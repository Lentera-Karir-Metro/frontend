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
	const [currentAttemptId, setCurrentAttemptId] = useState<string | null>(null);
	const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});
	const [showSubmitModal, setShowSubmitModal] = useState(false);
	const [showResultModal, setShowResultModal] = useState(false);
	const [quizResult, setQuizResult] = useState<any>(null);
	const [quizBestScore, setQuizBestScore] = useState<number | null>(null);
	const [quizHasPassed, setQuizHasPassed] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showEbookDownloadModal, setShowEbookDownloadModal] = useState(false);
	const [downloadedEbookTitle, setDownloadedEbookTitle] = useState('');
	const [courseCertificate, setCourseCertificate] = useState<any>(null);
	const [certificateLoading, setCertificateLoading] = useState(false);

	// Fetch course certificate
	const fetchCourseCertificate = async () => {
		try {
			setCertificateLoading(true);
			const token = localStorage.getItem('token');
			const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

			const response = await fetch(`${baseUrl}/certificates`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});

			if (response.ok) {
				const data = await response.json();
				// Find certificate for this course
				const cert = data.data?.find((c: any) => c.course_id === courseId);
				setCourseCertificate(cert || null);
			}
		} catch (err) {
			console.error('Error fetching certificate:', err);
		} finally {
			setCertificateLoading(false);
		}
	};

	// Helper function to mark module as complete
	const markModuleComplete = async (moduleId: string, moduleName: string = 'module') => {
		try {
			console.log(`[${moduleName}] Marking module as complete:`, moduleId);
			const token = localStorage.getItem('token');
			const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
			
			const url = `${baseUrl}/learn/modules/${moduleId}/complete`;
			console.log(`[${moduleName}] Calling API:`, url);
			
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			});
			
			const result = await response.json();
			console.log(`[${moduleName}] API response:`, response.status, result);
			
			if (!response.ok) {
				throw new Error(result.message || 'Failed to mark module as complete');
			}
			
			// Refresh learning content to update module status
			console.log(`[${moduleName}] Refreshing content...`);
			await fetchLearningContent();
			console.log(`[${moduleName}] Content refreshed successfully`);
			
			return true;
		} catch (err) {
			console.error(`[${moduleName}] Error marking as complete:`, err);
			return false;
		}
	};

	const fetchLearningContent = async () => {
		try {
			setIsLoading(true);
			const token = localStorage.getItem('token');

			if (!token) {
				router.push('/sign-in');
				return;
			}

			const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
			const response = await fetch(`${baseUrl}/learn/courses/${courseId}`, {
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

			// Auto-expand first course dan set first unlocked video module
			if (data.courses && data.courses.length > 0) {
				const firstCourse = data.courses[0];
				setExpandedSections({ [firstCourse.course_id]: true });

				// Find first unlocked video module
				for (const course of data.courses) {
					const firstUnlockedVideo = course.modules?.find((m: Module) => m.type === 'video' && !m.is_locked);
					if (firstUnlockedVideo) {
						setCurrentModule(firstUnlockedVideo);
						setVideoSrc(firstUnlockedVideo.video_url || '');
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

	useEffect(() => {
		if (courseId) {
			fetchLearningContent();
			fetchCourseCertificate();
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

	const savePartialAnswer = async (questionId: string, optionId: number) => {
		try {
			const token = localStorage.getItem('token');
			const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

			await fetch(`${baseUrl}/learn/attempts/${currentAttemptId}/answer`, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					question_id: questionId,
					selected_option_id: optionId
				})
			});
		} catch (err) {
			console.error('[Quiz] Error saving partial answer:', err);
			// Don't show error to user, it's background save
		}
	};

	const handleModuleClick = async (module: Module) => {
		// Check if module is locked
		if (module.is_locked) {
			alert('Modul ini terkunci. Selesaikan modul sebelumnya terlebih dahulu.');
			return;
		}

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
				setCurrentAttemptId(data.attempt_id);
				setQuizAnswers(data.partial_answers || {}); // Load saved answers if resuming
				setQuizBestScore(data.best_score);
				setQuizHasPassed(data.has_passed || false);
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
												onEnded={async () => {
													// Mark module as completed when video ends
													if (currentModule && currentModule.type === 'video' && !currentModule.is_completed) {
														const success = await markModuleComplete(currentModule.module_id, 'Video');
														if (!success) {
															alert('Gagal menandai video sebagai selesai. Silakan coba lagi atau hubungi support.');
														}
													} else {
														console.log('[Video] Video ended but not marking as complete:', {
															hasCurrentModule: !!currentModule,
															type: currentModule?.type,
															isCompleted: currentModule?.is_completed
														});
													}
												}}
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
											className={`px-16 py-2 font-semibold rounded-full transition-colors border ${activeTab === 'overview'
												? 'bg-[#661FFF] text-white border-[#661FFF]'
												: 'bg-transparent text-gray-600 hover:bg-gray-100 border-gray-300'
												}`}
										>
											Overview
										</button>
										<button
											onClick={() => setActiveTab('ebook')}
											className={`px-16 py-2 font-semibold rounded-full transition-colors border ${activeTab === 'ebook'
												? 'bg-[#661FFF] text-white border-[#661FFF]'
												: 'bg-transparent text-gray-600 hover:bg-gray-100 border-gray-300'
												}`}
										>
											Ebook
										</button>
										<button
											onClick={() => setActiveTab('sertifikat')}
											className={`px-16 py-2 font-semibold rounded-full transition-colors border ${activeTab === 'sertifikat'
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
																<button
																	onClick={async (e) => {
																		e.preventDefault();
																		try {
																			const token = localStorage.getItem('token');
																			const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
																			
																			console.log('[Ebook Download] Starting download process...');
																			console.log('[Ebook Download] Module ID:', ebook.module_id);
																			console.log('[Ebook Download] Module Title:', ebook.title);
																			
																			// Mark ebook module as complete in database
																			const url = `${baseUrl}/learn/modules/${ebook.module_id}/complete`;
																			console.log('[Ebook Download] Calling API:', url);
																			
																			const response = await fetch(url, {
																				method: 'POST',
																				headers: {
																					'Authorization': `Bearer ${token}`,
																					'Content-Type': 'application/json'
																				}
																			});
																			
																			const result = await response.json();
																			console.log('[Ebook Download] API Response Status:', response.status);
																			console.log('[Ebook Download] API Response Body:', result);
																			
																			if (!response.ok) {
																				throw new Error(result.message || 'Gagal menyimpan ebook');
																			}
																			
																			console.log('[Ebook Download] Success! Ebook saved to library');
																			
																			// Show success modal
																			setDownloadedEbookTitle(ebook.title);
																			setShowEbookDownloadModal(true);
																			
																			// Refresh learning content to update module status
																			await fetchLearningContent();
																		} catch (err: any) {
																			console.error('[Ebook Download] Error:', err);
																			alert(err.message || 'Gagal menyimpan ebook. Silakan coba lagi.');
																		}
																	}}
																	className="bg-[#661FFF] hover:bg-[#5518dd] text-white rounded-full p-2.5 transition-colors shadow-lg hover:shadow-xl"
																	title="Download ebook"
																>
																	<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
																		<path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
																	</svg>
																</button>
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

										{activeTab === 'sertifikat' && (() => {
											// Calculate total modules and completed modules across all courses
											const allModules = learningPathData?.courses.flatMap(course => course.modules) || [];
											const totalModules = allModules.length;
											const completedModules = allModules.filter(m => m.is_completed).length;
											const completionPercentage = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
											const isFullyCompleted = completionPercentage === 100;

											return (
												<div className="py-8 px-6">
													{courseCertificate ? (
														// Sertifikat sudah tersedia - bisa diklaim
														<div className="max-w-2xl mx-auto">
															<div 
																className="bg-green-100 border border-green-300 rounded-xl p-6 flex items-start gap-4 cursor-pointer hover:bg-green-200 transition-colors"
																onClick={() => {
																	if (courseCertificate.certificate_url) {
																		// Download certificate
																		const link = document.createElement('a');
																		link.href = courseCertificate.certificate_url;
																		link.download = `sertifikat-${courseCertificate.Course?.title || 'course'}.pdf`;
																		link.target = '_blank';
																		document.body.appendChild(link);
																		link.click();
																		document.body.removeChild(link);
																	}
																}}
															>
																<div className="flex-shrink-0">
																	<svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
																	</svg>
																</div>
																<div className="flex-1">
																	<h3 className="text-lg font-bold text-green-800 mb-2">Klaim sertifikatmu sekarang!</h3>
																	<p className="text-green-700 text-sm">Unduh sertifikat sebagai hasil belajarmu</p>
																</div>
															</div>
														</div>
													) : isFullyCompleted ? (
														// Sertifikat sedang diproses - menunggu admin generate
														<div className="max-w-2xl mx-auto">
															<div className="bg-gray-100 border border-gray-300 rounded-xl p-6 flex items-start gap-4">
																<div className="flex-shrink-0">
																	<svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
																	</svg>
																</div>
																<div className="flex-1">
																	<h3 className="text-lg font-bold text-gray-900 mb-2">Sertifikatmu sedang di proses</h3>
																	<p className="text-gray-600 text-sm">Tunggu dalam beberapa saat untuk klaim sertifikat</p>
																</div>
															</div>
														</div>
													) : (
														// Sertifikat belum tersedia - tampilkan progress
														<div className="max-w-2xl mx-auto">
															{/* Alert Box */}
															<div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
																<div className="flex items-start gap-4">
																	<div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
																		<svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
																		</svg>
																	</div>
																	<div className="flex-1">
																		<h3 className="text-lg font-bold text-red-800 mb-2">Anda belum bisa mengklaim sertifikat</h3>
																		<p className="text-red-700 text-sm">Selesaikan seluruh tahap kelas lebih dulu!</p>
																	</div>
																</div>
															</div>

															{/* Progress Section */}
															<div className="bg-white rounded-xl border-2 border-gray-200 p-6">
																<div className="flex items-center justify-between mb-4">
																	<h4 className="text-lg font-bold text-gray-900">Progress Pembelajaran</h4>
																	<span className="text-2xl font-bold text-[#661FFF]">{completionPercentage}%</span>
																</div>
																
																{/* Progress Bar */}
																<div className="w-full bg-gray-200 rounded-full h-4 mb-6 overflow-hidden">
																	<div 
																		className="bg-gradient-to-r from-[#661FFF] to-[#8b5cf6] h-full rounded-full transition-all duration-500 ease-out relative"
																		style={{ width: `${completionPercentage}%` }}
																	>
																		<div className="absolute inset-0 bg-white/20 animate-pulse"></div>
																	</div>
																</div>

																{/* Stats */}
																<div className="grid grid-cols-2 gap-4 mb-6">
																	<div className="bg-green-50 rounded-lg p-4 text-center border border-green-200">
																		<div className="text-3xl font-bold text-green-600 mb-1">{completedModules}</div>
																		<div className="text-sm text-green-700">Modul Selesai</div>
																	</div>
																	<div className="bg-orange-50 rounded-lg p-4 text-center border border-orange-200">
																		<div className="text-3xl font-bold text-orange-600 mb-1">{totalModules - completedModules}</div>
																		<div className="text-sm text-orange-700">Modul Tersisa</div>
																	</div>
																</div>

																{/* Requirement Checklist */}
																<div className="space-y-3 pt-4 border-t border-gray-200">
																	<p className="text-sm font-semibold text-gray-700 mb-3">Yang perlu diselesaikan:</p>
																	{learningPathData?.courses.map(course => {
																		const courseModules = course.modules;
																		const courseCompleted = courseModules.filter(m => m.is_completed).length;
																		const courseTotal = courseModules.length;
																		const isCourseDone = courseCompleted === courseTotal;

																		return (
																			<div key={course.course_id} className="flex items-start gap-3">
																				<div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${isCourseDone ? 'bg-green-500' : 'bg-gray-300'}`}>
																					{isCourseDone && (
																						<svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
																							<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
																						</svg>
																					)}
																				</div>
																				<div className="flex-1">
																					<p className={`text-sm font-medium ${isCourseDone ? 'text-gray-900 line-through' : 'text-gray-700'}`}>
																						{course.title}
																					</p>
																					<p className="text-xs text-gray-500 mt-0.5">
																						{courseCompleted}/{courseTotal} modul selesai
																					</p>
																				</div>
																			</div>
																		);
																	})}
																</div>

																{/* Call to Action */}
																<div className="mt-6 pt-6 border-t border-gray-200 text-center">
																	<p className="text-sm text-gray-600 mb-4">Selesaikan semua modul untuk mendapatkan sertifikat! 🎓</p>
																	<button 
																		onClick={() => setActiveTab('overview')}
																		className="bg-[#661FFF] hover:bg-[#5518dd] text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-[1.03] hover:shadow-lg"
																	>
																		Lanjutkan Belajar
																	</button>
																</div>
															</div>
														</div>
													)}
												</div>
											);
										})()}
									</div>
								</div>
							</>
						) : (
							/* Quiz Content */
							<div className="bg-white rounded-xl shadow-lg p-8">
								<div className="flex items-center justify-between mb-8">
									<h2 className="text-3xl font-bold text-gray-900">{currentQuiz?.title || 'Final Quiz'}</h2>
									{quizHasPassed && (
										<div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full">
											<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
												<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
											</svg>
											<span className="font-semibold">Lulus</span>
										</div>
									)}
								</div>

								{quizBestScore !== null && (
									<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
										<div className="flex items-center gap-2 text-blue-800">
											<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
												<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
											</svg>
											<span className="font-semibold">Nilai Terbaik Kamu: {Math.round(quizBestScore * 100)}%</span>
										</div>
									</div>
								)}

								{!currentQuiz ? (
									<div className="text-center py-12">
										<p className="text-gray-600">Memuat quiz...</p>
									</div>
								) : (
									<div className="space-y-8">
										{currentQuiz.questions?.map((question: any, qIndex: number) => (
											<div key={question.id} className="space-y-4">
												<div className="flex gap-2">
													<span className="text-gray-900 font-medium">{qIndex + 1}.</span>
													<p className="text-gray-900 font-medium flex-1">
														{question.question_text}
													</p>
												</div>
												
												{/* Soal pilihan ganda atau benar/salah */}
												<div className="space-y-3 ml-6">
													{question.options?.map((option: any, oIndex: number) => (
														<div
															key={option.id}
															onClick={() => {
																setQuizAnswers({ ...quizAnswers, [question.id]: option.id });
																savePartialAnswer(question.id, option.id);
															}}
															className={`rounded-xl px-4 py-3 transition-colors cursor-pointer ${quizAnswers[question.id] === option.id ? 'bg-purple-100 hover:bg-purple-150' : 'bg-gray-100 hover:bg-gray-200'
																}`}
														>
															<span className="text-gray-900">{option.option_text}</span>
														</div>
													))}
												</div>
											</div>
										))}
									</div>
								)}

								{/* Submit Button */}
								<div className="mt-10 flex justify-center">
									<button
										onClick={() => {
											console.log('[Quiz] Current attempt_id:', currentAttemptId);
											console.log('[Quiz] Current answers:', quizAnswers);
											setShowSubmitModal(true);
										}}
										disabled={!currentQuiz || !currentAttemptId}
										className="bg-[#661FFF] hover:bg-[#5518dd] text-white px-16 py-3 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
											{course.modules.filter(m => m.type !== 'ebook').map((module) => (
												<button
													key={module.module_id}
													onClick={() => handleModuleClick(module)}
													disabled={module.is_locked}
													className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all duration-200 ${
														module.is_locked 
															? 'opacity-50 cursor-not-allowed bg-gray-50 border-l-4 border-l-transparent' 
															: currentModule?.module_id === module.module_id 
																? 'bg-purple-50 border-l-4 border-l-[#661FFF]' 
																: 'hover:bg-gray-50 border-l-4 border-l-transparent'
													}`}
												>
													<div className="flex items-center gap-3 flex-1 min-w-0">
														{/* Module Icon */}
														{module.is_locked ? (
															<div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
																<svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
																	<path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
																</svg>
															</div>
														) : module.type === 'quiz' && module.is_passed === true ? (
															/* Quiz Lulus - Centang Hijau */
															<div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 shadow-sm">
																<svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
																	<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
																</svg>
															</div>
														) : module.type === 'quiz' && module.is_passed === false ? (
															/* Quiz Gagal - Silang Merah */
															<div className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 shadow-sm">
																<svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
																	<path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
																</svg>
															</div>
														) : module.type === 'quiz' && !module.is_completed ? (
															/* Quiz Belum Dikerjakan - Clipboard Amber */
															<div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
																<svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
																	<path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
																	<path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
																</svg>
															</div>
														) : module.type !== 'quiz' && module.is_completed ? (
															/* Video/Ebook Selesai - Centang Hijau */
															<div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 shadow-sm">
																<svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
																	<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
																</svg>
															</div>
														) : (
															/* Default Icon */
															<div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${currentModule?.module_id === module.module_id ? 'bg-[#661FFF]' : 'bg-gray-100'}`}>
																<svg className={`w-3.5 h-3.5 ${currentModule?.module_id === module.module_id ? 'text-white' : 'text-gray-500'}`} fill="currentColor" viewBox="0 0 20 20">
																	<path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
																</svg>
															</div>
														)}
														{/* Module Title */}
														<div className="flex flex-col flex-1 min-w-0">
																	<span className={`text-sm font-medium truncate ${
																		module.is_locked 
																			? 'text-gray-400' 
																			: currentModule?.module_id === module.module_id 
																				? 'text-[#661FFF]' 
																				: 'text-gray-800'
																	}`}>
																		{module.title}
																		{module.is_locked && <span className="ml-2 text-xs">🔒</span>}
																	</span>
																	<span className="text-xs text-gray-500">
																		{module.is_locked ? (
																			<span className="text-xs text-gray-400">Selesaikan modul sebelumnya</span>
																		) : module.type === 'quiz' ? (
																			<span className="text-xs text-amber-600 font-medium">Kuis</span>
																		) : (
																			module.duration > 0 ? formatDuration(module.duration) : 'Video'
																		)}
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
							{Object.keys(quizAnswers).length < (currentQuiz?.questions?.length || 0) ? (
								<>
									Anda belum menjawab semua pertanyaan. <br />
									Jawab: {Object.keys(quizAnswers).length} dari {currentQuiz?.questions?.length || 0} soal. <br />
									Apakah Anda yakin ingin submit?
								</>
							) : (
								'Anda sudah menjawab semua pertanyaan. Yakin ingin submit?'
							)}
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
								onClick={async () => {
									try {
										const token = localStorage.getItem('token');
										const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

										console.log('[Quiz] Submitting quiz with attempt_id:', currentAttemptId);

										const response = await fetch(`${baseUrl}/learn/attempts/${currentAttemptId}/submit`, {
											method: 'POST',
											headers: {
												'Authorization': `Bearer ${token}`,
												'Content-Type': 'application/json'
											}
										});

										const result = await response.json();
										console.log('[Quiz] Submit response:', result);

										if (!response.ok) {
											throw new Error(result.message || 'Failed to submit quiz');
										}

										setQuizResult(result);
										setShowSubmitModal(false);
										setShowResultModal(true);
									} catch (err: any) {
										console.error('[Quiz] Submit error:', err);
										alert(err.message || 'Gagal mengirim quiz. Silakan coba lagi.');
										setShowSubmitModal(false);
									}
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
			{showResultModal && quizResult && (
				<div className="fixed inset-0 backdrop-blur-sm bg-gray-900/60 flex items-center justify-center z-50">
					<div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
						{/* Success/Failed Icon */}
						<div className="flex justify-center mb-6">
							<div className={`w-20 h-20 ${quizResult.is_passed ? 'bg-green-100' : 'bg-red-100'} rounded-full flex items-center justify-center`}>
								{quizResult.is_passed ? (
									<svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
									</svg>
								) : (
									<svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
									</svg>
								)}
							</div>
						</div>

						{/* Title */}
						<h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
							{quizResult.is_passed ? 'Selamat! Kamu Lulus' : 'Belum Berhasil'}
						</h3>
						<p className="text-center text-gray-600 mb-4">
							Score kamu <span className={`font-semibold ${quizResult.is_passed ? 'text-green-500' : 'text-red-500'}`}>
								{Math.round(quizResult.score * 100)}%
							</span> dari {quizResult.correct_count}/{quizResult.total_questions} jawaban benar
							<br />
							<span className="text-sm">Passing grade: {Math.round(quizResult.pass_threshold * 100)}%</span>
						</p>

						{/* Best Score Info */}
						{quizResult.best_score !== undefined && quizResult.best_score !== quizResult.score && (
							<div className="text-center mb-4">
								<p className="text-sm text-gray-600">
									{quizResult.is_new_best ? (
										<span className="text-green-600 font-semibold">
											🎊 Ini nilai terbaik kamu! (sebelumnya: {Math.round((quizResult.best_score || 0) * 100)}%)
										</span>
									) : (
										<span>
											Nilai terbaik kamu: <span className="font-semibold text-blue-600">{Math.round((quizResult.best_score || 0) * 100)}%</span>
										</span>
									)}
								</p>
							</div>
						)}

						{/* Result Message */}
						<div className="bg-gray-50 rounded-xl p-6 mb-6">
							<p className="text-center text-gray-700">
								{quizResult.is_passed ? (
									<>
										🎉 Selamat! Kamu berhasil menyelesaikan quiz ini dengan baik.
										<br />
										Modul quiz telah ditandai sebagai selesai.
									</>
								) : (
									<>
										Jangan menyerah! Pelajari lagi materinya dan coba kembali.
										<br />
										Kamu bisa mengulang quiz ini kapan saja.
									</>
								)}
							</p>
						</div>

						{/* Close Button */}
						<div className="mt-8 flex justify-center">
							<button
								onClick={async () => {
									setShowResultModal(false);
									setShowQuiz(false);
									setQuizAnswers({});
									setCurrentQuiz(null);
									setCurrentAttemptId(null);

									// Refresh learning path data to update module completion status
									if (quizResult.is_passed) {
										await fetchLearningContent();
									}
								}}
								className="bg-[#661FFF] hover:bg-[#5518dd] text-white px-12 py-3 rounded-full font-semibold transition-colors"
							>
								Tutup
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Ebook Download Success Modal */}
			{showEbookDownloadModal && (
				<div className="fixed inset-0 backdrop-blur-sm bg-gray-900/60 flex items-center justify-center z-50 animate-fadeIn">
					<div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative shadow-2xl animate-scaleIn">
						{/* Success Icon */}
						<div className="flex justify-center mb-6">
							<div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounceIn">
								<svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
								</svg>
							</div>
						</div>

						{/* Title */}
						<h3 className="text-2xl font-bold text-gray-900 text-center mb-3 animate-slideDown" style={{ animationDelay: '0.15s' }}>Berhasil!</h3>
						<p className="text-gray-600 text-center mb-6 animate-slideDown" style={{ animationDelay: '0.25s' }}>
							Ebook <span className="font-semibold text-[#661FFF]">"{downloadedEbookTitle}"</span> berhasil diunduh!
							<br />
							<span className="text-sm">Anda dapat mengaksesnya di menu Ebook.</span>
						</p>

						{/* Buttons */}
						<div className="flex gap-3 animate-slideUp" style={{ animationDelay: '0.35s' }}>
							<button
								onClick={() => setShowEbookDownloadModal(false)}
								className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-[1.03] hover:shadow-md"
							>
								Tutup
							</button>
							<button
								onClick={() => {
									setShowEbookDownloadModal(false);
									router.push('/dashboard/ebook');
								}}
								className="flex-1 bg-[#661FFF] hover:bg-[#5518dd] text-white py-3 rounded-full font-semibold transition-all duration-300 hover:scale-[1.03] hover:shadow-lg"
							>
								Lihat Ebook
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
