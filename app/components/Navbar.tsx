'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSmoothScroll = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const targetId = event.currentTarget.getAttribute('href')?.slice(1);
    const targetElement = targetId ? document.getElementById(targetId) : null;
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="absolute top-0 left-0 right-0 z-50">
      <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="flex items-center justify-between h-20 sm:h-24 2xl:h-28">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0 z-50">
            <Image
              src="/images/lentera.png"
              alt="Lentera Karir Logo"
              width={110}
              height={50}
              className="h-10 sm:h-12 2xl:h-14 w-auto"
            />
          </Link>

          {/* Navigation Links - Centered (Desktop & Tablet) */}
          <div className="hidden md:flex items-center gap-4 md:gap-5 lg:gap-6 xl:gap-10 2xl:gap-12 absolute left-1/2 transform -translate-x-1/2">
            <a
              href="#about"
              className="text-white/90 hover:text-white transition-colors text-[13px] md:text-[13px] lg:text-[14px] xl:text-[15px] 2xl:text-[17px] font-normal whitespace-nowrap"
              onClick={handleSmoothScroll}
            >
              About Us
            </a>
            <a
              href="#features"
              className="text-white/90 hover:text-white transition-colors text-[13px] md:text-[13px] lg:text-[14px] xl:text-[15px] 2xl:text-[17px] font-normal whitespace-nowrap"
              onClick={handleSmoothScroll}
            >
              Features
            </a>
            <a
              href="#testimonies"
              className="text-white/90 hover:text-white transition-colors text-[13px] md:text-[13px] lg:text-[14px] xl:text-[15px] 2xl:text-[17px] font-normal whitespace-nowrap"
              onClick={handleSmoothScroll}
            >
              Testimonies
            </a>
            <a
              href="#courses"
              className="text-white/90 hover:text-white transition-colors text-[13px] md:text-[13px] lg:text-[14px] xl:text-[15px] 2xl:text-[17px] font-normal whitespace-nowrap"
              onClick={handleSmoothScroll}
            >
              Courses
            </a>
          </div>

          {/* Auth Buttons (Desktop & Tablet) */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3 2xl:gap-4 flex-shrink-0">
            <Link
              href="/sign-up"
              className="px-4 lg:px-6 xl:px-7 2xl:px-9 py-2 lg:py-2.5 2xl:py-3 bg-white text-gray-900 rounded-full text-[13px] lg:text-[14px] xl:text-[15px] 2xl:text-[17px] font-medium hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              Sign Up
            </Link>
            <Link
              href="/sign-in"
              className="px-4 lg:px-6 xl:px-7 2xl:px-9 py-2 lg:py-2.5 2xl:py-3 bg-[#661FFF] text-white rounded-full text-[13px] lg:text-[14px] xl:text-[15px] 2xl:text-[17px] font-medium hover:bg-violet-700 transition-colors whitespace-nowrap"
            >
              Sign In
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden z-50 p-2 text-white"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-t border-white/10">
            <div className="px-4 py-6 space-y-4">
              <a
                href="#about"
                className="block text-white hover:text-violet-400 transition-colors py-2 text-base"
                onClick={(e) => {
                  handleSmoothScroll(e);
                  setIsMenuOpen(false);
                }}
              >
                About Us
              </a>
              <a
                href="#features"
                className="block text-white hover:text-violet-400 transition-colors py-2 text-base"
                onClick={(e) => {
                  handleSmoothScroll(e);
                  setIsMenuOpen(false);
                }}
              >
                Features
              </a>
              <a
                href="#testimonies"
                className="block text-white hover:text-violet-400 transition-colors py-2 text-base"
                onClick={(e) => {
                  handleSmoothScroll(e);
                  setIsMenuOpen(false);
                }}
              >
                Testimonies
              </a>
              <a
                href="#courses"
                className="block text-white hover:text-violet-400 transition-colors py-2 text-base"
                onClick={(e) => {
                  handleSmoothScroll(e);
                  setIsMenuOpen(false);
                }}
              >
                Courses
              </a>
              <div className="pt-4 space-y-3 border-t border-white/10">
                <Link
                  href="/signup"
                  className="block text-center px-6 py-3 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
                <Link
                  href="/signin"
                  className="block text-center px-6 py-3 bg-violet-600 text-white rounded-full font-medium hover:bg-violet-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
