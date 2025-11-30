'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session from URL hash
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Session error:', sessionError);
          setError('Gagal mendapatkan session');
          setTimeout(() => router.push('/sign-in'), 2000);
          return;
        }

        if (!session) {
          console.error('No session found');
          setError('Session tidak ditemukan');
          setTimeout(() => router.push('/sign-in'), 2000);
          return;
        }

        // Sync with backend MySQL
        const syncResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          }
        });

        const syncData = await syncResponse.json();

        if (!syncResponse.ok) {
          console.error('Sync failed:', syncData);
          setError('Gagal sinkronisasi data');
          setTimeout(() => router.push('/sign-in'), 2000);
          return;
        }

        // Save to localStorage
        localStorage.setItem('supabase_token', session.access_token);
        localStorage.setItem('user_data', JSON.stringify(syncData.user));

        // Redirect to dashboard
        router.push('/dashboard');

      } catch (error: any) {
        console.error('Callback error:', error);
        setError('Terjadi kesalahan');
        setTimeout(() => router.push('/sign-in'), 2000);
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        {error ? (
          <>
            <div className="w-16 h-16 mx-auto mb-4 text-red-500">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">Redirecting to sign in...</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 mx-auto mb-4">
              <svg className="animate-spin text-[#661FFF]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Signing you in...</h2>
            <p className="text-gray-600">Please wait while we complete your sign in</p>
          </>
        )}
      </div>
    </div>
  );
}
