"use client";
import Image from 'next/image';
import Link from 'next/link';
import DashboardNavbar from '../../components/DashboardNavbar';
import Toast from '../../components/Toast';
import { useState, useEffect } from 'react';
import { DashboardSkeleton } from '../../components/ui/Skeleton';

interface Ebook {
	id: string;
	title: string;
	ebook_url: string;
	course_title: string;
	course_thumbnail: string;
}

export default function EbookPage() {
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [ebooks, setEbooks] = useState<Ebook[]>([]);
	const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

	const fetchEbooks = async () => {
		try {
			setIsLoading(true);
			setToastMessage(null);
			const token = localStorage.getItem('token');

			if (!token) {
				setToastMessage({ type: 'error', text: 'Token tidak ditemukan. Silakan login kembali.' });
				setIsLoading(false);
				return;
			}

			const response = await fetch('http://localhost:3000/api/v1/learn/ebooks', {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				throw new Error('Gagal mengambil data ebook');
			}

			const data = await response.json();
			setEbooks(data.data || []);
		} catch (err: any) {
			console.error('Error fetching ebooks:', err);
			setToastMessage({ type: 'error', text: err.message || 'Terjadi kesalahan saat mengambil data' });
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchEbooks();
	}, []);

	const filteredEbooks = ebooks.filter(ebook =>
		ebook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
		ebook.course_title.toLowerCase().includes(searchQuery.toLowerCase())
	);

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
			<div className="min-h-screen flex flex-col pb-18 md:pb-20 lg:pb-22 bg-gray-50">
				<DashboardNavbar />

				<main className="flex-grow">
					{/* Hero Section */}
					<section className="bg-gradient-to-br from-[#661FFF] to-[#9D6FFF] pt-12 pb-16 md:pt-16 md:pb-20">
						<div className="max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
							<h1 className="text-white text-[32px] sm:text-[36px] md:text-[42px] lg:text-[48px] font-bold mb-3 md:mb-4">
								Ebook Saya
							</h1>
							<p className="text-white/80 text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] max-w-2xl">
								Daftar Ebook yang telah diunduh pada tiap kelas
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
										placeholder="Cari ebook berdasarkan judul atau kelas..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#661FFF] focus:border-transparent text-gray-700 placeholder-gray-400 bg-gray-50"
									/>
								</div>
								{searchQuery && (
									<p className="text-sm text-gray-500 mt-3">
										Ditemukan {filteredEbooks.length} ebook
									</p>
								)}
							</div>
						</div>
					</section>

					{/* Ebook Cards Section */}
					<section className="py-8 md:py-12">
						<div className="max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
							{filteredEbooks.length === 0 ? (
								<div className="text-center py-16 bg-white rounded-2xl shadow-sm">
									<div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
										<svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
										</svg>
									</div>
									<p className="text-gray-600 text-lg mb-6">
										{searchQuery ? 'Tidak ada ebook yang sesuai dengan pencarian' : 'Kamu belum memiliki ebook'}
									</p>
									{!searchQuery && (
										<Link href="/explore" className="inline-block px-8 py-3 bg-[#661FFF] text-white rounded-xl font-semibold hover:bg-[#5518CC] transition">
											Jelajahi Kelas
										</Link>
									)}
								</div>
							) : (
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
									{filteredEbooks.map((ebook, index) => (
										<div
											key={`${ebook.id}-${index}`}
											className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#661FFF]/20"
										>
											{/* Thumbnail with gradient */}
											<div className="relative h-36 md:h-40 overflow-hidden">
												<div className="absolute inset-0 bg-gradient-to-br from-[#661FFF] to-[#A855F7]" />
												{ebook.course_thumbnail && (
													<Image
														src={ebook.course_thumbnail}
														alt={ebook.course_title}
														fill
														className="object-cover opacity-30 group-hover:opacity-40 transition-opacity"
													/>
												)}
												<div className="absolute inset-0 flex items-center justify-center">
													<div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
														<svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
															<path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
															<path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
														</svg>
													</div>
												</div>
											</div>

											{/* Content */}
											<div className="p-5">
												<span className="inline-block px-3 py-1 bg-[#661FFF]/10 text-[#661FFF] text-xs font-medium rounded-full mb-3">
													{ebook.course_title}
												</span>
												<h3 className="text-[15px] md:text-[17px] font-bold text-gray-900 mb-4 leading-snug line-clamp-2 min-h-[44px]">
													{ebook.title}
												</h3>
												<a
													href={ebook.ebook_url}
													target="_blank"
													rel="noopener noreferrer"
													className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#661FFF] text-white text-sm font-semibold rounded-xl hover:bg-[#5518CC] transition-colors w-full justify-center group-hover:shadow-md"
												>
													<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
													</svg>
													Unduh Ebook
												</a>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</section>
				</main>
			</div>
		</>
	);
}
