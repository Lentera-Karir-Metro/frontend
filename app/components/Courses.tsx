"use client";

import Image from 'next/image';
import { useEffect, useState } from 'react';

type LearningPath = {
  id: string;
  title: string;
  description?: string;
  price?: number;
  thumbnail_url?: string;
}

export default function Courses() {
	const [learningPaths, setLearningPaths] = useState<LearningPath[] | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const base = process.env.NEXT_PUBLIC_API_BASE || '';
		const url = `${base}/catalog/learning-paths`;

		let cancelled = false;

		const fetchData = async () => {
			setIsLoading(true);
			try {
				const res = await fetch(url);
				if (!res.ok) throw new Error(`Server returned ${res.status}`);
				const data = await res.json();
				if (!cancelled) setLearningPaths(data);
			} catch (err: any) {
				if (!cancelled) setError(err.message || 'Failed to load');
			} finally {
				if (!cancelled) setIsLoading(false);
			}
		};

		fetchData();
		return () => { cancelled = true };
	}, []);

	return (
		<section id="courses" className="relative bg-[#FAFAFA] py-16 md:py-20 lg:py-24 overflow-hidden">
			{/* Decorative circles - top right */}
			<div className="absolute top-8 right-0 w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rotate-180">
				<Image
					src="/images/polkadot.png"
					alt="Decorative Circle"
					fill
					className="object-cover"
				/>
			</div>

			{/* Decorative circles - bottom left */}
			<div className="absolute bottom-8 left-0 w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 rotate-90">
				<Image
					src="/images/polkadot-ungu-serong.png"
					alt="Decorative Circle Ungu"
					fill
					className="object-cover"
				/>
			</div>

			<div className="max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 relative z-10">
				{/* Header */}
				<div className="mb-12 md:mb-16">
					<h3 className="text-[#661FFF] text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px] 2xl:text-[28px] font-semibold mb-2 sm:mb-3 md:mb-4">
						Our Courses
					</h3>
					<h2 className="text-[32px] sm:text-[36px] md:text-[40px] lg:text-[44px] font-bold text-gray-900 mb-3 md:mb-4 leading-[1.2]">
						Kelas Unggulan dari Lentera Karir
					</h2>
					<p className="text-gray-700 text-[15px] md:text-[16px] lg:text-[17px] leading-[1.6] w-full whitespace-nowrap">
						Setiap kelas dirancang untuk membantumu tumbuh melalui praktik nyata, bukan sekadar teori.
					</p>
				</div>

				{/* Courses Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
					{isLoading && (
						<div className="col-span-full flex flex-col items-center justify-center py-16">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#661FFF] mb-4"></div>
							<p className="text-gray-500 text-lg">Memuat kelas...</p>
						</div>
					)}

					{error && (
						<div className="col-span-full flex flex-col items-center justify-center py-16">
							<svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<p className="text-red-500 text-lg font-semibold">Terjadi Kesalahan</p>
							<p className="text-gray-600 mt-2">{error}</p>
						</div>
					)}

					{!isLoading && !error && learningPaths && learningPaths.length === 0 && (
						<div className="col-span-full flex flex-col items-center justify-center py-16">
							<div className="bg-gray-100 rounded-full p-6 mb-4">
								<svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
								</svg>
							</div>
							<h3 className="text-gray-900 font-bold text-xl mb-2">Belum Ada Kelas Tersedia</h3>
							<p className="text-gray-600 text-center max-w-md">
								Kelas sedang dalam persiapan. Pantau terus halaman ini untuk update terbaru!
							</p>
						</div>
					)}

					{!isLoading && !error && learningPaths && learningPaths.slice(0, 4).map((lp) => (
						<div 
							key={lp.id} 
							className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100"
						>
							{/* Course Image */}
							<div className="relative w-full h-48 md:h-52 bg-gray-200">
								<Image
									src={lp.thumbnail_url || '/images/courses.png'}
									alt={lp.title}
									fill
									className="object-cover"
								/>
							</div>

							{/* Course Content */}
							<div className="p-5 md:p-6">

								{/* Title */}
								<h3 className="text-gray-900 font-bold text-base md:text-lg mb-2 leading-snug">
									{lp.title}
								</h3>

								{/* Price */}
								<p className="text-[#661FFF] font-semibold text-base md:text-lg mb-4">
									{lp.price ? `Rp${Number(lp.price).toLocaleString('id-ID')}` : 'Gratis'}
								</p>

								{/* Description intentionally hidden on this list page */}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
