/**
 * Cloudinary Direct Upload Service for AgriFlow AI.
 * Uploads produce images and Proof of Delivery (POD) photos directly to Cloudinary
 * using the unsigned preset 'agriflow_uploads'.
 */

export interface CloudinaryUploadResult {
  url: string;
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

export const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'tm4unkuu';
export const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'agriflow_uploads';

export async function uploadToCloudinary(
  file: File | Blob,
  folder: string = 'agriflow/produce'
): Promise<CloudinaryUploadResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  if (folder) {
    formData.append('folder', folder);
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cloudinary upload failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return {
    url: data.url,
    secure_url: data.secure_url,
    public_id: data.public_id,
    format: data.format,
    width: data.width,
    height: data.height,
    bytes: data.bytes,
  };
}
