"use client";
import AdminSidebar from '@/app/components/AdminSidebar';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Module {
    id: number;
    title: string;
    moduleNumber: number;
}

export default function BuatKelas() {
    const router = useRouter();
    const [judulKelas, setJudulKelas] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [harga, setHarga] = useState('');
    const [modules, setModules] = useState<Module[]>([
        { id: 1, title: 'Introduction to Digital Marketing', moduleNumber: 1 },
        { id: 2, title: 'SEO Fundamental', moduleNumber: 2 },
        { id: 3, title: 'Content Marketing Strategist', moduleNumber: 3 },
    ]);
    const [coverImage, setCoverImage] = useState<File | null>(null);

    const handleAddModule = () => {
        router.push('/admin/content/create/module');
    };

    const handleDeleteModule = (moduleId: number) => {
        setModules(modules.filter(m => m.id !== moduleId));
    };

    const handleEditModule = (moduleId: number) => {
        console.log('Edit module:', moduleId);
        // Implement edit functionality
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCoverImage(e.target.files[0]);
        }
    };

    const handleSaveClass = () => {
        console.log('Save class:', { judulKelas, deskripsi, harga, modules, coverImage });
        // Implement save functionality
        alert('Kelas berhasil disimpan!');
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />

            {/* Main Content */}
            <div className="flex-1 ml-[250px]">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-8 py-4">
                    <div className="flex justify-end items-center">
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-sm font-semibold text-gray-900">Budi Budiman</p>
                                <p className="text-xs text-gray-500">Admin</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                </svg>
                            </div>
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </header>

                {/* Form Content */}
                <main className="p-8 max-w-5xl mx-auto">
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

                    {/* Form */}
                    <div className="space-y-6">
                        {/* Judul Kelas */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Judul Kelas
                            </label>
                            <input
                                type="text"
                                placeholder="Ketik judul kelas disini"
                                value={judulKelas}
                                onChange={(e) => setJudulKelas(e.target.value)}
                                className="w-full px-6 py-4 rounded-xl border-2 border-[#6B21FF] focus:outline-none focus:ring-2 focus:ring-[#6B21FF] focus:ring-opacity-20 text-gray-700 placeholder-gray-400"
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
                            />
                        </div>

                        {/* Harga */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Harga
                            </label>
                            <input
                                type="text"
                                placeholder="Ketik harga kelas disini"
                                value={harga}
                                onChange={(e) => setHarga(e.target.value)}
                                className="w-full px-6 py-4 rounded-xl border-2 border-[#6B21FF] focus:outline-none focus:ring-2 focus:ring-[#6B21FF] focus:ring-opacity-20 text-gray-700 placeholder-gray-400"
                            />
                        </div>

                        {/* Upload Cover Image */}
                        <div>
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

                        {/* Modul Kelas */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Modul Kelas</h2>
                                <button
                                    onClick={handleAddModule}
                                    className="bg-[#6B21FF] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#5518CC] transition flex items-center gap-2"
                                >
                                    Tambah Modul
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                            </div>

                            {/* Module List */}
                            <div className="space-y-3">
                                {modules.map((module) => (
                                    <div
                                        key={module.id}
                                        className="bg-white border border-gray-200 rounded-xl p-6 flex justify-between items-center hover:shadow-md transition"
                                    >
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900">{module.title}</h3>
                                            <p className="text-xs text-gray-500 mt-1">Modul {module.moduleNumber}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {/* Edit Button */}
                                            <button
                                                onClick={() => handleEditModule(module.id)}
                                                className="text-[#6B21FF] hover:text-[#5518CC] transition"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            {/* Delete Button */}
                                            <button
                                                onClick={() => handleDeleteModule(module.id)}
                                                className="text-red-500 hover:text-red-700 transition"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6">
                            <button
                                onClick={handleSaveClass}
                                className="w-full bg-[#6B21FF] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#5518CC] transition"
                            >
                                Simpan Kelas
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
