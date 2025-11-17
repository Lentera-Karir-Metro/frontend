"use client";
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
	const pathname = usePathname();

	const handleNavClick = (e: any) => {
		const href = e.currentTarget.getAttribute('href') || e.currentTarget.dataset.href;
		const id = href?.split('#')[1];
		// If we're already on the homepage, do a smooth scroll to the element
		if (pathname === '/' && id) {
			e.preventDefault();
			const el = document.getElementById(id);
			if (el) el.scrollIntoView({ behavior: 'smooth' });
		}
		// otherwise let Link handle navigation to /#id
	};

	return (
		<footer className="relative bg-[#661FFF] text-white py-12 md:py-16 lg:py-20 overflow-hidden">
			{/* Decorative stars */}
			<div className="absolute -left-[100px] bottom-0 w-40 h-40 md:w-64 md:h-64 lg:w-80 lg:h-80 z-50 pointer-events-none">
				<Image
					src="/images/footer3.png"
					alt="Decorative Star"
					fill
					className="object-contain"
				/>
			</div>

			<div className="absolute top-48 md:top-56 left-1/4 w-32 h-32 md:w-48 md:h-48">
				<Image
					src="/images/footer2.png"
					alt="Decorative Star"
					fill
					className="object-contain"
				/>
			</div>

			<div className="absolute top-10 right-8 md:right-16 w-20 h-20 md:w-32 md:h-32">
				<Image
					src="/images/footer4.png"
					alt="Decorative Star"
					fill
					className="object-contain"
				/>
			</div>

			<div className="absolute bottom-[-20] right-20 md:right-32 w-32 h-32 md:w-40 md:h-40">
				<Image
					src="/images/footer.png"
					alt="Decorative Star"
					fill
					className="object-contain"
				/>
			</div>

			<div className="max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 relative z-10">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
					{/* Company Info */}
					<div>
						<div className="flex items-center gap-3 mb-4">
							<Image
								src="/images/lentera.png"
								alt="Lentera Karir Logo"
								width={180}
								height={80}
								className="h-16 sm:h-18 w-auto"
							/>
						</div>
						<div className="space-y-1 text-sm md:text-base">
							<p>
								<span className="font-semibold">Email:</span>{' '}
								<a href="mailto:karirlentera@gmail.com" className="hover:underline">
									karirlentera@gmail.com
								</a>
							</p>
							<p>
								<span className="font-semibold">Website:</span>{' '}
								<a 
									href="https://www.lenterakarir.com" 
									target="_blank" 
									rel="noopener noreferrer" 
									className="hover:underline"
								>
									www.lenterakarir.com
								</a>
							</p>
						</div>
					</div>

					{/* Navigation */}
					<div>
						<h4 className="text-lg md:text-xl font-bold mb-4">Navigation</h4>
						<ul className="space-y-2 text-sm md:text-base">
							<li>
								<Link href="/#about" className="hover:underline" onClick={handleNavClick}>
									About Us
								</Link>
							</li>
							<li>
								<Link href="/#features" className="hover:underline" onClick={handleNavClick}>
									Features
								</Link>
							</li>
							<li>
								<Link href="/#testimonies" className="hover:underline" onClick={handleNavClick}>
									Testimonies
								</Link>
							</li>
							<li>
								<Link href="/#courses" className="hover:underline" onClick={handleNavClick}>
									Courses
								</Link>
							</li>
						</ul>
					</div>

					{/* Social Media */}
					<div>
						<h4 className="text-lg md:text-xl font-bold mb-4">Sosial Media</h4>
						<div className="flex gap-4">
							<a
								href="https://instagram.com"
								target="_blank"
								rel="noopener noreferrer"
								className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
								aria-label="Instagram"
							>
								<svg
									className="w-6 h-6 md:w-7 md:h-7"
									viewBox="0 0 24 24"
									fill="#661FFF"
								>
									<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
								</svg>
							</a>
							<a
								href="https://linkedin.com"
								target="_blank"
								rel="noopener noreferrer"
								className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
								aria-label="LinkedIn"
							>
								<svg
									className="w-6 h-6 md:w-7 md:h-7"
									viewBox="0 0 24 24"
									fill="#661FFF"
								>
									<path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
								</svg>
							</a>
						</div>
					</div>
				</div>

				{/* Copyright */}
				<div className="mt-12 text-center">
					<p className="text-sm md:text-base">
						©2025 Lentera Karir. All Rights Reserved
					</p>
				</div>
			</div>
		</footer>
	);
}
