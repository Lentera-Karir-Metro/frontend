import Image from 'next/image';

export default function Features() {
	return (
		<section id="features" className="relative bg-white py-20 md:py-28 lg:py-32 overflow-hidden">
			{/* Decorative Elements */}
			<div className="absolute top-10 right-0 z-0 w-32 md:w-40 lg:w-48 opacity-50">
				<Image src="/images/polkadot-ungu.png" alt="Decoration" width={200} height={200} className="w-full h-auto" />
			</div>
			<div className="absolute bottom-20 left-0 z-0 w-28 md:w-36 lg:w-40 opacity-50">
				<Image src="/images/polkadot.png" alt="Decoration" width={160} height={160} className="w-full h-auto" />
			</div>

			<div className="max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 relative z-10">
				{/* Header */}
				<div className="text-center mb-12 md:mb-16 lg:mb-20">
					<h3 className="text-[#661FFF] text-[24px] font-semibold mb-3 md:mb-4">
						Our Best Features
					</h3>
					<h2 className="text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] xl:text-[44px] font-bold text-gray-900 mb-4 md:mb-5 leading-[1.2]">
						Lentera Karir memberi bimbingan dan<br className="hidden sm:block" /> strategi yang tepat
					</h2>
					<p className="text-gray-700 text-[15px] md:text-[16px] lg:text-[17px] leading-[1.75] max-w-[800px] mx-auto">
						Kami membantu kamu membangun fondasi profesional yang kuat sejak langkah pertama dengan menghadirkan pengalaman belajar yang interaktif dan dirancang langsung oleh para praktisi dunia kerja.
					</p>
				</div>

				{/* Features Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
					{/* Feature 1 */}
					<div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-7 lg:p-8 hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center">
						<div className="w-16 h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 bg-[#E5DBFF] rounded-2xl flex items-center justify-center mb-5 md:mb-6">
							<svg className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 text-[#661FFF]" fill="currentColor" viewBox="0 0 24 24">
								<path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zM10 4h4v2h-4V4zm10 15H4V8h16v11z"/>
							</svg>
						</div>
						<h3 className="text-[20px] md:text-[21px] lg:text-[22px] font-bold text-gray-900 mb-3 md:mb-4">
							Bootcamp Sukses Rekrutmen
						</h3>
						<p className="text-gray-600 text-[14px] md:text-[15px] leading-[1.7]">
							Program intensif selama 4-6 minggu dimana peserta mempelajari bimbingan mentor profesional, simulasi rekrutmen nyata, serta review CV dan interview yang dilakukan secara kolektif dan kolosal mereka.
						</p>
					</div>

					{/* Feature 2 */}
					<div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-7 lg:p-8 hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center">
						<div className="w-16 h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 bg-[#E5DBFF] rounded-2xl flex items-center justify-center mb-5 md:mb-6">
							<svg className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 text-[#661FFF]" fill="currentColor" viewBox="0 0 24 24">
								<path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
							</svg>
						</div>
						<h3 className="text-[20px] md:text-[21px] lg:text-[22px] font-bold text-gray-900 mb-3 md:mb-4">
							Video Course Mandiri
						</h3>
						<p className="text-gray-600 text-[14px] md:text-[15px] leading-[1.7]">
							Belajar secara fleksibel dan mandiri melalui rangkaian video pembelajaran praktis tentang strategi karier pun dari mana pun dan di mana pun. Materi disusun berdasarkan kebutuhan industri dan pengalaman HR profesional.
						</p>
					</div>

					{/* Feature 3 */}
					<div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-7 lg:p-8 hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center">
						<div className="w-16 h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 bg-[#E5DBFF] rounded-2xl flex items-center justify-center mb-5 md:mb-6">
							<svg className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 text-[#661FFF]" fill="currentColor" viewBox="0 0 24 24">
								<path d="M20 7h-5V4c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM9 4h6v3H9V4zm11 16H4V9h16v11zm-9-1h4v-2h-4v2zm0-4h4v-2h-4v2z"/>
							</svg>
						</div>
						<h3 className="text-[20px] md:text-[21px] lg:text-[22px] font-bold text-gray-900 mb-3 md:mb-4">
							Webinar & Workshop Mingguan
						</h3>
						<p className="text-gray-600 text-[14px] md:text-[15px] leading-[1.7]">
							Kelas interaktif daring dengan topik-topik karier terkini. Peserta dapat berinteraksi langsung dengan mentor praktisi HR, atau alumni perusahaan ternama, serta alumni aplikasi seputar dunia kerja
						</p>
					</div>

					{/* Feature 4 */}
					<div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-7 lg:p-8 hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center">
						<div className="w-16 h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 bg-[#E5DBFF] rounded-2xl flex items-center justify-center mb-5 md:mb-6">
							<svg className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 text-[#661FFF]" fill="currentColor" viewBox="0 0 24 24">
								<path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
							</svg>
						</div>
						<h3 className="text-[20px] md:text-[21px] lg:text-[22px] font-bold text-gray-900 mb-3 md:mb-4">
							Ebook dan Toolkit Digital
						</h3>
						<p className="text-gray-600 text-[14px] md:text-[15px] leading-[1.7]">
							Koleksi materi ringan dan praktis dalam bentuk PDF untuk membantu kamu menyusun CV, portofolio, dan strategi mencari lowongan kerja lebih cepat
						</p>
					</div>

					{/* Feature 5 */}
					<div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-7 lg:p-8 hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center">
						<div className="w-16 h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 bg-[#E5DBFF] rounded-2xl flex items-center justify-center mb-5 md:mb-6">
							<svg className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 text-[#661FFF]" fill="currentColor" viewBox="0 0 24 24">
								<path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
							</svg>
						</div>
						<h3 className="text-[20px] md:text-[21px] lg:text-[22px] font-bold text-gray-900 mb-3 md:mb-4">
							Program Magang dan Mitra
						</h3>
						<p className="text-gray-600 text-[14px] md:text-[15px] leading-[1.7]">
							Lentera Karir bekerja sama dengan UMKM, startup, dan komunitas digital untuk memberikan kesempatan magang nyata
						</p>
					</div>

				</div>
			</div>
		</section>
	);
}
