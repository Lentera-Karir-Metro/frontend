"use client";
import Image from 'next/image';
import Link from 'next/link';
import DashboardNavbar from '../../components/DashboardNavbar';
import Toast from '../../components/Toast';
import { useState, useEffect } from 'react';
import { DashboardSkeleton } from '../../components/ui/Skeleton';
import { authenticatedFetch, logout } from '@/lib/auth';

type FilterType = 'all' | 'progress' | 'completed';

interface Course {
	id: string;
	title: string;
	description: string;
	thumbnail_url: string;
	price: number;
	rating: number;
	review_count: number;
	category: string;
	level: string;
	discount_amount?: number;
	progress_percent?: number;
	total_modules?: number;
	completed_modules?: number;
}

export default function KelasPage() {
	const [isLoading, setIsLoading] = useState(true);
	const [activeFilter, setActiveFilter] = useState<FilterType>('all');
	const [searchQuery, setSearchQuery] = useState('');
	const [courses, setCourses] = useState<Course[]>([]);
	const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

	useEffect(() => {
		fetchMyCourses();
	}, []);

	const fetchMyCourses = async () => {
		try {
			setIsLoading(true);
			setToastMessage(null);

			// Gunakan authenticatedFetch yang otomatis handle token expiry
			const response = await authenticatedFetch('http://localhost:3000/api/v1/learn/my-courses');

			if (!response.ok) {
				// Jika 401, authenticatedFetch sudah handle logout otomatis
				if (response.status === 401) {
					return; // Stop execution karena sudah redirect
				}
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			console.log('API Response:', data);

			// Handle if data is array directly or wrapped in object
			const coursesData = Array.isArray(data) ? data : (data.data || []);
			setCourses(coursesData);

			if (coursesData.length === 0) {
				console.log('No courses found');
			}
		} catch (err: any) {
			console.error('Error fetching courses:', err);
			// Jangan tampilkan error jika token expired (sudah logout)
			if (err.message !== 'Token expired' && err.message !== 'Unauthorized - Token expired or invalid') {
				setToastMessage({ type: 'error', text: err.message || 'Terjadi kesalahan saat memuat data' });
			}
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading) return <DashboardSkeleton />;

	console.log('Total courses:', courses.length);
	console.log('Active filter:', activeFilter);
	console.log('Courses with progress:', courses.map(c => ({
		title: c.title,
		progress: c.progress_percent,
		completed: c.completed_modules,
		total: c.total_modules
	})));

	const filteredCourses = courses.filter(course => {
		// Search filter - add null/undefined check
		const matchesSearch = course.title ? course.title.toLowerCase().includes(searchQuery.toLowerCase()) : false;

		// Progress filter
		const progress = course.progress_percent || 0;
		const matchesFilter =
			activeFilter === 'all' ||
			(activeFilter === 'progress' && progress < 100) ||  // Termasuk 0% (belum mulai)
			(activeFilter === 'completed' && progress === 100);

		return matchesFilter && matchesSearch;
	});

	console.log('Filtered courses:', filteredCourses.length);
	console.log('Completed courses (100%):', courses.filter(c => c.progress_percent === 100).map(c => c.title));

	return (
		<>
			{toastMessage && (
				<Toast
					type={toastMessage.type}
					message={toastMessage.type === 'success' ? 'Berhasil' : 'Terjadi Kesalahan'}
					subMessage={toastMessage.text}
					onClose={() => setToastMessage(null)}
				/>
			)}
			<div className="min-h-screen flex flex-col bg-gray-50">
				<DashboardNavbar />

				<main className="flex-grow">
					{/* Hero Section */}
					<section className="bg-gradient-to-br from-[#661FFF] to-[#9D6FFF] pt-12 pb-16 md:pt-16 md:pb-20">
						<div className="max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
							<h1 className="text-white text-[32px] sm:text-[36px] md:text-[42px] lg:text-[48px] font-bold mb-3 md:mb-4">
								Kelas Saya
							</h1>
							<p className="text-white/80 text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] max-w-2xl">
								Kumpulan kelas yang telah kamu ikuti dari Lentera Karir
							</p>
						</div>
					</section>

					{/* Search Bar Section - Overlapping */}
					<section className="-mt-6 relative z-10">
						<div className="max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
							<div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
								<div className="relative md:max-w-md">
									<div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
										</svg>
									</div>
									<input
										type="text"
										placeholder="Cari kelas berdasarkan judul..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#661FFF] focus:border-transparent text-gray-700 placeholder-gray-400 bg-gray-50"
									/>
								</div>
								{searchQuery && (
									<p className="text-sm text-gray-500 mt-3">
										Ditemukan {filteredCourses.length} kelas
									</p>
								)}
							</div>
						</div>
					</section>

					{/* Course Cards Section */}
					<section className="py-8 md:py-12">
						<div className="max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
							{/* Filter Buttons */}
							<div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm p-1.5 rounded-full mb-8">
								<button
									onClick={() => setActiveFilter('all')}
									className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-200 ${activeFilter === 'all'
										? 'bg-[#661FFF] text-white shadow-sm'
										: 'text-gray-600 hover:text-gray-900'
										}`}
								>
									Semua Kelas
								</button>
								<button
									onClick={() => setActiveFilter('progress')}
									className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-200 ${activeFilter === 'progress'
										? 'bg-[#661FFF] text-white shadow-sm'
										: 'text-gray-600 hover:text-gray-900'
										}`}
								>
									On Progress
								</button>
								<button
									onClick={() => setActiveFilter('completed')}
									className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-200 ${activeFilter === 'completed'
										? 'bg-[#661FFF] text-white shadow-sm'
										: 'text-gray-600 hover:text-gray-900'
										}`}
								>
									Selesai
								</button>
							</div>

							{filteredCourses.length === 0 ? (
								<div className="text-center py-16 bg-white rounded-2xl shadow-sm">
									<div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
										<svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
										</svg>
									</div>
									<p className="text-gray-600 text-lg mb-6">
										{searchQuery ? 'Tidak ada kelas yang sesuai dengan pencarian' : 'Kamu belum memiliki kelas'}
									</p>
									{!searchQuery && (
										<Link href="/explore" className="inline-block px-8 py-3 bg-[#661FFF] text-white rounded-xl font-semibold hover:bg-[#5518CC] transition">
											Jelajahi Kelas
										</Link>
									)}
								</div>
							) : (
								// Jika filter 'all' tampilkan layout grid 3 kolom seperti dashboard (tanpa harga & progress)
								(activeFilter === 'all') ? (
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
										{filteredCourses.map((course) => (
											<Link key={course.id} href={`/dashboard/kelas/${course.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:-translate-y-2 flex flex-col">
												<div className="relative w-full aspect-video bg-gray-100 overflow-hidden">
													<Image
														src={course.thumbnail_url || '/images/placeholder.jpg'}
														alt={course.title}
														fill
														className="object-cover transition-transform duration-500 group-hover:scale-105"
													/>
												</div>
												<div className="p-5 flex flex-col flex-grow">
													<h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
														{course.title}
													</h3>
													{course.description && (
														<p className="text-gray-600 text-sm line-clamp-2 flex-grow">
															{course.description}
														</p>
													)}
												</div>
											</Link>
										))}
									</div>
								) : (
									// Untuk 'progress' dan 'completed' gunakan layout bar progress
									<div className="grid grid-cols-1 gap-6 md:gap-8">
										{filteredCourses.map((course) => (
											<Link key={course.id} href={`/dashboard/kelas/${course.id}`}>
												<div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100 cursor-pointer">
													<div className="p-6 md:p-8">
														<div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
															<div className="relative w-full sm:w-48 md:w-56 aspect-video rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
																<Image src={course.thumbnail_url || '/images/placeholder.jpg'} alt={course.title} fill className="object-contain" />
															</div>
															<div className="flex-grow w-full">
																<h3 className="text-[16px] md:text-[18px] font-bold text-gray-900 mb-3 leading-tight">{course.title}</h3>
																<div>
																	<div className="flex justify-between items-center mb-2">
																		<span className="text-[14px] text-gray-600">{course.progress_percent === 100 ? 'Selesai' : 'Lanjutkan Belajar'}</span>
																		<span className="text-[14px] font-semibold text-[#661FFF]">{course.progress_percent || 0}%</span>
																	</div>
																	<div className="w-full bg-gray-200 rounded-full h-3">
																		<div className="bg-[#661FFF] h-3 rounded-full" style={{ width: `${course.progress_percent || 0}%` }}></div>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
											</Link>
										))}
									</div>
								)
							)}
						</div>
					</section>
				</main>
			</div>
		</>
	);
}
