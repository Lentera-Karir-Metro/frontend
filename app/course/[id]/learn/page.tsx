"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardNavbar from '@/app/components/DashboardNavbar';
import Footer from '@/app/components/Footer';
import { DashboardSkeleton } from '@/app/components/ui/Skeleton';

type Module = {
	module_id: string;
	title: string;
	type: 'video' | 'ebook' | 'quiz';
	sequence_order: number;
	video_url?: string;
	ebook_url?: string;
	quiz_id?: string;
	duration: number;
	is_completed: boolean;
	is_locked: boolean;
}

type Course = {
	course_id: string;
	title: string;
	description?: string;
	sequence_order: number;
	is_locked: boolean;
	is_completed: boolean;
	modules: Module[];
}

type LearningPathData = {
	id: string;
	title: string;
	description?: string;
	thumbnail_url?: string;
	mentor?: {
		name: string;
		job_title: string;
		avatar_url: string;
	};
	courses: Course[];
}

export default function CourseLearnPage() {
	const params = useParams();
	const router = useRouter();
	const courseId = params?.id as string;

	const [activeTab, setActiveTab] = useState<'overview' | 'ebook' | 'sertifikat'>('overview');
	const [learningPathData, setLearningPathData] = useState<LearningPathData | null>(null);
	const [currentModule, setCurrentModule] = useState<Module | null>(null);
	const [videoSrc, setVideoSrc] = useState('');
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
	const [showQuiz, setShowQuiz] = useState(false);
	const [currentQuiz, setCurrentQuiz] = useState<any>(null);
	const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});
	const [showSubmitModal, setShowSubmitModal] = useState(false);
	const [showResultModal, setShowResultModal] = useState(false);
	const [quizScore, setQuizScore] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchLearningContent = async () => {
			try {
				setIsLoading(true);
				const token = localStorage.getItem('token');
				
				if (!token) {
					router.push('/sign-in');
					return;
				}

				const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
				const response = await fetch(`${baseUrl}/learn/learning-paths/${courseId}`, {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				});

				if (!response.ok) {
					if (response.status === 403) {
						// User belum beli kelas
						alert('Anda belum terdaftar di kelas ini. Silakan beli kelas terlebih dahulu.');
						router.push(`/course/${courseId}`);
						return;
					}
					throw new Error(`Failed to fetch: ${response.status}`);
				}

				const data = await response.json();
				setLearningPathData(data);

				// Auto-expand first course dan set first video module
				if (data.courses && data.courses.length > 0) {
					const firstCourse = data.courses[0];
					setExpandedSections({ [firstCourse.course_id]: true });

					// Find first video module (all modules unlocked)
					for (const course of data.courses) {
						const firstVideo = course.modules?.find((m: Module) => m.type === 'video');
						if (firstVideo) {
							setCurrentModule(firstVideo);
							setVideoSrc(firstVideo.video_url || '');
							break;
						}
					}
				}
			} catch (err: any) {
				console.error('Error fetching learning content:', err);
				setError(err.message || 'Failed to load learning content');
			} finally {
				setIsLoading(false);
			}
		};

		if (courseId) {
			fetchLearningContent();
		}
	}, [courseId, router]);

	const toggleSection = (sectionId: string) => {
		setExpandedSections(prev => ({
			...prev,
			[sectionId]: !prev[sectionId]
		}));
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

	const formatDuration = (minutes: number) => {
		const hrs = Math.floor(minutes / 60);
		const mins = minutes % 60;
		if (hrs > 0) {
			return `${hrs}:${mins.toString().padStart(2, '0')}`;
		}
		return `${mins}:00`;
	};

	const handleModuleClick = async (module: Module) => {
		// Lock check disabled - all modules accessible
		setCurrentModule(module);

		if (module.type === 'video' && module.video_url) {
			setShowQuiz(false);
			setVideoSrc(module.video_url);
		} else if (module.type === 'quiz') {
			setShowQuiz(true);
			setVideoSrc(''); // Clear video
			
			// Check if quiz_id exists
			if (!module.quiz_id) {
				console.error('[Quiz] Module does not have a quiz_id:', module);
				alert('Quiz belum tersedia untuk modul ini.');
				return;
			}
			
			// Load quiz data from backend
			try {
				const token = localStorage.getItem('token');
				const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
				
				const response = await fetch(`${baseUrl}/learn/quiz/${module.quiz_id}/start`, {
					method: 'POST',
					headers: {
						'Authorization': `Bearer ${token}`,
						'Content-Type': 'application/json'
					}
				});

				if (!response.ok) {
					const errorData = await response.json().catch(() => ({}));
					throw new Error(errorData.message || 'Failed to load quiz');
				}

				const data = await response.json();
				console.log('[Quiz] Loaded quiz data:', data);
				setCurrentQuiz(data.quiz);
				setQuizAnswers({}); // Reset answers
			} catch (err: any) {
				console.error('[Quiz] Error loading quiz:', err);
				alert(err.message || 'Gagal memuat quiz. Silakan coba lagi.');
				setShowQuiz(false);
			}
		}
	};

	if (isLoading) return <DashboardSkeleton />;

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<p className="text-red-500 mb-4">{error}</p>
					<button
						onClick={() => router.back()}
						className="text-purple-600 hover:text-purple-700 font-semibold"
					>
						Kembali
					</button>
				</div>
			</div>
		);
	}

	if (!learningPathData) return null;

	return (
		<div className="min-h-screen flex flex-col bg-gray-50">
			<DashboardNavbar />

			{/* Hero Section */}
			<div className="relative bg-gradient-to-br from-[#661FFF] via-[#8B5CF6] to-[#A78BFA] text-white py-6 md:py-8 overflow-hidden">
				{/* Animated Background Pattern */}
				<div className="absolute inset-0 opacity-10 pointer-events-none">
					<div className="absolute top-0 left-1/4 w-72 h-72 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
					<div className="absolute bottom-0 right-1/4 w-72 h-72 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
				</div>

				<div className="relative max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
					{/* Back Button */}
					<button
						onClick={() => router.back()}
						className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors group"
					>
						<svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
						</svg>
						<span className="text-sm font-medium">Kembali</span>
					</button>

					<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
						{/* Left Content */}
						<div className="flex-1 flex flex-col">
							<div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 mb-4 self-start">
								<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
								<span className="text-sm font-medium text-white">Sedang Belajar</span>
							</div>

							{currentModule && (
								<div className="space-y-2">
									<div className="flex items-center gap-2 text-white/90">
										<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
											<path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
										</svg>
										<span className="text-sm font-medium">Modul Saat Ini:</span>
									</div>
									<div className="bg-white/10 backdrop-blur-md rounded-xl px-3 py-2 border border-white/20 inline-block max-w-[520px]">
										<div className="flex items-start gap-3">
											<div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
												{currentModule.type === 'video' ? (
													<svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
														<path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
													</svg>
												) : currentModule.type === 'quiz' ? (
													<svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
														<path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
														<path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
													</svg>
												) : (
													<svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
														<path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
													</svg>
												)}
											</div>
											<div className="flex-1 min-w-0">
												<h3 className="font-semibold text-white text-base mb-1 truncate">
													{currentModule.title}
												</h3>
													<div className="flex items-center gap-3 text-white/80 text-sm">
													{currentModule.type !== 'quiz' && currentModule.duration > 0 && (
														<div className="flex items-center gap-1">
															<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
															</svg>
															<span>{formatDuration(currentModule.duration)} menit</span>
														</div>
													)}
													{currentModule.type === 'quiz' && (
														<div className="flex items-center gap-1">
															<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
															</svg>
															<span>Kuis Interaktif</span>
														</div>
													)}
													{currentModule.is_completed && (
														<div className="flex items-center gap-1 text-green-300">
															<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
																<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
															</svg>
															<span className="text-xs font-medium">Selesai</span>
														</div>
													)}
												</div>
											</div>
										</div>
									</div>
								</div>
							)}

							<h1 className="mt-4 text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">
								{learningPathData.title}
							</h1>
						</div>

						{/* Right Content - Progress Stats */}
						<div className="flex-shrink-0 flex flex-col sm:flex-row gap-4 md:mt-12">
							<div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 min-w-[140px] min-h-[96px] flex flex-col items-center justify-center px-4 py-3">
									<div className="flex items-center gap-2 mb-2">
										<svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
										<span className="text-sm text-white/80 font-medium">Progress</span>
									</div>
									<div className="text-center">
										<div className="text-3xl font-bold text-white">
											{Math.round((learningPathData.courses.flatMap(c => c.modules).filter(m => m.is_completed).length / learningPathData.courses.flatMap(c => c.modules).length) * 100)}%
										</div>
										<div className="text-sm text-white/60">selesai</div>
									</div>
								</div>

								<div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 min-w-[140px] min-h-[96px] flex flex-col items-center justify-center px-4 py-3">
									<div className="flex items-center gap-2 mb-2">
										<svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
										</svg>
										<span className="text-sm text-white/80 font-medium">Total Modul</span>
									</div>
									<div className="text-center">
										<div className="text-3xl font-bold text-white">
											{learningPathData.courses.flatMap(c => c.modules).length}
										</div>
										<div className="text-sm text-white/60">modul</div>
									</div>
								</div>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="flex-1 max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-6 md:py-8">
				<div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-12">
					{/* Left Content - Video Player/Quiz & Course Info */}
					<div className="space-y-6">
						{!showQuiz ? (
							<>
								{/* Video Player */}
								<div className="bg-black rounded-lg overflow-hidden shadow-lg">
									<div className="relative aspect-video bg-gray-900">
										{/* Video Element */}
										{videoSrc ? (
											<video 
												key={videoSrc}
												className="w-full h-full"
												controls
												src={videoSrc}
												onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
												onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
												onPlay={() => setIsPlaying(true)}
												onPause={() => setIsPlaying(false)}
											>
												Your browser does not support the video tag.
											</video>
										) : (
											<div className="w-full h-full flex items-center justify-center text-white">
												<div className="text-center">
													<svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
													</svg>
													<p className="text-gray-400">Pilih video dari daftar modul</p>
												</div>
											</div>
										)}
									</div>
								</div>

						{/* Tabs */}
						<div className="bg-gray-50 rounded-xl shadow-md border-2 border-gray-200 overflow-hidden p-4 h-[550px] flex flex-col">
							<div className="flex justify-center gap-4 mb-4 flex-shrink-0">
								<button
									onClick={() => setActiveTab('overview')}
									className={`px-16 py-2 font-semibold rounded-full transition-colors border ${
										activeTab === 'overview'
											? 'bg-[#661FFF] text-white border-[#661FFF]'
											: 'bg-transparent text-gray-600 hover:bg-gray-100 border-gray-300'
									}`}
								>
									Overview
								</button>
								<button
									onClick={() => setActiveTab('ebook')}
									className={`px-16 py-2 font-semibold rounded-full transition-colors border ${
										activeTab === 'ebook'
											? 'bg-[#661FFF] text-white border-[#661FFF]'
											: 'bg-transparent text-gray-600 hover:bg-gray-100 border-gray-300'
									}`}
								>
									Ebook
								</button>
								<button
									onClick={() => setActiveTab('sertifikat')}
									className={`px-16 py-2 font-semibold rounded-full transition-colors border ${
										activeTab === 'sertifikat'
											? 'bg-[#661FFF] text-white border-[#661FFF]'
											: 'bg-transparent text-gray-600 hover:bg-gray-100 border-gray-300'
									}`}
								>
									Sertifikat
								</button>
							</div>

							{/* Tab Content */}
							<div className="text-gray-700 flex-1 overflow-y-auto">
								{activeTab === 'overview' && (
									<div className="space-y-4 text-gray-700 text-justify px-6 py-4">
										<p className="leading-relaxed">
											{learningPathData.description || 'No description available'}
										</p>
										
										{learningPathData.mentor && (
											<div className="mt-8 pt-6 border-t border-gray-200">
												<h3 className="font-bold text-gray-900 mb-4 text-lg">Mentor</h3>
												<div className="flex items-center gap-4">
													{learningPathData.mentor.avatar_url && (
														<img 
															src={learningPathData.mentor.avatar_url} 
															alt={learningPathData.mentor.name}
															className="w-16 h-16 rounded-full object-cover"
														/>
													)}
													<div>
														<p className="font-semibold text-gray-900">{learningPathData.mentor.name}</p>
														<p className="text-sm text-gray-600">{learningPathData.mentor.job_title}</p>
													</div>
												</div>
											</div>
										)}
									</div>
								)}

								{activeTab === 'ebook' && (
									<div className="space-y-4 px-6 py-4">
										{(() => {
											const ebookModules = learningPathData.courses.flatMap(course => 
												course.modules.filter(m => m.type === 'ebook')
											);
											
											return ebookModules.length > 0 ? (
												ebookModules.map((ebook) => (
													<div key={ebook.module_id} className="bg-purple-100 rounded-2xl p-4 flex items-center justify-between hover:bg-purple-150 transition-colors">
														<div className="flex items-center gap-3">
															<div className="w-8 h-8 flex items-center justify-center">
																<svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
																	<path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
																</svg>
															</div>
															<div>
																<h4 className="font-bold text-gray-900 text-base">{ebook.title}</h4>
															</div>
														</div>
														<a 
															href={ebook.ebook_url} 
															target="_blank"
															rel="noopener noreferrer"
															onClick={async () => {
																// Mark ebook as downloaded when user clicks download
																try {
																	const token = localStorage.getItem('token');
																	const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
																	await fetch(`${baseUrl}/learn/modules/${ebook.module_id}/complete`, {
																		method: 'POST',
																		headers: {
																			'Authorization': `Bearer ${token}`,
																			'Content-Type': 'application/json'
																		}
																	});
																} catch (err) {
																	console.error('Error marking ebook as downloaded:', err);
																}
															}}
															className="bg-[#661FFF] hover:bg-[#5518dd] text-white rounded-full p-2.5 transition-colors shadow-lg hover:shadow-xl"
														>
															<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
																<path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
															</svg>
														</a>
													</div>
												))
											) : (
												<div className="text-center py-12 text-gray-600">
													<svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="currentColor" viewBox="0 0 20 20">
														<path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
													</svg>
													<p>Tidak ada ebook tersedia untuk pembelajaran ini</p>
												</div>
											);
										})()}
									</div>
								)}

								{activeTab === 'sertifikat' && (
									<div className="text-gray-700 text-center py-12 px-6">
										<svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
										</svg>
										<p className="text-lg font-semibold text-gray-900 mb-2">Sertifikat Belum Tersedia</p>
										<p className="text-gray-600">Selesaikan semua materi untuk mendapatkan sertifikat</p>
									</div>
								)}
							</div>
						</div>
							</>
						) : (
							/* Quiz Content */
							<div className="bg-white rounded-xl shadow-lg p-8">
								<h2 className="text-3xl font-bold text-gray-900 mb-8">Final Quiz</h2>
								
								<div className="space-y-8">
									{/* Question 1 */}
									<div className="space-y-4">
										<div className="flex gap-2">
											<span className="text-gray-900 font-medium">1.</span>
											<p className="text-gray-900 font-medium flex-1">
												Prinsip utama Digital Mindset yang menekankan percepatan dan pengoptimalan bisnis melalui data dalam lingkungan kerja yang selalu cepat adalah:
											</p>
										</div>
										<div className="space-y-3 ml-6">
											<div 
												onClick={() => setQuizAnswers({...quizAnswers, 1: 0})}
												className={`rounded-xl px-4 py-3 transition-colors cursor-pointer ${
													quizAnswers[1] === 0 ? 'bg-purple-100 hover:bg-purple-150' : 'bg-gray-100 hover:bg-gray-200'
												}`}
											>
												<span className="text-gray-900">Fixed Budget</span>
											</div>
											<div 
												onClick={() => setQuizAnswers({...quizAnswers, 1: 1})}
												className={`rounded-xl px-4 py-3 transition-colors cursor-pointer ${
													quizAnswers[1] === 1 ? 'bg-purple-100 hover:bg-purple-150' : 'bg-gray-100 hover:bg-gray-200'
												}`}
											>
												<span className="text-gray-900">Top-Down Hierarchy</span>
											</div>
											<div 
												onClick={() => setQuizAnswers({...quizAnswers, 1: 2})}
												className={`rounded-xl px-4 py-3 transition-colors cursor-pointer ${
													quizAnswers[1] === 2 ? 'bg-purple-100 hover:bg-purple-150' : 'bg-gray-100 hover:bg-gray-200'
												}`}
											>
												<span className="text-gray-900">Agility (Ketangkasan)</span>
											</div>
											<div 
												onClick={() => setQuizAnswers({...quizAnswers, 1: 3})}
												className={`rounded-xl px-4 py-3 transition-colors cursor-pointer ${
													quizAnswers[1] === 3 ? 'bg-purple-100 hover:bg-purple-150' : 'bg-gray-100 hover:bg-gray-200'
												}`}
											>
												<span className="text-gray-900">Waterfall Method</span>
											</div>
										</div>
									</div>

									{/* Question 2 */}
									<div className="space-y-4">
										<div className="flex gap-2">
											<span className="text-gray-900 font-medium">2.</span>
											<p className="text-gray-900 font-medium flex-1">
												Aktivitas yang termasuk dalam kategori 'Off-Page SEO' adalah:
											</p>
										</div>
										<div className="space-y-3 ml-6">
											<div 
												onClick={() => setQuizAnswers({...quizAnswers, 2: 0})}
												className={`rounded-xl px-4 py-3 transition-colors cursor-pointer ${
													quizAnswers[2] === 0 ? 'bg-purple-100 hover:bg-purple-150' : 'bg-gray-100 hover:bg-gray-200'
												}`}
											>
												<span className="text-gray-900">Pembuatan backlink berkualitas dari situs otoratif</span>
											</div>
											<div 
												onClick={() => setQuizAnswers({...quizAnswers, 2: 1})}
												className={`rounded-xl px-4 py-3 transition-colors cursor-pointer ${
													quizAnswers[2] === 1 ? 'bg-purple-100 hover:bg-purple-150' : 'bg-gray-100 hover:bg-gray-200'
												}`}
											>
												<span className="text-gray-900">Optimasi kecepatan website</span>
											</div>
											<div 
												onClick={() => setQuizAnswers({...quizAnswers, 2: 2})}
												className={`rounded-xl px-4 py-3 transition-colors cursor-pointer ${
													quizAnswers[2] === 2 ? 'bg-purple-100 hover:bg-purple-150' : 'bg-gray-100 hover:bg-gray-200'
												}`}
											>
												<span className="text-gray-900">Perbaikan struktur URL</span>
											</div>
											<div 
												onClick={() => setQuizAnswers({...quizAnswers, 2: 3})}
												className={`rounded-xl px-4 py-3 transition-colors cursor-pointer ${
													quizAnswers[2] === 3 ? 'bg-purple-100 hover:bg-purple-150' : 'bg-gray-100 hover:bg-gray-200'
												}`}
											>
												<span className="text-gray-900">Penggunaan tag H1 yang relevan</span>
											</div>
										</div>
									</div>

									{/* Question 3 */}
									<div className="space-y-4">
										<div className="flex gap-2">
											<span className="text-gray-900 font-medium">3.</span>
											<p className="text-gray-900 font-medium flex-1">
												Call-to-Action (CTA) yang efektif sebaiknya menggunakan bahasa yang dapat membuat audiens tidak merasa terbebani:
											</p>
										</div>
										<div className="space-y-3 ml-6">
											<div 
												onClick={() => setQuizAnswers({...quizAnswers, 3: 0})}
												className={`rounded-xl px-4 py-3 transition-colors cursor-pointer ${
													quizAnswers[3] === 0 ? 'bg-purple-100 hover:bg-purple-150' : 'bg-gray-100 hover:bg-gray-200'
												}`}
											>
												<span className="text-gray-900">TRUE</span>
											</div>
											<div 
												onClick={() => setQuizAnswers({...quizAnswers, 3: 1})}
												className={`rounded-xl px-4 py-3 transition-colors cursor-pointer ${
													quizAnswers[3] === 1 ? 'bg-purple-100 hover:bg-purple-150' : 'bg-gray-100 hover:bg-gray-200'
												}`}
											>
												<span className="text-gray-900">FALSE</span>
											</div>
										</div>
									</div>

									{/* Question 4 */}
									<div className="space-y-4">
										<div className="flex gap-2">
											<span className="text-gray-900 font-medium">4.</span>
											<p className="text-gray-900 font-medium flex-1">
												Organic Traffic adalah pengunjung yang datang ke website melalui tautan iklan berbayar (PPC) di mesin pencari:
											</p>
										</div>
										<div className="space-y-3 ml-6">
											<div 
												onClick={() => setQuizAnswers({...quizAnswers, 4: 0})}
												className={`rounded-xl px-4 py-3 transition-colors cursor-pointer ${
													quizAnswers[4] === 0 ? 'bg-purple-100 hover:bg-purple-150' : 'bg-gray-100 hover:bg-gray-200'
												}`}
											>
												<span className="text-gray-900">TRUE</span>
											</div>
											<div 
												onClick={() => setQuizAnswers({...quizAnswers, 4: 1})}
												className={`rounded-xl px-4 py-3 transition-colors cursor-pointer ${
													quizAnswers[4] === 1 ? 'bg-purple-100 hover:bg-purple-150' : 'bg-gray-100 hover:bg-gray-200'
												}`}
											>
												<span className="text-gray-900">FALSE</span>
											</div>
										</div>
									</div>

									{/* Question 5 */}
									<div className="space-y-4">
										<div className="flex gap-2">
											<span className="text-gray-900 font-medium">5.</span>
											<p className="text-gray-900 font-medium flex-1">
												Mengapa Content pillar (H-1 dan konten) penting dalam strategi media sosial?
											</p>
										</div>
										<div className="space-y-3 ml-6">
											<div 
												onClick={() => setQuizAnswers({...quizAnswers, 5: 0})}
												className={`rounded-xl px-4 py-3 transition-colors cursor-pointer ${
													quizAnswers[5] === 0 ? 'bg-purple-100 hover:bg-purple-150' : 'bg-gray-100 hover:bg-gray-200'
												}`}
											>
												<span className="text-gray-900">Untuk memastikan setiap postingan ditulankan</span>
											</div>
											<div 
												onClick={() => setQuizAnswers({...quizAnswers, 5: 1})}
												className={`rounded-xl px-4 py-3 transition-colors cursor-pointer ${
													quizAnswers[5] === 1 ? 'bg-purple-100 hover:bg-purple-150' : 'bg-gray-100 hover:bg-gray-200'
												}`}
											>
												<span className="text-gray-900">Untuk membangun user posting tersebut</span>
											</div>
											<div 
												onClick={() => setQuizAnswers({...quizAnswers, 5: 2})}
												className={`rounded-xl px-4 py-3 transition-colors cursor-pointer ${
													quizAnswers[5] === 2 ? 'bg-purple-100 hover:bg-purple-150' : 'bg-gray-100 hover:bg-gray-200'
												}`}
											>
												<span className="text-gray-900">Untuk memberdakan jumlah platform yang digunakan</span>
											</div>
											<div 
												onClick={() => setQuizAnswers({...quizAnswers, 5: 3})}
												className={`rounded-xl px-4 py-3 transition-colors cursor-pointer ${
													quizAnswers[5] === 3 ? 'bg-purple-100 hover:bg-purple-150' : 'bg-gray-100 hover:bg-gray-200'
												}`}
											>
												<span className="text-gray-900">Untuk menjaga konsistensi tema dan relevansi konten</span>
											</div>
										</div>
									</div>
								</div>

								{/* Submit Button */}
								<div className="mt-10 flex justify-center">
									<button 
										onClick={() => setShowSubmitModal(true)}
										className="bg-[#661FFF] hover:bg-[#5518dd] text-white px-16 py-3 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
									>
										Submit
									</button>
								</div>
							</div>
						)}
					</div>

					{/* Right Sidebar - Course Playlist */}
					<div className="lg:col-span-1">
						<div className="bg-gray-50 rounded-xl shadow-md border-2 border-gray-200 overflow-hidden p-4 space-y-3">
							{learningPathData?.courses.map((course) => (
								<div key={course.course_id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
									<button
										onClick={() => toggleSection(course.course_id)}
										className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
									>
										<div className="flex items-center gap-2">
											<svg 
												className={`w-3.5 h-3.5 transition-transform flex-shrink-0 ${expandedSections[course.course_id] ? 'rotate-90' : ''}`}
												fill="none" 
												stroke="currentColor" 
												viewBox="0 0 24 24"
											>
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
											</svg>
											<span className="font-medium text-gray-900 text-sm">{course.title}</span>
										</div>
									</button>
									
									{expandedSections[course.course_id] && course.modules.length > 0 && (
										<div className="border-t border-gray-200">
										{course.modules.map((module) => (
											<button
												key={module.module_id}
												onClick={() => handleModuleClick(module)}
												className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-gray-50 transition-colors"
											>
												<div className="flex items-center gap-3 flex-1 min-w-0">
													{/* Module Icon */}
													{module.type === 'quiz' && (
														<div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
															<svg className="w-3.5 h-3.5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
																<path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
																<path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
															</svg>
														</div>
													)}
													{module.type !== 'quiz' && module.is_completed && (
														<div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
															<svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
																<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
															</svg>
														</div>
													)}
													{module.type !== 'quiz' && !module.is_completed && module.type === 'video' && (
														<div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
															<svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
																<path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
															</svg>
														</div>
													)}
													{module.type !== 'quiz' && !module.is_completed && module.type === 'ebook' && (
														<div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
															<svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
																<path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
															</svg>
														</div>
													)}
													{/* Module Title */}
													<div className="flex flex-col flex-1 min-w-0">
														<span className={`text-sm font-normal truncate ${
															currentModule?.module_id === module.module_id ? 'text-[#661FFF]' : 'text-gray-900'
														}`}>{module.title}</span>
														<span className="text-xs text-gray-500">
															{module.type === 'quiz' ? 'Kuis' : (module.duration > 0 ? formatDuration(module.duration) : '-')}
														</span>
													</div>
												</div>
												</button>
											))}
										</div>
									)}
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			<Footer />

			{/* Submit Modal */}
			{showSubmitModal && (
				<div className="fixed inset-0 backdrop-blur-sm bg-gray-900/60 flex items-center justify-center z-50">
					<div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative">
						{/* Icon */}
						<div className="flex justify-center mb-6">
							<div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
								<svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
						</div>

						{/* Text */}
						<h3 className="text-2xl font-bold text-gray-900 text-center mb-3">Selesaikan?</h3>
						<p className="text-gray-600 text-center mb-8">
							Anda belum yakin untuk menyelesaikan quiz ini?
						</p>

						{/* Buttons */}
						<div className="flex gap-4">
							<button
								onClick={() => setShowSubmitModal(false)}
								className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-full font-semibold transition-colors"
							>
								Batal
							</button>
							<button
								onClick={() => {
									// Calculate score (example: correct answers are 0, 0, 0, 1, 3)
									const correctAnswers: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 1, 5: 3 };
									let score = 0;
									Object.keys(correctAnswers).forEach((key) => {
										if (quizAnswers[parseInt(key)] === correctAnswers[parseInt(key)]) {
											score += 20; // 5 questions, each worth 20 points
										}
									});
									setQuizScore(score);
									setShowSubmitModal(false);
									setShowResultModal(true);
								}}
								className="flex-1 bg-[#661FFF] hover:bg-[#5518dd] text-white py-3 rounded-full font-semibold transition-colors"
							>
								Submit
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Result Modal */}
			{showResultModal && (
				<div className="fixed inset-0 backdrop-blur-sm bg-gray-900/60 flex items-center justify-center z-50">
					<div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
						{/* Success Icon */}
						<div className="flex justify-center mb-6">
							<div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
								<svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
								</svg>
							</div>
						</div>

						{/* Title */}
						<h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Selamat! Kamu Lulus</h3>
						<p className="text-center text-gray-600 mb-6">
							Score kamu <span className="text-green-500 font-semibold">{quizScore}</span> dari KKM 60
						</p>

						{/* Questions Review */}
						<div className="space-y-4">
							{/* Question 1 */}
							<div className="text-sm">
								<p className="text-gray-700 mb-2">
									<span className="font-medium">1. Prinsip utama Digital Mindset yang menekankan percepatan dan pengoptimalan bisnis melalui data dalam lingkungan kerja yang selalu cepat adalah:</span>
								</p>
								<div className="space-y-2 ml-4">
									<div className={`px-4 py-2 rounded-lg ${quizAnswers[1] === 0 ? 'bg-purple-100 border border-purple-300' : 'bg-gray-50'}`}>
										<span className="text-gray-700">Fixed Budget</span>
										{quizAnswers[1] === 0 && <span className="ml-2 text-green-500">✓</span>}
									</div>
									<div className={`px-4 py-2 rounded-lg ${quizAnswers[1] === 1 ? 'bg-red-50 border border-red-300' : 'bg-gray-50'}`}>
										<span className="text-gray-700">Top-Down Hierarchy</span>
										{quizAnswers[1] === 1 && <span className="ml-2 text-red-500">✗</span>}
									</div>
									<div className={`px-4 py-2 rounded-lg ${quizAnswers[1] === 2 ? 'bg-red-50 border border-red-300' : 'bg-gray-50'}`}>
										<span className="text-gray-700">Agility (Ketangkasan)</span>
										{quizAnswers[1] === 2 && <span className="ml-2 text-red-500">✗</span>}
									</div>
									<div className={`px-4 py-2 rounded-lg ${quizAnswers[1] === 3 ? 'bg-red-50 border border-red-300' : 'bg-gray-50'}`}>
										<span className="text-gray-700">Waterfall Method</span>
										{quizAnswers[1] === 3 && <span className="ml-2 text-red-500">✗</span>}
									</div>
								</div>
							</div>

							{/* Question 2 */}
							<div className="text-sm">
								<p className="text-gray-700 mb-2">
									<span className="font-medium">2. Aktivitas yang termasuk dalam kategori 'Off-Page SEO' adalah:</span>
								</p>
								<div className="space-y-2 ml-4">
									<div className={`px-4 py-2 rounded-lg ${quizAnswers[2] === 0 ? 'bg-purple-100 border border-purple-300' : 'bg-gray-50'}`}>
										<span className="text-gray-700">Pembuatan backlink berkualitas dari situs otoratif</span>
										{quizAnswers[2] === 0 && <span className="ml-2 text-green-500">✓</span>}
									</div>
									<div className={`px-4 py-2 rounded-lg ${quizAnswers[2] === 1 ? 'bg-red-50 border border-red-300' : 'bg-gray-50'}`}>
										<span className="text-gray-700">Optimasi kecepatan website</span>
										{quizAnswers[2] === 1 && <span className="ml-2 text-red-500">✗</span>}
									</div>
									<div className={`px-4 py-2 rounded-lg ${quizAnswers[2] === 2 ? 'bg-red-50 border border-red-300' : 'bg-gray-50'}`}>
										<span className="text-gray-700">Perbaikan struktur URL</span>
										{quizAnswers[2] === 2 && <span className="ml-2 text-red-500">✗</span>}
									</div>
									<div className={`px-4 py-2 rounded-lg ${quizAnswers[2] === 3 ? 'bg-red-50 border border-red-300' : 'bg-gray-50'}`}>
										<span className="text-gray-700">Penggunaan tag H1 yang relevan</span>
										{quizAnswers[2] === 3 && <span className="ml-2 text-red-500">✗</span>}
									</div>
								</div>
							</div>

							{/* Question 3 */}
							<div className="text-sm">
								<p className="text-gray-700 mb-2">
									<span className="font-medium">3. Call-to-Action (CTA) yang efektif sebaiknya menggunakan bahasa yang dapat membuat audiens tidak merasa terbebani:</span>
								</p>
								<div className="space-y-2 ml-4">
									<div className={`px-4 py-2 rounded-lg ${quizAnswers[3] === 0 ? 'bg-purple-100 border border-purple-300' : 'bg-gray-50'}`}>
										<span className="text-gray-700">TRUE</span>
										{quizAnswers[3] === 0 && <span className="ml-2 text-green-500">✓</span>}
									</div>
									<div className={`px-4 py-2 rounded-lg ${quizAnswers[3] === 1 ? 'bg-red-50 border border-red-300' : 'bg-gray-50'}`}>
										<span className="text-gray-700">FALSE</span>
										{quizAnswers[3] === 1 && <span className="ml-2 text-red-500">✗</span>}
									</div>
								</div>
							</div>

							{/* Question 4 */}
							<div className="text-sm">
								<p className="text-gray-700 mb-2">
									<span className="font-medium">4. Organic Traffic adalah pengunjung yang datang ke website melalui tautan iklan berbayar (PPC) di mesin pencari:</span>
								</p>
								<div className="space-y-2 ml-4">
									<div className={`px-4 py-2 rounded-lg ${quizAnswers[4] === 0 ? 'bg-red-50 border border-red-300' : 'bg-gray-50'}`}>
										<span className="text-gray-700">TRUE</span>
										{quizAnswers[4] === 0 && <span className="ml-2 text-red-500">✗</span>}
									</div>
									<div className={`px-4 py-2 rounded-lg ${quizAnswers[4] === 1 ? 'bg-purple-100 border border-purple-300' : 'bg-gray-50'}`}>
										<span className="text-gray-700">FALSE</span>
										{quizAnswers[4] === 1 && <span className="ml-2 text-green-500">✓</span>}
									</div>
								</div>
							</div>

							{/* Question 5 */}
							<div className="text-sm">
								<p className="text-gray-700 mb-2">
									<span className="font-medium">5. Mengapa Content pillar (H-1 dan konten) penting dalam strategi media sosial?</span>
								</p>
								<div className="space-y-2 ml-4">
									<div className={`px-4 py-2 rounded-lg ${quizAnswers[5] === 0 ? 'bg-red-50 border border-red-300' : 'bg-gray-50'}`}>
										<span className="text-gray-700">Untuk memastikan setiap postingan ditulankan</span>
										{quizAnswers[5] === 0 && <span className="ml-2 text-red-500">✗</span>}
									</div>
									<div className={`px-4 py-2 rounded-lg ${quizAnswers[5] === 1 ? 'bg-red-50 border border-red-300' : 'bg-gray-50'}`}>
										<span className="text-gray-700">Untuk membangun user posting tersebut</span>
										{quizAnswers[5] === 1 && <span className="ml-2 text-red-500">✗</span>}
									</div>
									<div className={`px-4 py-2 rounded-lg ${quizAnswers[5] === 2 ? 'bg-red-50 border border-red-300' : 'bg-gray-50'}`}>
										<span className="text-gray-700">Untuk memberdakan jumlah platform yang digunakan</span>
										{quizAnswers[5] === 2 && <span className="ml-2 text-red-500">✗</span>}
									</div>
									<div className={`px-4 py-2 rounded-lg ${quizAnswers[5] === 3 ? 'bg-purple-100 border border-purple-300' : 'bg-gray-50'}`}>
										<span className="text-gray-700">Untuk menjaga konsistensi tema dan relevansi konten</span>
										{quizAnswers[5] === 3 && <span className="ml-2 text-green-500">✓</span>}
									</div>
								</div>
							</div>
						</div>

						{/* Close Button */}
						<div className="mt-8 flex justify-center">
							<button
								onClick={() => {
									setShowResultModal(false);
									setShowQuiz(false);
									setQuizAnswers({});
								}}
								className="bg-[#661FFF] hover:bg-[#5518dd] text-white px-12 py-3 rounded-full font-semibold transition-colors"
							>
								Tutup
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
