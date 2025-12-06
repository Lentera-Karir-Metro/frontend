"use client";
import AdminSidebar from '@/app/components/AdminSidebar';
import { useState } from 'react';

interface CoursePerformance {
    id: number;
    judulKelas: string;
    kategori: string;
    progress: number;
    jumlahModul: number;
}

export default function ReportMonitoring() {
    const [searchQuery, setSearchQuery] = useState('');

    // Dummy data performa belajar
    const allCourses: CoursePerformance[] = [
        { id: 1, judulKelas: 'Python Dasar untuk Analisis Data', kategori: 'Programming', progress: 75, jumlahModul: 24 },
        { id: 2, judulKelas: 'Merancang User Experience (UX) dari Nol', kategori: 'Design', progress: 50, jumlahModul: 12 },
        { id: 3, judulKelas: 'Pemasaran Digital untuk Pemula', kategori: 'Marketing', progress: 90, jumlahModul: 18 },
        { id: 4, judulKelas: 'Wawancara Perilaku (Behavioral Interview STAR) dan Tips Jitu', kategori: 'Interview & CV', progress: 25, jumlahModul: 20 },
        { id: 5, judulKelas: 'JavaScript Lanjutan untuk Web Interaktif', kategori: 'Programming', progress: 80, jumlahModul: 12 },
        { id: 6, judulKelas: 'Social Media Marketing (SMM) untuk Bisnis', kategori: 'Marketing', progress: 25, jumlahModul: 28 },
        { id: 7, judulKelas: 'Teknik Menjawab Pertanyaan Sulit Wawancara', kategori: 'Interview & CV', progress: 75, jumlahModul: 17 },
        { id: 8, judulKelas: 'Membangun Aplikasi Mobile dengan React Native', kategori: 'Programming', progress: 50, jumlahModul: 30 },
        { id: 9, judulKelas: 'SEO untuk Menaikkan Peringkat Website', kategori: 'Marketing', progress: 25, jumlahModul: 10 },
        { id: 10, judulKelas: 'Desain Logo dan Identitas Merek (Branding)', kategori: 'Design', progress: 50, jumlahModul: 26 },
    ];

    // Filter courses based on search
    const filteredCourses = allCourses.filter(course =>
        course.judulKelas.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Get progress color based on percentage
    const getProgressColor = (progress: number) => {
        if (progress >= 75) return 'bg-[#6B21FF]';
        if (progress >= 50) return 'bg-[#6B21FF]';
        if (progress >= 25) return 'bg-[#6B21FF]';
        return 'bg-[#6B21FF]';
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />

            {/* Main Content */}
            <div className="flex-1 ml-[220px]">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-8 py-4">
                    <div className="flex justify-end items-center">
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-sm font-semibold text-gray-900">Budi Budiman</p>
                                <p className="text-xs text-gray-500">Admin</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                </svg>
                            </div>
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </header>

                {/* Report Content */}
                <main className="p-8">
                    {/* Title */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Report and Monitoring</h1>

                    {/* Search Bar */}
                    <div className="mb-8">
                        <div className="relative max-w-3xl">
                            <input
                                type="text"
                                placeholder="Cari learning path..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-6 pr-12 py-4 rounded-full border-2 border-[#6B21FF] focus:outline-none focus:ring-2 focus:ring-[#6B21FF] focus:ring-opacity-20 text-gray-700 placeholder-gray-400"
                            />
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[#6B21FF]">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Performa Belajar Section */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Performa Belajar</h2>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-[#E8DEFF]">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">Judul Kelas</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">Jumlah Kelas yang diambil</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">Status</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">Jumlah Modul</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredCourses.map((course) => (
                                            <tr key={course.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{course.judulKelas}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-gray-700">{course.kategori}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        {/* Progress Bar */}
                                                        <div className="flex-1 max-w-xs">
                                                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                                <div
                                                                    className={`h-full ${getProgressColor(course.progress)} transition-all duration-300`}
                                                                    style={{ width: `${course.progress}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                        {/* Percentage */}
                                                        <span className="text-sm font-semibold text-[#6B21FF] min-w-[40px]">
                                                            {course.progress}%
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-gray-700">{course.jumlahModul}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {filteredCourses.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">Tidak ada data yang ditemukan</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
