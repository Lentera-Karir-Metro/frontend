"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DashboardNavbar from '@/app/components/DashboardNavbar';
import Footer from '@/app/components/Footer';

type Course = {
	id: string;
	title: string;
	description?: string;
	price: number;
	thumbnail_url?: string;
	discount_amount?: number;
	category: string;
	level?: string;
	mentor_name?: string;
	mentor_title?: string;
	mentor_photo_profile?: string;
}

export default function ExplorerPage() {
	const [selectedCategory, setSelectedCategory] = useState<string>('All');
	const [courses, setCourses] = useState<Course[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Fetch data from backend
	useEffect(() => {
		const fetchCourses = async () => {
			try {
				setIsLoading(true);
				const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
				const response = await fetch(`${baseUrl}/catalog/courses`);

				if (!response.ok) {
					throw new Error(`Failed to fetch: ${response.status}`);
				}

				const json = await response.json();
				// API returns { data: [...], pagination: {...} }
				const data = Array.isArray(json) ? json : (json.data || []);
				setCourses(data);
			} catch (err: any) {
				setError(err.message || 'Failed to load courses');
			} finally {
				setIsLoading(false);
			}
		};

		fetchCourses();
	}, []);

	// Popular Categories (use image icons)
	const categories = [
		{ id: 1, name: 'Programming', category: 'Technology', icon: '/images/cv.png', alt: 'Programming icon' },
		{ id: 2, name: 'Design', category: 'Design', icon: '/images/design.png', alt: 'Design icon' },
		{ id: 3, name: 'Marketing', category: 'Marketing', icon: '/images/marketing.png', alt: 'Marketing icon' },
	];

	// Get unique categories from data (exclude 'All' from course categories to prevent duplicates)
	const uniqueCategories: string[] = ['All', ...Array.from(new Set(
		(courses || [])
			.map((c: Course) => c.category)
			.filter((cat: string) => cat !== undefined && cat !== null && cat !== '' && cat !== 'All')
	))];

	// Filter and sort courses
	let filteredCourses = selectedCategory === 'All'
		? (courses || [])
		: (courses || []).filter((course: Course) => {
			// Handle Programming -> Technology mapping
			if (selectedCategory === 'Technology') {
				return course.category === 'Technology' || course.category === 'Programming';
			}
			return course.category === selectedCategory;
		});

	// Get top 3 for recommendations
	const recommendedCourses = [...(courses || [])].slice(0, 3);

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
										className={`flex items-center gap-4 px-6 py-4 rounded-full border transition-all shadow-sm ${isActive
											? 'bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 border-transparent shadow-lg'
											: 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-md'
											}`}
									>
										<div className={`flex items-center justify-center w-10 h-10 rounded-md flex-shrink-0 transition-all ${isActive ? 'bg-white/25 backdrop-blur-sm' : 'bg-gradient-to-br from-purple-50 to-indigo-50'
											}`}>
											<Image
												src={category.icon}
												alt={category.alt || category.name}
												width={20}
												height={20}
												className={`object-contain transition-all ${isActive ? 'brightness-0 invert' : ''}`}
											/>
										</div>
										<span className={`font-semibold text-base transition-all ${isActive ? 'text-white' : 'text-gray-900'
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
										className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:-translate-y-2 flex flex-col"
									>
										{/* Course Image */}
										<div className="relative w-full aspect-video bg-gray-100 overflow-hidden">
											<Image
												src={course.thumbnail_url || '/images/dashboard.png'}
												alt={course.title}
												fill
												className="object-cover transition-transform duration-500 group-hover:scale-105"
											/>
										</div>

										{/* Course Info */}
										<div className="p-5 flex flex-col flex-grow">
											<h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
												{course.title}
											</h3>
											<p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">
												{course.description || ''}
											</p>
											<div className="mt-auto">
												{course.mentor_name && (
													<div className="flex items-center gap-2 mb-3">
														{course.mentor_photo_profile && (
															<div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
																<Image
																	src={course.mentor_photo_profile}
																	alt={course.mentor_name}
																	width={32}
																	height={32}
																	className="object-cover w-full h-full"
																/>
															</div>
														)}
														<div>
															<p className="text-gray-800 text-sm font-medium">{course.mentor_name}</p>
															{course.mentor_title && (
																<p className="text-gray-500 text-xs">{course.mentor_title}</p>
															)}
														</div>
													</div>
												)}
												{course.discount_amount && course.discount_amount > 0 ? (
													<div className="flex items-center gap-2">
														<p className="text-gray-400 line-through text-sm">
															Rp{Number(course.price).toLocaleString('id-ID')}
														</p>
														<p className="text-[#661FFF] font-bold text-lg">
															Rp{Number(course.price - course.discount_amount).toLocaleString('id-ID')}
														</p>
													</div>
												) : (
													<p className="text-[#661FFF] font-bold text-lg">
														Rp{Number(course.price).toLocaleString('id-ID')}
													</p>
												)}
											</div>
										</div>
									</Link>
								))}
							</div>
						)}
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
										{uniqueCategories.map((category, index) => {
											// Check if this category should be selected
											// Handle Technology/Programming mapping
											const isChecked = selectedCategory === category ||
												(selectedCategory === 'Technology' && (category === 'Technology' || category === 'Programming'));

											return (
												<label
													key={category || `category-${index}`}
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
												className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:-translate-y-2 flex flex-col"
											>
												{/* Course Image */}
												<div className="relative w-full aspect-video bg-gray-100 overflow-hidden">
													<Image
														src={course.thumbnail_url || '/images/dashboard.png'}
														alt={course.title}
														fill
														className="object-cover transition-transform duration-500 group-hover:scale-105"
													/>
												</div>

												{/* Course Info */}
												<div className="p-5 flex flex-col flex-grow">
													<h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
														{course.title}
													</h3>
													<p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">
														{course.description || ''}
													</p>
													<div className="mt-auto">
														{course.mentor_name && (
															<div className="flex items-center gap-2 mb-3">
																{course.mentor_photo_profile && (
																	<div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
																		<Image
																			src={course.mentor_photo_profile}
																			alt={course.mentor_name}
																			width={32}
																			height={32}
																			className="object-cover w-full h-full"
																		/>
																	</div>
																)}
																<div>
																	<p className="text-gray-800 text-sm font-medium">{course.mentor_name}</p>
																	{course.mentor_title && (
																		<p className="text-gray-500 text-xs">{course.mentor_title}</p>
																	)}
																</div>
															</div>
														)}
														{course.discount_amount && course.discount_amount > 0 ? (
															<div className="flex items-center gap-2">
																<p className="text-gray-400 line-through text-sm">
																	Rp{Number(course.price).toLocaleString('id-ID')}
																</p>
																<p className="text-[#661FFF] font-bold text-lg">
																	Rp{Number(course.price - course.discount_amount).toLocaleString('id-ID')}
																</p>
															</div>
														) : (
															<p className="text-[#661FFF] font-bold text-lg">
																Rp{Number(course.price).toLocaleString('id-ID')}
															</p>
														)}
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
