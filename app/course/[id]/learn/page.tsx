"use client";
import { useState, useEffect } from 'react';
import DashboardNavbar from '@/app/components/DashboardNavbar';
import Footer from '@/app/components/Footer';
import { DashboardSkeleton } from '@/app/components/ui/Skeleton';

export default function CourseLearnPage() {
	const [activeTab, setActiveTab] = useState<'overview' | 'ebook' | 'sertifikat'>('overview');
	const [currentVideo, setCurrentVideo] = useState({
		title: 'Analisis Tren',
		duration: '09:20'
	});
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(145);
	const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
		'fundamental': true,
	});

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
				{ id: 1, title: 'Analisis Tren', duration: '09:20', completed: false },
				{ id: 2, title: 'Pengembangan Digital Mindset', duration: '12:45', completed: false },
				{ id: 3, title: 'Manajemen Media Sosial', duration: '15:30', completed: false },
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
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Left Content - Video Player & Course Info */}
					<div className="lg:col-span-2 space-y-6">
						{/* Video Player */}
						<div className="bg-black rounded-lg overflow-hidden shadow-lg">
							<div className="relative aspect-video bg-gray-900">
								{/* Video Placeholder */}
								<div className="absolute inset-0 flex items-center justify-center">
									<div className="text-white text-center">
										<div className="text-4xl mb-2">📹</div>
										<p className="text-sm">Video Player</p>
									</div>
								</div>

								{/* Video Controls Overlay */}
								<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity">
									<div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
										{/* Progress Bar */}
										<div className="relative">
											<input
												type="range"
												min="0"
												max={duration}
												value={currentTime}
												onChange={(e) => setCurrentTime(Number(e.target.value))}
												className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-red-600"
											/>
										</div>

										{/* Controls */}
										<div className="flex items-center justify-between text-white text-sm">
											<div className="flex items-center gap-4">
												{/* Previous Button */}
												<button className="flex items-center gap-1 hover:text-gray-300 transition-colors">
													<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
														<path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
													</svg>
													<span className="hidden sm:inline">Previous</span>
												</button>

												{/* Play Button */}
												<button 
													onClick={() => setIsPlaying(!isPlaying)}
													className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
												>
													{isPlaying ? (
														<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
															<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
														</svg>
													) : (
														<svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 20 20">
															<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
														</svg>
													)}
												</button>

												{/* Rewind 10s */}
												<button className="hover:text-gray-300 transition-colors">
													<div className="relative w-8 h-8 flex items-center justify-center">
														<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
														</svg>
														<span className="absolute text-[10px] font-bold">10</span>
													</div>
												</button>

												{/* Forward 10s */}
												<button className="hover:text-gray-300 transition-colors">
													<div className="relative w-8 h-8 flex items-center justify-center">
														<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
														</svg>
														<span className="absolute text-[10px] font-bold">10</span>
													</div>
												</button>

												{/* Time Display */}
												<span className="text-xs sm:text-sm">
													{formatTime(currentTime)} / {formatTime(duration)}
												</span>
											</div>

											<div className="flex items-center gap-3">
												{/* Subtitle Button */}
												<button className="flex items-center gap-1 hover:text-gray-300 transition-colors">
													<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
													</svg>
													<span className="hidden sm:inline">Subtitle</span>
												</button>

												{/* Quality Selector */}
												<div className="hidden sm:flex items-center gap-2">
													<button className="px-2 py-1 bg-white/20 rounded hover:bg-white/30 transition-colors text-xs">
														480P
													</button>
													<button className="px-2 py-1 bg-white/20 rounded hover:bg-white/30 transition-colors text-xs">
														1.0X
													</button>
												</div>

												{/* Next Button */}
												<button className="flex items-center gap-1 hover:text-gray-300 transition-colors">
													<span className="hidden sm:inline">Next</span>
													<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
														<path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
													</svg>
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Tabs */}
						<div className="bg-white rounded-lg shadow-sm overflow-hidden">
							<div className="flex border-b border-gray-200">
								<button
									onClick={() => setActiveTab('overview')}
									className={`flex-1 px-6 py-4 font-semibold transition-colors ${
										activeTab === 'overview'
											? 'bg-[#661FFF] text-white'
											: 'bg-white text-gray-600 hover:bg-gray-50'
									}`}
								>
									Overview
								</button>
								<button
									onClick={() => setActiveTab('ebook')}
									className={`flex-1 px-6 py-4 font-semibold transition-colors ${
										activeTab === 'ebook'
											? 'bg-[#661FFF] text-white'
											: 'bg-white text-gray-600 hover:bg-gray-50'
									}`}
								>
									Ebook
								</button>
								<button
									onClick={() => setActiveTab('sertifikat')}
									className={`flex-1 px-6 py-4 font-semibold transition-colors ${
										activeTab === 'sertifikat'
											? 'bg-[#661FFF] text-white'
											: 'bg-white text-gray-600 hover:bg-gray-50'
									}`}
								>
									Sertifikat
								</button>
							</div>

							{/* Tab Content */}
							<div className="p-6">
								<div className="min-h-[350px]">
									{activeTab === 'overview' && (
										<div className="space-y-4 text-gray-700">
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
										<div className="space-y-4">
											{/* Ebook 1 */}
											<div className="bg-purple-100 rounded-2xl p-5 flex items-center justify-between hover:bg-purple-150 transition-colors">
												<div className="flex items-center gap-4">
													<div className="bg-[#661FFF] rounded-lg p-3 flex items-center justify-center">
														<svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
															<path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
														</svg>
													</div>
													<div>
														<h4 className="font-bold text-gray-900 text-lg">Ebook Orientasi Karier Digital</h4>
													</div>
												</div>
												<button className="bg-[#661FFF] hover:bg-[#5518dd] text-white rounded-full p-3 transition-colors">
													<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
														<path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
													</svg>
												</button>
											</div>

											{/* Ebook 2 */}
											<div className="bg-purple-100 rounded-2xl p-5 flex items-center justify-between hover:bg-purple-150 transition-colors">
												<div className="flex items-center gap-4">
													<div className="bg-[#661FFF] rounded-lg p-3 flex items-center justify-center">
														<svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
															<path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
														</svg>
													</div>
													<div>
														<h4 className="font-bold text-gray-900 text-lg">Ebook Asah Digital Mindset</h4>
													</div>
												</div>
												<button className="bg-[#661FFF] hover:bg-[#5518dd] text-white rounded-full p-3 transition-colors">
													<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
														<path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
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
					</div>

					{/* Right Sidebar - Course Playlist */}
					<div className="lg:col-span-1">
						<div className="bg-white rounded-lg shadow-sm overflow-hidden top-24">
							<div className="p-4 border-b border-gray-200">
								<h3 className="font-bold text-gray-900 text-lg">Daftar Materi</h3>
							</div>

							<div className="max-h-[600px] overflow-y-auto">
								{courseContent.map((section) => (
									<div key={section.id} className="border-b border-gray-200">
										<button
											onClick={() => toggleSection(section.id)}
											className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
										>
											<div className="flex items-center gap-2">
												<svg 
													className={`w-4 h-4 transition-transform flex-shrink-0 ${expandedSections[section.id] ? 'rotate-90' : ''}`}
													fill="none" 
													stroke="currentColor" 
													viewBox="0 0 24 24"
												>
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
												</svg>
												<span className="font-semibold text-gray-900 text-sm">{section.title}</span>
											</div>
										</button>
										
										{expandedSections[section.id] && section.lessons.length > 0 && (
											<div className="bg-gray-50">
												{section.lessons.map((lesson) => (
													<button
														key={lesson.id}
														onClick={() => setCurrentVideo({ title: lesson.title, duration: lesson.duration })}
														className={`w-full flex items-center justify-between p-3 pl-8 text-left hover:bg-gray-100 transition-colors ${
															currentVideo.title === lesson.title ? 'bg-purple-50 border-l-4 border-[#661FFF]' : ''
														}`}
													>
														<div className="flex items-center gap-3 flex-1 min-w-0">
															{lesson.type === 'quiz' ? (
																<svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
																	<path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
																	<path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
																</svg>
															) : lesson.completed ? (
																<svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
																	<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
																</svg>
															) : (
																<svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
																	<path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
																</svg>
															)}
															<span className="text-sm text-gray-700 truncate">{lesson.title}</span>
														</div>
														<span className="text-xs text-gray-500 ml-2 flex-shrink-0">{lesson.duration}</span>
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
			</div>

			<Footer />
		</div>
	);
}
