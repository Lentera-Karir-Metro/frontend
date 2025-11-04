import Image from 'next/image';

export default function Courses() {
	const courses = [
		{
			id: 1,
			image: '/images/courses.png',
			badge: 'Bootcamp',
			title: 'Bootcamp: Kick-Start Karier Digital',
			price: 'Rp250,000',
			mentor: 'Budi (Mentor Bootcamp)',
			mentorImage: '/images/mentor.png'
		},
		{
			id: 2,
			image: '/images/courses.png',
			badge: 'Bootcamp',
			title: 'Bootcamp: Kick-Start Karier Digital',
			price: 'Rp250,000',
			mentor: 'Budi (Mentor Bootcamp)',
			mentorImage: '/images/mentor.png'
		},
		{
			id: 3,
			image: '/images/courses.png',
			badge: 'Bootcamp',
			title: 'Bootcamp: Kick-Start Karier Digital',
			price: 'Rp250,000',
			mentor: 'Budi (Mentor Bootcamp)',
			mentorImage: '/images/mentor.png'
		},
		{
			id: 4,
			image: '/images/courses.png',
			badge: 'Bootcamp',
			title: 'Bootcamp: Kick-Start Karier Digital',
			price: 'Rp250,000',
			mentor: 'Budi (Mentor Bootcamp)',
			mentorImage: '/images/mentor.png'
		}
	];

	return (
		<section id="courses" className="relative bg-[#FAFAFA] py-16 md:py-20 lg:py-24 overflow-hidden">
			{/* Decorative circles - top right */}
			<div className="absolute top-8 right-0 w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48">
				<Image
					src="/images/polkadot.png"
					alt="Decorative Circle"
					fill
					className="object-cover"
				/>
			</div>

			{/* Decorative circles - bottom left */}
			<div className="absolute bottom-8 left-0 w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36">
				<Image
					src="/images/polkadot-ungu.png"
					alt="Decorative Circle Ungu"
					fill
					className="object-cover"
				/>
			</div>

			<div className="max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 relative z-10">
				{/* Header */}
				<div className="mb-12 md:mb-16">
					<h3 className="text-[#661FFF] text-sm md:text-base font-semibold mb-3 md:mb-4">
						Our Courses
					</h3>
					<h2 className="text-[32px] sm:text-[36px] md:text-[40px] lg:text-[44px] font-bold text-gray-900 mb-3 md:mb-4 leading-[1.2]">
						Kelas Unggulan dari Lentera Karir
					</h2>
					<p className="text-gray-700 text-[15px] md:text-[16px] lg:text-[17px] leading-[1.6] max-w-[700px]">
						Setiap kelas dirancang untuk membantumu tumbuh melalui praktik nyata, bukan sekadar teori.
					</p>
				</div>

				{/* Courses Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
					{courses.map((course) => (
						<div 
							key={course.id} 
							className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100"
						>
							{/* Course Image */}
							<div className="relative w-full h-48 md:h-52 bg-gray-200">
								<Image
									src={course.image}
									alt={course.title}
									fill
									className="object-cover"
								/>
							</div>

							{/* Course Content */}
							<div className="p-5 md:p-6">
								{/* Badge */}
								<span className="inline-block bg-[#F3E8FF] text-[#661FFF] text-xs font-medium px-3 py-1 rounded-full mb-3">
									{course.badge}
								</span>

								{/* Title */}
								<h3 className="text-gray-900 font-bold text-base md:text-lg mb-2 leading-snug">
									{course.title}
								</h3>

								{/* Price */}
								<p className="text-gray-900 font-semibold text-base md:text-lg mb-4">
									{course.price}
								</p>

								{/* Mentor Info */}
								<div className="flex items-center gap-2">
									<div className="relative w-6 h-6 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
										<Image
											src={course.mentorImage}
											alt={course.mentor}
											fill
											className="object-cover"
										/>
									</div>
									<span className="text-gray-600 text-sm">
										{course.mentor}
									</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
