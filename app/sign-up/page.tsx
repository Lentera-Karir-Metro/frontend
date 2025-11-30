'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthSkeleton } from '../components/ui/Skeleton';

export default function SignUp() {
  const router = useRouter();
  
  // Form inputs
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Validations
    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      setErrorMsg('Semua field harus diisi.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Password dan konfirmasi password tidak sama.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password minimal 6 karakter.');
      return;
    }

    if (!agreedToTerms) {
      setErrorMsg('Anda harus menyetujui syarat dan ketentuan.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Sign up to Supabase Auth
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const signUpResponse = await fetch(`${supabaseUrl}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseAnonKey || '',
        },
        body: JSON.stringify({
          email,
          password,
          data: {
            username,
          },
        }),
      });

      const signUpData = await signUpResponse.json();

      if (!signUpResponse.ok) {
        // Handle specific error messages
        const errorMsg = signUpData?.msg || signUpData?.error_description || signUpData?.message || 'Gagal mendaftar';
        const lowerError = errorMsg.toLowerCase();
        
        if (lowerError.includes('rate limit') || lowerError.includes('email_send_rate_limit')) {
          throw new Error('Batas Pengiriman Email Tercapai\n\nAnda telah mencoba terlalu banyak dalam waktu singkat. Silakan tunggu beberapa menit atau gunakan email lain untuk mendaftar.');
        }
        
        if (lowerError.includes('already registered') || lowerError.includes('already been registered') || lowerError.includes('user already registered')) {
          throw new Error('Email Sudah Terdaftar\n\nEmail ini sudah digunakan. Silakan gunakan email lain atau langsung login jika Anda sudah memiliki akun.');
        }
        
        if (lowerError.includes('invalid email')) {
          throw new Error('Format Email Tidak Valid\n\nSilakan periksa kembali alamat email Anda dan pastikan formatnya benar.');
        }
        
        if (lowerError.includes('password') && (lowerError.includes('weak') || lowerError.includes('short'))) {
          throw new Error('Password Terlalu Lemah\n\nGunakan password yang lebih kuat dengan minimal 6 karakter, kombinasi huruf dan angka.');
        }
        
        // Default error with better formatting
        throw new Error(`Pendaftaran Gagal\n\n${errorMsg}`);
      }

      // Check if we got access token
      const accessToken = signUpData?.access_token;

      if (!accessToken) {
        // Email confirmation might be required
        setSuccessMsg('Pendaftaran berhasil! Mengalihkan ke halaman login...');
        setIsSubmitting(false);
        
        // Clear form
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setAgreedToTerms(false);
        
        // Redirect to sign-in with verification message
        setTimeout(() => {
          router.push('/sign-in?verified=false&email=' + encodeURIComponent(email));
        }, 2000);
        return;
      }

      // 2. Sync with backend MySQL
      const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!backendResponse.ok) {
        const backendError = await backendResponse.json().catch(() => ({}));
        throw new Error(backendError?.message || 'Gagal menyinkronkan dengan database');
      }

      // Success - redirect to dashboard
      setSuccessMsg('Pendaftaran berhasil! Mengalihkan ke dashboard...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);

    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <AuthSkeleton />;
  }

  return (
    <div className="min-h-screen flex flex-row-reverse">
      {/* Right Side - Image & Branding (cover image + strong bottom purple overlay, text bottom-right) */}
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

        {/* Branding and copy placed bottom-right */}
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

      {/* Left Side - Sign In Form */}
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
              Sign Up
            </h2>
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/sign-in" className="text-[#661FFF] font-semibold hover:underline">
                Login here
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {errorMsg && (
              <div className="bg-red-50 border-2 border-red-500 text-red-700 px-4 py-4 rounded-lg shadow-sm">
                <div className="flex items-start">
                  <svg className="w-6 h-6 mr-3 flex-shrink-0 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-semibold whitespace-pre-line leading-relaxed text-justify">{errorMsg}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
                <p className="text-sm font-medium">{successMsg}</p>
              </div>
            )}

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-900 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="input your username"
                disabled={isSubmitting}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#661FFF] transition-colors text-gray-900 placeholder:text-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

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
                placeholder="input your email"
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
                  placeholder="input your password"
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
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="input your password"
                  disabled={isSubmitting}
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

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#661FFF] text-white py-3.5 rounded-xl font-semibold text-base hover:bg-[#5518CC] transition-colors shadow-lg shadow-[#661FFF]/20 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mendaftar...
                </>
              ) : (
                'Sign Up'
              )}
            </button>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-4 h-4 text-[#661FFF] bg-gray-100 border-gray-300 rounded focus:ring-[#661FFF] focus:ring-2"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                By clicking Create account, I agree that I have read and accepted the{' '}
                <Link href="/terms" className="text-[#661FFF] hover:underline">
                  Terms of Use
                </Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-[#661FFF] hover:underline">
                  Privacy Policy
                </Link>
                .
              </label>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
