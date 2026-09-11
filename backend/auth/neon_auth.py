import os
import jwt
from jwt import PyJWKClient
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional, Dict, Any

security = HTTPBearer(auto_error=False)

NEON_AUTH_JWKS_URL = os.getenv("NEON_AUTH_JWKS_URL")

jwk_client = None
if NEON_AUTH_JWKS_URL:
    try:
        jwk_client = PyJWKClient(NEON_AUTH_JWKS_URL)
    except Exception as e:
        print(f"Warning: Failed to initialize PyJWKClient with {NEON_AUTH_JWKS_URL}: {e}")

async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Dict[str, Any]:
    """
    Validate Neon Auth JWT token via JWKS endpoint.
    Extracts user_id and roles from claims.
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization token required"
        )

    token = credentials.credentials

    # If JWKS is active, verify cryptographic signature against Neon Auth
    if jwk_client:
        try:
            signing_key = jwk_client.get_signing_key_from_jwt(token)
            data = jwt.decode(
                token,
                signing_key.key,
                algorithms=["RS256"],
                options={"verify_aud": False}
            )
            return {
                "user_id": data.get("sub"),
                "email": data.get("email"),
                "role": data.get("role", "farmer"),
                "claims": data
            }
        except jwt.PyJWTError as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid or expired authentication token: {str(e)}"
            )

    # In local/development mode without active JWKS, decode unverified
    try:
        data = jwt.decode(token, options={"verify_signature": False})
        return {
            "user_id": data.get("sub", "dev-user-001"),
            "email": data.get("email", "dev@agriflow.local"),
            "role": data.get("role", "farmer"),
            "claims": data
        }
    except Exception:
        return {
            "user_id": "dev-user-001",
            "email": "dev@agriflow.local",
            "role": "farmer",
            "claims": {}
        }
