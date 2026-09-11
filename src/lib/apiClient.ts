/**
 * AgriFlow AI Centralized API Client.
 *
 * ALL frontend services MUST use this client to communicate with the FastAPI backend.
 * ZERO SILENT MOCK FALLBACK: If the request fails, it throws a typed error so the UI
 * can display the honest "Live data unavailable" state with a Retry action.
 */

export function getApiBaseUrl(): string {
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
  }
  return 'http://localhost:8000';
}

export class ApiError extends Error {
  status?: number;
  endpoint: string;

  constructor(message: string, endpoint: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.endpoint = endpoint;
    this.status = status;
  }
}

interface RequestOptions extends RequestInit {
  timeoutMs?: number;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;
  const method = options.method || 'GET';
  const timeoutMs = options.timeoutMs || 8000;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error(
        `%c[AgriFlow] ${method} ${cleanEndpoint} Status: ${res.status} Source: FastAPI Mock fallback: NO`,
        'color: #ef4444; font-weight: bold;'
      );
      let errorDetail = `HTTP ${res.status} from backend`;
      try {
        const errorJson = await res.json();
        if (errorJson.detail) {
          errorDetail = typeof errorJson.detail === 'string' ? errorJson.detail : JSON.stringify(errorJson.detail);
        }
      } catch {
        // use default errorDetail
      }
      throw new ApiError(errorDetail, cleanEndpoint, res.status);
    }

    const data = await res.json();
    const count = Array.isArray(data) ? data.length : typeof data === 'object' && data !== null ? Object.keys(data).length : 1;

    console.log(
      `%c[AgriFlow] ${method} ${cleanEndpoint} Status: ${res.status} Source: FastAPI Records: ${count}`,
      'color: #10b981; font-weight: bold;'
    );

    return data as T;
  } catch (err: any) {
    clearTimeout(timeoutId);

    if (err instanceof ApiError) {
      throw err;
    }

    console.error(
      `%c[AgriFlow] ${method} ${cleanEndpoint} Status: FAILED Source: FastAPI Mock fallback: NO (${err?.message || 'Network/Timeout'})`,
      'color: #ef4444; font-weight: bold;'
    );

    throw new ApiError(
      err?.name === 'AbortError' ? 'REQUEST_TIMEOUT' : 'LIVE_DATA_UNAVAILABLE',
      cleanEndpoint
    );
  }
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: any, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: any, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: any, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};
