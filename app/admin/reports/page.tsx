"use client";
import AdminSidebar from '@/app/components/AdminSidebar';
import HeaderAdmin from '@/app/components/HeaderAdmin';
import { useState, useEffect } from 'react';

// Interface untuk response API
interface ClassPerformanceAPI {
    id: number;
    title: string;
    category: string;
    total_enrollments: number;
}

interface StudentPerformanceAPI {
    id: number;
    name: string;
    avatar_url: string | null;
    enrolled_classes: number;
    progress: string;
}

interface Pagination {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
}

export default function ReportMonitoring() {
    const [searchQuery, setSearchQuery] = useState('');
    const [classPerformance, setClassPerformance] = useState<ClassPerformanceAPI[]>([]);
    const [studentPerformance, setStudentPerformance] = useState<StudentPerformanceAPI[]>([]);
    const [classLoading, setClassLoading] = useState(true);
    const [studentLoading, setStudentLoading] = useState(true);
    const [classError, setClassError] = useState<string | null>(null);
    const [studentError, setStudentError] = useState<string | null>(null);
    const [classPagination, setClassPagination] = useState<Pagination | null>(null);
    const [studentPagination, setStudentPagination] = useState<Pagination | null>(null);
    const [classPage, setClassPage] = useState(1);
    const [studentPage, setStudentPage] = useState(1);

    // Fetch Class Performance
    useEffect(() => {
        const fetchClassPerformance = async () => {
            setClassLoading(true);
            setClassError(null);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    // Redirect akan ditangani oleh HeaderAdmin
                    return;
                }

                const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
                const response = await fetch(
                    `${baseUrl}/admin/reports/class-performance?page=${classPage}&limit=10&search=${searchQuery}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json().catch(() => null);
                    throw new Error(errorData?.message || `HTTP Error: ${response.status} - ${response.statusText}`);
                }

                const result = await response.json();
                if (result.success) {
                    setClassPerformance(result.data);
                    setClassPagination(result.pagination);
                } else {
                    throw new Error(result.message || 'Gagal mengambil data');
                }
            } catch (error) {
                if (error instanceof TypeError && error.message.includes('fetch')) {
                    setClassError('Backend tidak dapat dijangkau. Pastikan server backend sudah running di http://localhost:3000');
                } else {
                    setClassError(error instanceof Error ? error.message : 'Terjadi kesalahan');
                }
            } finally {
                setClassLoading(false);
            }
        };

        fetchClassPerformance();
    }, [classPage, searchQuery]);

    // Fetch Student Performance
    useEffect(() => {
        const fetchStudentPerformance = async () => {
            setStudentLoading(true);
            setStudentError(null);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    // Redirect akan ditangani oleh HeaderAdmin
                    return;
                }

                const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
                const response = await fetch(
                    `${baseUrl}/admin/reports/student-performance?page=${studentPage}&limit=10&search=${searchQuery}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json().catch(() => null);
                    throw new Error(errorData?.message || `HTTP Error: ${response.status} - ${response.statusText}`);
                }

                const result = await response.json();
                if (result.success) {
                    setStudentPerformance(result.data);
                    setStudentPagination(result.pagination);
                } else {
                    throw new Error(result.message || 'Gagal mengambil data');
                }
            } catch (error) {
                if (error instanceof TypeError && error.message.includes('fetch')) {
                    setStudentError('Backend tidak dapat dijangkau. Pastikan server backend sudah running di http://localhost:3000');
                } else {
                    setStudentError(error instanceof Error ? error.message : 'Terjadi kesalahan');
                }
            } finally {
                setStudentLoading(false);
            }
        };

        fetchStudentPerformance();
    }, [studentPage, searchQuery]);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />

            {/* Main Content */}
            <div className="flex-1 ml-[250px]">
                <HeaderAdmin />

                {/* Report Content */}
                <main className="p-8">
                    {/* Title */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Report and Monitoring</h1>
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

                            {/* Loading State */}
                            {classLoading && (
                                <div className="text-center py-12">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#6B21FF]"></div>
                                    <p className="text-gray-500 mt-2">Memuat data...</p>
                                </div>
                            )}

                            {/* Error State */}
                            {classError && !classLoading && (
                                <div className="text-center py-12">
                                    <div className="mb-4">
                                        <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <p className="text-red-500 mb-4">{classError}</p>
                                    <button
                                        onClick={() => setClassPage(1)}
                                        className="px-6 py-2 bg-[#6B21FF] text-white rounded-lg hover:bg-[#5a1ad9] transition-colors"
                                    >
                                        Coba Lagi
                                    </button>
                                    <div className="mt-4 text-sm text-gray-500">
                                        <p>Tips debugging:</p>
                                        <ul className="list-disc list-inside mt-2">
                                            <li>Pastikan backend running di port 3000</li>
                                            <li>Pastikan sudah login sebagai admin</li>
                                            <li>Periksa console browser untuk detail error</li>
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* Table */}
                            {!classLoading && !classError && (
                                <>
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
                                                {classPerformance.map((item) => (
                                                    <tr key={item.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4">
                                                            <p className="text-sm font-medium text-gray-900">{item.title}</p>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="text-sm text-gray-700">{item.category}</span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="text-sm text-gray-700">{item.total_enrollments}</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {classPerformance.length === 0 && (
                                        <div className="text-center py-12">
                                            <p className="text-gray-500">Tidak ada data yang ditemukan</p>
                                        </div>
                                    )}

                                    {/* Pagination */}
                                    {classPagination && classPagination.totalPages > 1 && (
                                        <div className="flex justify-center items-center gap-2 mt-6">
                                            <button
                                                onClick={() => setClassPage(prev => Math.max(1, prev - 1))}
                                                disabled={classPage === 1}
                                                className="px-4 py-2 bg-[#E8DEFF] text-[#6B21FF] rounded-lg hover:bg-[#6B21FF] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                Previous
                                            </button>
                                            <span className="text-sm text-gray-600">
                                                Page {classPagination.currentPage} of {classPagination.totalPages}
                                            </span>
                                            <button
                                                onClick={() => setClassPage(prev => Math.min(classPagination.totalPages, prev + 1))}
                                                disabled={classPage === classPagination.totalPages}
                                                className="px-4 py-2 bg-[#E8DEFF] text-[#6B21FF] rounded-lg hover:bg-[#6B21FF] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}
                                </>
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

                            {/* Loading State */}
                            {studentLoading && (
                                <div className="text-center py-12">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#6B21FF]"></div>
                                    <p className="text-gray-500 mt-2">Memuat data...</p>
                                </div>
                            )}

                            {/* Error State */}
                            {studentError && !studentLoading && (
                                <div className="text-center py-12">
                                    <div className="mb-4">
                                        <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <p className="text-red-500 mb-4">{studentError}</p>
                                    <button
                                        onClick={() => setStudentPage(1)}
                                        className="px-6 py-2 bg-[#6B21FF] text-white rounded-lg hover:bg-[#5a1ad9] transition-colors"
                                    >
                                        Coba Lagi
                                    </button>
                                    <div className="mt-4 text-sm text-gray-500">
                                        <p>Tips debugging:</p>
                                        <ul className="list-disc list-inside mt-2">
                                            <li>Pastikan backend running di port 3000</li>
                                            <li>Pastikan sudah login sebagai admin</li>
                                            <li>Periksa console browser untuk detail error</li>
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* Table */}
                            {!studentLoading && !studentError && (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-[#E8DEFF]">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">Nama</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">Jumlah Kelas yang diambil</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">Progress Belajar</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {studentPerformance.map((student) => {
                                                    const progressValue = parseInt(student.progress.replace('%', ''));
                                                    return (
                                                        <tr key={student.id} className="hover:bg-gray-50">
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-3">
                                                                    {student.avatar_url ? (
                                                                        <img
                                                                            src={student.avatar_url}
                                                                            alt={student.name}
                                                                            className="w-8 h-8 rounded-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-8 h-8 rounded-full bg-[#E8DEFF] flex items-center justify-center">
                                                                            <span className="text-[#6B21FF] text-xs font-semibold">
                                                                                {student.name.charAt(0).toUpperCase()}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                    <p className="text-sm font-medium text-gray-900">{student.name}</p>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className="text-sm text-gray-700">{student.enrolled_classes} kelas</span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-3">
                                                                    {/* Progress Bar */}
                                                                    <div className="flex-1 max-w-[200px]">
                                                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                                            <div
                                                                                className="h-full bg-[#6B21FF] transition-all duration-300"
                                                                                style={{ width: `${progressValue}%` }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    {/* Percentage */}
                                                                    <span className="text-sm font-semibold text-[#6B21FF] min-w-[40px]">
                                                                        {progressValue}%
                                                                    </span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>

                                    {studentPerformance.length === 0 && (
                                        <div className="text-center py-12">
                                            <p className="text-gray-500">Tidak ada data yang ditemukan</p>
                                        </div>
                                    )}

                                    {/* Pagination */}
                                    {studentPagination && studentPagination.totalPages > 1 && (
                                        <div className="flex justify-center items-center gap-2 mt-6">
                                            <button
                                                onClick={() => setStudentPage(prev => Math.max(1, prev - 1))}
                                                disabled={studentPage === 1}
                                                className="px-4 py-2 bg-[#E8DEFF] text-[#6B21FF] rounded-lg hover:bg-[#6B21FF] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                Previous
                                            </button>
                                            <span className="text-sm text-gray-600">
                                                Page {studentPagination.currentPage} of {studentPagination.totalPages}
                                            </span>
                                            <button
                                                onClick={() => setStudentPage(prev => Math.min(studentPagination.totalPages, prev + 1))}
                                                disabled={studentPage === studentPagination.totalPages}
                                                className="px-4 py-2 bg-[#E8DEFF] text-[#6B21FF] rounded-lg hover:bg-[#6B21FF] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
