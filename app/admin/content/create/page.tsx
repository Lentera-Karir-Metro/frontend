"use client";
import AdminSidebar from '@/app/components/AdminSidebar';
import HeaderAdmin from '@/app/components/HeaderAdmin';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createCourse } from '@/lib/courseService';
import { COURSE_CATEGORIES } from '@/lib/constants';

export default function BuatKelas() {
    const router = useRouter();
    const [judulKelas, setJudulKelas] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [harga, setHarga] = useState('');
    const [diskon, setDiskon] = useState('');
    const [kategori, setKategori] = useState('Programming');
    const [mentorName, setMentorName] = useState('');
    const [mentorTitle, setMentorTitle] = useState('');
    const [status, setStatus] = useState('published');
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [mentorPhoto, setMentorPhoto] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
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

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCoverImage(e.target.files[0]);
        }
    };

    const handleMentorPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setMentorPhoto(e.target.files[0]);
        }
    };

    const handleSaveClass = async () => {
        // Validasi
        if (!judulKelas.trim()) {
            showNotification('error', 'Judul kelas harus diisi!');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const courseData = {
                title: judulKelas,
                description: deskripsi,
                price: harga ? parseFloat(harga) : 0,
                discount_amount: diskon ? parseFloat(diskon) : 0,
                category: kategori,
                mentor_name: mentorName,
                mentor_title: mentorTitle,
                status: status,
                thumbnail: coverImage || undefined,
                mentor_photo: mentorPhoto || undefined,
            };

            const result = await createCourse(courseData);
            
            // Redirect to module creation page with courseId
            if (result && result.id) {
                router.push(`/admin/content/create/module?courseId=${result.id}`);
            } else {
                router.push('/admin/content');
            }
        } catch (err: any) {
            console.error('Error saving course:', err);
            setError(err.message || 'Gagal menyimpan kelas');
            showNotification('error', err.message || 'Gagal menyimpan kelas');
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
                    {/* Back Button */}
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-[#6B21FF] text-[#6B21FF] rounded-full font-semibold mb-6 hover:bg-[#6B21FF] hover:text-white hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-lg group"
                    >
                        <svg
                            className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>Kembali</span>
                    </button>

                    {/* Title */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Buat Kelas</h1>
                        <p className="text-gray-500 text-sm">Isi detail dibawah untuk membuat kelas baru</p>
                    </div>

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="space-y-6">
                        {/* Judul Kelas */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Judul Kelas <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Ketik judul kelas disini"
                                value={judulKelas}
                                onChange={(e) => setJudulKelas(e.target.value)}
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
                                placeholder="Ketik deskripsi kelas disini"
                                value={deskripsi}
                                onChange={(e) => setDeskripsi(e.target.value)}
                                rows={5}
                                className="w-full px-6 py-4 rounded-xl border-2 border-[#6B21FF] focus:outline-none focus:ring-2 focus:ring-[#6B21FF] focus:ring-opacity-20 text-gray-700 placeholder-gray-400 resize-none"
                                disabled={loading}
                            />
                        </div>

                        {/* Harga dan Diskon */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Harga (Rp)
                                </label>
                                <input
                                    type="number"
                                    placeholder="150000"
                                    value={harga}
                                    onChange={(e) => setHarga(e.target.value)}
                                    className="w-full px-6 py-4 rounded-xl border-2 border-[#6B21FF] focus:outline-none focus:ring-2 focus:ring-[#6B21FF] focus:ring-opacity-20 text-gray-700 placeholder-gray-400"
                                    disabled={loading}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Diskon (Rp)
                                </label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={diskon}
                                    onChange={(e) => setDiskon(e.target.value)}
                                    className="w-full px-6 py-4 rounded-xl border-2 border-[#6B21FF] focus:outline-none focus:ring-2 focus:ring-[#6B21FF] focus:ring-opacity-20 text-gray-700 placeholder-gray-400"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Kategori dan Status */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Kategori
                                </label>
                                <select
                                    value={kategori}
                                    onChange={(e) => setKategori(e.target.value)}
                                    className="w-full px-6 py-4 rounded-xl border-2 border-[#6B21FF] focus:outline-none focus:ring-2 focus:ring-[#6B21FF] focus:ring-opacity-20 text-gray-700 bg-white cursor-pointer"
                                    disabled={loading}
                                >
                                    <option value="">Pilih Kategori</option>
                                    {COURSE_CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Status
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full px-6 py-4 rounded-xl border-2 border-[#6B21FF] focus:outline-none focus:ring-2 focus:ring-[#6B21FF] focus:ring-opacity-20 text-gray-700 bg-white cursor-pointer"
                                    disabled={loading}
                                >
                                    <option value="published">Published</option>
                                    <option value="draft">Draft</option>
                                </select>
                            </div>
                        </div>

                        {/* Mentor Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Nama Mentor
                                </label>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    value={mentorName}
                                    onChange={(e) => setMentorName(e.target.value)}
                                    className="w-full px-6 py-4 rounded-xl border-2 border-[#6B21FF] focus:outline-none focus:ring-2 focus:ring-[#6B21FF] focus:ring-opacity-20 text-gray-700 placeholder-gray-400"
                                    disabled={loading}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Jabatan Mentor
                                </label>
                                <input
                                    type="text"
                                    placeholder="Senior Developer"
                                    value={mentorTitle}
                                    onChange={(e) => setMentorTitle(e.target.value)}
                                    className="w-full px-6 py-4 rounded-xl border-2 border-[#6B21FF] focus:outline-none focus:ring-2 focus:ring-[#6B21FF] focus:ring-opacity-20 text-gray-700 placeholder-gray-400"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Upload Cover Image */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Thumbnail Kelas
                            </label>
                            <div className="border-2 border-dashed border-[#6B21FF] rounded-xl p-12 text-center bg-white">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Cover Image</h3>
                                <p className="text-sm text-gray-500 mb-6">Drag and drop or click to upload</p>
                                <label htmlFor="cover-upload" className="inline-block">
                                    <div className="bg-[#6B21FF] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#5518CC] transition cursor-pointer">
                                        Upload
                                    </div>
                                    <input
                                        id="cover-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={loading}
                                        className="hidden"
                                    />
                                </label>
                                {coverImage && (
                                    <p className="mt-4 text-sm text-green-600">
                                        File uploaded: {coverImage.name}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Upload Mentor Photo */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Foto Mentor
                            </label>
                            <div className="border-2 border-dashed border-[#6B21FF] rounded-xl p-12 text-center bg-white">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Foto Mentor</h3>
                                <p className="text-sm text-gray-500 mb-6">Drag and drop or click to upload</p>
                                <label htmlFor="mentor-upload" className="inline-block">
                                    <div className="bg-[#6B21FF] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#5518CC] transition cursor-pointer">
                                        Upload
                                    </div>
                                    <input
                                        id="mentor-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleMentorPhotoUpload}
                                        disabled={loading}
                                        className="hidden"
                                    />
                                </label>
                                {mentorPhoto && (
                                    <p className="mt-4 text-sm text-green-600">
                                        File uploaded: {mentorPhoto.name}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                            <div className="pt-6">
                                <button
                                    onClick={handleSaveClass}
                                    disabled={loading || !judulKelas}
                                    className="w-full bg-[#6B21FF] text-white px-6 py-3 rounded-full font-semibold text-lg hover:bg-[#5518CC] transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Menyimpan...' : 'Simpan Kelas'}
                                </button>
                            </div>
                        </div>
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