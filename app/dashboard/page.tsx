"use client";
import Image from 'next/image';
import Link from 'next/link';
import DashboardNavbar from '../components/DashboardNavbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import { useState, useEffect } from 'react';
import { DashboardSkeleton } from '../components/ui/Skeleton';

interface DashboardStats {
	totalKelas: number;
	totalEbook: number;
	totalSertifikat: number;
}

interface ContinueLearning {
	id: string;
	title: string;
	description: string;
	thumbnail_url: string;
	progress_percent: number;
	total_modules: number;
	completed_modules: number;
}

interface RecommendedCourse {
	id: string;
	title: string;
	description: string;
	thumbnail_url: string;
	price: number;
	rating: number;
	review_count: number;
	category: string;
	level: string;
	total_students: number;
	mentor_name?: string;
	mentor_title?: string;
	mentor_photo_profile?: string;
}

export default function Dashboard() {
	const [isLoading, setIsLoading] = useState(true);
	const [stats, setStats] = useState<DashboardStats>({ totalKelas: 0, totalEbook: 0, totalSertifikat: 0 });
	const [continueLearning, setContinueLearning] = useState<ContinueLearning | null>(null);
	const [recommended, setRecommended] = useState<RecommendedCourse[]>([]);
	const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

	useEffect(() => {
		fetchDashboardData();
	}, []);

	const fetchDashboardData = async () => {
		try {
			const token = localStorage.getItem('token');
			if (!token) {
				window.location.href = '/sign-in';
				return;
			}

			const headers = {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json'
			};

			// Fetch stats
			const statsRes = await fetch('http://localhost:3000/api/v1/dashboard/stats', { headers });
			if (statsRes.ok) {
				const statsData = await statsRes.json();
				setStats(statsData.data);
			}

			// Fetch continue learning
			const continueRes = await fetch('http://localhost:3000/api/v1/dashboard/continue-learning', { headers });
			if (continueRes.ok) {
				const continueData = await continueRes.json();
				setContinueLearning(continueData.data);
			}

			// Fetch recommended from public catalog (3 latest courses)
			const recommendedRes = await fetch('http://localhost:3000/api/v1/catalog/courses?limit=3');
			if (recommendedRes.ok) {
				const recommendedJson = await recommendedRes.json();
				// API returns { data: [...], pagination: {...} }
				const recommendedData = Array.isArray(recommendedJson) ? recommendedJson : (recommendedJson.data || []);
				setRecommended(recommendedData.slice(0, 3));
			}

			setIsLoading(false);
		} catch (err) {
			console.error('Error fetching dashboard data:', err);
			setToastMessage({ type: 'error', text: 'Gagal memuat data dashboard' });
			setIsLoading(false);
		}
	};

	if (isLoading) return <DashboardSkeleton />;
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
			<div className="min-h-screen flex flex-col">
				<DashboardNavbar />

				<main className="flex-grow bg-white pb-20 md:pb-24 lg:pb-32">
					{/* Hero Section */}
					<section className="relative bg-gradient-to-r from-gray-900 to-gray-800 py-12 md:py-16 lg:py-20">
						<div className="absolute inset-0 opacity-50">
							<Image
								src="/images/dashboard.png"
								alt="Dashboard Background"
								fill
								className="object-cover"
								priority
							/>
						</div>
						<div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 text-center">
							<h1 className="text-white text-[32px] sm:text-[36px] md:text-[42px] lg:text-[48px] font-bold mb-3 md:mb-4">
								Dashboard
							</h1>
							<p className="text-white text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] max-w-2xl mx-auto">
								Upgrade terus ilmu dan pengalaman terbaru kamu di bidang teknologi
							</p>
						</div>
					</section>

					{/* Stats Cards */}
					<section className="py-8 md:py-12 lg:py-16 bg-gray-50">
						<div className="max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
								{/* Ebook Card */}
								<Link href="/dashboard/ebook" className="group relative bg-gradient-to-br from-[#661FFF] to-[#8B4FFF] rounded-2xl p-6 md:p-8 text-white shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2">
									{/* Large faded icon (decorative) */}
									<div className="absolute right-4 top-4 opacity-200 pointer-events-none z-0 hidden sm:block w-56 h-56 md:w-72 md:h-72 transform rotate-6 scale-105 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
										<Image src="/images/ebook2.png" alt="Decorative Ebook" fill className="object-contain" quality={100} priority />
									</div>

									{/* Content (above the decorative icon) */}
									<div className="relative z-10">
										<div className="flex items-center justify-between mb-4">
											<div className="relative bg-white/60 rounded-lg p-3 w-12 h-12 md:w-14 md:h-14 overflow-hidden flex items-center justify-center">
												<Image src="/images/fitur4.png" alt="Ebook icon" fill style={{ objectFit: 'contain' }} className="p-2" />
											</div>
										</div>
										<h3 className="text-[40px] md:text-[48px] font-bold mb-1">{stats.totalEbook}</h3>
										<p className="text-[16px] md:text-[18px] font-medium">Ebook</p>
									</div>
								</Link>
								{/* Kelas Card */}
								<Link href="/dashboard/kelas" className="group relative bg-gradient-to-br from-[#661FFF] to-[#8B4FFF] rounded-2xl p-6 md:p-8 text-white shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2">
									{/* Large faded icon (decorative) */}
									<div className="absolute right-8 top-10 opacity-200 pointer-events-none z-0 hidden sm:block w-44 h-44 md:w-56 md:h-56 transform rotate-6 scale-105 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
										<Image src="/images/fitur3.2.png" alt="Decorative Kelas" fill className="object-contain" quality={90} />
									</div>
									<div className="relative z-10">
										<div className="flex items-center justify-between mb-4">
											<div className="relative bg-white/60 rounded-lg p-3 w-12 h-12 md:w-14 md:h-14 overflow-hidden flex items-center justify-center">
												<Image src="/images/fitur3.png" alt="Class icon" fill style={{ objectFit: 'contain' }} className="p-2" />
											</div>
										</div>
										<h3 className="text-[40px] md:text-[48px] font-bold mb-1">{stats.totalKelas}</h3>
										<p className="text-[16px] md:text-[18px] font-medium">Kelas</p>
									</div>
								</Link>
								{/* Sertifikat Card */}
								<Link href="/dashboard/sertifikat" className="group relative bg-gradient-to-br from-[#661FFF] to-[#8B4FFF] rounded-2xl p-6 md:p-8 text-white shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2">
									{/* Large faded icon (decorative) */}
									<div className="absolute right-8 top-10 opacity-200 pointer-events-none z-0 hidden sm:block w-44 h-44 md:w-56 md:h-56 transform rotate-6 scale-105 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
										<Image src="/images/fitur6.2.png" alt="Decorative Sertifikat" fill className="object-contain" quality={90} />
									</div>
									<div className="relative z-10">
										<div className="flex items-center justify-between mb-4">
											<div className="relative bg-white/60 rounded-lg p-3 w-12 h-12 md:w-14 md:h-14 overflow-hidden flex items-center justify-center">
												<Image src="/images/fitur6.png" alt="Certificate icon" fill style={{ objectFit: 'contain' }} className="p-2" />
											</div>
										</div>
										<h3 className="text-[40px] md:text-[48px] font-bold mb-1">{stats.totalSertifikat}</h3>
										<p className="text-[16px] md:text-[18px] font-medium">Sertifikat</p>
									</div>
								</Link>
							</div>
						</div>
					</section>

					{/* Lanjutkan Belajar Section */}
					<section className="py-8 md:py-10 lg:py-12">
						<div className="max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
							<h2 className="text-[26px] sm:text-[30px] md:text-[36px] font-bold text-gray-900 mb-6 md:mb-8">
								Lanjutkan Belajar
							</h2>

							{continueLearning ? (
								<Link href={`/dashboard/kelas/${continueLearning.id}`} className="block bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow w-full">
									<div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
										{/* Course Image */}
										<div className="relative w-full sm:w-48 md:w-56 aspect-video rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
											<Image
												src={continueLearning.thumbnail_url || '/images/dashboard.png'}
												alt={continueLearning.title}
												fill
												className="object-cover"
											/>
										</div>

										{/* Course Info */}
										<div className="flex-grow w-full">
											<h3 className="text-[18px] md:text-[20px] font-bold text-gray-900 mb-3 leading-tight">
												{continueLearning.title}
											</h3>

											{/* Progress Bar */}
											<div>
												<div className="flex justify-between items-center mb-2">
													<span className="text-[14px] text-gray-600">Lanjutkan Belajar</span>
													<span className="text-[14px] font-semibold text-[#661FFF]">{continueLearning.progress_percent}%</span>
												</div>
												<div className="w-full bg-gray-200 rounded-full h-3">
													<div className="bg-[#661FFF] h-3 rounded-full" style={{ width: `${continueLearning.progress_percent}%` }}></div>
												</div>
											</div>
										</div>
									</div>
								</Link>
							) : (
								<div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 text-center">
									<p className="text-gray-500">Belum ada kelas yang sedang dipelajari</p>
									<Link href="/explore" className="inline-block mt-4 px-6 py-2 bg-[#661FFF] text-white rounded-lg hover:bg-[#5518CC] transition-colors">
										Jelajahi Kelas
									</Link>
								</div>
							)}
						</div>
					</section>

					{/* Rekomendasi Kelas Section */}
					<section className="py-0 md:py-2 lg:py-6">
						<div className="max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
							<h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-bold text-gray-900 mb-6 md:mb-8">
								Rekomendasi Kelas
							</h2>

							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
								{recommended.length > 0 ? (
									recommended.map((course) => (
										<Link key={course.id} href={`/course/${course.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:-translate-y-2 flex flex-col">
											<div className="relative w-full aspect-video bg-gray-100 overflow-hidden">
												<Image
													src={course.thumbnail_url || '/images/dashboard.png'}
													alt={course.title}
													fill
													className="object-cover transition-transform duration-500 group-hover:scale-105"
												/>
											</div>
											<div className="p-5 flex flex-col flex-grow">
												<h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
													{course.title}
												</h3>
												<p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">
													{course.description || ''}
												</p>
												<div className="mt-auto">
													{course.mentor_name && (
														<div className="flex items-center gap-2 mb-3">
															{course.mentor_photo_profile && (
																<div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
																	<Image
																		src={course.mentor_photo_profile}
																		alt={course.mentor_name}
																		width={32}
																		height={32}
																		className="object-cover w-full h-full"
																	/>
																</div>
															)}
															<div>
																<p className="text-gray-800 text-sm font-medium">{course.mentor_name}</p>
																{course.mentor_title && (
																	<p className="text-gray-500 text-xs">{course.mentor_title}</p>
																)}
															</div>
														</div>
													)}
													<p className="text-[#661FFF] font-bold text-lg">
														Rp{Number(course.price).toLocaleString('id-ID')}
													</p>
												</div>
											</div>
										</Link>
									))
								) : (
									<div className="col-span-full text-center py-12">
										<p className="text-gray-500">Tidak ada rekomendasi kelas saat ini</p>
									</div>
								)}
							</div>
						</div>
					</section>
				</main>

				<Footer />
			</div>
		</>
	);
}
