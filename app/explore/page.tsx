"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DashboardNavbar from '@/app/components/DashboardNavbar';
import Footer from '@/app/components/Footer';

type LearningPath = {
	id: string;
	title: string;
	description?: string;
	price: number;
	thumbnail_url?: string;
	discount_amount?: number;
	rating: number;
	review_count: number;
	category: string;
	level?: string;
	mentor_name?: string;
	mentor_title?: string;
	mentor_avatar_url?: string;
}

export default function ExplorerPage() {
	const [selectedCategory, setSelectedCategory] = useState<string>('All');
	const [sortBy, setSortBy] = useState<string>('Baru Rilis');
	const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Fetch data from backend
	useEffect(() => {
		const fetchLearningPaths = async () => {
			try {
				setIsLoading(true);
				const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
				const response = await fetch(`${baseUrl}/catalog/learning-paths`);
				
				if (!response.ok) {
					throw new Error(`Failed to fetch: ${response.status}`);
				}

				const data = await response.json();
				setLearningPaths(data);
			} catch (err: any) {
				setError(err.message || 'Failed to load courses');
			} finally {
				setIsLoading(false);
			}
		};

		fetchLearningPaths();
	}, []);

	// Popular Categories (use image icons)
	const categories = [
		{ id: 1, name: 'Programming', category: 'Technology', icon: '/images/cv.png', alt: 'Programming icon' },
		{ id: 2, name: 'Design', category: 'Design', icon: '/images/design.png', alt: 'Design icon' },
		{ id: 3, name: 'Marketing', category: 'Marketing', icon: '/images/marketing.png', alt: 'Marketing icon' },
	];

	// Get unique categories from data
	const uniqueCategories = ['All', ...Array.from(new Set(learningPaths.map(lp => lp.category)))];

	// Filter and sort courses
	let filteredCourses = selectedCategory === 'All' 
		? learningPaths 
		: learningPaths.filter(course => {
			// Handle Programming -> Technology mapping
			if (selectedCategory === 'Technology') {
				return course.category === 'Technology' || course.category === 'Programming';
			}
			return course.category === selectedCategory;
		});

	// Apply sorting
	if (sortBy === 'Terpopuler') {
		filteredCourses = [...filteredCourses].sort((a, b) => b.review_count - a.review_count);
	}

	// Get top 3 for recommendations (highest rated)
	const recommendedCourses = [...learningPaths]
		.sort((a, b) => b.rating - a.rating)
		.slice(0, 3);

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
							{categories.map((category) => {
								const isActive = selectedCategory === category.category;
								return (
									<button
										key={category.id}
										onClick={() => setSelectedCategory(category.category)}
										className={`flex items-center gap-4 px-6 py-4 rounded-full border transition-all shadow-sm ${
											isActive 
												? 'bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 border-transparent shadow-lg' 
												: 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-md'
										}`}
									>
										<div className={`flex items-center justify-center w-10 h-10 rounded-md flex-shrink-0 transition-all ${
											isActive ? 'bg-white/25 backdrop-blur-sm' : 'bg-gradient-to-br from-purple-50 to-indigo-50'
										}`}>
											<Image 
												src={category.icon} 
												alt={category.alt || category.name} 
												width={20} 
												height={20} 
												className={`object-contain transition-all ${isActive ? 'brightness-0 invert' : ''}`}
											/>
										</div>
										<span className={`font-semibold text-base transition-all ${
											isActive ? 'text-white' : 'text-gray-900'
										}`}>
											{category.name}
										</span>
									</button>
								);
							})}
						</div>
					</div>

					{/* Rekomendasi Untukmu */}
					<div className="mb-12 md:mb-16">
						<h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
							Rekomendasi Untukmu
						</h2>
						{isLoading ? (
							<div className="flex justify-center py-12">
								<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#661FFF]"></div>
							</div>
						) : (
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
												src={course.thumbnail_url || '/images/dashboard.png'}
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
												Rp{Number(course.price).toLocaleString('id-ID')}
											</p>

											{/* Rating */}
											<div className="flex items-center gap-2">
												<div className="flex items-center gap-0.5">
													{[1, 2, 3, 4, 5].map((star) => {
														const rating = course.rating;
														const isFullStar = star <= Math.floor(rating);
														const isHalfStar = star === Math.ceil(rating) && rating % 1 >= 0.5;
														
														return (
															<svg
																key={star}
																className="w-4 h-4"
																viewBox="0 0 329.942 329.942"
																fill="none"
															>
																{isFullStar ? (
																	<path fill="#f7e84b" d="M329.208,126.666c-1.765-5.431-6.459-9.389-12.109-10.209l-95.822-13.922l-42.854-86.837 c-2.527-5.12-7.742-8.362-13.451-8.362c-5.71,0-10.925,3.242-13.451,8.362l-42.851,86.836l-95.825,13.922 c-5.65,0.821-10.345,4.779-12.109,10.209c-1.764,5.431-0.293,11.392,3.796,15.377l69.339,67.582L57.496,305.07 c-0.965,5.628,1.348,11.315,5.967,14.671c2.613,1.899,5.708,2.865,8.818,2.865c2.387,0,4.784-0.569,6.979-1.723l85.711-45.059 l85.71,45.059c2.208,1.161,4.626,1.714,7.021,1.723c8.275-0.012,14.979-6.723,14.979-15c0-1.152-0.13-2.275-0.376-3.352 l-16.233-94.629l69.339-67.583C329.501,138.057,330.972,132.096,329.208,126.666z" />
																) : isHalfStar ? (
																	<>
																		<defs>
																			<linearGradient id={`half-rec-${star}-${course.id}`}>
																				<stop offset="50%" stopColor="#f7e84b" />
																				<stop offset="50%" stopColor="#e5e7eb" />
																			</linearGradient>
																		</defs>
																		<path fill={`url(#half-rec-${star}-${course.id})`} d="M329.208,126.666c-1.765-5.431-6.459-9.389-12.109-10.209l-95.822-13.922l-42.854-86.837 c-2.527-5.12-7.742-8.362-13.451-8.362c-5.71,0-10.925,3.242-13.451,8.362l-42.851,86.836l-95.825,13.922 c-5.65,0.821-10.345,4.779-12.109,10.209c-1.764,5.431-0.293,11.392,3.796,15.377l69.339,67.582L57.496,305.07 c-0.965,5.628,1.348,11.315,5.967,14.671c2.613,1.899,5.708,2.865,8.818,2.865c2.387,0,4.784-0.569,6.979-1.723l85.711-45.059 l85.71,45.059c2.208,1.161,4.626,1.714,7.021,1.723c8.275-0.012,14.979-6.723,14.979-15c0-1.152-0.13-2.275-0.376-3.352 l-16.233-94.629l69.339-67.583C329.501,138.057,330.972,132.096,329.208,126.666z" />
																	</>
																) : (
																	<path fill="#e5e7eb" d="M329.208,126.666c-1.765-5.431-6.459-9.389-12.109-10.209l-95.822-13.922l-42.854-86.837 c-2.527-5.12-7.742-8.362-13.451-8.362c-5.71,0-10.925,3.242-13.451,8.362l-42.851,86.836l-95.825,13.922 c-5.65,0.821-10.345,4.779-12.109,10.209c-1.764,5.431-0.293,11.392,3.796,15.377l69.339,67.582L57.496,305.07 c-0.965,5.628,1.348,11.315,5.967,14.671c2.613,1.899,5.708,2.865,8.818,2.865c2.387,0,4.784-0.569,6.979-1.723l85.711-45.059 l85.71,45.059c2.208,1.161,4.626,1.714,7.021,1.723c8.275-0.012,14.979-6.723,14.979-15c0-1.152-0.13-2.275-0.376-3.352 l-16.233-94.629l69.339-67.583C329.501,138.057,330.972,132.096,329.208,126.666z" />
																)}
															</svg>
														);
													})}
												</div>
												<span className="text-sm text-gray-600">({course.review_count})</span>
											</div>
										</div>
									</Link>
								))}
							</div>
						)}
					</div>					{/* Cari Berbagai Kelas di Lentera Karir Sesuai Minat Kamu */}
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
										{uniqueCategories.map((category) => {
											// Check if this category should be selected
											// Handle Technology/Programming mapping
											const isChecked = selectedCategory === category || 
												(selectedCategory === 'Technology' && (category === 'Technology' || category === 'Programming'));
											
											return (
												<label
													key={category}
													className="flex items-center gap-3 cursor-pointer"
												>
													<input
														type="checkbox"
														checked={isChecked}
														onChange={() => setSelectedCategory(category)}
														className="w-4 h-4 text-[#661FFF] border-gray-300 rounded focus:ring-[#661FFF]"
													/>
													<span className="text-gray-700">{category}</span>
												</label>
											);
										})}
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
								{isLoading ? (
									<div className="flex justify-center py-12">
										<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#661FFF]"></div>
									</div>
								) : error ? (
									<div className="text-center py-12">
										<p className="text-red-500">{error}</p>
									</div>
								) : filteredCourses.length === 0 ? (
									<div className="text-center py-12">
										<p className="text-gray-500">Tidak ada kelas ditemukan</p>
									</div>
								) : (
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
														src={course.thumbnail_url || '/images/dashboard.png'}
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
														Rp{Number(course.price).toLocaleString('id-ID')}
													</p>

													{/* Rating */}
													<div className="flex items-center gap-2">
														<div className="flex items-center gap-0.5">
															{[1, 2, 3, 4, 5].map((star) => {
																const rating = course.rating;
																const isFullStar = star <= Math.floor(rating);
																const isHalfStar = star === Math.ceil(rating) && rating % 1 >= 0.5;
																
																return (
																	<svg
																		key={star}
																		className="w-4 h-4"
																		viewBox="0 0 329.942 329.942"
																		fill="none"
																	>
																		{isFullStar ? (
																			<path fill="#f7e84b" d="M329.208,126.666c-1.765-5.431-6.459-9.389-12.109-10.209l-95.822-13.922l-42.854-86.837 c-2.527-5.12-7.742-8.362-13.451-8.362c-5.71,0-10.925,3.242-13.451,8.362l-42.851,86.836l-95.825,13.922 c-5.65,0.821-10.345,4.779-12.109,10.209c-1.764,5.431-0.293,11.392,3.796,15.377l69.339,67.582L57.496,305.07 c-0.965,5.628,1.348,11.315,5.967,14.671c2.613,1.899,5.708,2.865,8.818,2.865c2.387,0,4.784-0.569,6.979-1.723l85.711-45.059 l85.71,45.059c2.208,1.161,4.626,1.714,7.021,1.723c8.275-0.012,14.979-6.723,14.979-15c0-1.152-0.13-2.275-0.376-3.352 l-16.233-94.629l69.339-67.583C329.501,138.057,330.972,132.096,329.208,126.666z" />
																		) : isHalfStar ? (
																			<>
																				<defs>
																					<linearGradient id={`half-flt-${star}-${course.id}`}>
																						<stop offset="50%" stopColor="#f7e84b" />
																						<stop offset="50%" stopColor="#e5e7eb" />
																					</linearGradient>
																				</defs>
																				<path fill={`url(#half-flt-${star}-${course.id})`} d="M329.208,126.666c-1.765-5.431-6.459-9.389-12.109-10.209l-95.822-13.922l-42.854-86.837 c-2.527-5.12-7.742-8.362-13.451-8.362c-5.71,0-10.925,3.242-13.451,8.362l-42.851,86.836l-95.825,13.922 c-5.65,0.821-10.345,4.779-12.109,10.209c-1.764,5.431-0.293,11.392,3.796,15.377l69.339,67.582L57.496,305.07 c-0.965,5.628,1.348,11.315,5.967,14.671c2.613,1.899,5.708,2.865,8.818,2.865c2.387,0,4.784-0.569,6.979-1.723l85.711-45.059 l85.71,45.059c2.208,1.161,4.626,1.714,7.021,1.723c8.275-0.012,14.979-6.723,14.979-15c0-1.152-0.13-2.275-0.376-3.352 l-16.233-94.629l69.339-67.583C329.501,138.057,330.972,132.096,329.208,126.666z" />
																			</>
																		) : (
																			<path fill="#e5e7eb" d="M329.208,126.666c-1.765-5.431-6.459-9.389-12.109-10.209l-95.822-13.922l-42.854-86.837 c-2.527-5.12-7.742-8.362-13.451-8.362c-5.71,0-10.925,3.242-13.451,8.362l-42.851,86.836l-95.825,13.922 c-5.65,0.821-10.345,4.779-12.109,10.209c-1.764,5.431-0.293,11.392,3.796,15.377l69.339,67.582L57.496,305.07 c-0.965,5.628,1.348,11.315,5.967,14.671c2.613,1.899,5.708,2.865,8.818,2.865c2.387,0,4.784-0.569,6.979-1.723l85.711-45.059 l85.71,45.059c2.208,1.161,4.626,1.714,7.021,1.723c8.275-0.012,14.979-6.723,14.979-15c0-1.152-0.13-2.275-0.376-3.352 l-16.233-94.629l69.339-67.583C329.501,138.057,330.972,132.096,329.208,126.666z" />
																		)}
																	</svg>
																);
															})}
														</div>
														<span className="text-sm text-gray-600">({course.review_count})</span>
													</div>
												</div>
											</Link>
										))}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
}
