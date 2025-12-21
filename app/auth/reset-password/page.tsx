'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function ResetPassword() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        const tokenFromUrl = searchParams?.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        } else {
            setErrorMsg('Token reset password tidak ditemukan.');
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        // Validations
        if (!newPassword || !confirmPassword) {
            setErrorMsg('Semua field harus diisi.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMsg('Password dan konfirmasi password tidak sama.');
            return;
        }

        if (newPassword.length < 6) {
            setErrorMsg('Password minimal 6 karakter.');
            return;
        }

        if (!token) {
            setErrorMsg('Token tidak valid.');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    newPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMsg(data.message || 'Password berhasil direset!');

                // Redirect ke sign-in setelah 3 detik
                setTimeout(() => {
                    router.push('/sign-in');
                }, 3000);
            } else {
                setErrorMsg(data.message || 'Terjadi kesalahan. Silakan coba lagi.');
            }
        } catch (error: any) {
            console.error('Reset password error:', error);
            setErrorMsg('Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Image & Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-end justify-start pl-16 pr-8 py-12">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/signin.png"
                        alt="Reset Password Background"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                    <div className="absolute inset-0 z-10 pointer-events-none"
                        style={{ background: 'linear-gradient(to top, rgba(102,31,255,0.92) 18%, rgba(155,92,255,0.70) 45%, rgba(0,0,0,0.0) 85%)' }} />
                </div>

                <div className="relative z-20 text-white max-w-lg pb-12">
                    <div className="mb-6">
                        <Image
                            src="/images/lentera.png"
                            alt="Lentera Karir Logo"
                            width={120}
                            height={50}
                            className="h-12 w-auto mb-6"
                        />
                    </div>

                    <h1 className="font-extrabold mb-4 leading-tight">
                        <span className="block text-xl md:text-xl lg:text-2xl xl:text-3xl">Buat Password Baru</span>
                        <span className="block text-xl md:text-xl lg:text-3xl xl:text-3xl mt-1">Lentera Karir</span>
                    </h1>

                    <p className="text-base md:text-lg text-white/90 leading-relaxed max-w-[520px] text-justify">
                        Buat password baru yang kuat dan mudah diingat untuk akun Lentera Karir Anda.
                    </p>
                </div>
            </div>

            {/* Right Side - Reset Password Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden mb-8 flex justify-center">
                        <Image
                            src="/images/lentera.png"
                            alt="Lentera Karir Logo"
                            width={100}
                            height={40}
                            className="h-10 w-auto"
                        />
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                            Reset Password
                        </h2>
                        <p className="text-gray-600">
                            Masukkan password baru Anda
                        </p>
                    </div>

                    {/* Success Message */}
                    {successMsg && (
                        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
                            <div className="flex items-start">
                                <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <div>
                                    <p className="text-sm font-medium">{successMsg}</p>
                                    <p className="text-xs mt-1">Anda akan diarahkan ke halaman login...</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {errorMsg && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                            <div className="flex items-start">
                                <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <p className="text-sm font-medium">{errorMsg}</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* New Password */}
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-900 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Minimal 6 karakter"
                                    disabled={isSubmitting || !!successMsg}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#661FFF] transition-colors text-gray-900 placeholder:text-gray-400 pr-12 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Ulangi password baru"
                                    disabled={isSubmitting || !!successMsg}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#661FFF] transition-colors text-gray-900 placeholder:text-gray-400 pr-12 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting || !!successMsg}
                            className="w-full bg-[#661FFF] text-white py-3.5 rounded-xl font-semibold text-base hover:bg-[#5518CC] transition-colors shadow-lg shadow-[#661FFF]/20 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Mereset Password...
                                </>
                            ) : (
                                'Reset Password'
                            )}
                        </button>

                        {/* Back to Sign In */}
                        <div className="text-center">
                            <Link
                                href="/sign-in"
                                className="text-sm text-gray-600 hover:text-[#661FFF] transition-colors inline-flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Sign In
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
