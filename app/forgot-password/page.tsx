"use client";
import { AuthSkeleton } from '../components/ui/Skeleton';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSent(true);
      } else {
        setErrorMsg(data.message || 'Terjadi kesalahan. Silakan coba lagi.');
      }
    } catch (error: any) {
      console.error('Forgot password error:', error);
      setErrorMsg('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <AuthSkeleton />;
  }

  return (
    <div className="min-h-screen flex">
      {/* Kiri: Branding & Cover */}
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
            <span className="block text-xl md:text-xl lg:text-2xl xl:text-3xl">Temukan Arah Karirmu dengan</span>
            <span className="block text-xl md:text-xl lg:text-3xl xl:text-3xl mt-1">Lentera Karir</span>
          </h1>
          <p className="text-base md:text-lg text-white/90 leading-relaxed max-w-[520px] text-justify">
            Kami membantu kamu membangun fondasi profesional yang kuat sejak langkah pertama dengan menghadirkan pengalaman belajar yang interaktif dan dirancang langsung oleh para praktisi dunia kerja.
          </p>
        </div>
      </div>
      {/* Kanan: Form Kirim Email */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Reset Password</h2>
            <p className="text-gray-600">
              Tambahkan alamat email yang terkait dengan akunmu dan kami akan mengirimkan tautan untuk memperbarui password
            </p>
          </div>
          {sent ? (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
              <p className="text-sm font-medium">
                Email reset password telah dikirim! Silakan cek inbox/spam Anda.
              </p>
            </div>
          ) : (
            <>
              {/* Error Message */}
              {errorMsg && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                  <p className="text-sm font-medium">{errorMsg}</p>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="input your email"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#661FFF] transition-colors text-gray-900 placeholder:text-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                    required
                  />
                </div>
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
                      Mengirim...
                    </>
                  ) : (
                    'Send Email'
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
