"use client";
import Image from 'next/image';
import Link from 'next/link';
import DashboardNavbar from '../../components/DashboardNavbar';
import Footer from '../../components/Footer';
import { useParams } from 'next/navigation';

// Data artikel lengkap (nantinya bisa dari API)
const articlesData: any = {
	"1": {
		id: 1,
		title: "Panduan Pemula SEO: Menguasai Keyword Research dan On-Page SEO dalam 7 Hari",
		releaseDate: "Released date March 2025",
		image: "/images/courses.png",
		intro: "Panduan ini adalah road map praktis 7 hari untuk menguasai fondasi SEO (Optimasi Mesin Pencari) agar Anda dapat mendatangkan lebih banyak traffic berkualitas ke website Anda.",
		sections: [
			{
				title: "FASE 1: Riset Kata Kunci (Keyword Research)",
				subtitle: "Fokus pada menemukan keywords yang tepat untuk target audiens Anda.",
				days: [
					{
						day: "Hari 1: Identifikasi dan Nilai Pencarian (Search Intent)",
						points: [
							"Tentukan Seed Keywords: Buat daftar 5-10 kata yang relevan dengan bisnis atau topik Anda (misaknya: \"cara membuat kopi\", \"resep kopi viral\").",
							"Klasifikasi Nilai: Pahami inti dari balik setiap kata kunci (Informasional, Navigasi, Komersial, Transaksional). Pilih kata kunci yang relevan dengan konten Anda."
						]
					},
					{
						day: "Hari 2: Eksplorasi Data dan Kompetitor",
						points: [
							"Gunakan Google Keyword Planner atau Google Keyword Planner untuk mendapatkan data Volume Pencarian bulanan dan tingkat persaingan (kesulitan).",
							"Cari Long-Tail Keywords: Kembangkan kata kunci menjadi frasa lebih panjang dan spesifik (misaknya: \"resep kopi viral tanpa mesin espresso\"). Ini memiliki persaingan yang lebih rendah."
						]
					},
					{
						day: "Hari 3: Pemetaan Konten (Content Mapping)",
						points: [
							"Pillar Konten: Kelompokkan kata kunci Anda ke dalam tema besar (misaknya, Pillar: Tutorial Kopi).",
							"Perusakan Kata Kunci: Tetapkan satu Kata Kunci utama (Primary Keyword) untuk setiap artikel.",
							"Buat spreadsheet sederhana dengan kolom: [kata kunci] [Search Volume] [Keyword Difficulty] [halaman tujuan] dan beri artikel agar konten lebih mendalam."
						]
					}
				]
			},
			{
				title: "FASE 2: Optimasi di Halaman (On-Page SEO)",
				subtitle: "Fokus pada struktur dan konten Anda agar mudah dipahami: Google.",
				days: [
					{
						day: "Hari 4: Optimasi Metadata Kunci",
						points: [
							"Metadata adalah \"pamanasan\" konten Anda di hasil pencarian (SERP).",
							"Title Tag: Sertakan Primary Keyword di awal.",
							"Masukkan Primary Keyword di awal.",
							"Maksimum 60 karakter agar tidak terpotong.",
							"Tambahkan daya tarik (Clickbait positif! sebutri: \"Terbaik\", \"Lengkap\").",
							"Meta Description (Deskripsi Singkat):",
							"Panjang ideal: ~150-160 karakter.",
							"Sertakan Primary Keyword secara alami.",
							"Sertakan Call-to-Action bernyawa (CTA lembu!)."
						]
					},
					{
						day: "Hari 5: Struktura Konten dan Keterbacaan (Readability)",
						points: [
							"Heading Tags (H1, H2, H3): Hanya gunakan satu H1 (di halaman, pastikan menggabungkan Primary Keyword. Gunakan H2 dan H3 untuk membuat sub-judul dan memperjelas Secondary Keywords.",
							"Gunakan Paragraf Pendek: Pastikan konten mudah dibaca oleh manusia.",
							"Bullet Points dan List: Gunakan daftar seperti ini untuk memecah teks dan menyajikan Secondary Keywords."
						]
					}
				]
			},
			{
				title: "FASE 3: Tindak Lanjut",
				days: [
					{
						day: "Hari 7: Tinjauan Akhir dan Penerbitan",
						points: [
							"1. Checklist: Pastikan semua elemen On-Page (metadata, heading, Alt Text, linking).",
							"2. Publish: Publikasikan konten Anda!",
							"3. Langkah Selanjutnya (Off-Page SEO): Setelah diterbitkan, fokus Anda selanjutnya adalah membangun otoritas melalui backlinks, promosi konten, dan lain-lain."
						]
					}
				]
			}
		],
		waitWhat: {
			title: "Tunggu apa lagi?",
			content: "Stop membuang waktu dengan tutorial yang tak potong sotongl. Ide bague Anda butuh traffic organik yang stabil!\n\nLentera Karir menyediakan Kelas SEO Berkualitas yang dirancang untuk membantu website atau konten Anda ke Halaman 1 Google. Kelas ini memandu Anda secara sistematis, dari menemukan Kata Kunci Tepat hingga teknik Optimasi Metadata yang diakui Google.\n\nSekarang gihran kamu untuk ambil tindakan. Semangat!"
		}
	}
};

