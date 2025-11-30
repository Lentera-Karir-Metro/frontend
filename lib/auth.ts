// File: lib/auth.ts
/**
 * Authentication helper functions
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
  
  return localStorage.getItem('supabase_token');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getAccessToken();
};

/**
 * Logout user
 */
export const logout = async () => {
  await supabase.auth.signOut();
  localStorage.removeItem('supabase_token');
  localStorage.removeItem('user_data');
  
  // Redirect to sign-in
  if (typeof window !== 'undefined') {
    window.location.href = '/sign-in';
  }
};

/**
 * Fetch API with authentication
 */
export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token = getAccessToken();
  
  if (!token) {
    throw new Error('Not authenticated');
  }
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };
  
  return fetch(url, {
    ...options,
    headers,
  });
};

export { supabase };
