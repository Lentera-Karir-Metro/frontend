'use client'

import { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import Hero from './components/Hero';
import About from './components/About';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import Courses from './components/Courses';
import Footer from './components/Footer';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Change body background after splash screen finishes
    if (!showSplash) {
      document.body.style.background = '#ffffff';
    }
  }, [showSplash]);

  // Prevent hydration mismatch - don't render until mounted
  if (!isMounted) {
    return null;
  }

  return (
    <>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      <main style={{ opacity: showSplash ? 0 : 1, transition: 'opacity 0.3s ease-in-out' }}>
        <Hero />
        <About />
        <Features />
        <Testimonials />
        <Courses />
        <Footer />
      </main>
    </>
  );
}
