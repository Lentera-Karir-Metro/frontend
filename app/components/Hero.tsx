"use client";
import { useCallback } from 'react';
import Navbar from './Navbar';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  const handleSmoothScroll = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    // If it's a normal Link navigation, prevent the default and smooth scroll to target
    event.preventDefault();
    const targetId = event.currentTarget.getAttribute('href')?.slice(1);
    const targetElement = targetId ? document.getElementById(targetId) : null;
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gray-900">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero.png"
          alt="Hero Background"
          fill
          className="object-cover object-[center_30%] sm:object-[center_40%] md:object-center"
          priority
          quality={100}
          sizes="100vw"
          style={{ objectFit: 'cover' }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Hero Content */}
      <div className="relative z-10 min-h-screen pt-20 sm:pt-24 2xl:pt-28">
        <div className="max-w-[2000px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
          {/* Content aligned with navbar height */}
          <div className="pt-12 sm:pt-16 md:pt-20 lg:pt-24 xl:pt-28 2xl:pt-32">
            <div className="w-full">
              {/* Main Heading */}
              <h1 className="text-[42px] sm:text-[48px] md:text-[56px] lg:text-[64px] xl:text-[68px] 2xl:text-[76px] font-bold text-white mb-5 sm:mb-6 md:mb-7 2xl:mb-8 leading-[1.15] tracking-tight max-w-[90%] sm:max-w-[85%] md:max-w-[800px] lg:max-w-[900px] xl:max-w-[1000px] 2xl:max-w-[1100px]">
                Temukan <span className="text-[#661FFF]">Arah Kariermu</span>
                <br />
                Mulai dari Sini
              </h1>

              {/* Description */}
              <p className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] 2xl:text-[18px] text-gray-300/95 mb-8 sm:mb-9 md:mb-10 2xl:mb-11 leading-[1.65] max-w-[90%] sm:max-w-[480px] md:max-w-[520px] 2xl:max-w-[580px]">
                Lentera Karir membantu fresh graduate mempersiapkan diri menghadapi dunia kerja dengan bimbingan mentor, kurikulum praktis, dan pengalaman nyata.
              </p>

              {/* CTA Button */}
              <Link
                href="#courses"
                onClick={handleSmoothScroll}
                className="inline-block px-8 sm:px-9 2xl:px-11 py-3 sm:py-3.5 2xl:py-4 bg-[#661FFF] text-white text-[15px] sm:text-[16px] 2xl:text-[18px] font-semibold rounded-full hover:bg-[#4B13B3] transition-all hover:scale-105 shadow-lg shadow-[#661FFF]/30"
              >
                Mulai Belajar Sekarang
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