// Data kursus terkait
const relatedCourses = [
	{
		id: 1,
		title: "Bootcamp: Kick-Start Karier Digital",
		price: "Rp250.000",
		rating: 4.5,
		reviews: 956,
		image: "/images/courses.png"
	},
	{
		id: 2,
		title: "Bootcamp: Kick-Start Karier Digital",
		price: "Rp250.000",
		rating: 4.5,
		reviews: 956,
		image: "/images/courses.png"
	}
];

export default function ArticleDetailPage() {
	const params = useParams();
	const articleId = params.id as string;
	const article = articlesData[articleId];

	if (!article) {
		return (
			<div className="min-h-screen flex flex-col bg-white">
				<DashboardNavbar />
				<main className="flex-grow flex items-center justify-center">
					<div className="text-center">
						<h1 className="text-2xl font-bold text-gray-900 mb-4">Artikel tidak ditemukan</h1>
						<Link href="/article" className="text-[#661FFF] hover:underline">
							Kembali ke daftar artikel
						</Link>
					</div>
				</main>
				<Footer />
			</div>
		);
	}

	return (
		<div className="min-h-screen flex flex-col bg-white">
			<DashboardNavbar />

			{/* Main Content */}
			<main className="flex-grow">
				{/* Article Header */}
				<section className="bg-white py-8 md:py-12 lg:py-16">
					<div className="max-w-[900px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
						{/* Title */}
						<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
							{article.title}
						</h1>

						{/* Release Date */}
						<div className="flex items-center gap-2 text-gray-600 mb-8">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<span className="text-sm md:text-base">{article.releaseDate}</span>
						</div>

						{/* Featured Image */}
						<div className="w-full h-64 md:h-80 lg:h-96 relative rounded-2xl overflow-hidden mb-8 bg-gray-200">
							<Image
								src={article.image}
								alt={article.title}
								fill
								className="object-cover"
							/>
						</div>

						{/* Article Content */}
						<div className="prose prose-lg max-w-none">
							{/* Intro */}
							<p className="text-gray-700 text-base md:text-lg leading-relaxed mb-8">
								{article.intro}
							</p>

							{/* Sections */}
							{article.sections.map((section: any, sectionIdx: number) => (
								<div key={sectionIdx} className="mb-10">
									<h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
										{section.title}
									</h2>
									{section.subtitle && (
										<p className="text-gray-700 text-base md:text-lg mb-6">
											{section.subtitle}
										</p>
									)}

									{/* Days */}
									{section.days.map((day: any, dayIdx: number) => (
										<div key={dayIdx} className="mb-6">
											<h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
												{day.day}
											</h3>
											<ul className="list-none space-y-3 ml-0">
												{day.points.map((point: string, pointIdx: number) => (
													<li key={pointIdx} className="text-gray-700 text-sm md:text-base leading-relaxed pl-6 relative before:content-['•'] before:absolute before:left-0 before:text-[#661FFF] before:font-bold">
														{point}
													</li>
												))}
											</ul>
										</div>
									))}
								</div>
							))}

							{/* Wait What Section */}
							{article.waitWhat && (
								<div className="bg-gray-50 p-6 md:p-8 rounded-2xl mb-10">
									<h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
										{article.waitWhat.title}
									</h2>
									<div className="text-gray-700 text-base md:text-lg leading-relaxed whitespace-pre-line">
										{article.waitWhat.content}
									</div>
								</div>
							)}
						</div>
					</div>
				</section>

				{/* Related Courses Section */}
				<section className="bg-gray-50 py-12 md:py-16">
					<div className="max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
						<h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
							Pelajari Selengkapnya
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
							{relatedCourses.map((course) => (
								<Link
									key={course.id}
									href={`/course/${course.id}`}
									className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
								>
									{/* Course Image */}
									<div className="relative h-48 md:h-56 bg-gray-200">
										<Image
											src={course.image}
											alt={course.title}
											fill
											className="object-cover"
										/>
									</div>

									{/* Course Info */}
									<div className="p-5">
										<h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">
											{course.title}
										</h3>
										<div className="flex items-center justify-between">
											<span className="text-[#661FFF] font-bold text-lg">
												{course.price}
											</span>
											<div className="flex items-center gap-2">
												<div className="flex">
													{[...Array(5)].map((_, i) => (
														<svg
															key={i}
															className={`w-4 h-4 ${
																i < Math.floor(course.rating)
																	? 'text-yellow-400 fill-current'
																	: 'text-gray-300 fill-current'
															}`}
															viewBox="0 0 20 20"
														>
															<path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
														</svg>
													))}
												</div>
												<span className="text-sm text-gray-600">({course.reviews})</span>
											</div>
										</div>
									</div>
								</Link>
							))}
						</div>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
}
