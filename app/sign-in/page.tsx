'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthSkeleton } from '../components/ui/Skeleton';

function SignInContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationMsg, setVerificationMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Check if redirected from backend after email verification or from sign-up
    if (searchParams) {
      const verified = searchParams.get('verified');
      const email = searchParams.get('email');
      const message = searchParams.get('message');
      const inactive = searchParams.get('inactive');
      const deleted = searchParams.get('deleted');

      if (deleted === 'true') {
        // User was redirected because account was deleted
        setErrorMsg('Akun Anda telah dihapus oleh administrator. Silakan hubungi administrator jika Anda merasa ini adalah kesalahan.');
      } else if (inactive === 'true') {
        // User was redirected because account was deactivated
        setErrorMsg('Akun Anda telah dinonaktifkan oleh administrator. Silakan hubungi administrator untuk informasi lebih lanjut.');
      } else if (verified === 'success' && email) {
        // Dari backend verifikasi email berhasil
        setVerificationMsg(`Email berhasil diverifikasi! Silakan login dengan akun Anda.`);
        setEmail(email); // Pre-fill email field
      } else if (verified === 'error' && message) {
        // Dari backend verifikasi email gagal
        setErrorMsg(decodeURIComponent(message));
      } else if (verified === 'false' && email) {
        // Dari sign-up page (belum verifikasi)
        setVerificationMsg(`Pendaftaran berhasil! Silakan cek email ${email} untuk verifikasi akun Anda sebelum login.`);
      } else if (searchParams.get('registered') === 'true' && email) {
        // Dari sign-up page (berhasil registrasi)
        setVerificationMsg(`Pendaftaran berhasil! Kami telah mengirim email verifikasi ke ${email}. Silakan cek inbox/spam Anda dan klik link verifikasi.`);
        setEmail(email); // Pre-fill email field
      }
    }


  }, [searchParams, router]);

  if (isLoading) {
    return <AuthSkeleton />;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image & Branding (cover image + strong bottom purple overlay, text bottom-left) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-end justify-start pl-16 pr-8 py-12">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/signin.png"
            alt="Sign In Background"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Strong purple gradient from bottom to transparent to match reference */}
          <div className="absolute inset-0 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(102,31,255,0.92) 18%, rgba(155,92,255,0.70) 45%, rgba(0,0,0,0.0) 85%)' }} />
        </div>

        {/* Branding and copy placed bottom-left */}
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
            <span className="block text-xl md:text-xl lg:text-2xl xl:text-3xl">Temukan Arah Karirmu dengan</span>
            <span className="block text-xl md:text-xl lg:text-3xl xl:text-3xl mt-1">Lentera Karir</span>
          </h1>

          <p className="text-base md:text-lg text-white/90 leading-relaxed max-w-[520px] text-justify">
            Kami membantu kamu membangun fondasi profesional yang kuat sejak langkah pertama dengan menghadirkan pengalaman belajar yang interaktif dan dirancang langsung oleh para praktisi dunia kerja.
          </p>
        </div>
      </div>

      {/* Right Side - Sign In Form */}
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
              Sign In
            </h2>
            <p className="text-gray-600">
              New user?{' '}
              <Link href="/sign-up" className="text-[#661FFF] font-semibold hover:underline">
                Create an account
              </Link>
            </p>
          </div>

          {/* Verification Message */}
          {verificationMsg && (
            <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl">
              <div className="flex items-start">
                <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium">{verificationMsg}</p>
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

          <form className="space-y-6" onSubmit={async (e) => {
            e.preventDefault();
            setIsSubmitting(true);
            setErrorMsg('');

            try {
              // Call backend API directly
              const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
              });

              const data = await response.json();

              if (!response.ok) {
                // Handle error response from backend
                if (data.code === 'USER_DELETED') {
                  setErrorMsg('Akun Anda telah dihapus oleh administrator. Silakan hubungi administrator jika Anda merasa ini adalah kesalahan.');
                } else if (data.code === 'USER_INACTIVE') {
                  setErrorMsg('Akun Anda telah dinonaktifkan oleh administrator. Silakan hubungi administrator untuk informasi lebih lanjut.');
                } else {
                  setErrorMsg(data.message || 'Login gagal. Silakan coba lagi.');
                }
                setIsSubmitting(false);
                return;
              }

              // Store tokens and user data in localStorage
              localStorage.setItem('token', data.token);
              localStorage.setItem('refreshToken', data.refreshToken);
              localStorage.setItem('user_data', JSON.stringify(data.user));

              // Redirect based on user role
              if (data.user.role === 'admin') {
                router.push('/admin/dashboard');
              } else {
                router.push('/dashboard');
              }

            } catch (error: any) {
              console.error('Sign in error:', error);
              setErrorMsg('Terjadi kesalahan. Silakan coba lagi.');
              setIsSubmitting(false);
            }
          }}>
            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="inibudii@gmail.com"
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#661FFF] transition-colors text-gray-900 placeholder:text-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Input your password"
                  required
                  disabled={isSubmitting}
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
              <div className="mt-2 text-right">
                <Link href="/forgot-password" className="text-sm text-[#661FFF] font-medium hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#661FFF] text-white py-3.5 rounded-xl font-semibold text-base hover:bg-[#5518CC] transition-colors shadow-lg shadow-[#661FFF]/20 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>


          </form>
        </div>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <SignInContent />
    </Suspense>
  );
}
