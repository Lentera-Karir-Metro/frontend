"use client";
import AdminSidebar from '@/app/components/AdminSidebar';
import HeaderAdmin from '@/app/components/HeaderAdmin';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    getCertificateTemplates,
    type CertificateTemplate
} from '@/lib/certificateService';

export default function CertificatePage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Upload Template States
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [templatePreview, setTemplatePreview] = useState<string | null>(null);
    const [showLightbox, setShowLightbox] = useState(false);
    const [templateName, setTemplateName] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    // Notification
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    // Delete Template Modal States
    const [showDeleteTemplateModal, setShowDeleteTemplateModal] = useState(false);
    const [selectedTemplateToDelete, setSelectedTemplateToDelete] = useState<CertificateTemplate | null>(null);
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

    // Show notification helper
    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
    };

    // Fetch data
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const templatesData = await getCertificateTemplates();
            setTemplates(templatesData);
        } catch (err: any) {
            console.error('Error fetching data:', err);
            setError(err.message || 'Gagal memuat data');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleDeleteTemplate = async () => {
        if (!selectedTemplateToDelete) return;

        if (deleteConfirmText !== 'hapus') {
            showNotification('error', 'Ketik "hapus" untuk konfirmasi');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/certificates/admin/templates/${selectedTemplateToDelete.id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Gagal menghapus template');
            }

            showNotification('success', 'Template berhasil dihapus!');
            setShowDeleteTemplateModal(false);
            setSelectedTemplateToDelete(null);
            setDeleteConfirmText('');
            fetchData(); // Refresh templates
        } catch (err: any) {
            console.error('Error deleting template:', err);
            showNotification('error', err.message || 'Gagal menghapus template');
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];

            if (!validTypes.includes(file.type)) {
                showNotification('error', 'Format file harus JPG atau PNG');
                return;
            }

            // Check file size (max 50MB)
            if (file.size > 50 * 1024 * 1024) {
                showNotification('error', 'Ukuran file maksimal 50MB');
                return;
            }

            setSelectedFile(file);

            // Generate preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setTemplatePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setTemplatePreview(null);
        setTemplateName('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUploadTemplate = async () => {
        if (!selectedFile || !templateName) {
            showNotification('error', 'Mohon pilih file dan isi nama template');
            return;
        }

        try {
            setIsUploading(true);
            const formData = new FormData();
            formData.append('template', selectedFile);
            formData.append('name', templateName);

            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/certificates/admin/templates`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Gagal upload template');
            }

            showNotification('success', 'Template berhasil diupload!');
            setSelectedFile(null);
            setTemplatePreview(null);
            setTemplateName('');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            fetchData(); // Refresh templates
        } catch (err: any) {
            console.error('Error uploading template:', err);
            showNotification('error', err.message || 'Gagal upload template');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />

            <div className="flex-1 ml-[250px]">
                <HeaderAdmin />

                <main className="p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Manajemen Sertifikat</h1>
                        <p className="text-gray-600 mt-2">Kelola template sertifikat untuk auto-generate ketika user menyelesaikan course</p>
                    </div>

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <p className="text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#6B21FF]"></div>
                            <p className="text-gray-500 ml-3">Memuat data...</p>
                        </div>
                    ) : (
                        <>
                            {/* Info Banner */}
                            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 mb-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">Sistem Auto-Generate Sertifikat</h3>
                                        <p className="text-gray-700 mb-3">
                                            Sertifikat akan <strong>otomatis dibuat</strong> ketika user menyelesaikan semua modul di suatu course.
                                        </p>
                                        <ul className="space-y-2 text-sm text-gray-600">
                                            <li className="flex items-center gap-2">
                                                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>Upload template sertifikat di bawah ini</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>Assign template ke course di halaman Edit Course</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>Sistem akan otomatis generate sertifikat untuk setiap user yang menyelesaikan course</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Upload Template Section */}
                            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8 shadow-sm">
                                <h2 className="text-xl font-bold text-gray-900 mb-2">Upload Desain Sertifikat</h2>
                                <p className="text-gray-500 text-sm mb-6">Format: JPG, PNG (Maks. 50MB)</p>

                                {/* Upload Area - Show when no file selected */}
                                {!templatePreview && (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full py-16 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-[#6B21FF] cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-4 group"
                                    >
                                        <div className="w-16 h-16 rounded-2xl bg-white border border-gray-200 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
                                            <svg className="w-8 h-8 text-gray-400 group-hover:text-[#6B21FF] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-gray-600 font-medium group-hover:text-gray-900 transition-colors">Klik untuk upload template sertifikat</p>
                                            <p className="text-gray-400 text-sm mt-1">atau drag & drop file disini</p>
                                        </div>
                                    </div>
                                )}

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />

                                {/* Preview Card - Show when file is selected */}
                                {templatePreview && (
                                    <div className="space-y-4">
                                        <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300 max-w-lg mx-auto">
                                            <div className="relative aspect-[4/3]">
                                                <img
                                                    src={templatePreview}
                                                    alt="Preview Template"
                                                    onClick={() => setShowLightbox(true)}
                                                    className="w-full h-full object-contain bg-gray-50 cursor-zoom-in p-4"
                                                />

                                                {/* Hover Overlay */}
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

                                                {/* Remove Button */}
                                                <button
                                                    onClick={handleRemoveFile}
                                                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-gray-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110 group"
                                                    title="Hapus template"
                                                >
                                                    <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>

                                            {/* File Info Footer */}
                                            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-8 h-8 rounded-lg bg-[#6B21FF]/10 flex items-center justify-center flex-shrink-0">
                                                        <svg className="w-4 h-4 text-[#6B21FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-medium text-gray-700 truncate">
                                                            {selectedFile?.name || 'Template'}
                                                        </p>
                                                        <p className="text-xs text-gray-400">
                                                            {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : ''}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Template Name Input */}
                                        <div className="max-w-lg mx-auto">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Template</label>
                                            <input
                                                type="text"
                                                placeholder="Contoh: Template Sertifikat Dasar"
                                                value={templateName}
                                                onChange={(e) => setTemplateName(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6B21FF] focus:border-[#6B21FF] text-gray-900 transition-all"
                                            />
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-3 justify-center pt-2">
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition"
                                            >
                                                Ganti File
                                            </button>
                                            <button
                                                onClick={handleUploadTemplate}
                                                disabled={isUploading || !templateName}
                                                className="bg-[#6B21FF] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#5518CC] transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                                            >
                                                {isUploading ? (
                                                    <>
                                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Uploading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                        </svg>
                                                        Simpan Template
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Template Gallery */}
                            <div className="mb-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Template Sertifikat lainnya</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {templates.map((template) => (
                                        <div key={template.id} className="relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition">
                                            {/* Delete template button (top-right) */}
                                            <button
                                                onClick={() => {
                                                    setSelectedTemplateToDelete(template);
                                                    setShowDeleteTemplateModal(true);
                                                }}
                                                title="Hapus template"
                                                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-gray-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110 group"
                                            >
                                                <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>

                                            <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center p-4">
                                                {template.preview_url ? (
                                                    <img
                                                        src={template.preview_url}
                                                        alt={template.name}
                                                        className="w-full h-full object-contain"
                                                    />
                                                ) : (
                                                    <div className="text-center">
                                                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        <p className="text-sm text-gray-500">No Preview</p>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4 text-center bg-gray-50">
                                                <p className="font-semibold text-gray-900">{template.name}</p>
                                            </div>
                                        </div>
                                    ))}

                                    {templates.length === 0 && (
                                        <div className="col-span-full text-center py-12">
                                            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <p className="text-gray-500">Belum ada template tersedia</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </main>

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

                {/* Delete Template Confirmation Modal */}
                {showDeleteTemplateModal && selectedTemplateToDelete && (
                    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-8 max-w-md w-full animate-scale-up shadow-2xl">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Konfirmasi Hapus Template</h2>
                            <p className="text-gray-600 mb-2">
                                Apakah Anda yakin ingin menghapus template <strong>{selectedTemplateToDelete.name}</strong>?
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
                                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-500 transition-colors text-gray-600 placeholder-gray-400"
                                    autoFocus
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteTemplateModal(false);
                                        setSelectedTemplateToDelete(null);
                                        setDeleteConfirmText('');
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleDeleteTemplate}
                                    disabled={deleteConfirmText !== 'hapus'}
                                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Lightbox Modal */}
                {showLightbox && templatePreview && (
                    <div
                        className="fixed inset-0 z-[100] flex items-center justify-center animate-fade-in"
                        onClick={() => setShowLightbox(false)}
                    >
                        <div className="absolute inset-0 bg-black/90" />

                        {/* Close Button */}
                        <button
                            onClick={() => setShowLightbox(false)}
                            className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm text-white/80 hover:bg-white hover:text-gray-900 flex items-center justify-center transition-all duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Image */}
                        <div
                            className="relative z-10 max-w-[90vw] max-h-[90vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={templatePreview}
                                alt="Full size preview"
                                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                            />
                        </div>

                        {/* Bottom Info */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
                            <div className="bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full text-white/90 text-sm">
                                <span className="font-medium truncate max-w-[300px]">{selectedFile?.name || 'Template Sertifikat'}</span>
                            </div>
                        </div>
                    </div>
                )}

                <style jsx>{`
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                        }
                        to {
                            opacity: 1;
                        }
                    }
                    .animate-fade-in {
                        animation: fadeIn 0.2s ease-out;
                    }
                `}</style>
            </div>
        </div>
    );
}
