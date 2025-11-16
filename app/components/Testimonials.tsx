"use client";
import Image from 'next/image';
import { useState } from 'react';

export default function Testimonials() {
	const [isPausedRow1, setIsPausedRow1] = useState(false);
	const [isPausedRow2, setIsPausedRow2] = useState(false);
	const testimonials = [
		{
			quote: "Sebelum ikut bootcamp, saya benar-benar bingung mau mulai dari mana. Mentor Lentera Karir bantu saya memahami potensi diri dan sekarang saya berhasil magang di startup impian",
			name: "Budi, Alumni Bootcamp Batch 3",
			position: "Intern at Creative Studio",
			avatar: "/images/avatar-placeholder.png"
		},
		{
			quote: "Sebelum ikut bootcamp, saya benar-benar bingung mau mulai dari mana. Mentor Lentera Karir bantu saya memahami potensi diri dan sekarang saya berhasil magang di startup impian",
			name: "Budi, Alumni Bootcamp Batch 3",
			position: "Intern at Creative Studio",
			avatar: "/images/avatar-placeholder.png"
		},
		{
			quote: "Sebelum ikut bootcamp, saya benar-benar bingung mau mulai dari mana. Mentor Lentera Karir bantu saya memahami potensi diri dan sekarang saya berhasil magang di startup impian",
			name: "Budi, Alumni Bootcamp Batch 3",
			position: "Intern at Creative Studio",
			avatar: "/images/avatar-placeholder.png"
		},
		{
			quote: "Sebelum ikut bootcamp, saya benar-benar bingung mau mulai dari mana. Mentor Lentera Karir bantu saya memahami potensi diri dan sekarang saya berhasil magang di startup impian",
			name: "Budi, Alumni Bootcamp Batch 3",
			position: "Intern at Creative Studio",
			avatar: "/images/avatar-placeholder.png"
		},
		{
			quote: "Sebelum ikut bootcamp, saya benar-benar bingung mau mulai dari mana. Mentor Lentera Karir bantu saya memahami potensi diri dan sekarang saya",
			name: "Budi, Alumni Bootcamp Batch 3",
			position: "Intern at Creative Studio",
			avatar: "/images/avatar-placeholder.png"
		},
		{
			quote: "Sebelum ikut bootcamp, saya benar-benar bingung mau mulai dari mana. Mentor Lentera Karir bantu saya memahami potensi diri dan sekarang saya berhasil magang di startup impian",
			name: "Budi, Alumni Bootcamp Batch 3",
			position: "Intern at Creative Studio",
			avatar: "/images/avatar-placeholder.png"
		}
	];

	return (
		<section id="testimonies" className="relative bg-gradient-to-b from-white to-[#F5F3FF] py-12 sm:py-16 md:py-24 lg:py-28 xl:py-32 2xl:py-36 overflow-hidden">
			{/* Decorative Elements */}
			<div className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-10 md:left-10 z-0 w-20 sm:w-28 md:w-32 lg:w-44 xl:w-56 2xl:w-64 opacity-70">
				<Image src="/images/polkadot-ungu-serong.png" alt="Decoration" width={200} height={200} className="w-full h-auto" />
			</div>
			<div className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-10 md:right-10 z-0 w-20 sm:w-28 md:w-32 lg:w-44 xl:w-56 2xl:w-64 opacity-70">
				<Image src="/images/polkadot-ungu-serong.png" alt="Decoration" width={200} height={200} className="w-full h-auto rotate-45" />
			</div>

			<div className="max-w-[1800px] 2xl:max-w-[2400px] mx-auto relative z-10">
				{/* Header */}
				<div className="text-center mb-8 sm:mb-10 md:mb-14 lg:mb-16 xl:mb-20 2xl:mb-24 px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20 2xl:px-24">
					<h3 className="text-[#661FFF] text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px] 2xl:text-[28px] font-semibold mb-2 sm:mb-3 md:mb-4">
						Testimonies
					</h3>
					<h2 className="text-[24px] sm:text-[28px] md:text-[32px] lg:text-[38px] xl:text-[44px] 2xl:text-[52px] font-bold text-gray-900 mb-3 sm:mb-4 md:mb-5 leading-[1.2]">
						Apa Kata Mereka tentang Lentera Karir
					</h2>
				</div>

				{/* Testimonials Marquee */}
				<div className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-7 xl:space-y-8 2xl:space-y-10">
					{/* First Row - Scroll Left */}
					<div className="overflow-hidden"
						onMouseEnter={() => setIsPausedRow1(true)}
						onMouseLeave={() => setIsPausedRow1(false)}
					>
						<div
							className={`flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-7 2xl:gap-8 animate-marquee-left`}
							style={{
								animationPlayState: isPausedRow1 ? 'paused' : 'running',
								transition: 'animation-play-state 0.3s'
							}}
						>
							{/* First set */}
							{testimonials.slice(0, 3).map((testimonial, index) => (
								<div 
									key={`row1-${index}`}
									className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8 2xl:p-9 shadow-md hover:shadow-xl transition-shadow duration-300 flex-shrink-0 w-[280px] sm:w-[320px] md:w-[360px] lg:w-[400px] xl:w-[440px] 2xl:w-[500px]"
								>
									<div className="text-[#661FFF] mb-3 sm:mb-4">
										<svg className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14" fill="currentColor" viewBox="0 0 24 24">
											<path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
										</svg>
									</div>
									<p className="text-gray-700 text-[14px] md:text-[15px] leading-[1.7] mb-6">
										{testimonial.quote}
									</p>
									<div className="flex items-center gap-3">
										<div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
											<Image 
												src={testimonial.avatar} 
												alt={testimonial.name}
												width={48}
												height={48}
												className="w-full h-full object-cover"
											/>
										</div>
										<div>
											<h4 className="text-gray-900 font-semibold text-[14px] md:text-[15px]">
												{testimonial.name}
											</h4>
											<p className="text-gray-600 text-[12px] md:text-[13px]">
												{testimonial.position}
											</p>
										</div>
									</div>
								</div>
							))}
							{/* Duplicate set for seamless loop */}
							{testimonials.slice(0, 3).map((testimonial, index) => (
								<div 
									key={`row1-dup-${index}`}
									className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8 2xl:p-9 shadow-md hover:shadow-xl transition-shadow duration-300 flex-shrink-0 w-[280px] sm:w-[320px] md:w-[360px] lg:w-[400px] xl:w-[440px] 2xl:w-[500px]"
								>
									<div className="text-[#661FFF] mb-3 sm:mb-4">
										<svg className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14" fill="currentColor" viewBox="0 0 24 24">
											<path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
										</svg>
									</div>
									<p className="text-gray-700 text-[14px] md:text-[15px] leading-[1.7] mb-6">
										{testimonial.quote}
									</p>
									<div className="flex items-center gap-3">
										<div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
											<Image 
												src={testimonial.avatar} 
												alt={testimonial.name}
												width={48}
												height={48}
												className="w-full h-full object-cover"
											/>
										</div>
										<div>
											<h4 className="text-gray-900 font-semibold text-[14px] md:text-[15px]">
												{testimonial.name}
											</h4>
											<p className="text-gray-600 text-[12px] md:text-[13px]">
												{testimonial.position}
											</p>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Second Row - Scroll Right */}
					<div className="overflow-hidden"
						onMouseEnter={() => setIsPausedRow2(true)}
						onMouseLeave={() => setIsPausedRow2(false)}
					>
						<div
							className={`flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-7 2xl:gap-8 animate-marquee-right`}
							style={{
								animationPlayState: isPausedRow2 ? 'paused' : 'running',
								transition: 'animation-play-state 0.3s'
							}}
						>
							{/* First set */}
							{testimonials.slice(3, 6).map((testimonial, index) => (
								<div 
									key={`row2-${index}`}
									className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8 2xl:p-9 shadow-md hover:shadow-xl transition-shadow duration-300 flex-shrink-0 w-[280px] sm:w-[320px] md:w-[360px] lg:w-[400px] xl:w-[440px] 2xl:w-[500px]"
								>
									<div className="text-[#661FFF] mb-3 sm:mb-4">
										<svg className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14" fill="currentColor" viewBox="0 0 24 24">
											<path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
										</svg>
									</div>
									<p className="text-gray-700 text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] xl:text-[17px] 2xl:text-[18px] leading-[1.7] mb-4 sm:mb-5 md:mb-6">
										{testimonial.quote}
									</p>
									<div className="flex items-center gap-2 sm:gap-3">
										<div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-13 lg:h-13 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
											<Image 
												src={testimonial.avatar} 
												alt={testimonial.name}
												width={64}
												height={64}
												className="w-full h-full object-cover"
											/>
										</div>
										<div>
											<h4 className="text-gray-900 font-semibold text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] xl:text-[17px] 2xl:text-[18px]">
												{testimonial.name}
											</h4>
											<p className="text-gray-600 text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px]">
												{testimonial.position}
											</p>
										</div>
									</div>
								</div>
							))}
							{/* Duplicate set for seamless loop */}
							{testimonials.slice(3, 6).map((testimonial, index) => (
								<div 
									key={`row2-dup-${index}`}
									className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8 2xl:p-9 shadow-md hover:shadow-xl transition-shadow duration-300 flex-shrink-0 w-[280px] sm:w-[320px] md:w-[360px] lg:w-[400px] xl:w-[440px] 2xl:w-[500px]"
								>
									<div className="text-[#661FFF] mb-3 sm:mb-4">
										<svg className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14" fill="currentColor" viewBox="0 0 24 24">
											<path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
										</svg>
									</div>
									<p className="text-gray-700 text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] xl:text-[17px] 2xl:text-[18px] leading-[1.7] mb-4 sm:mb-5 md:mb-6">
										{testimonial.quote}
									</p>
									<div className="flex items-center gap-2 sm:gap-3">
										<div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-13 lg:h-13 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
											<Image 
												src={testimonial.avatar} 
												alt={testimonial.name}
												width={64}
												height={64}
												className="w-full h-full object-cover"
											/>
										</div>
										<div>
											<h4 className="text-gray-900 font-semibold text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] xl:text-[17px] 2xl:text-[18px]">
												{testimonial.name}
											</h4>
											<p className="text-gray-600 text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px]">
												{testimonial.position}
											</p>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Bottom Background Wave */}
			<div className="absolute bottom-0 left-0 right-0 h-24 sm:h-28 md:h-32 lg:h-36 xl:h-40 2xl:h-48 bg-[#E5DBFF]/30 -z-10"></div>
		</section>
	);
}
