import Image from 'next/image';

export default function About() {
	return (
		<section id="about" className="relative bg-[#FAFAFA] py-20 md:py-28 lg:py-32 overflow-visible">
			{/* Polkadot kiri atas */}
			<div className="absolute top-0 left-0 z-0 w-20 md:w-28 lg:w-32">
				<Image src="/images/polkadot.png" alt="Polkadot" width={130} height={130} className="w-full h-auto" />
			</div>
			{/* Polkadot kiri bawah */}
			<div className="absolute left-0 z-0 w-24 md:w-32 lg:w-36" style={{ bottom: '0px' }}>
				<Image src="/images/polkadot-ungu.png" alt="Polkadot Ungu" width={150} height={150} className="w-full h-auto" />
			</div>
			<div className="max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 flex flex-col md:flex-row items-center gap-10 md:gap-12 lg:gap-16 xl:gap-20 relative z-10">
				{/* Text */}
				<div className="flex-1 max-w-[600px]">
					<h3 className="text-[#661FFF] text-base md:text-lg font-semibold mb-4 md:mb-5">About Us</h3>
					<h2 className="text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] xl:text-[44px] font-bold text-gray-900 mb-5 md:mb-6 lg:mb-7 leading-[1.2]">
						Kami hadir sebagai teman perjalanan kariermu menuju dunia profesional
					</h2>
					<p className="text-gray-700 text-[15px] md:text-[16px] lg:text-[17px] leading-[1.75] border-l-4 border-[#661FFF] pl-5 md:pl-6">
						Lentera Karir adalah lembaga pengembangan karier yang membantu individu, terutama fresh graduate, untuk lebih siap menghadapi dunia kerja. Kami menjawab tantangan seperti kebingungan arah, kurang percaya diri, hingga kesulitan saat proses rekrutmen melalui pendekatan praktis dan mentoring personal.
					</p>
				</div>
				{/* Image */}
				<div className="flex-1 flex justify-center md:justify-end items-center relative">
					<div className="absolute -top-8 -right-8 md:-top-10 md:-right-10 lg:-top-12 lg:-right-12 -z-10">
						<div className="bg-[#E5DBFF] w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] md:w-[360px] md:h-[360px] lg:w-[400px] lg:h-[400px] rounded-2xl" />
					</div>
					<Image
						src="/images/about.png"
						alt="About Lentera Karir"
						width={500}
						height={340}
						className="rounded-xl shadow-2xl relative z-10 w-full max-w-[300px] sm:max-w-[340px] md:max-w-[380px] lg:max-w-[420px] h-auto"
					/>
				</div>
			</div>
		</section>
	);
}
