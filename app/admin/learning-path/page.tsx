"use client";
import AdminSidebar from '@/app/components/AdminSidebar';
import HeaderAdmin from '@/app/components/HeaderAdmin';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    getAllLearningPaths,
    deleteLearningPath,
    type LearningPath
} from '@/lib/learningPathService';

export default function LearningPathPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const itemsPerPage = 10;

    // Auto-hide notification
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    // Show notification helper
    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
    };

    // Fetch learning paths dari backend
    useEffect(() => {
        fetchLearningPaths();
    }, [currentPage, searchQuery]);

    const fetchLearningPaths = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getAllLearningPaths(currentPage, itemsPerPage, searchQuery);
            setLearningPaths(response.data);
            setTotalPages(response.pagination.totalPages);
        } catch (err: any) {
            console.error('Error fetching learning paths:', err);
            setError(err.message || 'Gagal memuat learning paths');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (pathId: string) => {
        router.push(`/admin/learning-path/edit/${pathId}`);
    };

    const handleDeleteClick = (pathId: string) => {
        setSelectedPathId(pathId);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (!selectedPathId) return;

        if (deleteConfirmText !== 'hapus') {
            showNotification('error', 'Ketik "hapus" untuk konfirmasi');
            return;
        }

        try {
            await deleteLearningPath(selectedPathId);
            showNotification('success', 'Learning path berhasil dihapus!');
            setShowDeleteModal(false);
            setSelectedPathId(null);
            setDeleteConfirmText('');
            fetchLearningPaths(); // Refresh data
        } catch (err: any) {
            console.error('Error deleting learning path:', err);
            showNotification('error', err.message || 'Gagal menghapus learning path');
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />

            {/* Main Content */}
            <div className="flex-1 ml-[250px]">
                <HeaderAdmin />

                {/* Learning Path Content */}
                <main className="p-8">
                    {/* Title and Add Button */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Learning Path</h1>
                        <Link href="/admin/learning-path/create">
                            <button className="bg-[#6B21FF] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#5518CC] transition flex items-center gap-2">
                                Buat Path Baru
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative max-w-2xl">
                            <input
                                type="text"
                                placeholder="Cari learning path..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1); // Reset ke halaman pertama saat search
                                }}
                                className="w-full pl-6 pr-12 py-4 rounded-full border-2 border-gray-300 focus:outline-none focus:border-[#6B21FF] text-gray-700 placeholder-gray-400 transition-all"
                            />
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B21FF]"></div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    {/* Status Filter - Removed as backend doesn't have status field */}

                    {/* Learning Paths Table */}
                    {!loading && !error && (
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-[#E8DEFF]">
                                        <tr>
                                            <th className="px-6 py-4 text-center text-sm font-semibold text-[#6B21FF]">Judul Path</th>
                                            <th className="px-6 py-4 text-center text-sm font-semibold text-[#6B21FF]">Jumlah Course</th>
                                            <th className="px-6 py-4 text-center text-sm font-semibold text-[#6B21FF]">Jumlah Modul</th>
                                            <th className="px-6 py-4 text-center text-sm font-semibold text-[#6B21FF]">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {learningPaths.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                                    Tidak ada learning path yang ditemukan
                                                </td>
                                            </tr>
                                        ) : (
                                            learningPaths.map((path) => (
                                                <tr key={path.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 text-sm text-gray-900 text-center">{path.title}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600 text-center">{path.total_courses || 0}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600 text-center">{path.total_modules || 0}</td>
                                                    <td className="px-6 py-4 text-center">
                                                        <div className="flex items-center justify-center gap-3">
                                                            {/* Edit Button */}
                                                            <button
                                                                onClick={() => handleEdit(path.id)}
                                                                className="text-[#6B21FF] hover:text-white hover:bg-[#6B21FF] transition-all duration-300 flex items-center justify-center p-2 rounded-lg hover:scale-110 hover:shadow-lg"
                                                                title="Edit"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                            </button>
                                                            {/* Delete Button */}
                                                            <button
                                                                onClick={() => handleDeleteClick(path.id)}
                                                                className="text-red-500 hover:text-white hover:bg-red-500 transition-all duration-300 flex items-center justify-center p-2 rounded-lg hover:scale-110 hover:shadow-lg hover:rotate-12"
                                                                title="Delete"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Pagination */}
                    {!loading && !error && totalPages > 1 && (
                        <div className="flex flex-col items-center gap-3 mt-8">
                            <div className="flex items-center gap-6">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-full hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="Previous page"
                                >
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                <div className="w-12 h-12 rounded-full bg-[#6B21FF] flex items-center justify-center text-white font-semibold text-lg shadow-xl">
                                    {currentPage}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-full hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="Next page"
                                >
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>

                            <p className="text-sm text-gray-600">Menampilkan halaman {currentPage} dari {totalPages}</p>
                        </div>
                    )}
                </main>

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 transform transition-all scale-100">
                            <div className="text-center mb-6">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                    <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Konfirmasi Hapus</h3>
                                <p className="text-gray-600 mb-4">Apakah Anda yakin ingin menghapus learning path ini? Tindakan ini tidak dapat dibatalkan.</p>
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                                    <p className="text-sm text-gray-600">
                                        Ketik <span className="font-bold text-gray-600">&quot;hapus&quot;</span> untuk mengkonfirmasi
                                    </p>
                                </div>
                                <input
                                    type="text"
                                    value={deleteConfirmText}
                                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B21FF] text-gray-800 placeholder-gray-400"
                                    placeholder="Ketik 'hapus' untuk konfirmasi"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setDeleteConfirmText('');
                                        setSelectedPathId(null);
                                    }}
                                    className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold transition"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleteConfirmText !== 'hapus'}
                                    className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Toast Notification */}
                {notification && (
                    <div className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${notification ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                        }`}>
                        <div className={`rounded-lg shadow-lg p-4 max-w-md ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                            }`}>
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0">
                                    {notification.type === 'success' ? (
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    )}
                                </div>
                                <p className="text-white font-semibold flex-1">{notification.message}</p>
                                <button
                                    onClick={() => setNotification(null)}
                                    className="flex-shrink-0 text-white hover:text-gray-200 transition"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}