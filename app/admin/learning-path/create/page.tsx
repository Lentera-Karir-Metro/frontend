"use client";
import AdminSidebar from '@/app/components/AdminSidebar';
import HeaderAdmin from '@/app/components/HeaderAdmin';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createLearningPath } from '@/lib/learningPathService';
import { getAllCourses, type Course } from '@/lib/courseService';

interface PathCourse {
    id: string;
    courseId: string;
    title: string;
    order: number;
}

export default function BuatLearningPath() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [judulPath, setJudulPath] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [showLightbox, setShowLightbox] = useState(false);
    const [pathCourses, setPathCourses] = useState<PathCourse[]>([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [draggedItem, setDraggedItem] = useState<string | null>(null);
    const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [error, setError] = useState<string | null>(null);
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

    // Fetch courses dari backend
    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoadingCourses(true);
            const courses = await getAllCourses();
            setAvailableCourses(courses);
        } catch (err: any) {
            console.error('Error fetching courses:', err);
            setError('Gagal memuat daftar course');
        } finally {
            setLoadingCourses(false);
        }
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setThumbnail(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddCourse = () => {
        if (selectedCourse) {
            const course = availableCourses.find(c => c.id === selectedCourse);
            if (course && !pathCourses.find(pc => pc.courseId === course.id)) {
                const newPathCourse: PathCourse = {
                    id: `temp-${Date.now()}`,
                    courseId: course.id,
                    title: course.title,
                    order: pathCourses.length + 1,
                };
                setPathCourses([...pathCourses, newPathCourse]);
                setSelectedCourse('');
            }
        }
    };

    const handleDeleteCourse = (id: string) => {
        const updatedCourses = pathCourses
            .filter(c => c.id !== id)
            .map((course, index) => ({
                ...course,
                order: index + 1
            }));
        setPathCourses(updatedCourses);
    };

    // Drag and Drop handlers
    const handleDragStart = (e: React.DragEvent, id: string) => {
        setDraggedItem(id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, targetId: string) => {
        e.preventDefault();

        if (draggedItem === null || draggedItem === targetId) {
            setDraggedItem(null);
            return;
        }

        const draggedIndex = pathCourses.findIndex(c => c.id === draggedItem);
        const targetIndex = pathCourses.findIndex(c => c.id === targetId);

        if (draggedIndex === -1 || targetIndex === -1) return;

        const newCourses = [...pathCourses];
        const [draggedCourse] = newCourses.splice(draggedIndex, 1);
        newCourses.splice(targetIndex, 0, draggedCourse);

        // Update order
        const updatedCourses = newCourses.map((course, index) => ({
            ...course,
            order: index + 1
        }));

        setPathCourses(updatedCourses);
        setDraggedItem(null);
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
    };

    const handleSavePath = async () => {
        // Validasi
        if (!judulPath.trim()) {
            showNotification('error', 'Judul path harus diisi!');
            return;
        }

        if (pathCourses.length === 0) {
            showNotification('error', 'Learning path harus memiliki minimal 1 course!');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Ambil course IDs dalam urutan yang benar
            const courseIds = pathCourses
                .sort((a, b) => a.order - b.order)
                .map(pc => pc.courseId);

            await createLearningPath(judulPath, deskripsi, courseIds, thumbnail);
            showNotification('success', 'Learning Path berhasil disimpan!');
            setTimeout(() => {
                router.push('/admin/learning-path');
            }, 2000);
        } catch (err: any) {
            console.error('Error saving learning path:', err);
            setError(err.message || 'Gagal menyimpan learning path');
            showNotification('error', err.message || 'Gagal menyimpan learning path');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />

            {/* Main Content */}
            <div className="flex-1 ml-[250px]">
                <HeaderAdmin />

                {/* Form Content */}
                <main className="p-8">
                    {/* Title */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Buat Learning Path</h1>
                        <p className="text-gray-500 text-sm">Isi detail dibawah untuk membuat learning path baru</p>
                    </div>

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Column - Form */}
                        <div className="lg:col-span-6">

                            {/* Form */}
                            <div className="space-y-6">
                                {/* Judul Path */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Judul Path <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ketik judul path disini"
                                        value={judulPath}
                                        onChange={(e) => setJudulPath(e.target.value)}
                                        className="w-full px-6 py-4 rounded-xl border-2 border-[#6B21FF] focus:outline-none focus:ring-2 focus:ring-[#6B21FF] focus:ring-opacity-20 text-gray-700 placeholder-gray-400"
                                        disabled={loading}
                                    />
                                </div>

                                {/* Deskripsi */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Deskripsi
                                    </label>
                                    <textarea
                                        placeholder="Ketik deskripsi path disini"
                                        value={deskripsi}
                                        onChange={(e) => setDeskripsi(e.target.value)}
                                        rows={5}
                                        className="w-full px-6 py-4 rounded-xl border-2 border-[#6B21FF] focus:outline-none focus:ring-2 focus:ring-[#6B21FF] focus:ring-opacity-20 text-gray-700 placeholder-gray-400 resize-none"
                                        disabled={loading}
                                    />
                                </div>

                                {/* Thumbnail */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                                        Thumbnail
                                    </label>

                                    {/* Upload Area - Minimalist Design */}
                                    {!thumbnailPreview && (
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full py-12 rounded-2xl border border-gray-200 bg-gray-50/50 hover:bg-gray-100/80 hover:border-gray-300 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-4 group"
                                        >
                                            <div className="w-14 h-14 rounded-2xl bg-white border border-gray-200 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
                                                <svg className="w-6 h-6 text-gray-400 group-hover:text-[#6B21FF] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-gray-600 font-medium text-sm group-hover:text-gray-900 transition-colors">Upload Thumbnail</p>
                                                <p className="text-gray-400 text-xs mt-1">PNG, JPG hingga 5MB</p>
                                            </div>
                                        </div>
                                    )}

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleThumbnailChange}
                                        className="hidden"
                                        disabled={loading}
                                    />

                                    {/* Thumbnail Preview - Clean Minimal Design */}
                                    {thumbnailPreview && (
                                        <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
                                            {/* Image Container */}
                                            <div className="relative aspect-video">
                                                <img
                                                    src={thumbnailPreview}
                                                    alt="Preview"
                                                    onClick={() => setShowLightbox(true)}
                                                    className="w-full h-full object-cover cursor-zoom-in"
                                                />

                                                {/* Hover Overlay - Subtle */}
                                                <div
                                                    onClick={() => setShowLightbox(true)}
                                                    className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-zoom-in flex items-end justify-center pb-4"
                                                >
                                                    <span className="text-white/90 text-xs font-medium flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                                        </svg>
                                                        Lihat Penuh
                                                    </span>
                                                </div>

                                                {/* Remove Button - Top Right Corner */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setThumbnail(null);
                                                        setThumbnailPreview(null);
                                                        if (fileInputRef.current) {
                                                            fileInputRef.current.value = '';
                                                        }
                                                    }}
                                                    disabled={loading}
                                                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-gray-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110 disabled:opacity-50"
                                                    title="Hapus thumbnail"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>

                                            {/* File Info - Minimal Footer */}
                                            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-100 bg-gray-50/50">
                                                <div className="flex items-center gap-2.5 min-w-0">
                                                    <div className="w-8 h-8 rounded-lg bg-[#6B21FF]/10 flex items-center justify-center flex-shrink-0">
                                                        <svg className="w-4 h-4 text-[#6B21FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-medium text-gray-700 truncate">
                                                            {thumbnail?.name || 'Thumbnail'}
                                                        </p>
                                                        <p className="text-xs text-gray-400">
                                                            {thumbnail ? `${(thumbnail.size / 1024 / 1024).toFixed(2)} MB` : ''}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Tambahkan Kelas ke Path */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Tambahkan Course ke Path <span className="text-red-500">*</span>
                                    </label>
                                    {loadingCourses ? (
                                        <div className="flex items-center justify-center py-4">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#6B21FF]"></div>
                                            <span className="ml-2 text-gray-500">Memuat courses...</span>
                                        </div>
                                    ) : (
                                        <div className="flex gap-3">
                                            <select
                                                value={selectedCourse}
                                                onChange={(e) => setSelectedCourse(e.target.value)}
                                                className="flex-1 px-6 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#6B21FF] text-gray-700 bg-white cursor-pointer"
                                                disabled={loading}
                                            >
                                                <option value="">Pilih Course</option>
                                                {availableCourses
                                                    .filter(course => !pathCourses.find(pc => pc.courseId === course.id))
                                                    .map((course) => (
                                                        <option key={course.id} value={course.id}>
                                                            {course.title}
                                                        </option>
                                                    ))}
                                            </select>
                                            <button
                                                onClick={handleAddCourse}
                                                disabled={!selectedCourse || loading}
                                                className="w-12 h-12 bg-[#6B21FF] text-white rounded-lg flex items-center justify-center hover:bg-[#5518CC] transition flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Learning Path Flow */}
                        <div className="lg:col-span-6 mt-[28px]">
                            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Path Flow</h3>
                                <div className="space-y-3">
                                    {pathCourses.map((course) => (
                                        <div
                                            key={course.id}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, course.id)}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => handleDrop(e, course.id)}
                                            onDragEnd={handleDragEnd}
                                            className={`flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-move transition-all ${draggedItem === course.id ? 'opacity-50 scale-95' : 'hover:shadow-md'
                                                }`}
                                        >
                                            {/* Drag Handle */}
                                            <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M9 3h2v2H9V3zm0 4h2v2H9V7zm0 4h2v2H9v-2zm0 4h2v2H9v-2zm0 4h2v2H9v-2zM13 3h2v2h-2V3zm0 4h2v2h-2V7zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z" />
                                            </svg>

                                            {/* Course Title */}
                                            <span className="flex-1 text-sm text-gray-900 line-clamp-2">{course.title}</span>

                                            {/* Delete Button */}
                                            <button
                                                onClick={() => handleDeleteCourse(course.id)}
                                                className="text-red-500 hover:text-red-700 transition flex-shrink-0"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}

                                    {pathCourses.length === 0 && (
                                        <p className="text-sm text-gray-500 text-center py-8">
                                            Belum ada kelas ditambahkan
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={handleSavePath}
                            disabled={loading || pathCourses.length === 0 || !judulPath.trim()}
                            className="w-full max-w-2xl bg-[#6B21FF] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#5518CC] transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Menyimpan...
                                </>
                            ) : (
                                'Simpan Learning Path'
                            )}
                        </button>
                    </div>
                </main>
            </div>

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

            {/* Lightbox Modal - Clean Minimal Design */}
            {showLightbox && thumbnailPreview && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center animate-lightbox-in"
                    onClick={() => setShowLightbox(false)}
                >
                    {/* Backdrop - Subtle blur */}
                    <div className="absolute inset-0 bg-black/90" />

                    {/* Close Button - Fixed Top Right */}
                    <button
                        onClick={() => setShowLightbox(false)}
                        className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm text-white/80 hover:bg-white hover:text-gray-900 flex items-center justify-center transition-all duration-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Image Container - Clean without frame */}
                    <div
                        className="relative z-10 max-w-[85vw] max-h-[85vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={thumbnailPreview}
                            alt="Full size preview"
                            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                        />
                    </div>

                    {/* Bottom Info - Minimal */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
                        <div className="bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full text-white/90 text-sm">
                            <span className="font-medium truncate max-w-[250px]">{thumbnail?.name || 'Thumbnail'}</span>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
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
                .animate-slide-in {
                    animation: slideIn 0.3s ease-out;
                }
                @keyframes lightboxIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-lightbox-in {
                    animation: lightboxIn 0.2s ease-out;
                }
            `}</style>
        </div>
    );
}