"use client";
import Image from 'next/image';
import DashboardNavbar from '../../components/DashboardNavbar';
import Footer from '../../components/Footer';
import { useState } from 'react';

type FilterType = 'all' | 'progress' | 'completed';

export default function KelasPage() {
	const [activeFilter, setActiveFilter] = useState<FilterType>('all');
	const [searchQuery, setSearchQuery] = useState('');

	// Sample course data - replace with actual data from API
	const courses = [
		{
			id: 1,
			title: 'Bootcamp: Kick-Start Karier Digital',
			price: 'Rp250.000',
			rating: 5,
			reviews: 256,
			image: '/images/dashboard.png',
			status: 'progress',
			progress: 25
		},
		{
			id: 2,
			title: 'Bootcamp: Kick-Start Karier Digital',
			price: 'Rp250.000',
			rating: 5,
			reviews: 256,
			image: '/images/dashboard.png',
			status: 'completed',
			progress: 100
		},
		{
			id: 3,
			title: 'Bootcamp: Kick-Start Karier Digital',
			price: 'Rp250.000',
			rating: 5,
			reviews: 256,
			image: '/images/dashboard.png',
			status: 'progress',
			progress: 60
		}
	];

	const filteredCourses = courses.filter(course => {
		const matchesFilter = activeFilter === 'all' || course.status === activeFilter;
		const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
		return matchesFilter && matchesSearch;
	});

	return (
		<div className="min-h-screen flex flex-col">
			<DashboardNavbar />

			<main className="flex-grow bg-[#E5E1F6]">
				{/* Hero Section */}
				<section className="bg-[#E5E1F6] pt-12 pb-8 md:pt-16 md:pb-12">
					<div className="max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
						<h1 className="text-gray-900 text-[32px] sm:text-[36px] md:text-[42px] lg:text-[48px] font-bold mb-3 md:mb-4">
							Kelas Saya
						</h1>
						<p className="text-gray-700 text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] max-w-2xl">
							Kumpulan kelas yang telah kamu ikuti dari Lentera Karir
						</p>
					</div>
				</section>

				{/* Search and Filter Section */}
				<section className="bg-[#E5E1F6] pb-8">
					<div className="max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
						{/* Search Bar */}
						<div className="flex flex-col sm:flex-row gap-4 mb-8">
							<div className="flex-grow relative">
								<input
									type="text"
									placeholder="Cari Kelas.."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="w-full px-6 py-4 rounded-full border-2 border-[#661FFF] focus:outline-none focus:ring-2 focus:ring-[#661FFF] text-gray-700 placeholder-gray-400"
								/>
							</div>
							<button className="bg-[#661FFF] text-white px-12 py-4 rounded-full font-semibold hover:bg-[#5518CC] transition-colors whitespace-nowrap">
								Search
							</button>
						</div>

						{/* Filter Buttons */}
						<div className="flex flex-wrap gap-4">
							<button
								onClick={() => setActiveFilter('all')}
								className={`px-8 py-3 rounded-full font-semibold transition-all ${
									activeFilter === 'all'
										? 'bg-[#661FFF] text-white'
										: 'bg-white text-gray-700 border border-gray-300 hover:border-[#661FFF]'
								}`}
							>
								Semua Kelas
							</button>
							<button
								onClick={() => setActiveFilter('progress')}
								className={`px-8 py-3 rounded-full font-semibold transition-all ${
									activeFilter === 'progress'
										? 'bg-[#661FFF] text-white'
										: 'bg-white text-gray-700 border border-gray-300 hover:border-[#661FFF]'
								}`}
							>
								On Progress
							</button>
							<button
								onClick={() => setActiveFilter('completed')}
								className={`px-8 py-3 rounded-full font-semibold transition-all ${
									activeFilter === 'completed'
										? 'bg-[#661FFF] text-white'
										: 'bg-white text-gray-700 border border-gray-300 hover:border-[#661FFF]'
								}`}
							>
								Selesai
							</button>
						</div>
					</div>
				</section>

				{/* Course Cards Section */}
				<section className="py-8 md:py-12 bg-white">
					<div className="max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
						{filteredCourses.length === 0 ? (
							<div className="text-center py-12">
								<p className="text-gray-600 text-lg">Tidak ada kelas ditemukan</p>
							</div>
						) : (
							<div className="grid grid-cols-1 gap-6 md:gap-8">
								{filteredCourses.map((course) => (
									<div
										key={course.id}
										className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100 cursor-pointer"
									>
										<div className="p-6 md:p-8">
											<div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
												{/* Course Image */}
												<div className="relative w-full sm:w-40 md:w-48 h-40 md:h-36 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
													<Image
														src={course.image}
														alt={course.title}
														fill
														className="object-cover"
													/>
												</div>

												{/* Course Info */}
												<div className="flex-grow w-full">
													<h3 className="text-[16px] md:text-[18px] font-bold text-gray-900 mb-3 leading-tight">
														{course.title}
													</h3>

													{/* Progress Bar */}
													<div>
														<div className="flex justify-between items-center mb-2">
															<span className="text-[14px] text-gray-600">Lanjutkan Belajar</span>
															<span className="text-[14px] font-semibold text-[#661FFF]">
																{course.progress}%
															</span>
														</div>
														<div className="w-full bg-gray-200 rounded-full h-3">
															<div
																className="bg-[#661FFF] h-3 rounded-full transition-all"
																style={{ width: `${course.progress}%` }}
															></div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
}
