/**
 * @fileoverview API Helper - Wrapper untuk fetch dengan auto-logout
 */
import { authenticatedFetch, logout } from '@/lib/auth';

/**
 * Helper function untuk semua API calls dengan auto-logout handling
 * Automatically handles:
 * - Token validation before request
 * - 401 response (auto logout)
 * - Error handling
 */
export const apiCall = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  try {
    const response = await authenticatedFetch(url, options);
    return response;
  } catch (error: any) {
    // Jika error adalah token expired, user sudah di-logout otomatis
    if (error.message === 'Token expired' || 
        error.message === 'Unauthorized - Token expired or invalid') {
      // Sudah di-handle oleh authenticatedFetch, just re-throw
      throw error;
    }
    // Re-throw error lainnya
    throw error;
  }
};

/**
 * Helper untuk POST request
 */
export const apiPost = async (
  url: string,
  body?: any,
  additionalHeaders?: HeadersInit
): Promise<Response> => {
  return apiCall(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...additionalHeaders,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
};

/**
 * Helper untuk GET request
 */
export const apiGet = async (
  url: string,
  additionalHeaders?: HeadersInit
): Promise<Response> => {
  return apiCall(url, {
    method: 'GET',
    headers: {
      ...additionalHeaders,
    },
  });
};

/**
 * Helper untuk PUT request
 */
export const apiPut = async (
  url: string,
  body?: any,
  additionalHeaders?: HeadersInit
): Promise<Response> => {
  return apiCall(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...additionalHeaders,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
};

/**
 * Helper untuk DELETE request
 */
export const apiDelete = async (
  url: string,
  additionalHeaders?: HeadersInit
): Promise<Response> => {
  return apiCall(url, {
    method: 'DELETE',
    headers: {
      ...additionalHeaders,
    },
  });
};
