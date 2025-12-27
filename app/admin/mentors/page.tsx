"use client";
import AdminSidebar from '@/app/components/AdminSidebar';
import HeaderAdmin from '@/app/components/HeaderAdmin';
import { useState, useEffect } from 'react';

interface Mentor {
    id: string | number;
    name: string;
    photo: string;
    title: string;
    status: 'Active' | 'Inactive';
    courseCount?: number;
}

interface PaginationInfo {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
}

export default function MentorManagement() {
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
    
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        status: 'Active' as 'Active' | 'Inactive'
    });

    const [pagination, setPagination] = useState<PaginationInfo>({
        totalItems: 0,
        totalPages: 1,
        currentPage: 1,
        itemsPerPage: 10
    });

    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    // Fetch mentors from API
    const fetchMentors = async () => {
        setIsLoading(true);
        setError('');

        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append('search', searchQuery);
            if (statusFilter !== 'all') params.append('status', statusFilter);

            const token = localStorage.getItem('token');
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/admin/mentors?${params}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch mentors: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                setMentors(data.data);
                setPagination(data.pagination);
            } else {
                throw new Error(data.message || 'Unknown error');
            }
        } catch (err: any) {
            console.error('Error fetching mentors:', err);
            setError(err.message || 'Gagal memuat data mentors. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchMentors();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, statusFilter, currentPage]);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
    };

    const handleUpdateMentor = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedMentor) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/admin/mentors/${selectedMentor.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        name: formData.name,
                        title: formData.title,
                        status: formData.status
                    }),
                }
            );

            const data = await response.json();

            if (response.ok && data.success) {
                setShowEditModal(false);
                setSelectedMentor(null);
                fetchMentors();
                showNotification('success', 'Mentor berhasil diperbarui!');
            } else {
                showNotification('error', data.message || 'Gagal memperbarui mentor');
            }
        } catch (err) {
            console.error('Error updating mentor:', err);
            showNotification('error', 'Terjadi kesalahan saat memperbarui mentor');
        }
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
                .animate-scale-up {
                    animation: scaleUp 0.2s ease-out;
                }
            `}</style>
            <div className="flex min-h-screen bg-gray-50">
                <AdminSidebar />

                {/* Main Content */}
                <div className="flex-1 ml-[250px]">
                    <HeaderAdmin />

                    {/* Mentor Management Content */}
                    <main className="p-8">
                        {/* Title and Add Button */}
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold text-gray-900">Mentor Management</h1>
                        </div>

                        {/* Search Bar */}
                        <div className="mb-6">
                            <div className="relative max-w-2xl">
                                <input
                                    type="text"
                                    placeholder="Cari mentor..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-6 pr-12 py-4 rounded-full border-2 border-gray-300 focus:outline-none focus:border-[#6B21FF] text-gray-700 placeholder-gray-400 transition-all"
                                />
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div className="mb-6">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-6 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#6B21FF] text-gray-700 bg-white cursor-pointer"
                            >
                                <option value="all">Status Mentor</option>
                                <option value="published">Active</option>
                                <option value="draft">Inactive</option>
                            </select>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                                {error}
                            </div>
                        )}

                        {/* Loading State */}
                        {isLoading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full"></div>
                            </div>
                        ) : (
                            <>
                                {/* Mentors Table */}
                                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-[#E8DEFF]">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">No</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">Foto</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">Nama Mentor</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">Pekerjaan</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">Jumlah Kursus</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">Status</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {mentors.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                                            Tidak ada mentor ditemukan
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    mentors.map((mentor, index) => (
                                                        <tr key={mentor.id} className="hover:bg-gray-50 transition">
                                                            <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                                                            <td className="px-6 py-4">
                                                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                                                                    <img
                                                                        src={mentor.photo}
                                                                        alt={mentor.name}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{mentor.name}</td>
                                                            <td className="px-6 py-4 text-sm text-gray-600">{mentor.title}</td>
                                                            <td className="px-6 py-4 text-sm text-gray-600">{mentor.courseCount || 0} Kursus</td>
                                                            <td className="px-6 py-4">
                                                                <span className={`inline-flex px-4 py-1.5 rounded-full text-xs font-semibold text-white ${mentor.status === 'Active'
                                                                    ? 'bg-green-500'
                                                                    : 'bg-gray-500'
                                                                    }`}>
                                                                    {mentor.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-3">
                                                                    {/* Edit Button */}
                                                                    <button
                                                                        onClick={() => {
                                                                            setSelectedMentor(mentor);
                                                                            setFormData({
                                                                                name: mentor.name,
                                                                                title: mentor.title,
                                                                                status: mentor.status
                                                                            });
                                                                            setShowEditModal(true);
                                                                        }}
                                                                        className="text-[#6B21FF] hover:text-white hover:bg-[#6B21FF] transition-all duration-300 flex items-center justify-center p-2 rounded-lg hover:scale-110 hover:shadow-lg"
                                                                        title="Edit Mentor"
                                                                    >
                                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
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

                                {/* Pagination (centered) */}
                                <div className="flex flex-col items-center gap-3 mt-8">
                                    <div className="flex items-center gap-6">
                                        <button
                                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
                                            onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages || 1, p + 1))}
                                            disabled={currentPage === pagination.totalPages || pagination.totalPages === 0}
                                            className="p-2 rounded-full hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                            aria-label="Next page"
                                        >
                                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>

                                </div>
                            </>
                        )}
                    </main>
                </div>

                {/* Edit Mentor Modal */}
                {showEditModal && selectedMentor && (
                    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-8 max-w-md w-full animate-scale-up shadow-2xl">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Mentor</h2>
                            <form onSubmit={handleUpdateMentor} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Mentor</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#6B21FF] text-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Pekerjaan / Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#6B21FF] text-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#6B21FF] text-gray-900"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowEditModal(false);
                                            setSelectedMentor(null);
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
