"use client";
import AdminSidebar from '@/app/components/AdminSidebar';
import HeaderAdmin from '@/app/components/HeaderAdmin';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    getCertificateCandidates,
    getCertificateTemplates,
    type CertificateCandidate,
    type CertificateTemplate
} from '@/lib/certificateService';

export default function CertificatePage() {
    const router = useRouter();
    const [candidates, setCandidates] = useState<CertificateCandidate[]>([]);
    const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Upload Template States
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [templateName, setTemplateName] = useState('');
    const [isUploading, setIsUploading] = useState(false);

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

    // Fetch data
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const [candidatesData, templatesData] = await Promise.all([
                getCertificateCandidates(),
                getCertificateTemplates()
            ]);
            
            setCandidates(candidatesData);
            setTemplates(templatesData);
        } catch (err: any) {
            console.error('Error fetching data:', err);
            setError(err.message || 'Gagal memuat data');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateClick = (candidate: CertificateCandidate) => {
        // Navigate to generate page with candidate data
        const params = new URLSearchParams({
            userId: candidate.user_id.toString(),
            courseId: candidate.course_id.toString(),
            userName: encodeURIComponent(candidate.user_name),
            courseTitle: encodeURIComponent(candidate.course_title)
        });
        router.push(`/admin/certificates/generate?${params.toString()}`);
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
            setTemplateName('');
            fetchData(); // Refresh templates
        } catch (err: any) {
            console.error('Error uploading template:', err);
            showNotification('error', err.message || 'Gagal upload template');
        } finally {
            setIsUploading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />

            <div className="flex-1 ml-[250px]">
                <HeaderAdmin />

                <main className="p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Certificate Template</h1>
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
                            {/* Candidates Table */}
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm mb-8">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-[#E8DEFF]">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">Nama</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">Email</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">Judul Kelas</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">Tanggal Selesai</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">Mentor</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {candidates.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                                        Tidak ada peserta yang menunggu sertifikat
                                                    </td>
                                                </tr>
                                            ) : (
                                                candidates.map((candidate, index) => (
                                                    <tr key={index} className="hover:bg-gray-50 transition">
                                                        <td className="px-6 py-4 text-sm text-gray-900">{candidate.user_name}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-600">{candidate.user_email}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-900">{candidate.course_title}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-600">{formatDate(candidate.completed_at)}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-600">{candidate.mentor_name || '-'}</td>
                                                        <td className="px-6 py-4">
                                                            <button
                                                                onClick={() => handleGenerateClick(candidate)}
                                                                className="text-[#6B21FF] hover:text-[#5518CC] font-medium text-sm transition"
                                                            >
                                                                Buat Sertifikat
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Upload Template Section */}
                            <div className="bg-white rounded-xl border-2 border-dashed border-[#6B21FF] p-12 mb-8 text-center">
                                <h2 className="text-xl font-bold text-gray-900 mb-2">Upload desain sertifikat disini</h2>
                                <p className="text-gray-600 mb-6">Format: JPG, PNG (Maks. 50MB)</p>
                                
                                {selectedFile ? (
                                    <div className="mb-4">
                                        <div className="inline-flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-lg mb-3">
                                            <svg className="w-5 h-5 text-[#6B21FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <span className="text-sm text-gray-900">{selectedFile.name}</span>
                                            <button
                                                onClick={() => setSelectedFile(null)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Nama template..."
                                            value={templateName}
                                            onChange={(e) => setTemplateName(e.target.value)}
                                            className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B21FF] text-gray-900"
                                        />
                                    </div>
                                ) : null}
                                
                                <div className="flex gap-3 justify-center">
                                    <input
                                        type="file"
                                        id="template-upload"
                                        accept="image/jpeg,image/jpg,image/png"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="template-upload"
                                        className="bg-[#6B21FF] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#5518CC] transition cursor-pointer inline-flex items-center gap-2"
                                    >
                                        {selectedFile ? 'Pilih File Lain' : 'Upload'}
                                    </label>
                                    {selectedFile && (
                                        <button
                                            onClick={handleUploadTemplate}
                                            disabled={isUploading || !templateName}
                                            className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
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
                                                'Simpan'
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Template Gallery */}
                            <div className="mb-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Template Sertifikat lainnya</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {templates.map((template) => (
                                        <div key={template.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition">
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
                    <div className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
                        notification ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                    }`}>
                        <div className={`rounded-lg shadow-lg p-4 max-w-md ${
                            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
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
            </div>
        </div>
    );
}
