"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardNavbar from '../components/DashboardNavbar';
import Footer from '../components/Footer';

type Article = {
	id: number;
	title: string;
	content: string;
	thumbnail_url: string | null;
	author: string;
	category: string;
	createdAt: string;
	updatedAt: string;
}

export default function ArticlePage() {
	const [articles, setArticles] = useState<Article[]>([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [visibleCount, setVisibleCount] = useState(4);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [totalArticles, setTotalArticles] = useState(0);
	const [allArticles, setAllArticles] = useState<Article[]>([]); // Store all articles
	const [filteredArticles, setFilteredArticles] = useState<Article[]>([]); // Filtered results

	useEffect(() => {
		fetchArticles();
	}, []);

	// Real-time search filter
	useEffect(() => {
		if (!searchQuery.trim()) {
			setFilteredArticles(allArticles);
			setArticles(allArticles);
			return;
		}

		const query = searchQuery.toLowerCase().trim();
		const filtered = allArticles.filter(article => 
			article.title.toLowerCase().includes(query) ||
			article.content.toLowerCase().includes(query) ||
			article.author.toLowerCase().includes(query) ||
			article.category.toLowerCase().includes(query)
		);

		setFilteredArticles(filtered);
		setArticles(filtered);
		setVisibleCount(4); // Reset visible count when filtering
	}, [searchQuery, allArticles]);

	const fetchArticles = async (search = '') => {
		try {
			setIsLoading(true);
			setError(null);
			const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
			
			// Build query parameters
			const params = new URLSearchParams();
			params.append('limit', '100');
			if (search && search.trim()) {
				params.append('search', search.trim());
			}
			
			const response = await fetch(`${baseUrl}/articles?${params.toString()}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				}
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || 'Failed to fetch articles');
			}

			const data = await response.json();
			
			if (data.success && data.data) {
				setAllArticles(data.data); // Store all articles
				setArticles(data.data);
				setFilteredArticles(data.data);
				setTotalArticles(data.pagination?.total || data.data.length);
			} else {
				throw new Error('Invalid response format');
			}
		} catch (err: any) {
			setError(err.message || 'Failed to load articles');
			console.error('Error fetching articles:', err);
		} finally {
			setIsLoading(false);
		}
	};
    
	const itemVariants = {
		hidden: { opacity: 0, y: 12 },
		visible: { opacity: 1, y: 0 }
	};

	const visibleArticles = articles.slice(0, visibleCount);

	const handleLoadMore = () => {
		setVisibleCount((prev) => Math.min(prev + 4, articles.length));
	};

	const handleClearSearch = () => {
		setSearchQuery('');
		setVisibleCount(4);
	};

	// Get excerpt from content (first 200 characters)
	const getExcerpt = (content: string, maxLength = 200) => {
		const plainText = content.replace(/[#*\n]/g, ' ').replace(/\s+/g, ' ').trim();
		return plainText.length > maxLength 
			? plainText.substring(0, maxLength) + '...' 
			: plainText;
	};

	// Highlight search term in text
	const highlightText = (text: string, highlight: string): React.ReactNode => {
		if (!highlight.trim()) {
			return text;
		}
		
		try {
			// Escape special regex characters
			const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			const regex = new RegExp(`(${escapedHighlight})`, 'gi');
			const parts = text.split(regex);
			
			return parts.map((part, index) => 
				regex.test(part) ? (
					<mark key={index} className="bg-yellow-200 text-gray-900 font-semibold">
						{part}
					</mark>
				) : (
					<span key={index}>{part}</span>
				)
			);
		} catch (error) {
			// If regex fails, return original text
			return text;
		}
	};

	return (
		<div className="min-h-screen flex flex-col bg-white">
			<DashboardNavbar />

			{/* Main Content */}
			<main className="flex-grow">
				{/* Hero Section */}
				<section className="bg-white py-12 md:py-16 lg:py-20">
					<div className="max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
						<div className="text-center mb-8 md:mb-12">
							<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
								Article & Tips
							</h1>
							<p className="text-gray-600 text-base md:text-lg max-w-3xl mx-auto">
								Tingkatkan pengetahuan dan insight dengan berbagai artikel dari Lentera Karir
							</p>
						</div>

						{/* Search Bar */}
						<div className="max-w-3xl mx-auto mb-12 md:mb-16">
							<div className="relative">
								{/* Search Icon */}
								<div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
									</svg>
								</div>

								<input
									type="text"
									placeholder="Cari artikel berdasarkan judul, konten, kategori, atau author..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="w-full pl-14 pr-14 py-4 md:py-5 border-2 border-[#661FFF] rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#5518CC] focus:ring-2 focus:ring-[#661FFF] focus:ring-opacity-20 text-sm md:text-base transition-all"
								/>

								{/* Clear Button */}
								{searchQuery && (
									<button
										onClick={handleClearSearch}
										className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
										title="Clear search"
									>
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
										</svg>
									</button>
								)}
							</div>
							
							{/* Search Results Info */}
							{searchQuery && (
								<motion.div 
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									className="mt-4 text-center"
								>
									<p className="text-gray-600 text-sm">
										{articles.length > 0 
											? `Menampilkan ${articles.length} artikel dari ${totalArticles} artikel`
											: `Tidak ada artikel ditemukan untuk "${searchQuery}"`
										}
									</p>
								</motion.div>
							)}
						</div>

						{/* Loading State */}
						{isLoading && (
							<div className="flex justify-center items-center py-20">
								<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#661FFF]"></div>
							</div>
						)}

						{/* Error State */}
						{error && (
							<div className="text-center py-12">
								<p className="text-red-500 mb-4">{error}</p>
								<button
									onClick={() => fetchArticles()}
									className="px-6 py-2 bg-[#661FFF] text-white rounded-full hover:bg-[#5518CC] transition-colors"
								>
									Coba Lagi
								</button>
							</div>
						)}

						{/* Articles Grid */}
						{!isLoading && !error && (
							<>
								{articles.length === 0 ? (
									<div className="text-center py-12">
										<p className="text-gray-500 text-lg">Tidak ada artikel ditemukan</p>
									</div>
								) : (
									<>
										<div className="space-y-8 md:space-y-12">
											<AnimatePresence initial={false}>
												{visibleArticles.map((article, idx) => (
													<motion.div
														key={article.id}
														layout
														initial="hidden"
														animate="visible"
														exit={{ opacity: 0, y: 8 }}
														variants={itemVariants}
														transition={{ duration: 0.35, delay: idx * 0.03 }}
													>
														<Link
															href={`/article/${article.id}`}
															className="flex flex-col md:flex-row gap-6 pb-8 md:pb-12 border-b border-gray-200 last:border-b-0 hover:opacity-80 transition-opacity cursor-pointer"
														>
															{/* Image */}
															<div className="w-full md:w-64 lg:w-80 h-48 md:h-40 lg:h-44 relative flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
																<Image
																	src={article.thumbnail_url || '/images/dashboard.png'}
																	alt={article.title}
																	fill
																	className="object-cover"
																/>
															</div>

															{/* Content */}
															<div className="flex-1">
																<div className="flex items-center gap-3 mb-2">
																	<span className="inline-block px-3 py-1 bg-purple-100 text-[#661FFF] text-xs font-semibold rounded-full">
																		{article.category}
																	</span>
																	<span className="text-sm text-gray-500">
																		By {article.author}
																	</span>
																</div>
																<h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 leading-tight">
																	{searchQuery ? highlightText(article.title, searchQuery) : article.title}
																</h3>
																<p className="text-gray-600 text-sm md:text-base leading-relaxed">
																	{searchQuery ? highlightText(getExcerpt(article.content), searchQuery) : getExcerpt(article.content)}
																</p>
															</div>
														</Link>
													</motion.div>
												))}
											</AnimatePresence>
										</div>

										{/* Load More Button */}
										{visibleCount < articles.length && (
											<div className="text-center mt-12 md:mt-16">
												<button 
													onClick={handleLoadMore} 
													className="px-8 md:px-12 py-3 md:py-4 border-2 border-[#661FFF] text-[#661FFF] rounded-full hover:bg-[#661FFF] hover:text-white transition-colors font-medium text-sm md:text-base"
												>
													Lihat Artikel Lainnya
												</button>
											</div>
										)}

										{visibleCount >= articles.length && articles.length > 0 && (
											<div className="text-center mt-12 md:mt-16 text-gray-500">
												Tidak ada artikel lagi
											</div>
										)}
									</>
								)}
							</>
						)}
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
}
