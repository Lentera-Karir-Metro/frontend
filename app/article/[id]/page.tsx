"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import DashboardNavbar from '@/app/components/DashboardNavbar';
import Footer from '@/app/components/Footer';

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

export default function ArticleDetailPage() {
	const params = useParams();
	const router = useRouter();
	const articleId = params?.id as string;

	const [article, setArticle] = useState<Article | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (articleId) {
			fetchArticle();
		}
	}, [articleId]);

	const fetchArticle = async () => {
		try {
			setIsLoading(true);
			setError(null);
			const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
			const response = await fetch(`${baseUrl}/articles/${articleId}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				}
			});

			if (!response.ok) {
				if (response.status === 404) {
					throw new Error('Artikel tidak ditemukan');
				}
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || 'Gagal memuat artikel');
			}

			const data = await response.json();
			
			if (data.success && data.data) {
				setArticle(data.data);
			} else {
				throw new Error('Invalid response format');
			}
		} catch (err: any) {
			setError(err.message || 'Gagal memuat artikel');
			console.error('Error fetching article:', err);
		} finally {
			setIsLoading(false);
		}
	};

	// Format date
	const formatDate = (dateString: string) => {
		const options: Intl.DateTimeFormatOptions = { 
			year: 'numeric', 
			month: 'long', 
			day: 'numeric' 
		};
		return new Date(dateString).toLocaleDateString('id-ID', options);
	};

	// Render markdown-like content
	const renderContent = (content: string) => {
		// Simple markdown parser
		const lines = content.split('\n');
		return lines.map((line, index) => {
			// Headers
			if (line.startsWith('### ')) {
				return <h3 key={index} className="text-xl font-bold text-gray-900 mt-8 mb-4">{line.replace('### ', '')}</h3>;
			}
			if (line.startsWith('## ')) {
				return <h2 key={index} className="text-2xl font-bold text-gray-900 mt-10 mb-4">{line.replace('## ', '')}</h2>;
			}
			if (line.startsWith('# ')) {
				return <h1 key={index} className="text-3xl font-bold text-gray-900 mt-12 mb-6">{line.replace('# ', '')}</h1>;
			}
			
			// Bold text with **
			if (line.includes('**')) {
				const parts = line.split('**');
				return (
					<p key={index} className="text-gray-700 leading-relaxed mb-4">
						{parts.map((part, i) => 
							i % 2 === 1 ? <strong key={i} className="font-bold text-gray-900">{part}</strong> : part
						)}
					</p>
				);
			}

			// Bullet points
			if (line.startsWith('- ')) {
				return <li key={index} className="text-gray-700 leading-relaxed ml-6 mb-2">{line.replace('- ', '')}</li>;
			}

			// Empty lines
			if (line.trim() === '') {
				return <div key={index} className="h-4"></div>;
			}

			// Regular paragraphs
			return <p key={index} className="text-gray-700 leading-relaxed mb-4">{line}</p>;
		});
	};

	if (isLoading) {
		return (
			<div className="min-h-screen flex flex-col bg-white">
				<DashboardNavbar />
				<main className="flex-grow flex items-center justify-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#661FFF]"></div>
				</main>
				<Footer />
			</div>
		);
	}

	if (error || !article) {
		return (
			<div className="min-h-screen flex flex-col bg-white">
				<DashboardNavbar />
				<main className="flex-grow flex items-center justify-center">
					<div className="text-center">
						<p className="text-red-500 mb-4">{error || 'Artikel tidak ditemukan'}</p>
						<button
							onClick={() => router.back()}
							className="px-6 py-2 bg-[#661FFF] text-white rounded-full hover:bg-[#5518CC] transition-colors"
						>
							Kembali
						</button>
					</div>
				</main>
				<Footer />
			</div>
		);
	}

	return (
		<div className="min-h-screen flex flex-col bg-white">
			<DashboardNavbar />

			<main className="flex-grow py-12 md:py-16">
				<article className="max-w-4xl mx-auto px-6 sm:px-8 md:px-12">
					{/* Back Button */}
					<button
						onClick={() => router.back()}
						className="flex items-center gap-2 text-[#661FFF] hover:text-[#5518CC] mb-8 font-medium transition-colors"
					>
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
						</svg>
						Kembali
					</button>

					{/* Category Badge */}
					<div className="mb-4">
						<span className="inline-block px-4 py-2 bg-purple-100 text-[#661FFF] text-sm font-semibold rounded-full">
							{article.category}
						</span>
					</div>

					{/* Title */}
					<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
						{article.title}
					</h1>

					{/* Meta Info */}
					<div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200">
						<div className="flex items-center gap-2">
							<svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
							</svg>
							<span className="text-gray-700 font-medium">{article.author}</span>
						</div>
						<span className="text-gray-400">•</span>
						<div className="flex items-center gap-2">
							<svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
							<span className="text-gray-700">{formatDate(article.createdAt)}</span>
						</div>
					</div>

					{/* Thumbnail */}
					{article.thumbnail_url && (
						<div className="relative w-full h-64 md:h-96 lg:h-[500px] mb-12 rounded-2xl overflow-hidden">
							<Image
								src={article.thumbnail_url}
								alt={article.title}
								fill
								className="object-cover"
								priority
							/>
						</div>
					)}

					{/* Content */}
					<div className="prose prose-lg max-w-none">
						{renderContent(article.content)}
					</div>

					{/* Share Section */}
					<div className="mt-12 pt-8 border-t border-gray-200">
						<p className="text-gray-600 mb-4">Bagikan artikel ini:</p>
						<div className="flex gap-3">
							<button className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
								</svg>
							</button>
							<button className="p-3 rounded-full bg-blue-400 text-white hover:bg-blue-500 transition-colors">
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
								</svg>
							</button>
							<button className="p-3 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors">
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
								</svg>
							</button>
						</div>
					</div>
				</article>
			</main>

			<Footer />
		</div>
	);
}
