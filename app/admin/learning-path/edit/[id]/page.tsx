"use client";
import AdminSidebar from '@/app/components/AdminSidebar';
import HeaderAdmin from '@/app/components/HeaderAdmin';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    getLearningPathById,
    updateLearningPath
} from '@/lib/learningPathService';
import { getAllCourses, type Course } from '@/lib/courseService';

interface PathCourse {
    id: string;
    courseId: string;
    title: string;
    order: number;
}

export default function EditLearningPath() {
    const router = useRouter();
    const params = useParams();
    const learningPathId = params.id as string;

    const [judulPath, setJudulPath] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [existingThumbnail, setExistingThumbnail] = useState<string | null>(null);
    const [pathCourses, setPathCourses] = useState<PathCourse[]>([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [draggedItem, setDraggedItem] = useState<string | null>(null);
    const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [loadingData, setLoadingData] = useState(true);
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

    // Fetch learning path data dan courses
    useEffect(() => {
        fetchData();
        fetchCourses();
    }, [learningPathId]);

    const fetchData = async () => {
        try {
            setLoadingData(true);
            const data = await getLearningPathById(learningPathId);
            setJudulPath(data.title);
            setDeskripsi(data.description || '');

            // Set existing thumbnail
            if ((data as any).thumbnail) {
                setExistingThumbnail((data as any).thumbnail);
            }

            // Convert courses to PathCourse format
            if (data.courses) {
                const courses = data.courses
                    .sort((a, b) => {
                        const aSeq = a.LearningPathCourse?.sequence_order || 0;
                        const bSeq = b.LearningPathCourse?.sequence_order || 0;
                        return aSeq - bSeq;
                    })
                    .map((course, index) => ({
                        id: course.id,
                        courseId: course.id,
                        title: course.title,
                        order: index + 1
                    }));
                setPathCourses(courses);
            }
        } catch (err: any) {
            console.error('Error fetching learning path:', err);
            setError('Gagal memuat data learning path');
        } finally {
            setLoadingData(false);
        }
    };

    const fetchCourses = async () => {
        try {
            setLoadingCourses(true);
            const courses = await getAllCourses();
            setAvailableCourses(courses);
        } catch (err: any) {
            console.error('Error fetching courses:', err);
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
                    id: course.id,
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

    const handleUpdatePath = async () => {
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

            await updateLearningPath(learningPathId, judulPath, deskripsi, courseIds, thumbnail);
            showNotification('success', 'Learning Path berhasil diperbarui!');
            setTimeout(() => {
                router.push('/admin/learning-path');
            }, 2000);
        } catch (err: any) {
            console.error('Error updating learning path:', err);
            setError(err.message || 'Gagal memperbarui learning path');
            showNotification('error', err.message || 'Gagal memperbarui learning path');
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <AdminSidebar />
                <div className="flex-1 ml-[250px]">
                    <HeaderAdmin />
                    <main className="p-8">
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B21FF]"></div>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

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
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Learning Path</h1>
                        <p className="text-gray-500 text-sm">Perbarui detail learning path</p>
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
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Thumbnail
                                    </label>
                                    {existingThumbnail && !thumbnailPreview && (
                                        <div className="mb-3">
                                            <img
                                                src={existingThumbnail}
                                                alt="Current thumbnail"
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                            <p className="text-sm text-gray-500 mt-2">Thumbnail saat ini</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleThumbnailChange}
                                        className="w-full px-6 py-4 rounded-xl border-2 border-[#6B21FF] focus:outline-none focus:ring-2 focus:ring-[#6B21FF] focus:ring-opacity-20 text-gray-700"
                                        disabled={loading}
                                    />
                                    {thumbnailPreview && (
                                        <div className="mt-3">
                                            <img
                                                src={thumbnailPreview}
                                                alt="Preview thumbnail"
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                            <p className="text-sm text-gray-500 mt-2">Preview thumbnail baru</p>
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
                                            Belum ada course ditambahkan
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8 flex justify-center gap-4">
                        <button
                            onClick={() => router.push('/admin/learning-path')}
                            className="px-8 py-4 rounded-full font-bold text-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                            disabled={loading}
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleUpdatePath}
                            disabled={loading || pathCourses.length === 0 || !judulPath.trim()}
                            className="px-8 py-4 bg-[#6B21FF] text-white rounded-full font-bold text-lg hover:bg-[#5518CC] transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Memperbarui...
                                </>
                            ) : (
                                'Update Learning Path'
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
            `}</style>
        </div>
    );
}
