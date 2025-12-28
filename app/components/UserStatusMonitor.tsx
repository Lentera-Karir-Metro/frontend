'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

/**
 * UserStatusMonitor Component
 * Monitors user status and redirects to sign-in if account is deactivated
 */
export default function UserStatusMonitor() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only run status check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) return;

    // Don't check on public pages (sign-in, sign-up, etc)
    const publicPages = ['/sign-in', '/sign-up', '/forgot-password', '/reset-password', '/verify-email'];
    if (publicPages.some(page => pathname.startsWith(page))) return;

    const checkUserStatus = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/check-status`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        // If user is deleted (404), redirect to sign-in
        if (response.status === 404 || data.code === 'USER_DELETED') {
          // Clear local storage
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user_data');

          // Redirect to sign-in with deleted message
          router.push('/sign-in?deleted=true');
        }
        // If user is inactive (403), redirect to sign-in
        else if (response.status === 403 || (data.data && data.data.status === 'inactive')) {
          // Clear local storage
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user_data');

          // Redirect to sign-in with inactive message
          router.push('/sign-in?inactive=true');
        }
      } catch (error) {
        console.error('Error checking user status:', error);
      }
    };

    // Check immediately
    checkUserStatus();

    // Set up polling every 30 seconds
    const interval = setInterval(checkUserStatus, 30000);

    return () => clearInterval(interval);
  }, [pathname, router]);

  return null; // This component doesn't render anything
}
