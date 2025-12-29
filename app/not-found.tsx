"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      router.push('/sign-in');
    }
  }, [countdown, router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-10">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl mb-6">
            <svg className="w-16 h-16 text-[#661FFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-3">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-gray-500 text-base md:text-lg max-w-md mx-auto">
            Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
          </p>
        </div>

        {/* Countdown */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-gray-50 rounded-full border border-gray-200">
            <div className="w-2 h-2 bg-[#661FFF] rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-600">Redirect otomatis dalam {countdown} detik</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
          <button
            onClick={() => router.push('/sign-in')}
            className="flex-1 bg-[#661FFF] hover:bg-[#5518dd] text-white py-3.5 px-6 rounded-xl font-semibold transition-all hover:shadow-lg"
          >
            Kembali ke Login
          </button>
          <button
            onClick={() => router.push('/')}
            className="flex-1 bg-white hover:bg-gray-50 text-gray-700 py-3.5 px-6 rounded-xl font-semibold border-2 border-gray-200 transition-all hover:border-gray-300"
          >
            Halaman Utama
          </button>
        </div>
      </div>
    </div>
  );
}
