"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DashboardNavbar from '@/app/components/DashboardNavbar';
import Footer from '@/app/components/Footer';

export default function ExplorerPage() {
	const [selectedCategory, setSelectedCategory] = useState<string>('All');
	const [sortBy, setSortBy] = useState<string>('Baru Rilis');

	// Popular Categories (use image icons)
	const categories = [
		{ id: 1, name: 'Interview & CV', icon: '/images/cv.png', alt: 'CV icon' },
		{ id: 2, name: 'Design', icon: '/images/design.png', alt: 'Design icon' },
		{ id: 3, name: 'Marketing', icon: '/images/marketing.png', alt: 'Marketing icon' },
	];

	// Filter Categories
	const filterCategories = [
		'All',
		'Design',
		'Programming',
		'Marketing',
		'Interview & CV',
	];

	// Sample course data
	const recommendedCourses = [
		{
			id: 1,
			title: 'Bootcamp: Kick-Start Karier Digital',
			price: 250000,
			rating: 5,
			reviews: 256,
			image: '/images/dashboard.png',
		},
		{
			id: 2,
			title: 'Bootcamp: Kick-Start Karier Digital',
			price: 250000,
			rating: 5,
			reviews: 256,
			image: '/images/dashboard.png',
		},
		{
			id: 3,
			title: 'Bootcamp: Kick-Start Karier Digital',
			price: 250000,
			rating: 5,
			reviews: 256,
			image: '/images/dashboard.png',
		},
	];

	// All courses for catalog
	const allCourses = Array(12).fill(null).map((_, idx) => ({
		id: idx + 1,
		title: 'Bootcamp: Kick-Start Karier Digital',
		price: 250000 + (idx * 10000),
		rating: 5,
		reviews: 256 + idx,
		image: '/images/dashboard.png',
	}));

	const filteredCourses = selectedCategory === 'All' 
		? allCourses 
		: allCourses.filter(course => course.title.toLowerCase().includes(selectedCategory.toLowerCase()));

	return (
		<div className="min-h-screen flex flex-col bg-gray-50">
			<DashboardNavbar />

			{/* Main Content */}
			<main className="flex-grow">
				<div className="max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-8 md:py-12">
					{/* Page Title */}
					<div className="mb-8 md:mb-12 max-w-2xl mx-auto text-center">
						<h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
							Explore Katalog Kelas
						</h1>
						<p className=" text-gray-600 text-base md:text-lg max-w-xl mx-auto">
							Lentera karir menyediakan berbagai kelas dengan kurikulum terbaru dan sesuai standar industri
						</p>
					</div>

					{/* Popular Category */}
					<div className="mb-12 md:mb-16">
						<h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
							Popular Category
						</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{categories.map((category) => (
										<button
											key={category.id}
											className="flex items-center gap-4 px-6 py-4 bg-white rounded-full border border-gray-200 hover:border-[#661FFF] transition-all shadow-sm"
										>
											<div className="flex items-center justify-center w-10 h-10 rounded-md bg-[#F6F0FF] flex-shrink-0">
												<Image src={category.icon} alt={category.alt || category.name} width={20} height={20} className="object-contain" />
											</div>
											<span className="font-semibold text-gray-900 text-base">{category.name}</span>
										</button>
									))}
						</div>
					</div>

					{/* Rekomendasi Untukmu */}
					<div className="mb-12 md:mb-16">
						<h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
							Rekomendasi Untukmu
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{recommendedCourses.map((course) => (
								<Link
									key={course.id}
									href={`/course/${course.id}`}
									className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-200"
								>
									{/* Course Image */}
									<div className="relative w-full h-48 bg-gray-200">
										<Image
											src={course.image}
											alt={course.title}
											fill
											className="object-cover"
										/>
									</div>

									{/* Course Info */}
									<div className="p-5">
										<h3 className="font-bold text-gray-900 mb-3 line-clamp-2">
											{course.title}
										</h3>
										<p className="text-[#661FFF] font-bold text-lg mb-3">
											Rp{course.price.toLocaleString('id-ID')}
										</p>

										{/* Rating */}
										<div className="flex items-center gap-2">
											<div className="flex items-center gap-0.5">
												{[1, 2, 3, 4, 5].map((star) => (
													<svg
														key={star}
														className="w-4 h-4"
														viewBox="0 0 329.942 329.942"
														fill="#f7e84b"
														>
															<path d="M329.208,126.666c-1.765-5.431-6.459-9.389-12.109-10.209l-95.822-13.922l-42.854-86.837 c-2.527-5.12-7.742-8.362-13.451-8.362c-5.71,0-10.925,3.242-13.451,8.362l-42.851,86.836l-95.825,13.922 c-5.65,0.821-10.345,4.779-12.109,10.209c-1.764,5.431-0.293,11.392,3.796,15.377l69.339,67.582L57.496,305.07 c-0.965,5.628,1.348,11.315,5.967,14.671c2.613,1.899,5.708,2.865,8.818,2.865c2.387,0,4.784-0.569,6.979-1.723l85.711-45.059 l85.71,45.059c2.208,1.161,4.626,1.714,7.021,1.723c8.275-0.012,14.979-6.723,14.979-15c0-1.152-0.13-2.275-0.376-3.352 l-16.233-94.629l69.339-67.583C329.501,138.057,330.972,132.096,329.208,126.666z" />
															</svg>
														))}
													</div>
													<span className="text-sm text-gray-600">({course.reviews})</span>
												</div>
											</div>
										</Link>
								))}
						</div>
					</div>

					{/* Cari Berbagai Kelas di Lentera Karir Sesuai Minat Kamu */}
					<div className="mb-8">
						<h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
							Cari Berbagai Kelas di Lentera Karir<br />Sesuai Minat Kamu
						</h2>

						<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
							{/* Left Sidebar - Filters */}
							<div className="lg:col-span-1">
								{/* Category Filter */}
								<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
									<h3 className="font-bold text-gray-900 mb-4">Category</h3>
									<div className="space-y-3">
										{filterCategories.map((category) => (
											<label
												key={category}
												className="flex items-center gap-3 cursor-pointer"
											>
												<input
													type="checkbox"
													checked={selectedCategory === category}
													onChange={() => setSelectedCategory(category)}
													className="w-4 h-4 text-[#661FFF] border-gray-300 rounded focus:ring-[#661FFF]"
												/>
												<span className="text-gray-700">{category}</span>
											</label>
										))}
									</div>
								</div>

								{/* Sort Filter */}
								<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
									<h3 className="font-bold text-gray-900 mb-4">Sort</h3>
									<div className="space-y-3">
										{['Baru Rilis', 'Terpopuler'].map((sort) => (
											<label
												key={sort}
												className="flex items-center gap-3 cursor-pointer"
											>
												<input
													type="checkbox"
													checked={sortBy === sort}
													onChange={() => setSortBy(sort)}
													className="w-4 h-4 text-[#661FFF] border-gray-300 rounded focus:ring-[#661FFF]"
												/>
												<span className="text-gray-700">{sort}</span>
											</label>
										))}
									</div>
								</div>
							</div>

							{/* Right Content - Course Grid */}
							<div className="lg:col-span-3">
								<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
									{filteredCourses.map((course) => (
										<Link
											key={course.id}
											href={`/course/${course.id}`}
											className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-200"
										>
											{/* Course Image */}
											<div className="relative w-full h-48 bg-gray-200">
												<Image
													src={course.image}
													alt={course.title}
													fill
													className="object-cover"
												/>
											</div>

											{/* Course Info */}
											<div className="p-5">
												<h3 className="font-bold text-gray-900 mb-3 line-clamp-2">
													{course.title}
												</h3>
												<p className="text-[#661FFF] font-bold text-lg mb-3">
													Rp{course.price.toLocaleString('id-ID')}
												</p>

												{/* Rating */}
												<div className="flex items-center gap-2">
													<div className="flex items-center gap-0.5">
														{[1, 2, 3, 4, 5].map((star) => (
															<svg
																key={star}
																className="w-4 h-4"
																viewBox="0 0 329.942 329.942"
																fill="#f7e84b"
															>
																<path d="M329.208,126.666c-1.765-5.431-6.459-9.389-12.109-10.209l-95.822-13.922l-42.854-86.837 c-2.527-5.12-7.742-8.362-13.451-8.362c-5.71,0-10.925,3.242-13.451,8.362l-42.851,86.836l-95.825,13.922 c-5.65,0.821-10.345,4.779-12.109,10.209c-1.764,5.431-0.293,11.392,3.796,15.377l69.339,67.582L57.496,305.07 c-0.965,5.628,1.348,11.315,5.967,14.671c2.613,1.899,5.708,2.865,8.818,2.865c2.387,0,4.784-0.569,6.979-1.723l85.711-45.059 l85.71,45.059c2.208,1.161,4.626,1.714,7.021,1.723c8.275-0.012,14.979-6.723,14.979-15c0-1.152-0.13-2.275-0.376-3.352 l-16.233-94.629l69.339-67.583C329.501,138.057,330.972,132.096,329.208,126.666z" />
															</svg>
														))}
													</div>
													<span className="text-sm text-gray-600">({course.reviews})</span>
												</div>
											</div>
										</Link>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
}
