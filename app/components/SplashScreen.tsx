'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function SplashScreen({ onFinish }: { onFinish?: () => void }) {
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // Splash screen will show for 1.5 seconds
    const timer = setTimeout(() => {
      setFadeOut(true)
      // Call onFinish callback after fade-out animation completes
      setTimeout(() => {
        onFinish?.()
      }, 500) // Wait for fade-out animation
    }, 1500)

    return () => clearTimeout(timer)
  }, [onFinish])

  return (
    <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div className="splash-content">
        <div className="logo-container">
          <Image
            src="/images/lentera.png"
            alt="Lentera Karir Logo"
            width={240}
            height={240}
            priority
            className="logo-image"
          />
        </div>
      </div>

      <style jsx>{`
        .splash-screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: linear-gradient(180deg, #7c3aed 0%, #6c2bd9 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.5s ease-in-out;
        }

        .splash-screen.fade-out {
          animation: fadeOut 0.5s ease-in-out forwards;
          pointer-events: none;
        }

        .splash-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          animation: scaleIn 0.6s ease-out 0.2s backwards;
        }

        .logo-container {
          animation: float 2s ease-in-out infinite;
        }

        .logo-image {
          filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3));
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @media (max-width: 640px) {
          .logo-container :global(img) {
            width: 180px !important;
            height: 180px !important;
          }
        }
      `}</style>
    </div>
  )
}
