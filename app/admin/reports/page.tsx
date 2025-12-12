"use client";
import AdminSidebar from '@/app/components/AdminSidebar';
import { useState } from 'react';

interface ClassPerformance {
    id: number;
    judulKelas: string;
    kategori: string;
    jumlahEnroll: number;
}

interface StudentPerformance {
    id: number;
    nama: string;
    jumlahKelas: string;
    progressBelajar: number;
    rataRataSkorQuiz: number;
}

export default function ReportMonitoring() {
    const [searchQuery, setSearchQuery] = useState('');

    // Dummy data peforma kelas
    const classPerformance: ClassPerformance[] = [
        { id: 1, judulKelas: 'Python Dasar untuk Analisis Data', kategori: 'Programming', jumlahEnroll: 30 },
        { id: 2, judulKelas: 'Merancang User Experience (UX) dari Nol', kategori: 'Design', jumlahEnroll: 25 },
        { id: 3, judulKelas: 'Pemasaran Digital untuk Pemula', kategori: 'Marketing', jumlahEnroll: 45 },
        { id: 4, judulKelas: 'Wawancara Perilaku (Behavioral Interview STAR) dan Tips Jitu', kategori: 'Interview & CV', jumlahEnroll: 15 },
        { id: 5, judulKelas: 'Social Media Marketing (SMM) untuk Bisnis', kategori: 'Marketing', jumlahEnroll: 20 },
    ];

    // Dummy data peforma belajar
    const studentPerformance: StudentPerformance[] = [
        { id: 1, nama: 'Anya Sharma', jumlahKelas: '5 kelas', progressBelajar: 75, rataRataSkorQuiz: 85 },
        { id: 2, nama: 'Ethan Carter', jumlahKelas: '3 kelas', progressBelajar: 50, rataRataSkorQuiz: 90 },
        { id: 3, nama: 'Olivia Bennett', jumlahKelas: '4 kelas', progressBelajar: 90, rataRataSkorQuiz: 100 },
        { id: 4, nama: 'Liam Harper', jumlahKelas: '3 kelas', progressBelajar: 25, rataRataSkorQuiz: 75 },
        { id: 5, nama: 'Ava Foster', jumlahKelas: '8 kelas', progressBelajar: 60, rataRataSkorQuiz: 80 },
        { id: 6, nama: 'Noah Parker', jumlahKelas: '6 kelas', progressBelajar: 25, rataRataSkorQuiz: 95 },
        { id: 7, nama: 'Isabella Reed', jumlahKelas: '7 kelas', progressBelajar: 75, rataRataSkorQuiz: 80 },
        { id: 8, nama: 'Jackson Hayes', jumlahKelas: '10 kelas', progressBelajar: 50, rataRataSkorQuiz: 70 },
        { id: 9, nama: 'Sophia Morgan', jumlahKelas: '5 kelas', progressBelajar: 25, rataRataSkorQuiz: 100 },
        { id: 10, nama: 'Lucas Bennett', jumlahKelas: '6 kelas', progressBelajar: 50, rataRataSkorQuiz: 90 },
    ];

    // Filter based on search
    const filteredClassPerformance = classPerformance.filter(item =>
        item.judulKelas.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredStudentPerformance = studentPerformance.filter(student =>
        student.nama.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                    {/* Title and Date Button */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Report and Monitoring</h1>
                        <button className="flex items-center gap-2 px-6 py-3 bg-[#E8DEFF] text-[#6B21FF] rounded-2xl hover:bg-[#6B21FF] hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="font-semibold">Pilih Rentang Tanggal</span>
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-8">
                        <div className="relative">
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

                    {/* Peforma Kelas Section */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm mb-6">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Peforma Kelas</h2>
                                <a href="#" className="text-[#6B21FF] text-sm font-semibold hover:underline">
                                    Lihat Selengkapnya
                                </a>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-[#E8DEFF]">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">Judul Kelas</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">Kategori</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">Jumlah Enroll</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredClassPerformance.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-medium text-gray-900">{item.judulKelas}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-gray-700">{item.kategori}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-gray-700">{item.jumlahEnroll}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {filteredClassPerformance.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">Tidak ada data yang ditemukan</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Peforma Belajar Section */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Peforma Belajar</h2>
                                <a href="#" className="text-[#6B21FF] text-sm font-semibold hover:underline">
                                    Lihat Selengkapnya
                                </a>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-[#E8DEFF]">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">Nama</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">Jumlah Kelas yang diambil</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">Progress Belajar</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">Rata rata Skor Quiz</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredStudentPerformance.map((student) => (
                                            <tr key={student.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-medium text-gray-900">{student.nama}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-gray-700">{student.jumlahKelas}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        {/* Progress Bar */}
                                                        <div className="flex-1 max-w-[200px]">
                                                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-[#6B21FF] transition-all duration-300"
                                                                    style={{ width: `${student.progressBelajar}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                        {/* Percentage */}
                                                        <span className="text-sm font-semibold text-[#6B21FF] min-w-[40px]">
                                                            {student.progressBelajar}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-gray-700">{student.rataRataSkorQuiz}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {filteredStudentPerformance.length === 0 && (
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
