import Image from 'next/image';

export default function Testimonials() {
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
		<section id="testimonies" className="relative bg-gradient-to-b from-white to-[#F5F3FF] py-20 md:py-28 lg:py-32 overflow-hidden">
			{/* Decorative Elements */}
			<div className="absolute top-10 left-10 z-0 w-24 md:w-32 lg:w-36 opacity-40">
				<Image src="/images/polkadot-ungu.png" alt="Decoration" width={150} height={150} className="w-full h-auto" />
			</div>

			<div className="max-w-[1600px] mx-auto relative z-10">
				{/* Header */}
				<div className="text-center mb-12 md:mb-16 lg:mb-20 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
					<h3 className="text-[#661FFF] text-[24px] font-semibold mb-3 md:mb-4">
						Testimonies
					</h3>
					<h2 className="text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] xl:text-[44px] font-bold text-gray-900 mb-4 md:mb-5 leading-[1.2]">
						Apa Kata Mereka tentang Lentera Karir
					</h2>
				</div>

				{/* Testimonials Marquee */}
				<div className="space-y-6 md:space-y-8">
					{/* First Row - Scroll Left */}
					<div className="overflow-hidden">
						<div className="flex gap-6 animate-marquee-left hover:[animation-play-state:paused]">
							{/* First set */}
							{testimonials.slice(0, 3).map((testimonial, index) => (
								<div 
									key={`row1-${index}`}
									className="bg-white rounded-2xl p-6 md:p-7 lg:p-8 shadow-md hover:shadow-xl transition-shadow duration-300 flex-shrink-0 w-[320px] md:w-[380px]"
								>
									<div className="text-[#661FFF] mb-4">
										<svg className="w-10 h-10 md:w-12 md:h-12" fill="currentColor" viewBox="0 0 24 24">
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
									className="bg-white rounded-2xl p-6 md:p-7 lg:p-8 shadow-md hover:shadow-xl transition-shadow duration-300 flex-shrink-0 w-[320px] md:w-[380px]"
								>
									<div className="text-[#661FFF] mb-4">
										<svg className="w-10 h-10 md:w-12 md:h-12" fill="currentColor" viewBox="0 0 24 24">
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
					<div className="overflow-hidden">
						<div className="flex gap-6 animate-marquee-right hover:[animation-play-state:paused]">
							{/* First set */}
							{testimonials.slice(3, 6).map((testimonial, index) => (
								<div 
									key={`row2-${index}`}
									className="bg-white rounded-2xl p-6 md:p-7 lg:p-8 shadow-md hover:shadow-xl transition-shadow duration-300 flex-shrink-0 w-[320px] md:w-[380px]"
								>
									<div className="text-[#661FFF] mb-4">
										<svg className="w-10 h-10 md:w-12 md:h-12" fill="currentColor" viewBox="0 0 24 24">
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
							{testimonials.slice(3, 6).map((testimonial, index) => (
								<div 
									key={`row2-dup-${index}`}
									className="bg-white rounded-2xl p-6 md:p-7 lg:p-8 shadow-md hover:shadow-xl transition-shadow duration-300 flex-shrink-0 w-[320px] md:w-[380px]"
								>
									<div className="text-[#661FFF] mb-4">
										<svg className="w-10 h-10 md:w-12 md:h-12" fill="currentColor" viewBox="0 0 24 24">
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
				</div>
			</div>

			{/* Bottom Background Wave */}
			<div className="absolute bottom-0 left-0 right-0 h-32 bg-[#E5DBFF]/30 -z-10"></div>
		</section>
	);
}
