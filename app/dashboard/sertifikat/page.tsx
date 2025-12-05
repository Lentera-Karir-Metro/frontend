"use client";
import Image from 'next/image';
import Link from 'next/link';
import DashboardNavbar from '../../components/DashboardNavbar';
import Footer from '../../components/Footer';
import Toast from '../../components/Toast';
import { useState, useEffect } from 'react';
import { DashboardSkeleton } from '../../components/ui/Skeleton';

interface Certificate {
	id: string;
	user_id: string;
	learning_path_id: string;
	issued_at: string;
	total_hours: number;
	certificate_url: string | null;
	LearningPath: {
		id: string;
		title: string;
		description: string;
		thumbnail_url: string;
		category: string;
	};
}

export default function SertifikatPage() {
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [certificates, setCertificates] = useState<Certificate[]>([]);
	const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

	useEffect(() => {
		fetchCertificates();
	}, []);

	const fetchCertificates = async () => {
		try {
			const token = localStorage.getItem('token');
			if (!token) {
				window.location.href = '/sign-in';
				return;
			}

			const response = await fetch('http://localhost:3000/api/v1/certificates', {
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			});

			if (response.ok) {
				const data = await response.json();
				setCertificates(data.data || []);
			} else {
				setToastMessage({ type: 'error', text: 'Gagal memuat sertifikat' });
			}
		} catch (err) {
			console.error('Error fetching certificates:', err);
			setToastMessage({ type: 'error', text: 'Terjadi kesalahan saat memuat data' });
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading) return <DashboardSkeleton />;

	const filteredCertificates = certificates.filter(cert => 
		cert.LearningPath.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('id-ID', { 
			day: 'numeric', 
			month: 'long', 
			year: 'numeric' 
		});
	};

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
			<div className="min-h-screen flex flex-col pb-18 md:pb-20 lg:pb-22 bg-white">
				<DashboardNavbar />

			<main className="flex-grow bg-[#E5E1F6]">
				{/* Hero Section */}
				<section className="bg-[#E5E1F6] pt-12 pb-8 md:pt-16 md:pb-12">
					<div className="max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
						<h1 className="text-gray-900 text-[32px] sm:text-[36px] md:text-[42px] lg:text-[48px] font-bold mb-3 md:mb-4">
							Sertifikat Saya
						</h1>
						<p className="text-gray-700 text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] max-w-2xl">
							Sertifikat yang kamu dapatkan setelah menyelesaikan kelas
						</p>
					</div>
				</section>

				{/* Search Bar Section */}
				<section className="bg-[#E5E1F6] pb-8">
					<div className="max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
						<div className="relative max-w-xl">
							<div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
								</svg>
							</div>
							<input
								type="text"
								placeholder="Cari sertifikat berdasarkan judul kelas..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-14 pr-6 py-4 rounded-full border-2 border-[#661FFF] focus:outline-none focus:ring-2 focus:ring-[#661FFF] focus:ring-opacity-20 text-gray-700 placeholder-gray-400 transition-all"
							/>
						</div>
						{searchQuery && (
							<p className="mt-3 text-sm text-gray-600">
								{filteredCertificates.length > 0 
									? `Ditemukan ${filteredCertificates.length} sertifikat`
									: 'Tidak ada sertifikat ditemukan'
								}
							</p>
						)}
					</div>
				</section>

				{/* Certificate Cards Section */}
				<section className="py-8 md:py-12 bg-white">
					<div className="max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
						{filteredCertificates.length === 0 ? (
							<div className="text-center py-12">
								<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
									<svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
										<path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
										<path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
									</svg>
								</div>
								<p className="text-gray-600 text-lg mb-2">
									{searchQuery ? 'Tidak ada sertifikat yang sesuai dengan pencarian' : 'Kamu belum memiliki sertifikat'}
								</p>
								<p className="text-gray-500 text-sm mb-6">
									Selesaikan kelas hingga 100% untuk mendapatkan sertifikat
								</p>
								{!searchQuery && (
									<Link href="/dashboard/kelas" className="inline-block px-6 py-2 bg-[#661FFF] text-white rounded-lg hover:bg-[#5518CC] transition">
										Lihat Kelas Saya
									</Link>
								)}
							</div>
						) : (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
								{filteredCertificates.map((certificate) => (
									<div
										key={certificate.id}
										className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-200"
									>
										{/* Certificate Image */}
										<div className="relative w-full h-48 md:h-56 bg-gradient-to-br from-[#661FFF] to-[#9D6FFF]">
											<div className="absolute inset-0 flex items-center justify-center">
												<div className="relative w-full h-full">
													<Image
														src={certificate.LearningPath.thumbnail_url || '/images/placeholder.jpg'}
														alt={certificate.LearningPath.title}
														fill
														className="object-cover opacity-30"
													/>
												</div>
												<div className="absolute inset-0 flex items-center justify-center">
													<div className="text-center text-white">
														<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-2">
															<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
																<path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
																<path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
															</svg>
														</div>
														<span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold">
															{certificate.LearningPath.category}
														</span>
													</div>
												</div>
											</div>
										</div>

										{/* Certificate Info */}
										<div className="p-5 md:p-6">
											<h3 className="text-[16px] md:text-[18px] font-bold text-gray-900 mb-2 leading-tight line-clamp-2">
												{certificate.LearningPath.title}
											</h3>
											<div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
												<span>
													{new Date(certificate.issued_at).toLocaleDateString('id-ID', { 
														day: 'numeric', 
														month: 'long', 
														year: 'numeric' 
													})}
												</span>
												<span>•</span>
												<span>{certificate.total_hours} Jam</span>
											</div>
											{certificate.certificate_url ? (
												<a
													href={certificate.certificate_url}
													target="_blank"
													rel="noopener noreferrer"
													className="inline-block text-[14px] md:text-[16px] font-semibold text-[#661FFF] hover:text-[#5518CC] underline transition-colors"
												>
													Lihat Sertifikat
												</a>
											) : (
												<Link
													href={`/dashboard/sertifikat/${certificate.id}`}
													className="inline-block text-[14px] md:text-[16px] font-semibold text-[#661FFF] hover:text-[#5518CC] underline transition-colors"
												>
													Lihat Detail
												</Link>
											)}
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</section>
			</main>

			<Footer />
		</div>
		</>
	);
}
