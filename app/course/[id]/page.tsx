"use client";
import Image from 'next/image';
import { useState, useEffect } from 'react';
import DashboardNavbar from '@/app/components/DashboardNavbar';
import Footer from '@/app/components/Footer';
import { DashboardSkeleton } from '@/app/components/ui/Skeleton';

export default function CourseDetailPage() {
	const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
		'fundamental': true,
	});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const t = setTimeout(() => setIsLoading(false), 700);
		return () => clearTimeout(t);
	}, []);

	const toggleSection = (sectionId: string) => {
		setExpandedSections(prev => ({
			...prev,
			[sectionId]: !prev[sectionId]
		}));
	};

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
			<div className="flex-1 max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-8 md:py-12">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Left Content - Course Details */}
					<div className="lg:col-span-2 space-y-8">
						{/* Tentang Kelas */}
						<div className="bg-white rounded-2xl shadow-md p-6 md:p-8 border border-gray-300">
							<h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Tentang Kelas</h2>
							<div className="space-y-4 text-gray-700 leading-relaxed j">
								<p>
									Program pelatihan intensif yang dirancang untuk memfasilitasi individu, baik fresh graduate maupun profesional yang berkeinginan melakukan career pivot, untuk memahami industri teknologi dan mengembangkan kemampuan dasar yang dibutuhkan untuk bekerja di sektor digital. Kurikulum program ini disusun berdasarkan kebutuhan pasar kerja saat ini, berfokus pada skill digital, komunikasi, dan mindset profesional yang diperlih teknis untuk memahami lanskap industri digital, memidentifikasi peluang karir yang sesuai dengan minat dan kompetensi, serta membangun inter personal branding dan portofolio.
								</p>
								<p>
									Peserta akan dibimbing untuk memahami lanskap industri digital, memidentifikasi peluang karir yang sesuai dengan minat dan kompetensi, serta membangun inter personal branding dan portofolio.
								</p>
								<div className="mt-6">
									<h3 className="font-bold text-gray-900 mb-2">Tujuan Utama:</h3>
									<p>
										Menghasilkan lulusan yang siap kerja (job-ready) dan mampu memberikan kontribusi signifikan dalam lingkungan kerja digital yang dinamis dan kompetitif.
									</p>
								</div>
							</div>
						</div>

						{/* Daftar Materi */}
						<div className="bg-white rounded-2xl shadow-md p-6 md:p-8 border border-gray-300">
							<h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Daftar Materi</h2>

							{/* Section 1 */}
							<div className="border-b border-gray-200">
								<button
									onClick={() => toggleSection('fundamental')}
									className="w-full flex items-center justify-between py-4 text-left hover:bg-gray-50 transition-colors text-black"
								>
									<div className="flex items-center gap-3">
										<svg
											className={`w-5 h-5 transition-transform ${expandedSections['fundamental'] ? 'rotate-90' : ''}`}
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
										</svg>
										<span className="font-semibold text-gray-900">Fundamental & Orientasi Karier Digital</span>
									</div>
									<div className="flex items-center gap-4 text-sm text-gray-600">
										<span>3 Video</span>
										<span>1 Quiz</span>
									</div>
								</button>

								{expandedSections['fundamental'] && (
									<div className="pl-8 pb-4 space-y-2">
										<div className="flex items-center justify-between py-2 hover:bg-gray-50 px-3 rounded">
											<div className="flex items-center gap-3">
												<svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
													<path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM372.5 276.5l-144 88C224.7 366.8 220.3 368 216 368c-13.69 0-24-11.2-24-24V168C192 155.3 202.2 144 216 144c4.344 0 8.678 1.176 12.51 3.516l144 88C379.6 239.9 384 247.6 384 256C384 264.4 379.6 272.1 372.5 276.5z" />
												</svg>
												<span className="text-gray-700">Analisis Tren</span>
											</div>
											<span className="text-sm text-gray-500">09:20</span>
										</div>
										<div className="flex items-center justify-between py-2 hover:bg-gray-50 px-3 rounded">
											<div className="flex items-center gap-3">
												<svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
													<path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM372.5 276.5l-144 88C224.7 366.8 220.3 368 216 368c-13.69 0-24-11.2-24-24V168C192 155.3 202.2 144 216 144c4.344 0 8.678 1.176 12.51 3.516l144 88C379.6 239.9 384 247.6 384 256C384 264.4 379.6 272.1 372.5 276.5z" />
												</svg>
												<span className="text-gray-700">Pengembangan Digital Mindset</span>
											</div>
											<span className="text-sm text-gray-500">12:45</span>
										</div>
										<div className="flex items-center justify-between py-2 hover:bg-gray-50 px-3 rounded">
											<div className="flex items-center gap-3">
												<svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
													<path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM372.5 276.5l-144 88C224.7 366.8 220.3 368 216 368c-13.69 0-24-11.2-24-24V168C192 155.3 202.2 144 216 144c4.344 0 8.678 1.176 12.51 3.516l144 88C379.6 239.9 384 247.6 384 256C384 264.4 379.6 272.1 372.5 276.5z" />
												</svg>
												<span className="text-gray-700">Manajemen Media Sosial</span>
											</div>
											<span className="text-sm text-gray-500">15:30</span>
										</div>
										<div className="flex items-center justify-between py-2 hover:bg-gray-50 px-3 rounded">
											<div className="flex items-center gap-3">
												<svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg">
													<path d="M336 64h-53.88C268.9 26.8 233.7 0 192 0S115.1 26.8 101.9 64H48C21.5 64 0 85.48 0 112v352C0 490.5 21.5 512 48 512h288c26.5 0 48-21.48 48-48v-352C384 85.48 362.5 64 336 64zM96 392c-13.25 0-24-10.75-24-24S82.75 344 96 344s24 10.75 24 24S109.3 392 96 392zM96 296c-13.25 0-24-10.75-24-24S82.75 248 96 248S120 258.8 120 272S109.3 296 96 296zM192 64c17.67 0 32 14.33 32 32c0 17.67-14.33 32-32 32S160 113.7 160 96C160 78.33 174.3 64 192 64zM304 384h-128C167.2 384 160 376.8 160 368C160 359.2 167.2 352 176 352h128c8.801 0 16 7.199 16 16C320 376.8 312.8 384 304 384zM304 288h-128C167.2 288 160 280.8 160 272C160 263.2 167.2 256 176 256h128C312.8 256 320 263.2 320 272C320 280.8 312.8 288 304 288z" />
												</svg>
												<span className="text-gray-700">Quiz Sesi 1</span>
											</div>
											<span className="text-sm text-gray-500">18:00</span>
										</div>
									</div>
								)}
							</div>

							{/* Section 2 */}
							<div className="border-b border-gray-200">
								<button
									onClick={() => toggleSection('teknis')}
									className="w-full flex items-center justify-between py-4 text-left hover:bg-gray-50 transition-colors text-black"
								>
									<div className="flex items-center gap-3">
										<svg
											className={`w-5 h-5 transition-transform ${expandedSections['teknis'] ? 'rotate-90' : ''}`}
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
										</svg>
										<span className="font-semibold text-gray-900">Kompetensi Teknis Dasar</span>
									</div>
									<div className="flex items-center gap-4 text-sm text-gray-600">
										<span>5 Lessons</span>
										<span>45 Mins</span>
									</div>
								</button>
							</div>

							{/* Section 3 */}
							<div className="border-b border-gray-200">
								<button
									onClick={() => toggleSection('strategi')}
									className="w-full flex items-center justify-between py-4 text-left hover:bg-gray-50 transition-colors text-black"
								>
									<div className="flex items-center gap-3">
										<svg
											className={`w-5 h-5 transition-transform ${expandedSections['strategi'] ? 'rotate-90' : ''}`}
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
										</svg>
										<span className="font-semibold text-gray-900">Strategi Pengembangan Profesional</span>
									</div>
									<div className="flex items-center gap-4 text-sm text-gray-600">
										<span>5 Lessons</span>
										<span>45 Mins</span>
									</div>
								</button>
							</div>
						</div>

						{/* Mentor Section */}
						<div className="bg-white rounded-2xl shadow-md p-6 md:p-8 border border-gray-300">
							<h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Mentor</h2>
							<div className="flex items-start gap-6">
								<div className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
									<Image
										src="/images/avatar-placeholder.png"
										alt="Ayu Putri"
										fill
										className="object-cover"
									/>
								</div>
								<div className="flex flex-col">
									<h3 className="text-xl font-bold text-gray-900">Dimas Radithya</h3>
									<p className="text-gray-600">Co-Founder @bijaketechno, Lecturer</p>
								</div>
							</div>
						</div>
					</div>

					{/* Right Sidebar - Course Card */}
					<div className="lg:col-span-1">
						<div className="bg-white rounded-2xl shadow-md overflow-hidden top-24 border border-gray-300">
							{/* Course Image */}
							<div className="relative w-full aspect-video bg-gray-200">
								<Image
									src="/images/course-thumbnail.jpg"
									alt="Course Thumbnail"
									fill
									className="object-cover"
								/>
								<div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
									<button className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
										<svg className="w-8 h-8 text-[#661FFF] ml-1" fill="currentColor" viewBox="0 0 20 20">
											<path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
										</svg>
									</button>
								</div>
							</div>

							<div className="p-6">
								{/* Price */}
								<div className="mb-4">
									<p className="text-3xl font-bold text-gray-900">Rp250.000</p>
								</div>

								{/* Features */}
								<div className="space-y-3 mb-6">
									<div className="flex items-center gap-3 text-gray-700">
										<svg className="w-5 h-5 text-[#661FFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
										<span>Lifetime Access</span>
									</div>
									<div className="flex items-center gap-3 text-gray-700">
										<svg className="w-5 h-5 text-[#661FFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
										</svg>
										<span>Is Video</span>
									</div>
									<div className="flex items-center gap-3 text-gray-700">
										<svg className="w-5 h-5 text-[#661FFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
										</svg>
										<span>3 Ebook (PDF)</span>
									</div>
									<div className="flex items-center gap-3 text-gray-700">
										<svg className="w-5 h-5 text-[#661FFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
										</svg>
										<span>Bersertifikat</span>
									</div>
								</div>

								{/* CTA Button */}
								<button className="w-full bg-[#661FFF] hover:bg-[#5518dd] text-white font-bold py-4 rounded-lg transition-colors">
									Beli Kelas
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<Footer />
		</div>
	);
}
