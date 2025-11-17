"use client";
import Image from 'next/image';
import DashboardNavbar from '../../components/DashboardNavbar';
import { useState, useEffect } from 'react';
import { DashboardSkeleton } from '../../components/ui/Skeleton';

export default function EbookPage() {
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');

	useEffect(() => {
		const t = setTimeout(() => setIsLoading(false), 1000);
		return () => clearTimeout(t);
	}, []);

	if (isLoading) return <DashboardSkeleton />;

	// Sample ebook data - replace with actual data from API
	const ebooks = [
		{
			id: 1,
			title: 'Ebook Orientasi Karier Digital',
			image: '/images/dashboard.png',
			readLink: '#'
		},
		{
			id: 2,
			title: 'Ebook Asah Digital Mindset',
			image: '/images/dashboard.png',
			readLink: '#'
		}
	];

	const filteredEbooks = ebooks.filter(ebook => 
		ebook.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

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
						<div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
							<div className="flex-grow relative md:flex-grow-0 md:w-[420px]">
								<input
									type="text"
									placeholder="Cari Ebook"
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

				{/* Ebook Cards Section */}
				<section className="py-8 md:py-12 bg-white">
					<div className="max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
						{filteredEbooks.length === 0 ? (
							<div className="text-center py-12">
								<p className="text-gray-600 text-lg">Tidak ada ebook ditemukan</p>
							</div>
						) : (
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
								{filteredEbooks.map((ebook) => (
									<div
										key={ebook.id}
										className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-200 p-6"
									>
										<div className="flex items-center gap-4">
											{/* Ebook Image */}
											<div className="relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
												<Image
													src={ebook.image}
													alt={ebook.title}
													fill
													className="object-cover"
												/>
											</div>

											{/* Ebook Info */}
											<div className="flex-grow">
												<h3 className="text-[16px] md:text-[18px] font-bold text-gray-900 mb-3 leading-tight">
													{ebook.title}
												</h3>
												<a
													href={ebook.readLink}
													className="text-[14px] md:text-[16px] font-semibold text-[#661FFF] hover:text-[#5518CC] underline transition-colors"
												>
													Baca Sekarang
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
