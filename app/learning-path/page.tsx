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
    course_count?: number;
    thumbnail?: string;
    category?: string;
    createdAt?: string;
}

export default function LearningPathPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch learning paths from backend API
    useEffect(() => {
        const fetchLearningPaths = async () => {
            try {
                setIsLoading(true);
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
                const response = await fetch(`${baseUrl}/catalog/learning-paths?limit=50`);

                if (!response.ok) {
                    throw new Error('Failed to fetch learning paths');
                }

                const result = await response.json();
                setLearningPaths(result.data || []);
            } catch (error) {
                console.error('Error fetching learning paths:', error);
                setLearningPaths([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLearningPaths();
    }, []);

    // Filter learning paths based on search query
    const filteredPaths = learningPaths.filter(path =>
        path.title.toLowerCase().includes(searchQuery.toLowerCase())
    );


    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <DashboardNavbar />

            {/* Main Content */}
            <main className="flex-grow">
                <div className="max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-8 md:py-12">
                    {/* Page Title */}
                    <div className="mb-8 md:mb-12 max-w-2xl mx-auto text-center">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                            Learning Path
                        </h1>
                        <p className="text-gray-600 text-base md:text-lg max-w-xl mx-auto">
                            Kumpulan kelas untuk alur belajar yang lebih teratur
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-10 md:mb-12 flex justify-center">
                        <div className="flex w-full max-w-2xl">
                            <input
                                type="text"
                                placeholder="Cari Path..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-grow px-6 py-3 border-2 border-gray-200 rounded-l-full focus:outline-none focus:border-[#661FFF] text-gray-700 bg-white"
                            />
                            <button className="px-8 py-3 bg-[#661FFF] text-white font-semibold rounded-r-full hover:bg-[#5518d9] transition-colors">
                                Search
                            </button>
                        </div>
                    </div>

                    {/* Learning Path List */}
                    <div className="space-y-6">
                        {isLoading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#661FFF]"></div>
                            </div>
                        ) : filteredPaths.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500">Tidak ada learning path ditemukan</p>
                            </div>
                        ) : (
                            filteredPaths.map((path) => (
                                <Link
                                    key={path.id}
                                    href={`/learning-path/${path.id}`}
                                    className="block bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-2"
                                >
                                    <div className="flex flex-col md:flex-row gap-6">
                                        {/* Image */}
                                        <div className="relative w-full md:w-[240px] h-[200px] md:h-[160px] flex-shrink-0 rounded-2xl overflow-hidden">
                                            <Image
                                                src={path.thumbnail || '/images/dashboard.png'}
                                                alt={path.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-grow">
                                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                                {path.title}
                                            </h3>

                                            {/* Classes Badge */}
                                            <div className="flex gap-3 mb-3">
                                                <span className="px-4 py-1.5 border-2 border-[#661FFF] text-[#661FFF] text-sm font-medium rounded-full">
                                                    {path.course_count || 0} kelas
                                                </span>
                                            </div>

                                            {/* Description */}
                                            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                                                {path.description}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>

                    {/* Load More Button */}
                    <div className="mt-12 flex justify-center">
                        <button className="px-8 py-3 border-2 border-[#661FFF] text-[#661FFF] font-semibold rounded-full hover:bg-[#661FFF] hover:text-white transition-colors">
                            Lihat Path Lainnya
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
