"use client";
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardNavbar from '@/app/components/DashboardNavbar';
import Footer from '@/app/components/Footer';
import { DashboardSkeleton } from '@/app/components/ui/Skeleton';

type Module = {
	id: string;
	title: string;
	module_type?: 'video' | 'ebook' | 'quiz';
	sequence_order: number;
	video_url?: string;
	ebook_url?: string;
	quiz_id?: string;
	durasi_video_menit?: number;
	estimasi_waktu_menit?: number;
}

type Course = {
	id: string;
	title: string;
	description?: string;
	sequence_order: number;
	modules: Module[];
}

type LearningPath = {
	id: string;
	title: string;
	description?: string;
	price: number;
	thumbnail_url?: string;
	discount_amount?: number;
	rating: number;
	review_count: number;
	category: string;
	level?: string;
	mentor_name?: string;
	mentor_title?: string;
	mentor_photo_profile?: string;
	courses: Course[];
}

export default function CourseDetailPage() {
	const params = useParams();
	const router = useRouter();
	const courseId = params?.id as string;

	const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
	const [isEnrolled, setIsEnrolled] = useState(false);

	useEffect(() => {
		const fetchCourseDetail = async () => {
			try {
				setIsLoading(true);
				const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
				const response = await fetch(`${baseUrl}/catalog/courses/${courseId}`);

				if (!response.ok) {
					throw new Error(`Failed to fetch: ${response.status}`);
				}

				const data = await response.json();
				// Map single course to learningPath format for compatibility
				setLearningPath({
					...data,
					courses: data.modules ? [{
						id: data.id,
						title: data.title,
						sequence_order: 1,
						modules: data.modules
					}] : []
				});

				// Auto-expand first section
				if (data.modules && data.modules.length > 0) {
					setExpandedSections({ [data.id]: true });
				}
			} catch (err: any) {
				setError(err.message || 'Failed to load course details');
			} finally {
				setIsLoading(false);
			}
		};

		const checkEnrollment = async () => {
			try {
				const token = localStorage.getItem('token');
				if (!token) {
					setIsEnrolled(false);
					return;
				}

				const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
				const response = await fetch(`${baseUrl}/learn/my-courses`, {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				});

				if (response.ok) {
					const enrolledCourses = await response.json();
					// Check if current courseId is in enrolled courses
					const enrolled = Array.isArray(enrolledCourses) && enrolledCourses.some((course: any) => course.id === courseId);
					setIsEnrolled(enrolled);
				}
			} catch (err) {
				console.error('Error checking enrollment:', err);
				setIsEnrolled(false);
			}
		};

		if (courseId) {
			fetchCourseDetail();
			checkEnrollment();
		}
	}, [courseId]);

	const toggleSection = (sectionId: string) => {
		setExpandedSections(prev => ({
			...prev,
			[sectionId]: !prev[sectionId]
		}));
	};

	const getModuleIcon = (type: string) => {
		if (type === 'video') {
			return (
				<svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 512 512">
					<path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM372.5 276.5l-144 88C224.7 366.8 220.3 368 216 368c-13.69 0-24-11.2-24-24V168C192 155.3 202.2 144 216 144c4.344 0 8.678 1.176 12.51 3.516l144 88C379.6 239.9 384 247.6 384 256C384 264.4 379.6 272.1 372.5 276.5z" />
				</svg>
			);
		} else if (type === 'ebook') {
			return (
				<svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 512 512">
					<path d="M96 0C43 0 0 43 0 96V416c0 53 43 96 96 96H384h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V384c17.7 0 32-14.3 32-32V32c0-17.7-14.3-32-32-32H384 96zm0 384H352v64H96c-17.7 0-32-14.3-32-32s14.3-32 32-32zm32-240c0-8.8 7.2-16 16-16H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16zm16 48H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
				</svg>
			);
		} else {
			return (
				<svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 384 512">
					<path d="M336 64h-53.88C268.9 26.8 233.7 0 192 0S115.1 26.8 101.9 64H48C21.5 64 0 85.48 0 112v352C0 490.5 21.5 512 48 512h288c26.5 0 48-21.48 48-48v-352C384 85.48 362.5 64 336 64zM96 392c-13.25 0-24-10.75-24-24S82.75 344 96 344s24 10.75 24 24S109.3 392 96 392zM96 296c-13.25 0-24-10.75-24-24S82.75 248 96 248S120 258.8 120 272S109.3 296 96 296zM192 64c17.67 0 32 14.33 32 32c0 17.67-14.33 32-32 32S160 113.7 160 96C160 78.33 174.3 64 192 64zM304 384h-128C167.2 384 160 376.8 160 368C160 359.2 167.2 352 176 352h128c8.801 0 16 7.199 16 16C320 376.8 312.8 384 304 384zM304 288h-128C167.2 288 160 280.8 160 272C160 263.2 167.2 256 176 256h128C312.8 256 320 263.2 320 272C320 280.8 312.8 288 304 288z" />
				</svg>
			);
		}
	};

	const formatDuration = (minutes?: number) => {
		if (!minutes) return '';
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		if (hours > 0) {
			return `${hours}:${mins.toString().padStart(2, '0')}`;
		}
		return `${mins}:00`;
	};

	const getModuleType = (module: Module): 'video' | 'ebook' | 'quiz' => {
		if (module.module_type) return module.module_type;
		if (module.video_url) return 'video';
		if (module.ebook_url) return 'ebook';
		if (module.quiz_id) return 'quiz';
		return 'video'; // default
	};

	const countModulesByType = (modules: Module[]) => {
		const counts = {
			video: 0,
			ebook: 0,
			quiz: 0
		};
		modules.forEach(m => {
			const type = getModuleType(m);
			counts[type]++;
		});
		return counts;
	};

	if (isLoading) return <DashboardSkeleton />;

	if (error) {
		return (
			<div className="min-h-screen flex flex-col bg-gray-50">
				<DashboardNavbar />
				<div className="flex-1 flex items-center justify-center">
					<div className="text-center">
						<svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<h2 className="text-2xl font-bold text-gray-900 mb-2">Terjadi Kesalahan</h2>
						<p className="text-gray-600">{error}</p>
					</div>
				</div>
				<Footer />
			</div>
		);
	}

	if (!learningPath) {
		return (
			<div className="min-h-screen flex flex-col bg-gray-50">
				<DashboardNavbar />
				<div className="flex-1 flex items-center justify-center">
					<p className="text-gray-500">Kelas tidak ditemukan</p>
				</div>
				<Footer />
			</div>
		);
	}

	return (
		<div className="min-h-screen flex flex-col bg-gray-50">
			<DashboardNavbar />

			{/* Hero Section */}
			<section className="relative bg-gradient-to-r from-gray-900 to-gray-800 py-12 md:py-16 lg:py-20">
				<div className="absolute inset-0 opacity-50">
					<Image
						src={learningPath.thumbnail_url || '/images/dashboard.png'}
						alt={learningPath.title}
						fill
						className="object-cover"
						priority
					/>
				</div>
				<div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
					{/* Back Button */}
					<button
						onClick={() => router.back()}
						className="inline-flex items-center gap-2 px-4 py-2.5 bg-transparent border-2 border-white/70 text-white rounded-full font-semibold mb-6 hover:bg-white hover:text-gray-900 hover:scale-105 transition-all duration-300 group"
					>
						<svg
							className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
						</svg>
						<span>Kembali</span>
					</button>

					<div className="text-center md:text-left">
						{isEnrolled && (
							<div className="inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
								<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
								<span className="text-sm font-medium text-white">Sudah Terdaftar</span>
							</div>
						)}

						<h1 className="text-white text-[32px] sm:text-[36px] md:text-[42px] lg:text-[48px] font-bold mb-3 md:mb-4">
							{learningPath.title}
						</h1>
						<p className="text-white text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] max-w-2xl">
							{learningPath.description}
						</p>

						{/* Course Info - Category Only */}
						<div className="flex flex-wrap gap-3 mt-6">
							<span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium">
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
								</svg>
								{learningPath.category}
							</span>
							{learningPath.mentor_name && (
								<span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium">
									<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
										<path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
									</svg>
									{learningPath.mentor_name}
								</span>
							)}
						</div>
					</div>
				</div>
			</section>

			{/* Main Content */}
			<div className="flex-1 max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-8 md:py-12">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Left Content - Course Details */}
					<div className="lg:col-span-2 space-y-8">
						{/* Tentang Kelas */}
						<div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-200">
							<h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Tentang Kelas</h2>
							<div className="space-y-4 text-gray-700 leading-relaxed">
								<p>{learningPath.description}</p>
							</div>
							<div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
								<div className="flex items-center gap-3">
									<div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
										<svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
										</svg>
									</div>
									<div>
										<p className="text-sm text-gray-600">Video</p>
										<p className="font-semibold text-gray-900">{learningPath.courses?.reduce((acc, c) => acc + countModulesByType(c.modules || []).video, 0)} video</p>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
										<svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 512 512">
											<path d="M96 0C43 0 0 43 0 96V416c0 53 43 96 96 96H384h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V384c17.7 0 32-14.3 32-32V32c0-17.7-14.3-32-32-32H384 96zm0 384H352v64H96c-17.7 0-32-14.3-32-32s14.3-32 32-32zm32-240c0-8.8 7.2-16 16-16H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16zm16 48H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
										</svg>
									</div>
									<div>
										<p className="text-sm text-gray-600">E-book</p>
										<p className="font-semibold text-gray-900">{learningPath.courses?.reduce((acc, c) => acc + countModulesByType(c.modules || []).ebook, 0)} materi</p>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
										<svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 384 512">
											<path d="M336 64h-53.88C268.9 26.8 233.7 0 192 0S115.1 26.8 101.9 64H48C21.5 64 0 85.48 0 112v352C0 490.5 21.5 512 48 512h288c26.5 0 48-21.48 48-48v-352C384 85.48 362.5 64 336 64zM96 392c-13.25 0-24-10.75-24-24S82.75 344 96 344s24 10.75 24 24S109.3 392 96 392zM96 296c-13.25 0-24-10.75-24-24S82.75 248 96 248S120 258.8 120 272S109.3 296 96 296zM192 64c17.67 0 32 14.33 32 32c0 17.67-14.33 32-32 32S160 113.7 160 96C160 78.33 174.3 64 192 64zM304 384h-128C167.2 384 160 376.8 160 368C160 359.2 167.2 352 176 352h128c8.801 0 16 7.199 16 16C320 376.8 312.8 384 304 384zM304 288h-128C167.2 288 160 280.8 160 272C160 263.2 167.2 256 176 256h128C312.8 256 320 263.2 320 272C320 280.8 312.8 288 304 288z" />
										</svg>
									</div>
									<div>
										<p className="text-sm text-gray-600">Quiz</p>
										<p className="font-semibold text-gray-900">{learningPath.courses?.reduce((acc, c) => acc + countModulesByType(c.modules || []).quiz, 0)} quiz</p>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
										<svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
										</svg>
									</div>
									<div>
										<p className="text-sm text-gray-600">Sertifikat</p>
										<p className="font-semibold text-gray-900">Tersedia</p>
									</div>
								</div>
							</div>
						</div>

						{/* Daftar Materi */}
						<div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-200">
							<h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Daftar Materi</h2>

							{learningPath.courses && learningPath.courses.map((course, index) => {
								const moduleCounts = countModulesByType(course.modules || []);
								const isLast = index === (learningPath.courses?.length || 0) - 1;
								return (
									<div key={course.id} className={isLast ? '' : 'border-b border-gray-200'}>
										<button
											onClick={() => toggleSection(course.id)}
											className="w-full flex items-center justify-between py-4 text-left hover:bg-gray-50 transition-colors text-black"
										>
											<div className="flex items-center gap-3">
												<svg
													className={`w-5 h-5 transition-transform ${expandedSections[course.id] ? 'rotate-90' : ''}`}
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
												</svg>
												<span className="font-semibold text-gray-900">{course.title}</span>
											</div>
											<div className="flex items-center gap-4 text-sm text-gray-600">
												{moduleCounts.video > 0 && <span>{moduleCounts.video} Video</span>}
												{moduleCounts.ebook > 0 && <span>{moduleCounts.ebook} E-book</span>}
												{moduleCounts.quiz > 0 && <span>{moduleCounts.quiz} Quiz</span>}
											</div>
										</button>

										{expandedSections[course.id] && (
											<div className="pl-8 pb-4 space-y-2">
												{course.modules && course.modules
													.slice()
													.sort((a, b) => {
														// Urutkan berdasarkan tipe: video -> quiz -> ebook
														const typeOrder: { [key: string]: number } = {
															'video': 1,
															'quiz': 2,
															'ebook': 3
														};
														const typeA = getModuleType(a);
														const typeB = getModuleType(b);
														return (typeOrder[typeA] || 999) - (typeOrder[typeB] || 999);
													})
													.map((module) => (
														<div key={module.id} className="flex items-center justify-between py-2 hover:bg-gray-50 px-3 rounded">
															<div className="flex items-center gap-3">
																{getModuleIcon(getModuleType(module))}
																<span className="text-gray-700">{module.title}</span>
															</div>
															<span className="text-sm text-gray-500">
																{formatDuration(module.durasi_video_menit || module.estimasi_waktu_menit)}
															</span>
														</div>
													))}
											</div>
										)}
									</div>
								);
							})}

							{/* Separator Line */}
							<hr className="border-gray-200 my-6" />

							{/* Mentor Section */}
							<div className="pt-2">
								<h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Mentor</h2>
								<div className="flex items-center gap-4">
									<img
										src={learningPath.mentor_photo_profile || '/images/default-avatar.png'}
										alt={learningPath.mentor_name}
										className="w-14 h-14 rounded-full object-cover"
									/>
									<div>
										<h3 className="font-bold text-gray-900">{learningPath.mentor_name}</h3>
										<p className="text-gray-600 text-sm">{learningPath.mentor_title}</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="lg:col-span-1">
						<div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
							<img
								src={learningPath.thumbnail_url}
								alt={learningPath.title}
								className="w-full aspect-video object-cover rounded-lg mb-6"
							/>

							<div className="space-y-4 mb-6">
								<div className="flex flex-wrap items-baseline gap-2">
									{learningPath.discount_amount && learningPath.discount_amount > 0 ? (
										<>
											<span className="text-2xl font-bold text-gray-900">
												Rp{Number(learningPath.price - learningPath.discount_amount).toLocaleString('id-ID')}
											</span>
											<span className="text-base text-gray-500 line-through">
												Rp{Number(learningPath.price).toLocaleString('id-ID')}
											</span>
										</>
									) : (
										<span className="text-2xl font-bold text-gray-900">
											Rp{Number(learningPath.price).toLocaleString('id-ID')}
										</span>
									)}
								</div>

								{isEnrolled ? (
									<button
										onClick={() => router.push(`/course/${courseId}/learn`)}
										className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
									>
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
										Lanjutkan Belajar
									</button>
								) : (
									<button
										onClick={() => router.push(`/checkout/${courseId}`)}
										className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors"
									>
										Beli Sekarang
									</button>
								)}
							</div>

							<div className="space-y-3 text-sm text-gray-700">
								<div className="flex items-center gap-3">
									<svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
									</svg>
									<span>Akses selamanya</span>
								</div>
								<div className="flex items-center gap-3">
									<svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
									</svg>
									<span>{learningPath.courses?.reduce((acc, c) => acc + countModulesByType(c.modules || []).video, 0)} video pembelajaran</span>
								</div>
								<div className="flex items-center gap-3">
									<svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
									</svg>
									<span>{learningPath.courses?.reduce((acc, c) => acc + countModulesByType(c.modules || []).ebook, 0)} materi e-book</span>
								</div>
								<div className="flex items-center gap-3">
									<svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
									</svg>
									<span>Sertifikat kelulusan</span>
								</div>
								<div className="flex items-center gap-3">
									<svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
									</svg>
									<span>Akses komunitas</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<Footer />
		</div>
	);
}
