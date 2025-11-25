"use client";
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardNavbar from '../components/DashboardNavbar';
import Footer from '../components/Footer';
import { useState } from 'react';

// Data artikel (bisa dipindahkan ke API nantinya)
const articles = [
	{ id: 1, title: "Panduan Pemula SEO: Menguasai Keyword Research dan On-Page SEO dalam 7 Hari", description: "Tutorial praktis, langkah demi langkah, tentang cara menggunakan tools dasar (seperti Google Keyword Planner) untuk menemukan kata kunci yang efektif dan cara mengimplementasikannya pada halaman web.", image: "/images/courses.png" },
	{ id: 2, title: "Metode STAR dan Framework Wawancara Lain yang Wajib Dikuasai Calon Product Manager", description: "Panduan praktik untuk menjawab pertanyaan wawancara teknis dan perilaku (behavioral), khususnya di posisi yang memerlukan pemecahan masalah dan kepemimpinan.", image: "/images/courses.png" },
	{ id: 3, title: "Mengenal Lebih Dekat Digital Mindset: Agility, Iterasi, dan Eksperimen Cepat", description: "Penjelasan filosofi ini dari level digital. Fokus pada perbedaan antara metodologi Agile vs. Waterfall dan pentingnya Continuous Learning.", image: "/images/courses.png" },
	{ id: 4, title: "Rahasia Portfolio 'Anti Gagal' yang Meloloskan Anda Wawancara di Startup Tier-1", description: "Analisis mendalam tentang elemen kunci dari Case Study yang 'unik' (menggabungkan kerangka PSI atau STAR), dengan fokus pada cara menyajikan dampak (impact) daripada hanya mendeskripsikan proses.", image: "/images/courses.png" },
	{ id: 5, title: "Cara Menulis CV yang Menarik untuk Product Manager", description: "Tips praktis untuk menonjolkan pengalaman dan hasil pada CV Anda.", image: "/images/courses.png" },
	{ id: 6, title: "Strategi Interview Teknis: Langkah-Langkah Persiapan", description: "Persiapan wawancara teknis untuk posisi yang membutuhkan problem solving cepat.", image: "/images/courses.png" },
	{ id: 7, title: "Membangun Portfolio dengan Case Study yang Berdampak", description: "Contoh struktur case study dan bagaimana menyajikan dampak secara jelas.", image: "/images/courses.png" },
	{ id: 8, title: "Growth Hacking untuk Produk Digital: Dasar dan Contoh", description: "Pendekatan growth untuk meningkatkan retensi dan akuisisi pengguna.", image: "/images/courses.png" },
	{ id: 9, title: "Membuat Roadmap Produk yang Realistis", description: "Panduan membuat roadmap produk yang komunikatif dan terukur.", image: "/images/courses.png" },
	{ id: 10, title: "Dasar-Dasar UX untuk Non-Designer", description: "Prinsip-prinsip UX yang perlu diketahui oleh product manager dan developer.", image: "/images/courses.png" },
	{ id: 11, title: "Analisis Kompetitor: Teknik yang Efektif", description: "Metode sederhana untuk menganalisis kompetitor dan merumuskan strategi.", image: "/images/courses.png" },
	{ id: 12, title: "Panduan cepat A/B Testing untuk Pemula", description: "Langkah-langkah menjalankan A/B test dan menginterpretasikan hasilnya.", image: "/images/courses.png" }
];

export default function ArticlePage() {
	const [searchQuery, setSearchQuery] = useState('');
	const [visibleCount, setVisibleCount] = useState(4);
    
	const itemVariants = {
		hidden: { opacity: 0, y: 12 },
		visible: { opacity: 1, y: 0 }
	};

	const visibleArticles = articles.slice(0, visibleCount);

	const handleLoadMore = () => {
		setVisibleCount((prev) => Math.min(prev + 4, articles.length));
	};

	const handleSearch = () => {
		// Implementasi search (bisa disambungkan ke API)
		console.log('Searching for:', searchQuery);
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
							<div className="flex gap-3">
								<div className="flex-1 relative">
									<input
										type="text"
										placeholder="Cari Kelas"
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
										className="w-full px-6 py-3 md:py-4 border-2 border-[#661FFF] rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#661FFF] text-sm md:text-base"
									/>
								</div>
								<button
									onClick={handleSearch}
									className="px-8 md:px-12 py-3 md:py-4 bg-[#661FFF] text-white rounded-full hover:bg-[#5518CC] transition-colors font-medium text-sm md:text-base"
								>
									Search
								</button>
							</div>
						</div>

						{/* Articles Grid */}
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
													src={article.image}
													alt={article.title}
													fill
													className="object-cover"
												/>
											</div>

											{/* Content */}
											<div className="flex-1">
												<h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 leading-tight">
													{article.title}
												</h3>
												<p className="text-gray-600 text-sm md:text-base leading-relaxed">
													{article.description}
												</p>
											</div>
										</Link>
									</motion.div>
								))}
							</AnimatePresence>
						</div>

						{/* Load More Button */}
						{visibleCount < articles.length ? (
							<div className="text-center mt-12 md:mt-16">
								<button onClick={handleLoadMore} className="px-8 md:px-12 py-3 md:py-4 border-2 border-[#661FFF] text-[#661FFF] rounded-full hover:bg-[#661FFF] hover:text-white transition-colors font-medium text-sm md:text-base">
									Lihat Artikel Lainnya
								</button>
							</div>
						) : (
							<div className="text-center mt-12 md:mt-16 text-gray-500">Tidak ada artikel lagi</div>
						)}
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
}
