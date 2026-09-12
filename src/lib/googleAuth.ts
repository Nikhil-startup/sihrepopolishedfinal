import { authService, GoogleAuthPayload, GoogleAuthResponse } from '@/services/authService';

/**
 * Lightweight helper to parse JWT payload without external dependencies.
 */
export function decodeJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.warn('Failed to parse JWT token:', e);
    return null;
  }
}

/**
 * Triggers Google Sign-In.
 * Supports Google Identity Services (GIS) when NEXT_PUBLIC_GOOGLE_CLIENT_ID is configured,
 * and provides a prompt/selection dialog for local testing.
 */
export async function triggerGoogleAuth(
  requestedRole: 'farmer' | 'consumer' | 'logistics' | 'fpo' = 'farmer',
  preferredEmail?: string
): Promise<GoogleAuthResponse> {
  const googleClientId = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID : undefined;

  // 1. If running in a browser with Google GIS script loaded and client ID set
  if (typeof window !== 'undefined' && (window as any).google?.accounts?.id && googleClientId) {
    return new Promise((resolve, reject) => {
      try {
        (window as any).google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response: any) => {
            if (response.credential) {
              const decoded = decodeJwt(response.credential);
              const payload: GoogleAuthPayload = {
                credential: response.credential,
                email: decoded?.email,
                name: decoded?.name,
                sub: decoded?.sub,
                picture: decoded?.picture,
                requested_role: requestedRole === 'fpo' ? 'farmer' : requestedRole,
              };
              try {
                const res = await authService.authenticateGoogle(payload);
                resolve(res);
              } catch (err) {
                reject(err);
              }
            } else {
              reject(new Error('No credential returned by Google'));
            }
          },
        });
        (window as any).google.accounts.id.prompt();
      } catch (err) {
        console.error('Error invoking Google Identity Services:', err);
        reject(err);
      }
    });
  }

  // 2. Fallback / direct Google authentication prompt
  let email = preferredEmail;
  if (!email && typeof window !== 'undefined') {
    const promptEmail = window.prompt(
      'Sign in with Google Account:\nEnter your Google / Gmail address:',
      'kisan.farmer@gmail.com'
    );
    if (!promptEmail) {
      throw new Error('Google sign-in cancelled by user');
    }
    email = promptEmail.trim();
  }

  if (!email) {
    email = 'user@gmail.com';
  }

  const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const payload: GoogleAuthPayload = {
    email,
    name,
    sub: `google-user-${email.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
    picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=059669&color=fff`,
    requested_role: requestedRole === 'fpo' ? 'farmer' : requestedRole,
  };

  return authService.authenticateGoogle(payload);
}
