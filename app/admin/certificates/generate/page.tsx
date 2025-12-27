"use client";
import AdminSidebar from '@/app/components/AdminSidebar';
import HeaderAdmin from '@/app/components/HeaderAdmin';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
    getCertificateTemplates,
    generateCertificate,
    type CertificateTemplate
} from '@/lib/certificateService';

export default function GenerateCertificatePage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const userId = searchParams.get('userId');
    const courseId = searchParams.get('courseId');
    const userName = searchParams.get('userName');
    const courseTitle = searchParams.get('courseTitle');

    const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState<number | undefined>(undefined);
    const [outputFormat, setOutputFormat] = useState<'pdf' | 'png'>('pdf');
    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedCertificate, setGeneratedCertificate] = useState<{ url: string; format: string } | null>(null);

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

    // Fetch templates
    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                setLoading(true);
                const templatesData = await getCertificateTemplates();
                setTemplates(templatesData);
            } catch (err: any) {
                console.error('Error fetching templates:', err);
                showNotification('error', err.message || 'Gagal memuat template');
            } finally {
                setLoading(false);
            }
        };

        fetchTemplates();
    }, []);

    // Redirect if missing required params
    useEffect(() => {
        if (!loading && (!userId || !courseId)) {
            showNotification('error', 'Parameter tidak lengkap');
            setTimeout(() => router.push('/admin/certificates'), 2000);
        }
    }, [userId, courseId, loading, router]);

    const handleGenerate = async () => {
        if (!userId || !courseId) {
            showNotification('error', 'Data tidak lengkap');
            return;
        }

        try {
            setIsGenerating(true);
            const result = await generateCertificate(
                userId,
                courseId,
                selectedTemplateId,
                outputFormat
            );

            showNotification('success', 'Sertifikat berhasil dibuat!');
            
            // Set generated certificate for preview
            if (result && result.certificate_url) {
                setGeneratedCertificate({
                    url: result.certificate_url,
                    format: outputFormat
                });
            }
        } catch (err: any) {
            console.error('Error generating certificate:', err);
            showNotification('error', err.message || 'Gagal membuat sertifikat');
        } finally {
            setIsGenerating(false);
        }
    };

    const getSelectedTemplatePreview = () => {
        if (!selectedTemplateId) return null;
        const template = templates.find(t => t.id === selectedTemplateId);
        return template?.preview_url || template?.file_url;
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <AdminSidebar />
                <div className="flex-1 ml-[250px]">
                    <HeaderAdmin />
                    <main className="p-8">
                        <div className="flex justify-center items-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#6B21FF]"></div>
                            <p className="text-gray-500 ml-3">Memuat data...</p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />

            <div className="flex-1 ml-[250px]">
                <HeaderAdmin />

                <main className="p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Generate Certificate</h1>
                        <p className="text-gray-600 mt-2">Buat sertifikat untuk partisipan kelas</p>
                    </div>

                    {/* Content */}
                    <div className="max-w-4xl mx-auto">
                        {/* Participant Info */}
                        {userName && courseTitle && (
                            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Peserta</label>
                                        <p className="text-gray-900 font-semibold">{decodeURIComponent(userName)}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Kursus</label>
                                        <p className="text-gray-900 font-semibold">{decodeURIComponent(courseTitle)}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Template Selection */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Pilih Desain Sertifikat</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Template Sertifikat</label>
                                    <select
                                        value={selectedTemplateId || ''}
                                        onChange={(e) => setSelectedTemplateId(e.target.value ? Number(e.target.value) : undefined)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B21FF] text-gray-900"
                                    >
                                        <option value="">Default Template</option>
                                        {templates.map((template) => (
                                            <option key={template.id} value={template.id}>
                                                {template.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Format Output</label>
                                    <select
                                        value={outputFormat}
                                        onChange={(e) => setOutputFormat(e.target.value as 'pdf' | 'png')}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B21FF] text-gray-900"
                                    >
                                        <option value="pdf">PDF</option>
                                        <option value="png">PNG</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Certificate Preview */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Preview Sertifikat</h2>
                            
                            {generatedCertificate ? (
                                // Show generated certificate
                                <div className="space-y-4">
                                    <div className="bg-gray-50 rounded-lg p-4 border-2 border-green-500">
                                        <div className="flex items-center gap-3 mb-4">
                                            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <p className="text-green-700 font-semibold">Sertifikat berhasil dibuat!</p>
                                        </div>
                                        
                                        {generatedCertificate.format === 'png' ? (
                                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                                                <img 
                                                    src={generatedCertificate.url} 
                                                    alt="Generated Certificate" 
                                                    className="w-full h-auto rounded shadow-lg"
                                                />
                                            </div>
                                        ) : (
                                            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                                                <svg className="w-16 h-16 text-[#6B21FF] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <p className="text-gray-900 font-semibold mb-2">PDF Certificate Generated</p>
                                                <p className="text-gray-600 text-sm mb-4">Sertifikat dalam format PDF telah dibuat</p>
                                            </div>
                                        )}

                                        <div className="mt-4 flex gap-3">
                                            <a
                                                href={generatedCertificate.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 px-4 py-3 bg-[#6B21FF] text-white rounded-lg hover:bg-[#5518CC] font-semibold transition text-center"
                                            >
                                                Lihat Sertifikat
                                            </a>
                                            <button
                                                onClick={() => router.push('/admin/certificates')}
                                                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold transition"
                                            >
                                                Kembali ke Daftar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // Show template preview
                                <div className="bg-gray-50 rounded-lg aspect-[4/3] flex items-center justify-center p-8">
                                    {getSelectedTemplatePreview() ? (
                                        <img 
                                            src={getSelectedTemplatePreview()!} 
                                            alt="Template Preview" 
                                            className="max-w-full max-h-full object-contain rounded shadow-lg"
                                        />
                                    ) : (
                                        <div className="text-center">
                                            <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <p className="text-gray-500 font-medium">Default Template Preview</p>
                                            <p className="text-gray-400 text-sm mt-2">Pilih template untuk melihat preview</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Generate Button */}
                        {!generatedCertificate && (
                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                className="w-full py-4 bg-[#6B21FF] text-white rounded-lg hover:bg-[#5518CC] font-bold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            >
                                {isGenerating ? (
                                    <>
                                        <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Generating Certificate...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Generate Certificate
                                    </>
                                )}
                            </button>
                        )}
                    </div>
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
