"use client";
import AdminSidebar from '@/app/components/AdminSidebar';
import HeaderAdmin from '@/app/components/HeaderAdmin';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getAllCourses, deleteCourse, type Course } from '@/lib/courseService';
import { COURSE_CATEGORIES } from '@/lib/constants';

export default function LearningContent() {
    // State management
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [kategoriFilter, setKategoriFilter] = useState('all');

    // Modal states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    // Edit form state
    const [editFormData, setEditFormData] = useState({
        title: '',
        category: '',
        price: 0,
        discount_amount: 0,
        status: 'draft' as 'draft' | 'published'
    });

    // Notification
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

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

    // Fetch courses from backend
    const fetchCourses = async () => {
        setIsLoading(true);
        setError('');

        try {
            const data = await getAllCourses(searchQuery);
            setCourses(data);
        } catch (err: any) {
            console.error('Error fetching courses:', err);
            setError(err.message || 'Gagal memuat data courses');
        } finally {
            setIsLoading(false);
        }
    };

    // Initial fetch and when search changes
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchCourses();
        }, 300); // Debounce search

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    // Delete course
    const handleDeleteCourse = async () => {
        if (!selectedCourse) return;

        // Validate delete confirmation text
        if (deleteConfirmText !== 'hapus') {
            showNotification('error', 'Ketik "hapus" untuk konfirmasi');
            return;
        }

        try {
            await deleteCourse(selectedCourse.id);
            setShowDeleteModal(false);
            setSelectedCourse(null);
            setDeleteConfirmText('');
            fetchCourses();
            showNotification('success', 'Course berhasil dihapus!');
        } catch (err: any) {
            console.error('Error deleting course:', err);
            showNotification('error', err.message || 'Terjadi kesalahan saat menghapus course');
        }
    };

    // Open delete modal
    const handleDelete = (course: Course) => {
        setSelectedCourse(course);
        setShowDeleteModal(true);
    };

    // Open edit modal
    const handleEdit = (course: Course) => {
        setSelectedCourse(course);
        setEditFormData({
            title: course.title,
            category: course.category || '',
            price: course.price || 0,
            discount_amount: course.discount_amount || 0,
            status: (course.status || 'draft') as 'draft' | 'published'
        });
        setShowEditModal(true);
    };

    // Update course
    const handleUpdateCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCourse) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/admin/courses/${selectedCourse.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(editFormData),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Update failed:', errorText);
                throw new Error('Gagal memperbarui course');
            }

            const data = await response.json();

            // Backend returns course object directly, not { success: true, data: ... }
            if (data && data.id) {
                setShowEditModal(false);
                setSelectedCourse(null);
                fetchCourses();
                showNotification('success', 'Course berhasil diperbarui!');
            } else {
                showNotification('error', data.message || 'Gagal memperbarui course');
            }
        } catch (err: any) {
            console.error('Error updating course:', err);
            showNotification('error', err.message || 'Terjadi kesalahan saat memperbarui course');
        }
    };

    // Filter courses by kategori (client-side)
    const filteredCourses = courses.filter(course => {
        if (kategoriFilter === 'all') return true;
        return course.category === kategoriFilter;
    });

    // Use shared categories from constants
    const categories = [...COURSE_CATEGORIES];

    // Format date
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <>
            <style jsx>{`
                @keyframes scaleUp {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                .animate-scale-up {
                    animation: scaleUp 0.2s ease-out;
                }
                .animate-slide-in {
                    animation: slideIn 0.3s ease-out;
                }
            `}</style>

            <div className="flex min-h-screen bg-gray-50">
                <AdminSidebar />

                {/* Main Content */}
                <div className="flex-1 ml-[250px]">
                    <HeaderAdmin />

                    {/* Learning Content */}
                    <main className="p-8">
                        {/* Title and Add Button */}
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold text-gray-900">Learning Content</h1>
                            <Link href="/admin/content/create">
                                <button className="bg-[#6B21FF] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#5518CC] transition flex items-center gap-2">
                                    Buat Kelas Baru
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
                                    placeholder="Cari judul kelas..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-6 pr-12 py-4 rounded-full border-2 border-gray-300 focus:outline-none focus:border-[#6B21FF] text-gray-900 placeholder-gray-400 transition-all"
                                />
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex gap-4 mb-6">
                            {/* Kategori Filter */}
                            <select
                                value={kategoriFilter}
                                onChange={(e) => setKategoriFilter(e.target.value)}
                                className="px-6 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#6B21FF] text-gray-900 bg-white cursor-pointer"
                            >
                                <option value="all">Semua Kategori</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Loading State */}
                        {isLoading && (
                            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B21FF] mx-auto"></div>
                                <p className="mt-4 text-gray-600">Memuat data courses...</p>
                            </div>
                        )}

                        {/* Error State */}
                        {error && !isLoading && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                                <p className="text-red-800 font-semibold">{error}</p>
                                <button
                                    onClick={fetchCourses}
                                    className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                >
                                    Coba Lagi
                                </button>
                            </div>
                        )}

                        {/* Courses Table */}
                        {!isLoading && !error && (
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-[#E8DEFF]">
                                            <tr>
                                                <th className="px-6 py-4 text-center text-sm font-semibold text-[#6B21FF]">Judul Kelas</th>
                                                <th className="px-6 py-4 text-center text-sm font-semibold text-[#6B21FF]">Kategori</th>
                                                <th className="px-6 py-4 text-center text-sm font-semibold text-[#6B21FF]">Status</th>
                                                <th className="px-6 py-4 text-center text-sm font-semibold text-[#6B21FF]">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {filteredCourses.length === 0 ? (
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                                        Tidak ada course ditemukan
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredCourses.map((course) => (
                                                    <tr key={course.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 text-sm text-gray-900 text-center">{course.title}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-600 text-center">
                                                            {course.category || 'All'}
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${course.status === 'published'
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-gray-100 text-gray-700'
                                                                }`}>
                                                                {course.status || 'published'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <div className="flex items-center justify-center gap-3">
                                                                {/* Edit Button */}
                                                                <button
                                                                    onClick={() => handleEdit(course)}
                                                                    className="text-[#6B21FF] hover:text-white hover:bg-[#6B21FF] transition-all duration-300 flex items-center justify-center p-2 rounded-lg hover:scale-110 hover:shadow-lg"
                                                                >
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                    </svg>
                                                                </button>
                                                                {/* Delete Button */}
                                                                <button
                                                                    onClick={() => handleDelete(course)}
                                                                    className="text-red-500 hover:text-white hover:bg-red-500 transition-all duration-300 flex items-center justify-center p-2 rounded-lg hover:scale-110 hover:shadow-lg hover:rotate-12"
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
                    </main>
                </div>

                {/* Edit Course Modal */}
                {showEditModal && selectedCourse && (
                    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-8 max-w-md w-full animate-scale-up shadow-2xl">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Course</h2>
                            <form onSubmit={handleUpdateCourse} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Judul Course</label>
                                    <input
                                        type="text"
                                        value={editFormData.title}
                                        onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#6B21FF] text-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                                    <select
                                        value={editFormData.category}
                                        onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#6B21FF] text-gray-900"
                                    >
                                        <option value="">Pilih Kategori</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Harga</label>
                                    <input
                                        type="number"
                                        value={editFormData.price}
                                        onChange={(e) => setEditFormData({ ...editFormData, price: Number(e.target.value) })}
                                        min="0"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#6B21FF] text-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Diskon</label>
                                    <input
                                        type="number"
                                        value={editFormData.discount_amount}
                                        onChange={(e) => setEditFormData({ ...editFormData, discount_amount: Number(e.target.value) })}
                                        min="0"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#6B21FF] text-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select
                                        value={editFormData.status}
                                        onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as 'draft' | 'published' })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#6B21FF] text-gray-900"
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                    </select>
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowEditModal(false);
                                            setSelectedCourse(null);
                                        }}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-[#6B21FF] text-white rounded-lg hover:bg-[#5518CC] transition"
                                    >
                                        Simpan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && selectedCourse && (
                    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-8 max-w-md w-full animate-scale-up shadow-2xl">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Konfirmasi Hapus</h2>
                            <p className="text-gray-600 mb-2">
                                Apakah Anda yakin ingin menghapus course <strong>{selectedCourse.title}</strong>?
                            </p>
                            <p className="text-gray-600 mb-6">
                                Ketik <span className="font-mono bg-gray-100 px-2 py-1 rounded text-red-600 font-semibold">hapus</span> untuk konfirmasi.
                            </p>
                            <div className="mb-6">
                                <input
                                    type="text"
                                    value={deleteConfirmText}
                                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                                    placeholder="Ketik 'hapus' untuk konfirmasi"
                                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-500 transition-colors text-gray-900"
                                    autoFocus
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setSelectedCourse(null);
                                        setDeleteConfirmText('');
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleDeleteCourse}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Notification Toast */}
                {notification && (
                    <div className="fixed top-4 right-4 z-50 animate-slide-in">
                        <div className={`rounded-xl px-6 py-4 shadow-2xl border-2 min-w-[300px] max-w-md ${notification.type === 'success'
                            ? 'bg-green-50 border-green-500 text-green-800'
                            : 'bg-red-50 border-red-500 text-red-800'
                            }`}>
                            <div className="flex items-start gap-3">
                                {notification.type === 'success' ? (
                                    <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                )}
                                <div className="flex-1">
                                    <p className="font-semibold text-sm">{notification.message}</p>
                                </div>
                                <button
                                    onClick={() => setNotification(null)}
                                    className="flex-shrink-0 text-gray-400 hover:text-gray-600"
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
        </>
    );
}
