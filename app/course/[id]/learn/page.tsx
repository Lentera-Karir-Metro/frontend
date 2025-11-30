"use client";
import { useState, useEffect } from 'react';
import DashboardNavbar from '@/app/components/DashboardNavbar';
import Footer from '@/app/components/Footer';
import { DashboardSkeleton } from '@/app/components/ui/Skeleton';

export default function CourseLearnPage() {
	const [activeTab, setActiveTab] = useState<'overview' | 'ebook' | 'sertifikat'>('overview');
	const [currentVideo, setCurrentVideo] = useState({
		title: 'Analisis Tren',
		duration: '09:20',
		videoSrc: '/videos/video1.mp4'
	});
	const [videoSrc, setVideoSrc] = useState('/videos/video1.mp4');
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(145);
	const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
		'fundamental': true,
	});
	const [showQuiz, setShowQuiz] = useState(false);
	const [currentQuiz, setCurrentQuiz] = useState<any>(null);
	const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});
	const [showSubmitModal, setShowSubmitModal] = useState(false);
	const [showResultModal, setShowResultModal] = useState(false);
	const [quizScore, setQuizScore] = useState(0);

	const toggleSection = (sectionId: string) => {
		setExpandedSections(prev => ({
			...prev,
			[sectionId]: !prev[sectionId]
		}));
	};

	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const t = setTimeout(() => setIsLoading(false), 700);
		return () => clearTimeout(t);
	}, []);

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

	const courseContent = [
		{
			id: 'fundamental',
			title: 'Fundamental & Orientasi Karier Digital',
			lessons: [
				{ id: 1, title: 'Analisis Tren', duration: '09:20', completed: false, videoSrc: '/videos/video1.mp4' },
				{ id: 2, title: 'Pengembangan Digital Mindset', duration: '12:45', completed: false, videoSrc: '/videos/video2.mp4' },
				{ id: 3, title: 'Manajemen Media Sosial', duration: '15:30', completed: false, videoSrc: '/videos/video3.mp4' },
				{ id: 4, title: 'Quiz Sesi 1', duration: '18:00', type: 'quiz' }
			]
		},
		{
			id: 'teknis',
			title: 'Kompetensi Teknis Dasar',
			lessons: []
		},
		{
			id: 'strategi',
			title: 'Strategi Pengembangan Profesional',
			lessons: []
		}
	];

	if (isLoading) return <DashboardSkeleton />;

	return (
		<div className="min-h-screen flex flex-col bg-gray-50">
			<DashboardNavbar />

			{/* Hero Section */}
			<div className="bg-gradient-to-r from-[#EAE6FE] to-[#EAE6FE] text-gray-900 py-12 md:py-16">
				<div className="max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
					<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
						Bootcamp: Kick-start Karier Digital
					</h1>
					<div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm md:text-base">
						<div className="flex items-center gap-2">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
							<span>Released date March 2025</span>
						</div>
						<div className="flex items-center gap-2">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<span>Last updated August 2025</span>
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
							</div>
						</div>

						{/* Tabs */}
						<div className="bg-gray-50 rounded-xl shadow-md border-2 border-gray-200 overflow-hidden p-4">
							<div className="flex justify-center gap-4 mb-4">
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
							<div className="text-gray-700">
								<div className="min-h-[350px]">
									{activeTab === 'overview' && (
										<div className="space-y-4 text-gray-700 text-justify px-6">
											<p className="leading-relaxed">
												Program pelatihan intensif yang dirancang khusus untuk memfasilitasi individu, baik fresh graduate maupun profesional yang berkeinginan melakukan career pivot, untuk memahami industri teknologi dan mengembangkan kemampuan dasar yang dibutuhkan untuk bekerja di sektor digital. Kurikulum program ini disusun berdasarkan kebutuhan pasar kerja saat ini, berfokus pada skill digital, komunikasi, dan mindset profesional yang diperlih teknis.
											</p>
											<p className="leading-relaxed">
												Kurikulum program ini disusun berdasarkan kebutuhan pasar kerja saat ini, berfokus pada skill digital, komunikasi, dan mindset profesional yang dibutuhkan untuk menjadi keterampilan teknis dasar (seperti SEO, copywriting), data analisis data sederhana, serta komunikasi dan kolaborasi dalam tim dalam pengembangan personal branding dan portofolio.
											</p>
											<p className="leading-relaxed">
												Peserta akan dibimbing untuk memahami lanskap industri digital, memidentifikasi peluang karir yang sesuai dengan minat dan kompetensi, serta membangun inter personal branding dan portofolio yang sesuai dengan minat dan kompetensi, serta membangun inter personal branding dan portofolio yang memenuhi standar industri.
											</p>
											<div className="mt-6">
												<h3 className="font-bold text-gray-900 mb-2">Tujuan Utama:</h3>
												<p className="leading-relaxed">
													Menghasilkan lulusan yang siap kerja (job-ready) dan mampu memberikan kontribusi signifikan dalam lingkungan kerja digital yang dinamis dan kompetitif.
												</p>
											</div>
										</div>
									)}

									{activeTab === 'ebook' && (
										<div className="space-y-4 px-6">
									{/* Ebook 1 */}
									<div className="bg-purple-100 rounded-2xl p-4 flex items-center justify-between hover:bg-purple-150 transition-colors">
										<div className="flex items-center gap-3">
											<div className="w-8 h-8 flex items-center justify-center">
												<img src="/images/ebook-purple.png" alt="Ebook" className="w-full h-full object-contain" />
											</div>
											<div>
												<h4 className="font-bold text-gray-900 text-base">Ebook Orientasi Karier Digital</h4>
											</div>
										</div>
										<button className="bg-[#661FFF] hover:bg-[#5518dd] text-white rounded-full p-2.5 transition-colors shadow-lg hover:shadow-xl">
											<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
											</svg>
										</button>
									</div>											{/* Ebook 2 */}
											<div className="bg-purple-100 rounded-2xl p-4 flex items-center justify-between hover:bg-purple-150 transition-colors">
												<div className="flex items-center gap-3">
													<div className="w-8 h-8 flex items-center justify-center">
														<img src="/images/ebook-purple.png" alt="Ebook" className="w-full h-full object-contain" />
													</div>
													<div>
														<h4 className="font-bold text-gray-900 text-base">Ebook Asah Digital Mindset</h4>
													</div>
												</div>
												<button className="bg-[#661FFF] hover:bg-[#5518dd] text-white rounded-full p-2.5 transition-colors shadow-lg hover:shadow-xl">
													<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
													</svg>
												</button>
											</div>
										</div>
									)}

									{activeTab === 'sertifikat' && (
										<div className="text-gray-700 text-center py-8">
											<svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
											</svg>
											<p className="text-lg font-semibold text-gray-900 mb-2">Sertifikat Belum Tersedia</p>
											<p className="text-gray-600">Selesaikan semua materi untuk mendapatkan sertifikat</p>
										</div>
									)}
								</div>
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
							{courseContent.map((section) => (
								<div key={section.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
									<button
										onClick={() => toggleSection(section.id)}
										className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
									>
										<div className="flex items-center gap-2">
											<svg 
												className={`w-3.5 h-3.5 transition-transform flex-shrink-0 ${expandedSections[section.id] ? 'rotate-90' : ''}`}
												fill="none" 
												stroke="currentColor" 
												viewBox="0 0 24 24"
											>
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
											</svg>
											<span className="font-medium text-gray-900 text-sm">{section.title}</span>
										</div>
									</button>
									
									{expandedSections[section.id] && section.lessons.length > 0 && (
										<div className="border-t border-gray-200">
											{section.lessons.map((lesson: any) => (
												<button
													key={lesson.id}
													onClick={() => {
														if (lesson.type === 'quiz') {
															setShowQuiz(true);
															setCurrentQuiz(lesson);
														} else if (lesson.videoSrc) {
															setShowQuiz(false);
															setCurrentVideo({ title: lesson.title, duration: lesson.duration, videoSrc: lesson.videoSrc });
															setVideoSrc(lesson.videoSrc);
														}
													}}
													className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-gray-50 transition-colors"
												>
													<div className="flex items-center gap-3 flex-1 min-w-0">
														{lesson.type === 'quiz' ? (
															<div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
																<svg className="w-3.5 h-3.5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
																	<path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
																	<path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
																</svg>
															</div>
														) : lesson.completed ? (
															<div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
																<svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
																	<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
																</svg>
															</div>
														) : (
															<div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
																<svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
																	<path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
																</svg>
															</div>
														)}
														<div className="flex flex-col flex-1 min-w-0">
															<span className={`text-sm font-normal truncate ${
																currentVideo.title === lesson.title ? 'text-[#661FFF]' : 'text-gray-900'
															}`}>{lesson.title}</span>
															<span className="text-xs text-gray-500">{lesson.duration} menit</span>
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
