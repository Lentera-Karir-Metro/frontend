"use client";
import Image from 'next/image';
import Link from 'next/link';
import DashboardNavbar from '../../components/DashboardNavbar';
import Footer from '../../components/Footer';
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
			const response = await authenticatedFetch('http://localhost:3000/api/v1/learn/dashboard');

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
		// Search filter
		const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
		
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
			<div className="min-h-screen flex flex-col bg-white">
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
						<div className="relative max-w-xl">
							<div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
								</svg>
							</div>
							<input
								type="text"
								placeholder="Cari kelas berdasarkan judul..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-14 pr-6 py-4 rounded-full border-2 border-[#661FFF] focus:outline-none focus:ring-2 focus:ring-[#661FFF] focus:ring-opacity-20 text-gray-700 placeholder-gray-400 transition-all"
							/>
						</div>
						{searchQuery && (
							<p className="mt-3 text-sm text-gray-600">
								{filteredCourses.length > 0 
									? `Ditemukan ${filteredCourses.length} kelas`
									: 'Tidak ada kelas ditemukan'
								}
							</p>
						)}
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
								<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
									<svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
									</svg>
								</div>
								<p className="text-gray-600 text-lg mb-4">
									{searchQuery ? 'Tidak ada kelas yang sesuai dengan pencarian' : 'Kamu belum mendaftar kelas apapun'}
								</p>
								{!searchQuery && (
									<Link href="/explore" className="inline-block px-6 py-2 bg-[#661FFF] text-white rounded-lg hover:bg-[#5518CC] transition">
										Jelajahi Kelas
									</Link>
								)}
							</div>
						) : (
							// Jika filter 'all' tampilkan layout grid 3 kolom seperti dashboard
							(activeFilter === 'all') ? (
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
									{filteredCourses.map((course) => (
										<Link key={course.id} href={`/dashboard/kelas/${course.id}`}>
											<div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
												<div className="relative w-full h-48 md:h-52 bg-gray-200">
													<Image src={course.thumbnail_url || '/images/placeholder.jpg'} alt={course.title} fill className="object-cover" />
												</div>
												<div className="p-5 md:p-6">
													<h3 className="text-[16px] md:text-[18px] font-bold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
													<p className="text-[18px] md:text-[20px] font-bold text-[#661FFF] mb-4">
														{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(course.price)}
													</p>
													<div className="flex items-center gap-2 text-yellow-500 text-sm">
														<div className="flex items-center gap-1 leading-none">
															{[1,2,3,4,5].map(star => (
																<svg key={star} className="w-4 h-4 block" viewBox="0 0 329.942 329.942" fill={star <= Math.floor(course.rating) ? "#f7e84b" : "#e5e7eb"} aria-hidden="true">
																	<path d="M329.208,126.666c-1.765-5.431-6.459-9.389-12.109-10.209l-95.822-13.922l-42.854-86.837 c-2.527-5.12-7.742-8.362-13.451-8.362c-5.71,0-10.925,3.242-13.451,8.362l-42.851,86.836l-95.825,13.922 c-5.65,0.821-10.345,4.779-12.109,10.209c-1.764,5.431-0.293,11.392,3.796,15.377l69.339,67.582L57.496,305.07 c-0.965,5.628,1.348,11.315,5.967,14.671c2.613,1.899,5.708,2.865,8.818,2.865c2.387,0,4.784-0.569,6.979-1.723l85.711-45.059 l85.71,45.059c2.208,1.161,4.626,1.714,7.021,1.723c8.275-0.012,14.979-6.723,14.979-15c0-1.152-0.13-2.275-0.376-3.352 l-16.233-94.629l69.339-67.583C329.501,138.057,330.972,132.096,329.208,126.666z"/></svg>
																))}
														</div>
														<span className="text-gray-600 text-sm leading-none">({course.rating.toFixed(1)})</span>
													</div>
												</div>
											</div>
										</Link>
									))}
								</div>
							) : (
								// Untuk 'progress' dan 'completed' gunakan layout bar progress (tetap seperti sebelumnya)
								<div className="grid grid-cols-1 gap-6 md:gap-8">
									{filteredCourses.map((course) => (
										<Link key={course.id} href={`/dashboard/kelas/${course.id}`}>
											<div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100 cursor-pointer">
												<div className="p-6 md:p-8">
													<div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
														<div className="relative w-full sm:w-40 md:w-48 h-40 md:h-36 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
															<Image src={course.thumbnail_url || '/images/placeholder.jpg'} alt={course.title} fill className="object-cover" />
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
			<Footer />
		</div>
	</>
	);
}
