import Image from 'next/image';

export default function Features() {
	return (
		<section id="features" className="relative bg-white py-20 md:py-28 lg:py-32 overflow-visible">
			{/* Decorative Elements */}
			<div className="absolute top-0 right-0 z-30 w-32 md:w-40 lg:w-48 opacity-50">
				<Image src="/images/polkadot-ungu-kanan.png" alt="Decoration" width={200} height={200} className="w-full h-auto" />
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
				<div className="flex flex-col gap-4 sm:gap-6 md:gap-8 lg:gap-10">
					{/* Baris pertama: 3 fitur */}
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
						{/* Feature 1 */}
						<div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8 hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center">
							<div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 xl:w-20 xl:h-20 rounded-2xl mb-3 sm:mb-4 md:mb-5 lg:mb-6 overflow-hidden">
								<Image src="/images/fitur1.png" alt="Feature 1" fill style={{objectFit: 'contain'}} className="p-2" />
							</div>
							<h3 className="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[21px] xl:text-[22px] font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
								Bootcamp Sukses Rekrutmen
							</h3>
							<p className="text-gray-600 text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] leading-[1.7]">
								Program intensif selama 4-6 minggu dimana peserta mempelajari bimbingan mentor profesional, simulasi rekrutmen nyata, serta review CV dan interview yang dilakukan secara kolektif dan kolosal mereka.
							</p>
						</div>

						{/* Feature 2 */}
						<div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-7 lg:p-8 hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center">
							<div className="relative w-16 h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 rounded-2xl mb-5 md:mb-6 overflow-hidden">
								<Image src="/images/fitur2.png" alt="Feature 2" fill style={{objectFit: 'contain'}} className="p-2" />
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
							<div className="relative w-16 h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 rounded-2xl mb-5 md:mb-6 overflow-hidden">
								<Image src="/images/fitur3.png" alt="Feature 3" fill style={{objectFit: 'contain'}} className="p-2" />
							</div>
							<h3 className="text-[20px] md:text-[21px] lg:text-[22px] font-bold text-gray-900 mb-3 md:mb-4">
								Webinar & Workshop Mingguan
							</h3>
							<p className="text-gray-600 text-[14px] md:text-[15px] leading-[1.7]">
								Kelas interaktif daring dengan topik-topik karier terkini. Peserta dapat berinteraksi langsung dengan mentor praktisi HR, atau alumni perusahaan ternama, serta alumni aplikasi seputar dunia kerja
							</p>
						</div>
					</div>

					{/* Baris kedua: 2 fitur di tengah dengan ukuran konsisten */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-10 max-w-3xl mx-auto">
						{/* Feature 4 */}
						<div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8 hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center">
							<div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 xl:w-20 xl:h-20 rounded-2xl mb-3 sm:mb-4 md:mb-5 lg:mb-6 overflow-hidden">
								<Image src="/images/fitur4.png" alt="Feature 4" fill style={{objectFit: 'contain'}} className="p-2" />
							</div>
							<h3 className="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[21px] xl:text-[22px] font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
								Ebook dan Toolkit Digital
							</h3>
							<p className="text-gray-600 text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] leading-[1.7]">
								Koleksi materi ringan dan praktis dalam bentuk PDF untuk membantu kamu menyusun CV, portofolio, dan strategi mencari lowongan kerja lebih cepat
							</p>
						</div>

						{/* Feature 5 */}
						<div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-7 lg:p-8 hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center">
							<div className="relative w-16 h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 rounded-2xl mb-5 md:mb-6 overflow-hidden">
								<Image src="/images/fitur5.png" alt="Feature 5" fill style={{objectFit: 'contain'}} className="p-2" />
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
			</div>
		</section>
	);
}
