'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

export default function VerifyEmail() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const verifyEmail = async () => {
            const token = searchParams?.get('token');

            if (!token) {
                setStatus('error');
                setMessage('Token verifikasi tidak ditemukan.');
                setTimeout(() => {
                    router.push('/sign-in');
                }, 3000);
                return;
            }

            try {
                // Call backend API untuk verify email
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email?token=${token}`,
                    {
                        method: 'GET',
                    }
                );

                const data = await response.json();

                if (response.ok) {
                    setStatus('success');
                    setMessage(data.message || 'Email berhasil diverifikasi!');

                    // Redirect langsung ke sign-in setelah 3 detik
                    setTimeout(() => {
                        router.push('/sign-in');
                    }, 3000);
                } else {
                    setStatus('error');
                    setMessage(data.message || 'Verifikasi email gagal. Token mungkin tidak valid atau sudah kadaluarsa.');

                    // Redirect langsung ke sign-in setelah 5 detik
                    setTimeout(() => {
                        router.push('/sign-in');
                    }, 5000);
                }
            } catch (error) {
                console.error('Verification error:', error);
                setStatus('error');
                setMessage('Terjadi kesalahan saat memverifikasi email. Silakan coba lagi.');

                setTimeout(() => {
                    router.push('/sign-in');
                }, 5000);
            }
        };

        verifyEmail();
    }, [searchParams, router, email]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <Image
                        src="/images/lentera.png"
                        alt="Lentera Karir Logo"
                        width={120}
                        height={50}
                        className="h-12 w-auto"
                    />
                </div>

                {/* Loading State */}
                {status === 'loading' && (
                    <div className="text-center">
                        <div className="mb-6">
                            <svg className="animate-spin h-16 w-16 mx-auto text-[#661FFF]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Memverifikasi Email...</h2>
                        <p className="text-gray-600">Mohon tunggu sebentar</p>
                    </div>
                )}

                {/* Success State */}
                {status === 'success' && (
                    <div className="text-center">
                        <div className="mb-6">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                                <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Terverifikasi! ✓</h2>
                        <p className="text-gray-600 mb-4">{message}</p>
                        <p className="text-sm text-gray-500">Anda akan diarahkan ke halaman login...</p>

                        {/* Progress bar */}
                        <div className="mt-6 w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-[#661FFF] h-2 rounded-full animate-progress" style={{ animation: 'progress 3s linear' }}></div>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {status === 'error' && (
                    <div className="text-center">
                        <div className="mb-6">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
                                <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifikasi Gagal</h2>
                        <p className="text-gray-600 mb-4">{message}</p>
                        <p className="text-sm text-gray-500">Anda akan diarahkan ke halaman login...</p>

                        {/* Manual redirect button */}
                        <button
                            onClick={() => router.push('/sign-in')}
                            className="mt-6 w-full bg-[#661FFF] text-white py-3 rounded-xl font-semibold hover:bg-[#5518CC] transition-colors"
                        >
                            Kembali ke Login
                        </button>
                    </div>
                )}
            </div>

            <style jsx>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
        .animate-progress {
          animation: progress 3s linear forwards;
        }
      `}</style>
        </div>
    );
}
