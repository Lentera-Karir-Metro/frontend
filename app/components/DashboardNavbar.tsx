"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function DashboardNavbar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<nav className="bg-white shadow-sm sticky top-0 z-50">
			<div className="max-w-[1400px] mx-auto px-0 sm:px-1 md:px-2 lg:px-3 xl:px-4">
				<div className="flex items-center justify-between h-16 md:h-20">
					{/* Logo */}
					<Link href="/dashboard" className="flex items-center gap-2">
						<div className="relative w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 flex items-center justify-center">
							<Image
								src="/images/lenteracolor.png"
								alt="Lentera Karir Logo"
								fill
								style={{objectFit: 'contain'}}
								sizes="(max-width: 768px) 5rem, 7rem"
								priority
							/>
						</div>
					</Link>

					{/* Desktop Menu */}
					<div className="hidden md:flex items-center gap-8 lg:gap-10">
						<Link href="/dashboard" className="text-gray-900 hover:text-[#661FFF] transition-colors font-bold">
							Dashboard
						</Link>
						<Link href="/explore" className="text-gray-600 hover:text-[#661FFF] transition-colors font-bold">
							Explore
						</Link>
						<Link href="/article" className="text-gray-600 hover:text-[#661FFF] transition-colors font-bold">
							Article
						</Link>
						<Link href="/contact" className="text-gray-600 hover:text-[#661FFF] transition-colors font-bold">
							Contact Us
						</Link>
					</div>

					{/* User Profile & Notification */}
					<div className="flex items-center gap-4">
						{/* Notification Bell */}
						<button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
							<svg className="w-5 h-5 md:w-6 md:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
							</svg>
						</button>

						{/* User Profile */}
						<div className="flex items-center gap-6 cursor-pointer hover:opacity-80 transition-opacity">
							<span className="hidden sm:block text-gray-900 font-medium text-sm md:text-base">Halo, Budi</span>
							<div className="relative w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden bg-gray-200">
								<Image src="/images/avatar-placeholder.png" alt="User" fill className="object-cover" />
							</div>
						</div>

						{/* Mobile Menu Button */}
						<button 
							className="md:hidden p-2"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
						>
							<svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								{isMenuOpen ? (
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								) : (
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
								)}
							</svg>
						</button>
					</div>
				</div>

				{/* Mobile Menu */}
				{isMenuOpen && (
					<div className="md:hidden py-4 border-t border-gray-200">
						<div className="flex flex-col gap-4">
							<Link href="/dashboard" className="text-gray-900 hover:text-[#661FFF] transition-colors font-medium">
								Dashboard
							</Link>
							<Link href="/explore" className="text-gray-600 hover:text-[#661FFF] transition-colors font-medium">
								Explore
							</Link>
							<Link href="/article" className="text-gray-600 hover:text-[#661FFF] transition-colors font-medium">
								Article
							</Link>
							<Link href="/contact" className="text-gray-600 hover:text-[#661FFF] transition-colors font-medium">
								Contact Us
							</Link>
						</div>
					</div>
				)}
			</div>
		</nav>
	);
}
