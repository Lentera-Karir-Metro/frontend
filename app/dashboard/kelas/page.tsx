"use client";
import Image from 'next/image';
import DashboardNavbar from '../../components/DashboardNavbar';
import Footer from '../../components/Footer';
import { useState, useEffect } from 'react';
import { DashboardSkeleton } from '../../components/ui/Skeleton';

type FilterType = 'all' | 'progress' | 'completed';

export default function KelasPage() {
	const [isLoading, setIsLoading] = useState(true);
	const [activeFilter, setActiveFilter] = useState<FilterType>('all');
	const [searchQuery, setSearchQuery] = useState('');

	useEffect(() => {
		const t = setTimeout(() => setIsLoading(false), 1000);
		return () => clearTimeout(t);
	}, []);

	if (isLoading) return <DashboardSkeleton />;

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
		<div className="min-h-screen flex flex-col pb-18 md:pb-20 lg:pb-22 bg-white">
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
						<div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
							<div className="flex-grow relative md:flex-grow-0 md:w-[420px]">
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

						{/* Filter Buttons moved below purple area */}
					</div>
				</section>

				{/* Course Cards Section */}
				<section className="py-4 md:py-8 bg-white">
					<div className="max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
						{/* Filter Buttons (now below purple hero) */}
						<div className="flex flex-wrap gap-4 mb-6">
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

						{filteredCourses.length === 0 ? (
							<div className="text-center py-12">
								<p className="text-gray-600 text-lg">Tidak ada kelas ditemukan</p>
							</div>
						) : (
							// Jika filter 'all' tampilkan layout grid 3 kolom seperti dashboard
							(activeFilter === 'all') ? (
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
									{filteredCourses.map((course) => (
										<div key={course.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
											<div className="relative w-full h-48 md:h-52 bg-gray-200">
												<Image src={course.image} alt={course.title} fill className="object-cover" />
											</div>
											<div className="p-5 md:p-6">
												<h3 className="text-[16px] md:text-[18px] font-bold text-gray-900 mb-2">{course.title}</h3>
												<p className="text-[18px] md:text-[20px] font-bold text-[#661FFF] mb-4">{course.price}</p>
												<div className="flex items-center gap-2 text-yellow-500 text-sm">
													<div className="flex items-center gap-1 leading-none">
														{[1,2,3,4,5].map(star => (
															<svg key={star} className="w-4 h-4 block" viewBox="0 0 329.942 329.942" fill="#f7e84b" aria-hidden="true">
																<path d="M329.208,126.666c-1.765-5.431-6.459-9.389-12.109-10.209l-95.822-13.922l-42.854-86.837 c-2.527-5.12-7.742-8.362-13.451-8.362c-5.71,0-10.925,3.242-13.451,8.362l-42.851,86.836l-95.825,13.922 c-5.65,0.821-10.345,4.779-12.109,10.209c-1.764,5.431-0.293,11.392,3.796,15.377l69.339,67.582L57.496,305.07 c-0.965,5.628,1.348,11.315,5.967,14.671c2.613,1.899,5.708,2.865,8.818,2.865c2.387,0,4.784-0.569,6.979-1.723l85.711-45.059 l85.71,45.059c2.208,1.161,4.626,1.714,7.021,1.723c8.275-0.012,14.979-6.723,14.979-15c0-1.152-0.13-2.275-0.376-3.352 l-16.233-94.629l69.339-67.583C329.501,138.057,330.972,132.096,329.208,126.666z"/></svg>
															))}
													</div>
													<span className="text-gray-600 text-sm leading-none">({course.reviews})</span>
												</div>
											</div>
										</div>
									))}
								</div>
							) : (
								// Untuk 'progress' dan 'completed' gunakan layout bar progress (tetap seperti sebelumnya)
								<div className="grid grid-cols-1 gap-6 md:gap-8">
									{filteredCourses.map((course) => (
										<div key={course.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100 cursor-pointer">
											<div className="p-6 md:p-8">
												<div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
													<div className="relative w-full sm:w-40 md:w-48 h-40 md:h-36 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
														<Image src={course.image} alt={course.title} fill className="object-cover" />
													</div>
													<div className="flex-grow w-full">
														<h3 className="text-[16px] md:text-[18px] font-bold text-gray-900 mb-3 leading-tight">{course.title}</h3>
														<div>
															<div className="flex justify-between items-center mb-2">
																<span className="text-[14px] text-gray-600">Lanjutkan Belajar</span>
																<span className="text-[14px] font-semibold text-[#661FFF]">{course.progress}%</span>
															</div>
															<div className="w-full bg-gray-200 rounded-full h-3">
																<div className="bg-[#661FFF] h-3 rounded-full" style={{ width: `${course.progress}%` }}></div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							)
						)}
					</div>
				</section>
			</main>
		</div>
	);
}
