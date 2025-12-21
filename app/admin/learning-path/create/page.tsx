"use client";
import AdminSidebar from '@/app/components/AdminSidebar';
import HeaderAdmin from '@/app/components/HeaderAdmin';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Course {
    id: number;
    title: string;
}

interface PathCourse {
    id: number;
    courseId: number;
    title: string;
    order: number;
}

export default function BuatLearningPath() {
    const router = useRouter();
    const [judulPath, setJudulPath] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [pathCourses, setPathCourses] = useState<PathCourse[]>([
        { id: 1, courseId: 1, title: 'Introduction to Digital Marketing', order: 1 },
        { id: 2, courseId: 2, title: 'Introduction to Digital Marketing', order: 2 },
        { id: 3, courseId: 3, title: 'Introduction to Digital Marketing', order: 3 },
    ]);
    const [selectedCourse, setSelectedCourse] = useState('');

    // Dummy courses untuk dropdown
    const availableCourses: Course[] = [
        { id: 1, title: 'Introduction to Digital Marketing' },
        { id: 2, title: 'SEO Fundamental' },
        { id: 3, title: 'Content Marketing Strategist' },
        { id: 4, title: 'Social Media Marketing' },
        { id: 5, title: 'Email Marketing Basics' },
    ];

    const handleAddCourse = () => {
        if (selectedCourse) {
            const course = availableCourses.find(c => c.id.toString() === selectedCourse);
            if (course) {
                const newPathCourse: PathCourse = {
                    id: pathCourses.length + 1,
                    courseId: course.id,
                    title: course.title,
                    order: pathCourses.length + 1,
                };
                setPathCourses([...pathCourses, newPathCourse]);
                setSelectedCourse('');
            }
        }
    };

    const handleDeleteCourse = (id: number) => {
        setPathCourses(pathCourses.filter(c => c.id !== id));
    };

    const handleSavePath = () => {
        console.log('Save path:', { judulPath, deskripsi, pathCourses });
        alert('Learning Path berhasil disimpan!');
        router.push('/admin/learning-path');
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />

            {/* Main Content */}
            <div className="flex-1 ml-[250px]">
                <HeaderAdmin />

                {/* Form Content */}
                <main className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Form */}
                        <div className="lg:col-span-2">
                            {/* Title */}
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">Buat Learning Path</h1>
                                <p className="text-gray-500 text-sm">Isi detail dibawah untuk membuat learning path baru</p>
                            </div>

                            {/* Form */}
                            <div className="space-y-6">
                                {/* Judul Path */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Judul Path
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ketik judul path disini"
                                        value={judulPath}
                                        onChange={(e) => setJudulPath(e.target.value)}
                                        className="w-full px-6 py-4 rounded-xl border-2 border-[#6B21FF] focus:outline-none focus:ring-2 focus:ring-[#6B21FF] focus:ring-opacity-20 text-gray-700 placeholder-gray-400"
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
                                    />
                                </div>

                                {/* Tambahkan Kelas ke Path */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-4">
                                        Tambahkan Kelas ke Path
                                    </label>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleAddCourse}
                                            className="w-12 h-12 bg-[#6B21FF] text-white rounded-lg flex items-center justify-center hover:bg-[#5518CC] transition flex-shrink-0"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                        <select
                                            value={selectedCourse}
                                            onChange={(e) => setSelectedCourse(e.target.value)}
                                            className="flex-1 px-6 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#6B21FF] text-gray-700 bg-white cursor-pointer"
                                        >
                                            <option value="">Pilih Kelas</option>
                                            {availableCourses.map((course) => (
                                                <option key={course.id} value={course.id.toString()}>
                                                    {course.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Learning Path Flow */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Path Flow</h3>
                                <div className="space-y-3">
                                    {pathCourses.map((course) => (
                                        <div
                                            key={course.id}
                                            className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
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
                    <div className="mt-8 max-w-2xl">
                        <button
                            onClick={handleSavePath}
                            className="w-full bg-[#6B21FF] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#5518CC] transition"
                        >
                            Simpan Learning Path
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}