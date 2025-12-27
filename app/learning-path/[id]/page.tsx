"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import DashboardNavbar from '@/app/components/DashboardNavbar';
import Footer from '@/app/components/Footer';

type Module = {
    id: string;
    title: string;
    sequence_order: number;
    video_url?: string;
    ebook_url?: string;
    quiz_id?: string;
}

type Course = {
    id: string;
    title: string;
    description?: string;
    category: string;
    mentor_name?: string;
    mentor_title?: string;
    thumbnail_url?: string;
    price?: number;
    discount_amount?: number;
    status?: string;
    modules?: Module[];
    LearningPathCourse?: {
        sequence_order: number;
    };
}

type LearningPath = {
    id: string;
    title: string;
    description?: string;
    createdAt?: string;
    courses: Course[];
}

export default function LearningPathDetailPage() {
    const params = useParams();
    const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch learning path detail from backend API
    useEffect(() => {
        const fetchLearningPathDetail = async () => {
            try {
                setIsLoading(true);
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
                const response = await fetch(`${baseUrl}/catalog/learning-paths/${params.id}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch learning path detail');
                }

                const result = await response.json();
                setLearningPath(result);
            } catch (error) {
                console.error('Error fetching learning path detail:', error);
                setLearningPath(null);
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) {
            fetchLearningPathDetail();
        }
    }, [params.id]);

    // Loading state
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

    // Not found state
    if (!learningPath) {
        return (
            <div className="min-h-screen flex flex-col bg-white">
                <DashboardNavbar />
                <main className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Learning Path tidak ditemukan</h1>
                        <Link href="/learning-path" className="text-[#661FFF] hover:underline">
                            Kembali ke Learning Path
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Get first course thumbnail as path thumbnail
    const pathThumbnail = learningPath.courses?.[0]?.thumbnail_url || '/images/dashboard.png';
    // Get category from first course
    const pathCategory = learningPath.courses?.[0]?.category || 'Course';


    return (
        <div className="min-h-screen flex flex-col bg-white">
            <DashboardNavbar />

            {/* Main Content */}
            <main className="flex-grow">
                {/* Hero Image - Single Banner */}
                <div className="w-full h-[180px] md:h-[220px] relative overflow-hidden">
                    <Image
                        src={pathThumbnail}
                        alt={learningPath.title}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                {/* Path Info Section - Unified Card */}
                <div className="max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 -mt-8 relative z-10">
                    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                            {/* Left Content */}
                            <div className="flex-grow">
                                <span className="inline-block px-3 py-1 bg-[#661FFF]/10 text-[#661FFF] text-sm font-semibold rounded-full mb-4">
                                    {pathCategory}
                                </span>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                                    {learningPath.title}
                                </h1>
                                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                                    {learningPath.description}
                                </p>
                            </div>

                            {/* Right - Details & Button */}
                            <div className="lg:w-[280px] flex-shrink-0 lg:border-l lg:border-gray-200 lg:pl-8">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Learning Path Details</h3>
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                        <span className="text-gray-700">{learningPath.courses?.length || 0} kelas terkait</span>
                                    </div>

                                </div>
                                <button className="w-full py-3 bg-[#661FFF] text-white font-semibold rounded-xl hover:bg-[#5518d9] transition-colors">
                                    Ikuti Path
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Course List Section */}
                <div className="max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-12">
                    {/* Section Header */}
                    <div className="flex items-center gap-3 mb-8">
                        <span className="text-lg font-bold text-gray-900">{learningPath.courses?.length || 0} KELAS</span>
                    </div>

                    {/* Timeline Course List */}
                    <div className="relative">
                        {/* Course Cards with Timeline */}
                        <div className="space-y-0">
                            {learningPath.courses.map((course, index) => {
                                // For demo: only first course is "active" (purple)
                                // In real app, this would be based on user's progress
                                const isActive = index === 0;

                                return (
                                    <div key={course.id} className="relative flex">
                                        {/* Timeline Column */}
                                        <div className="flex flex-col items-center mr-6">
                                            {/* Top Line (hidden for first item) */}
                                            <div className={`w-[2px] h-[50%] ${index === 0 ? 'bg-transparent' : 'bg-gray-300'}`} style={{ position: 'absolute', top: 0 }} />

                                            {/* Dot - Purple if active/current, gray if not - centered */}
                                            <div className={`w-5 h-5 rounded-full flex-shrink-0 ${isActive ? 'bg-[#661FFF]' : 'bg-gray-300'}`} style={{ marginTop: '60px' }} />

                                            {/* Bottom Line (hidden for last item) */}
                                            <div className={`w-[2px] flex-1 ${index === learningPath.courses.length - 1 ? 'bg-transparent' : 'bg-gray-300'}`} />
                                        </div>

                                        {/* Course Card */}
                                        <div className="flex-grow pb-6">
                                            <Link
                                                href={`/course/${course.id}`}
                                                className="block bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
                                            >
                                                <div className="flex gap-4">
                                                    {/* Course Thumbnail */}
                                                    <div className="relative w-28 h-20 md:w-32 md:h-24 rounded-xl overflow-hidden flex-shrink-0">
                                                        <Image
                                                            src={course.thumbnail_url || '/images/dashboard.png'}
                                                            alt={course.title}
                                                            fill
                                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                        />
                                                    </div>

                                                    {/* Course Info */}
                                                    <div className="flex-grow min-w-0">
                                                        <span className="inline-block text-[#661FFF] text-xs font-semibold mb-1">
                                                            {course.category}
                                                        </span>
                                                        <h4 className="text-base md:text-lg font-bold text-gray-900 mb-1">
                                                            {course.title}
                                                        </h4>
                                                        <p className="text-xs text-gray-500 mb-2">
                                                            By: {course.mentor_name || 'Instructor'}
                                                        </p>
                                                        <p className="text-sm text-gray-600 line-clamp-2">
                                                            {course.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
