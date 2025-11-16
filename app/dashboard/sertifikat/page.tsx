"use client";
import Image from 'next/image';
import DashboardNavbar from '../../components/DashboardNavbar';
import Footer from '../../components/Footer';
import { useState } from 'react';

export default function SertifikatPage() {
	const [searchQuery, setSearchQuery] = useState('');

	// Sample certificate data - replace with actual data from API
	const certificates = [
		{
			id: 1,
			title: 'Bootcamp: Kick-start Karier Digital',
			image: '/images/dashboard.png',
			viewLink: '#'
		},
		{
			id: 2,
			title: 'Bootcamp: Kick-start Karier Digital',
			image: '/images/dashboard.png',
			viewLink: '#'
		}
	];

	const filteredCertificates = certificates.filter(cert => 
		cert.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="min-h-screen flex flex-col">
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
						<div className="flex flex-col sm:flex-row gap-4">
							<div className="flex-grow relative">
								<input
									type="text"
									placeholder="Cari Sertifikat"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="w-full px-6 py-4 rounded-full border-2 border-[#661FFF] focus:outline-none focus:ring-2 focus:ring-[#661FFF] text-gray-700 placeholder-gray-400"
								/>
							</div>
							<button className="bg-[#661FFF] text-white px-12 py-4 rounded-full font-semibold hover:bg-[#5518CC] transition-colors whitespace-nowrap">
								Search
							</button>
						</div>
					</div>
				</section>

				{/* Certificate Cards Section */}
				<section className="py-8 md:py-12 bg-white">
					<div className="max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
						{filteredCertificates.length === 0 ? (
							<div className="text-center py-12">
								<p className="text-gray-600 text-lg">Tidak ada sertifikat ditemukan</p>
							</div>
						) : (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
								{filteredCertificates.map((certificate) => (
									<div
										key={certificate.id}
										className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-200"
									>
										{/* Certificate Image */}
										<div className="relative w-full h-48 md:h-56 bg-gray-100 p-4">
											<Image
												src={certificate.image}
												alt={certificate.title}
												fill
												className="object-contain p-2"
											/>
										</div>

										{/* Certificate Info */}
										<div className="p-5 md:p-6">
											<h3 className="text-[16px] md:text-[18px] font-bold text-gray-900 mb-3 leading-tight">
												{certificate.title}
											</h3>
											<a
												href={certificate.viewLink}
												className="text-[14px] md:text-[16px] font-semibold text-[#661FFF] hover:text-[#5518CC] underline transition-colors"
											>
												Lihat Sertifikat
											</a>
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
	);
}
