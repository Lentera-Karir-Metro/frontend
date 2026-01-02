"use client";
import Image from 'next/image';
import Link from 'next/link';
import DashboardNavbar from '../../components/DashboardNavbar';
import Toast from '../../components/Toast';
import { useState, useEffect } from 'react';
import { DashboardSkeleton } from '../../components/ui/Skeleton';

interface Certificate {
	id: string;
	user_id: string;
	course_id: string;
	issued_at: string;
	total_hours: number;
	certificate_url: string | null;
	Course?: {
		id: string;
		title: string;
		mentor_name?: string;
		thumbnail_url?: string;
	};
}

export default function SertifikatPage() {
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [certificates, setCertificates] = useState<Certificate[]>([]);
	const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

	useEffect(() => {
		fetchCertificates();

		// Auto-refresh when window gains focus (user comes back from learn page)
		const handleFocus = () => {
			fetchCertificates();
		};

		window.addEventListener('focus', handleFocus);

		return () => {
			window.removeEventListener('focus', handleFocus);
		};
	}, []);

	const fetchCertificates = async () => {
		try {
			const token = localStorage.getItem('token');
			if (!token) {
				window.location.href = '/sign-in';
				return;
			}

			const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
			const response = await fetch(`${baseUrl}/certificates`, {
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
		cert.Course?.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false
	);

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
								Sertifikat Saya
							</h1>
							<p className="text-white/80 text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] max-w-2xl">
								Sertifikat yang kamu dapatkan setelah menyelesaikan kelas
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
										placeholder="Cari sertifikat berdasarkan judul kelas..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#661FFF] focus:border-transparent text-gray-700 placeholder-gray-400 bg-gray-50"
									/>
								</div>
								{searchQuery && (
									<p className="text-sm text-gray-500 mt-3">
										Ditemukan {filteredCertificates.length} sertifikat
									</p>
								)}
							</div>
						</div>
					</section>

					{/* Certificate Cards Section */}
					<section className="py-8 md:py-12">
						<div className="max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
							{filteredCertificates.length === 0 ? (
								<div className="text-center py-16 bg-white rounded-2xl shadow-sm">
									<div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
										<svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
											<path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
											<path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
										</svg>
									</div>
									<p className="text-gray-600 text-lg mb-6">
										{searchQuery ? 'Tidak ada sertifikat yang sesuai dengan pencarian' : 'Kamu belum memiliki sertifikat'}
									</p>
									{!searchQuery && (
										<Link href="/dashboard/kelas" className="inline-block px-8 py-3 bg-[#661FFF] text-white rounded-xl font-semibold hover:bg-[#5518CC] transition">
											Lihat Kelas Saya
										</Link>
									)}
								</div>
							) : (
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
									{filteredCertificates.map((certificate) => (
										<div
											key={certificate.id}
											className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#661FFF]/20"
										>
											{/* Certificate Image */}
											<div className="relative w-full h-48 md:h-56 bg-gradient-to-br from-[#661FFF] to-[#9D6FFF]">
												<div className="absolute inset-0 flex items-center justify-center">
													<div className="relative w-full h-full">
														<Image
															src={certificate.Course?.thumbnail_url || '/images/placeholder.jpg'}
															alt={certificate.Course?.title || 'Certificate'}
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
																Sertifikat
															</span>
														</div>
													</div>
												</div>
											</div>

											{/* Certificate Info */}
											<div className="p-5 md:p-6">
												<h3 className="text-[16px] md:text-[18px] font-bold text-gray-900 mb-2 leading-tight line-clamp-2">
													{certificate.Course?.title || 'Kelas'}
												</h3>
												<div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
													<span>
														{new Date(certificate.issued_at).toLocaleDateString('id-ID', {
															day: 'numeric',
															month: 'long',
															year: 'numeric'
														})}
													</span>
												</div>
												{certificate.certificate_url ? (
													<button
														onClick={() => {
															// Download certificate
															const link = document.createElement('a');
															link.href = certificate.certificate_url || '';
															link.download = `sertifikat-${certificate.Course?.title || 'course'}.pdf`;
															link.target = '_blank';
															document.body.appendChild(link);
															link.click();
															document.body.removeChild(link);
														}}
														className="inline-block text-[14px] md:text-[16px] font-semibold text-[#661FFF] hover:text-[#5518CC] underline transition-colors"
													>
														Download Sertifikat
													</button>
												) : (
													<span className="text-sm text-gray-500">Sertifikat sedang diproses</span>
												)}
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
