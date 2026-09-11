import os
import uuid
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from typing import Optional
import boto3
from botocore.config import Config

router = APIRouter(prefix="/api/storage", tags=["Storage"])

class PresignedUrlRequest(BaseModel):
    file_name: str = Field(..., description="Original filename e.g. crop_lot_01.jpg")
    content_type: str = Field(..., description="MIME type e.g. image/jpeg")
    folder: Optional[str] = "produce"  # produce | pod | invoices

class PresignedUrlResponse(BaseModel):
    upload_url: str
    file_key: str
    public_url: str
    is_mock: bool = False

@router.post("/presigned-url", response_model=PresignedUrlResponse)
async def generate_presigned_url(payload: PresignedUrlRequest):
    """
    Generate an S3-compatible presigned PUT URL for Cloudflare R2 (or AWS S3).
    Allows client apps (Farmers/Drivers) to upload inspection images & proof of delivery directly.
    """
    account_id = os.getenv("R2_ACCOUNT_ID")
    access_key = os.getenv("R2_ACCESS_KEY_ID")
    secret_key = os.getenv("R2_SECRET_ACCESS_KEY")
    bucket_name = os.getenv("R2_BUCKET_NAME", "agriflow-storage")
    public_domain = os.getenv("R2_PUBLIC_DOMAIN")

    ext = payload.file_name.split(".")[-1] if "." in payload.file_name else "jpg"
    unique_name = f"{uuid.uuid4().hex[:12]}.{ext}"
    file_key = f"{payload.folder.strip('/')}/{unique_name}"

    # If R2 credentials are configured, generate genuine presigned URL
    if account_id and access_key and secret_key:
        try:
            s3_client = boto3.client(
                "s3",
                endpoint_url=f"https://{account_id}.r2.cloudflarestorage.com",
                aws_access_key_id=access_key,
                aws_secret_access_key=secret_key,
                config=Config(signature_version="s3v4")
            )

            upload_url = s3_client.generate_presigned_url(
                "put_object",
                Params={
                    "Bucket": bucket_name,
                    "Key": file_key,
                    "ContentType": payload.content_type
                },
                ExpiresIn=600  # 10 minutes
            )

            public_url = f"{public_domain.rstrip('/')}/{file_key}" if public_domain else f"https://{account_id}.r2.cloudflarestorage.com/{bucket_name}/{file_key}"

            return PresignedUrlResponse(
                upload_url=upload_url,
                file_key=file_key,
                public_url=public_url,
                is_mock=False
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to generate presigned URL: {str(e)}"
            )

    # Development fallback before credentials are set
    mock_upload = f"http://localhost:8000/api/storage/dev-upload/{file_key}"
    mock_public = f"https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800"

    return PresignedUrlResponse(
        upload_url=mock_upload,
        file_key=file_key,
        public_url=mock_public,
        is_mock=True
    )
