"use client";
import AdminSidebar from '@/app/components/AdminSidebar';
import HeaderAdmin from '@/app/components/HeaderAdmin';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Module {
    id: string;
    title: string;
    module_type: 'video' | 'ebook' | 'quiz';
    video_url?: string;
    ebook_url?: string;
    quiz_id?: string;
    sequence_order: number;
    duration_minutes?: number;
    created_at: string;
}

interface Course {
    id: string;
    title: string;
    category: string;
    price: number;
    thumbnail_url?: string;
    instructor_name?: string;
}

export default function CourseDetail() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.id as string;

    const [course, setCourse] = useState<Course | null>(null);
    const [modules, setModules] = useState<Module[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedModule, setSelectedModule] = useState<Module | null>(null);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    // Auto-hide notification
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

    // Fetch course details
    const fetchCourseDetails = async () => {
        setIsLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            
            // Fetch course info
            const courseResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/admin/courses/${courseId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (!courseResponse.ok) {
                throw new Error('Gagal memuat data course');
            }

            const courseData = await courseResponse.json();
            setCourse(courseData);

            // Fetch modules
            const modulesResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/admin/courses/${courseId}/modules`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (!modulesResponse.ok) {
                throw new Error('Gagal memuat data modul');
            }

            const modulesData = await modulesResponse.json();
            setModules(modulesData);
        } catch (err: any) {
            console.error('Error fetching course details:', err);
            setError(err.message || 'Gagal memuat data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (courseId) {
            fetchCourseDetails();
        }
    }, [courseId]);

    // Delete module
    const handleDeleteModule = async () => {
        if (!selectedModule) return;

        if (deleteConfirmText !== 'hapus') {
            showNotification('error', 'Ketik "hapus" untuk konfirmasi');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/admin/courses/${courseId}/modules/${selectedModule.id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Gagal menghapus modul');
            }

            setShowDeleteModal(false);
            setSelectedModule(null);
            setDeleteConfirmText('');
            fetchCourseDetails();
            showNotification('success', 'Modul berhasil dihapus!');
        } catch (err: any) {
            console.error('Error deleting module:', err);
            showNotification('error', err.message || 'Terjadi kesalahan saat menghapus modul');
        }
    };

    const getModuleIcon = (type: string) => {
        switch (type) {
            case 'video':
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'ebook':
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                );
            case 'quiz':
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const getModuleColor = (type: string) => {
        switch (type) {
            case 'video':
                return 'from-purple-500 to-purple-600';
            case 'ebook':
                return 'from-red-500 to-red-600';
            case 'quiz':
                return 'from-blue-500 to-blue-600';
            default:
                return 'from-gray-500 to-gray-600';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <AdminSidebar />
            <div className="flex-1 ml-[250px]">
                <HeaderAdmin />
                
                {/* Notification */}
                {notification && (
                    <div className={`fixed top-20 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl ${
                        notification.type === 'success' 
                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                            : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                    } animate-slide-in`}>
                        <div className="flex items-center gap-3">
                            {notification.type === 'success' ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                            <p className="font-semibold">{notification.message}</p>
                        </div>
                    </div>
                )}

                <main className="p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-6">
                            <Link href="/admin/content">
                                <button className="p-2 hover:bg-white rounded-lg transition shadow-sm">
                                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Kelola Modul</h1>
                                <p className="text-gray-600 text-sm mt-1">Atur dan kelola modul pembelajaran</p>
                            </div>
                        </div>
                        
                        {course && (
                            <div className="bg-gradient-to-r from-[#6B21FF] to-purple-600 rounded-2xl p-6 shadow-xl text-white">
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-6 items-center flex-1">
                                        {course.thumbnail_url && (
                                            <div className="flex-shrink-0">
                                                <img 
                                                    src={course.thumbnail_url} 
                                                    alt={course.title}
                                                    className="w-32 h-32 object-cover rounded-xl shadow-lg ring-4 ring-white/20"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <h2 className="text-2xl font-bold mb-3">{course.title}</h2>
                                            <div className="flex flex-wrap gap-4 text-sm">
                                                <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                    </svg>
                                                    {course.category}
                                                </span>
                                                <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Rp {course.price?.toLocaleString('id-ID') || '0'}
                                                </span>
                                                <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    {modules.length} Modul
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <Link href={`/admin/content/create/module?courseId=${courseId}`}>
                                        <button className="flex-shrink-0 inline-flex items-center gap-2 bg-white text-[#6B21FF] px-6 py-3 rounded-full font-semibold hover:scale-105 transition-all shadow-lg hover:shadow-2xl">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Tambah Modul
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B21FF]"></div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                            <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-red-700 font-semibold">{error}</p>
                        </div>
                    )}

                    {/* Modules List */}
                    {!isLoading && !error && (
                        <div>
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Daftar Modul</h2>
                                <p className="text-gray-600 mt-1">
                                    {modules.length === 0 
                                        ? 'Belum ada modul yang ditambahkan' 
                                        : `Total ${modules.length} modul tersedia`}
                                </p>
                            </div>

                            {modules.length === 0 ? (
                                <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-16 text-center">
                                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Belum ada modul</h3>
                                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                        Mulai bangun pembelajaran yang efektif dengan menambahkan modul pertama Anda
                                    </p>
                                    <Link href={`/admin/content/create/module?courseId=${courseId}`}>
                                        <button className="inline-flex items-center gap-2 bg-gradient-to-r from-[#6B21FF] to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:scale-105 transition-all shadow-lg hover:shadow-2xl">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Tambah Modul Pertama
                                        </button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid gap-5">
                                    {modules.map((module, index) => (
                                        <div 
                                            key={module.id} 
                                            className="group bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:border-[#6B21FF] hover:shadow-2xl transition-all duration-300"
                                        >
                                            <div className="flex items-stretch">
                                                {/* Module Icon & Number - Wider colored section */}
                                                <div className={`w-28 bg-gradient-to-br ${getModuleColor(module.module_type || 'quiz')} flex flex-col items-center justify-center text-white gap-3 relative`}>
                                                    <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold">
                                                        #{index + 1}
                                                    </div>
                                                    <div className="mt-8">
                                                        {getModuleIcon(module.module_type || 'quiz')}
                                                    </div>
                                                    <span className="text-xs font-semibold uppercase tracking-wider">
                                                        {module.module_type || 'Quiz'}
                                                    </span>
                                                </div>

                                                {/* Module Info */}
                                                <div className="flex-1 p-6">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1">
                                                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#6B21FF] transition-colors">
                                                                {module.title}
                                                            </h3>
                                                            <div className="flex flex-wrap gap-3 text-sm">
                                                                <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold border-2 bg-gradient-to-r ${
                                                                    module.module_type === 'video' 
                                                                        ? 'from-purple-50 to-purple-100 border-purple-200 text-purple-700' 
                                                                        : module.module_type === 'ebook' 
                                                                        ? 'from-red-50 to-red-100 border-red-200 text-red-700'
                                                                        : 'from-blue-50 to-blue-100 border-blue-200 text-blue-700'
                                                                }`}>
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                                    </svg>
                                                                    {module.module_type?.toUpperCase() || 'MODULE'}
                                                                </span>
                                                                {module.duration_minutes && (
                                                                    <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-semibold border-2 border-gray-200">
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                        </svg>
                                                                        {module.duration_minutes} menit
                                                                    </span>
                                                                )}
                                                                <span className="inline-flex items-center gap-1.5 text-gray-500">
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                    </svg>
                                                                    {formatDate(module.created_at)}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex items-center gap-2 flex-shrink-0">
                                                            {/* Edit Button */}
                                                            <Link href={`/admin/content/${courseId}/module/${module.id}/edit`}>
                                                                <button
                                                                    className="text-[#6B21FF] hover:text-white hover:bg-[#6B21FF] transition-all duration-300 flex items-center justify-center p-3 rounded-xl border-2 border-[#6B21FF] hover:scale-110 hover:shadow-xl"
                                                                    title="Edit Modul"
                                                                >
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                    </svg>
                                                                </button>
                                                            </Link>
                                                            {/* Delete Button */}
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedModule(module);
                                                                    setShowDeleteModal(true);
                                                                }}
                                                                className="text-red-500 hover:text-white hover:bg-red-500 transition-all duration-300 flex items-center justify-center p-3 rounded-xl border-2 border-red-500 hover:scale-110 hover:shadow-xl hover:rotate-12"
                                                                title="Hapus Modul"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </main>

                {/* Delete Modal */}
                {showDeleteModal && selectedModule && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Hapus Modul</h2>
                            <p className="text-gray-600 mb-6">
                                Apakah Anda yakin ingin menghapus modul <strong>"{selectedModule.title}"</strong>? 
                                Tindakan ini tidak dapat dibatalkan.
                            </p>
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Ketik <span className="text-red-600">"hapus"</span> untuk konfirmasi
                                </label>
                                <input
                                    type="text"
                                    value={deleteConfirmText}
                                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    placeholder="hapus"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setSelectedModule(null);
                                        setDeleteConfirmText('');
                                    }}
                                    className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleDeleteModule}
                                    disabled={deleteConfirmText !== 'hapus'}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes slide-in {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                .animate-slide-in {
                    animation: slide-in 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}
