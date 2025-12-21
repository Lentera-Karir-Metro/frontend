// File: lib/auth.ts
/**
 * Authentication helper functions
 * Backend-only authentication (no Supabase Auth)
 */

/**
 * Get current user from localStorage
 */
export const getCurrentUser = () => {
  if (typeof window === 'undefined') return null;

  const userData = localStorage.getItem('user_data');
  return userData ? JSON.parse(userData) : null;
};

/**
 * Get current access token
 */
export const getAccessToken = () => {
  if (typeof window === 'undefined') return null;

  return localStorage.getItem('token');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getAccessToken();
};

/**
 * Check if token is still valid
 */
export const isTokenValid = (): boolean => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return false;

    // Decode JWT token untuk cek expiry (tanpa verify signature)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiryTime = payload.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();

    // Cek apakah token sudah expired
    return currentTime < expiryTime;
  } catch (error) {
    console.error('Error checking token validity:', error);
    return false;
  }
};

/**
 * Logout user
 */
export const logout = async () => {
  // Clear all auth-related data from localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user_data');

  // Redirect to sign-in
  if (typeof window !== 'undefined') {
    window.location.href = '/sign-in';
  }
};

/**
 * Cek token setiap kali akan melakukan API call
 * Jika expired, otomatis logout
 */
export const checkTokenBeforeRequest = (): boolean => {
  if (!isTokenValid()) {
    console.log('Token expired, logging out...');
    logout();
    return false;
  }
  return true;
};

/**
 * Setup interval untuk auto-check token setiap 1 menit
 * HANYA cek jika user sudah punya token (sudah pernah login)
 */
export const setupAutoLogoutChecker = (): NodeJS.Timeout | null => {
  if (typeof window === 'undefined') return null;

  return setInterval(() => {
    const token = localStorage.getItem('token');

    // HANYA logout jika user memang punya token tapi sudah expired
    // Jangan paksa redirect user yang memang belum pernah login
    if (token && !isTokenValid()) {
      console.log('Token expired detected by interval checker');
      logout();
    }
  }, 60000); // Check setiap 1 menit
};

/**
 * Fetch API with authentication
 * Automatically checks token validity and handles 401 responses
 */
export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  // Check token validity before making request
  if (!checkTokenBeforeRequest()) {
    throw new Error('Token expired');
  }

  const token = getAccessToken();

  if (!token) {
    throw new Error('Not authenticated');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized response
  if (response.status === 401) {
    console.log('Received 401 Unauthorized, logging out...');
    await logout();
    throw new Error('Unauthorized - Token expired or invalid');
  }

  return response;
};
