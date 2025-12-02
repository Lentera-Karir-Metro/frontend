"use client";
import Image from 'next/image';
import Link from 'next/link';
import DashboardNavbar from '../../components/DashboardNavbar';
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
	const [error, setError] = useState<string | null>(null);

	const fetchEbooks = async () => {
		try {
			setIsLoading(true);
			setError(null);
			const token = localStorage.getItem('token');
			
			if (!token) {
				setError('Token tidak ditemukan. Silakan login kembali.');
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
			setError(err.message || 'Terjadi kesalahan saat mengambil data');
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
		<div className="min-h-screen flex flex-col pb-18 md:pb-20 lg:pb-22 bg-white">
			<DashboardNavbar />

			<main className="flex-grow">
				{/* Hero Section */}
				<section className="bg-[#E5E1F6] pt-12 pb-8 md:pt-16 md:pb-12">
					<div className="max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
						<h1 className="text-gray-900 text-[32px] sm:text-[36px] md:text-[42px] lg:text-[48px] font-bold mb-3 md:mb-4">
							Ebook Saya
						</h1>
						<p className="text-gray-700 text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] max-w-2xl">
							Daftar Ebook yang telah diunduh pada tiap kelas
						</p>
					</div>
				</section>

				{/* Search Bar Section */}
				<section className="bg-[#E5E1F6] pb-8">
					<div className="max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
						<div className="relative md:w-[420px]">
							<div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
								</svg>
							</div>
							<input
								type="text"
								placeholder="Cari ebook berdasarkan judul atau kelas..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-14 pr-6 py-4 rounded-full border-2 border-[#661FFF] focus:outline-none focus:ring-2 focus:ring-[#661FFF] text-gray-700 placeholder-gray-400"
							/>
						</div>
						{searchQuery && (
							<p className="text-sm text-gray-600 mt-3">
								Ditemukan {filteredEbooks.length} ebook
							</p>
						)}
					</div>
				</section>

				{/* Ebook Cards Section */}
				<section className="py-8 md:py-12 bg-white">
					<div className="max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
						{error ? (
							<div className="text-center py-12">
								<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
									<svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</div>
								<p className="text-gray-600 text-lg mb-4">{error}</p>
								<button
									onClick={fetchEbooks}
									className="px-6 py-2 bg-[#661FFF] text-white rounded-lg hover:bg-[#5518CC] transition"
								>
									Coba Lagi
								</button>
							</div>
						) : filteredEbooks.length === 0 ? (
							<div className="text-center py-12">
								<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
									<svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
									</svg>
								</div>
								<p className="text-gray-600 text-lg mb-4">
									{searchQuery ? 'Tidak ada ebook yang sesuai dengan pencarian' : 'Kamu belum memiliki ebook'}
								</p>
								{!searchQuery && (
									<Link href="/explore" className="inline-block px-6 py-2 bg-[#661FFF] text-white rounded-lg hover:bg-[#5518CC] transition">
										Jelajahi Kelas
									</Link>
								)}
							</div>
						) : (
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
								{filteredEbooks.map((ebook) => (
									<div
										key={ebook.id}
										className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-200"
									>
										<div className="flex items-center gap-4 p-6">
											{/* Ebook Thumbnail */}
											<div className="relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-gradient-to-br from-[#661FFF] to-[#9D6FFF] flex-shrink-0">
												<Image
													src={ebook.course_thumbnail || '/images/placeholder.jpg'}
													alt={ebook.course_title}
													fill
													className="object-cover opacity-50"
												/>
												<div className="absolute inset-0 flex items-center justify-center">
													<svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
														<path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
														<path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
													</svg>
												</div>
											</div>

											{/* Ebook Info */}
											<div className="flex-grow">
												<h3 className="text-[16px] md:text-[18px] font-bold text-gray-900 mb-1 leading-tight line-clamp-2">
													{ebook.title}
												</h3>
												<p className="text-sm text-gray-600 mb-3 line-clamp-1">{ebook.course_title}</p>
												<a
													href={ebook.ebook_url}
													target="_blank"
													rel="noopener noreferrer"
													className="inline-flex items-center gap-2 text-[14px] md:text-[16px] font-semibold text-[#661FFF] hover:text-[#5518CC] transition-colors"
												>
													<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
													</svg>
													Unduh Ebook
												</a>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</section>
			</main>
		</div>
	);
}
