"use client";
import AdminSidebar from '@/app/components/AdminSidebar';
import HeaderAdmin from '@/app/components/HeaderAdmin';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createCourse } from '@/lib/courseService';
import { COURSE_CATEGORIES } from '@/lib/constants';

export default function BuatKelas() {
    const router = useRouter();
    const coverInputRef = useRef<HTMLInputElement>(null);
    const mentorInputRef = useRef<HTMLInputElement>(null);
    const [judulKelas, setJudulKelas] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [harga, setHarga] = useState('');
    const [diskon, setDiskon] = useState('');
    const [kategori, setKategori] = useState('Programming');
    const [mentorName, setMentorName] = useState('');
    const [mentorTitle, setMentorTitle] = useState('');
    const [status, setStatus] = useState('published');
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [showCoverLightbox, setShowCoverLightbox] = useState(false);
    const [mentorPhoto, setMentorPhoto] = useState<File | null>(null);
    const [mentorPreview, setMentorPreview] = useState<string | null>(null);
    const [showMentorLightbox, setShowMentorLightbox] = useState(false);
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
        const file = e.target.files?.[0];
        if (file) {
            setCoverImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMentorPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setMentorPhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setMentorPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveCover = () => {
        setCoverImage(null);
        setCoverPreview(null);
        if (coverInputRef.current) {
            coverInputRef.current.value = '';
        }
    };

    const handleRemoveMentorPhoto = () => {
        setMentorPhoto(null);
        setMentorPreview(null);
        if (mentorInputRef.current) {
            mentorInputRef.current.value = '';
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
                                        min="0"
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

                            {/* Upload Cover Image - Clean Design */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-3">
                                    Thumbnail Kelas
                                </label>

                                {/* Upload Area - Only show when no preview */}
                                {!coverPreview && (
                                    <div
                                        onClick={() => coverInputRef.current?.click()}
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
                                    ref={coverInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    disabled={loading}
                                />

                                {/* Cover Preview Card */}
                                {coverPreview && (
                                    <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
                                        <div className="relative aspect-video">
                                            <img
                                                src={coverPreview}
                                                alt="Preview"
                                                onClick={() => setShowCoverLightbox(true)}
                                                className="w-full h-full object-cover cursor-zoom-in"
                                            />

                                            {/* Hover Overlay */}
                                            <div
                                                onClick={() => setShowCoverLightbox(true)}
                                                className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-zoom-in flex items-end justify-center pb-4"
                                            >
                                                <span className="text-white/90 text-xs font-medium flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                                    </svg>
                                                    Lihat Penuh
                                                </span>
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                onClick={handleRemoveCover}
                                                disabled={loading}
                                                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-gray-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110 disabled:opacity-50 group"
                                                title="Hapus thumbnail"
                                            >
                                                <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* File Info Footer */}
                                        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-100 bg-gray-50/50">
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <div className="w-8 h-8 rounded-lg bg-[#6B21FF]/10 flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-4 h-4 text-[#6B21FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-gray-700 truncate">
                                                        {coverImage?.name || 'Thumbnail'}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        {coverImage ? `${(coverImage.size / 1024 / 1024).toFixed(2)} MB` : ''}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Upload Mentor Photo - Clean Design */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-3">
                                    Foto Mentor
                                </label>

                                {/* Upload Area - Only show when no preview */}
                                {!mentorPreview && (
                                    <div
                                        onClick={() => mentorInputRef.current?.click()}
                                        className="w-full py-12 rounded-2xl border border-gray-200 bg-gray-50/50 hover:bg-gray-100/80 hover:border-gray-300 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-4 group"
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-white border border-gray-200 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
                                            <svg className="w-6 h-6 text-gray-400 group-hover:text-[#6B21FF] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-gray-600 font-medium text-sm group-hover:text-gray-900 transition-colors">Upload Foto Mentor</p>
                                            <p className="text-gray-400 text-xs mt-1">PNG, JPG hingga 5MB</p>
                                        </div>
                                    </div>
                                )}

                                <input
                                    ref={mentorInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleMentorPhotoUpload}
                                    className="hidden"
                                    disabled={loading}
                                />

                                {/* Mentor Preview Card - Circular Profile Style */}
                                {mentorPreview && (
                                    <div className="relative bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-6">
                                        {/* Circular Photo Container */}
                                        <div className="flex flex-col items-center">
                                            <div className="relative group">
                                                {/* Profile Ring */}
                                                <div className="w-32 h-32 rounded-full bg-gray-200 p-1 shadow-sm">
                                                    <img
                                                        src={mentorPreview}
                                                        alt="Preview Mentor"
                                                        onClick={() => setShowMentorLightbox(true)}
                                                        className="w-full h-full object-cover rounded-full cursor-zoom-in bg-white"
                                                    />
                                                </div>

                                                {/* Hover Overlay for zoom hint */}
                                                <div
                                                    onClick={() => setShowMentorLightbox(true)}
                                                    className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 transition-all duration-200 cursor-zoom-in flex items-center justify-center"
                                                >
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                        <svg className="w-6 h-6 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                {/* Remove Button - positioned outside the ring */}
                                                <button
                                                    onClick={handleRemoveMentorPhoto}
                                                    disabled={loading}
                                                    className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-white text-gray-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg hover:scale-110 disabled:opacity-50 border border-gray-100 group"
                                                    title="Hapus foto mentor"
                                                >
                                                    <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>

                                            {/* File Info - Below Photo */}
                                            <div className="mt-4 text-center">
                                                <p className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                                                    {mentorPhoto?.name || 'Foto Mentor'}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    {mentorPhoto ? `${(mentorPhoto.size / 1024 / 1024).toFixed(2)} MB` : ''}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
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

            {/* Cover Lightbox Modal */}
            {showCoverLightbox && coverPreview && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center animate-lightbox-in"
                    onClick={() => setShowCoverLightbox(false)}
                >
                    <div className="absolute inset-0 bg-black/90" />

                    <button
                        onClick={() => setShowCoverLightbox(false)}
                        className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm text-white/80 hover:bg-white hover:text-gray-900 flex items-center justify-center transition-all duration-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div
                        className="relative z-10 max-w-[85vw] max-h-[85vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={coverPreview}
                            alt="Full size preview"
                            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                        />
                    </div>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
                        <div className="bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full text-white/90 text-sm">
                            <span className="font-medium truncate max-w-[250px]">{coverImage?.name || 'Thumbnail'}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Mentor Photo Lightbox Modal */}
            {showMentorLightbox && mentorPreview && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center animate-lightbox-in"
                    onClick={() => setShowMentorLightbox(false)}
                >
                    <div className="absolute inset-0 bg-black/90" />

                    <button
                        onClick={() => setShowMentorLightbox(false)}
                        className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm text-white/80 hover:bg-white hover:text-gray-900 flex items-center justify-center transition-all duration-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div
                        className="relative z-10 max-w-[85vw] max-h-[85vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={mentorPreview}
                            alt="Full size mentor photo"
                            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                        />
                    </div>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
                        <div className="bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full text-white/90 text-sm">
                            <span className="font-medium truncate max-w-[250px]">{mentorPhoto?.name || 'Foto Mentor'}</span>
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