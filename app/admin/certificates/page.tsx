"use client";
import AdminSidebar from '@/app/components/AdminSidebar';
import HeaderAdmin from '@/app/components/HeaderAdmin';
import { useState, useEffect } from 'react';

interface CertificateTemplate {
    id: string;
    name: string;
    file_url: string;
    preview_url: string;
    is_active: boolean;
}

interface Certificate {
    id: string;
    recipient_name: string;
    course_title: string;
    instructor_name: string | null;
    issued_at: string;
    certificate_url: string;
}

interface Participant {
    nama: string;
    email: string;
    judulKelas: string;
    tanggalSelesai: string;
}

interface User {
    id: string;
    username: string;
    email: string;
    role: string;
}

interface LearningPath {
    id: string;
    title: string;
    category: string;
}

export default function CertificatePage() {
    const [showGenerateForm, setShowGenerateForm] = useState(false);
    const [showBulkUpload, setShowBulkUpload] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [outputFormat, setOutputFormat] = useState('PDF');
    const [uploadProgress, setUploadProgress] = useState(60);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Template upload modal states
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [templateName, setTemplateName] = useState('');
    const [templateFile, setTemplateFile] = useState<File | null>(null);
    const [templatePreview, setTemplatePreview] = useState<string | null>(null);
    const [isUploadingTemplate, setIsUploadingTemplate] = useState(false);

    // Form fields
    const [selectedUserId, setSelectedUserId] = useState('');
    const [selectedLearningPathId, setSelectedLearningPathId] = useState('');
    const [participantName, setParticipantName] = useState('');
    const [courseName, setCourseName] = useState('');
    const [completionDate, setCompletionDate] = useState('');
    const [instructorName, setInstructorName] = useState('');

    // API states
    const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
    const [userEnrolledPaths, setUserEnrolledPaths] = useState<LearningPath[]>([]);
    const [templatesLoading, setTemplatesLoading] = useState(true);
    const [certificatesLoading, setCertificatesLoading] = useState(true);
    const [usersLoading, setUsersLoading] = useState(false);
    const [learningPathsLoading, setLearningPathsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    // Fetch templates from backend
    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await fetch('http://localhost:3000/api/v1/certificates/admin/templates', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                        setTemplates(result.data);
                    }
                }
            } catch (error) {
                console.error('Error fetching templates:', error);
            } finally {
                setTemplatesLoading(false);
            }
        };

        fetchTemplates();
    }, []);

    // Fetch certificates from backend
    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await fetch('http://localhost:3000/api/v1/certificates/admin/all', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                        setCertificates(result.data);
                    }
                }
            } catch (error) {
                console.error('Error fetching certificates:', error);
            } finally {
                setCertificatesLoading(false);
            }
        };

        fetchCertificates();
    }, []);

    // Fetch users when generate form is shown
    useEffect(() => {
        if (showGenerateForm) {
            const fetchUsers = async () => {
                setUsersLoading(true);
                try {
                    const token = localStorage.getItem('token');
                    if (!token) return;

                    const response = await fetch('http://localhost:3000/api/v1/admin/users', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (response.ok) {
                        const result = await response.json();
                        if (result.success) {
                            // Filter out admin users, only show regular users
                            const nonAdminUsers = result.data.filter((user: User) => user.role !== 'admin');
                            setUsers(nonAdminUsers);
                        }
                    }
                } catch (error) {
                    console.error('Error fetching users:', error);
                } finally {
                    setUsersLoading(false);
                }
            };

            const fetchLearningPaths = async () => {
                setLearningPathsLoading(true);
                try {
                    const token = localStorage.getItem('token');
                    if (!token) return;

                    const response = await fetch('http://localhost:3000/api/v1/admin/learning-paths', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (response.ok) {
                        const result = await response.json();
                        if (result.success) {
                            setLearningPaths(result.data);
                        }
                    }
                } catch (error) {
                    console.error('Error fetching learning paths:', error);
                } finally {
                    setLearningPathsLoading(false);
                }
            };

            fetchUsers();
            fetchLearningPaths();
        }
    }, [showGenerateForm]);

    // Fetch user's enrolled learning paths when user is selected
    useEffect(() => {
        if (selectedUserId) {
            const fetchUserEnrollments = async () => {
                setLearningPathsLoading(true);
                try {
                    const token = localStorage.getItem('token');
                    if (!token) return;

                    const response = await fetch(`http://localhost:3000/api/v1/admin/users/${selectedUserId}/enrollments`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (response.ok) {
                        const result = await response.json();
                        if (result.success) {
                            // Extract learning paths from enrollments
                            const enrolledPaths = result.data.map((enrollment: any) => ({
                                id: enrollment.LearningPath.id,
                                title: enrollment.LearningPath.title,
                                category: enrollment.LearningPath.category
                            }));
                            setUserEnrolledPaths(enrolledPaths);
                        }
                    }
                } catch (error) {
                    console.error('Error fetching user enrollments:', error);
                } finally {
                    setLearningPathsLoading(false);
                }
            };

            fetchUserEnrollments();
            setSelectedLearningPathId(''); // Reset selected learning path when user changes
        } else {
            setUserEnrolledPaths([]);
            setSelectedLearningPathId('');
        }
    }, [selectedUserId]);

    // Dummy participants data for table display
    const allParticipants: Participant[] = certificates.map(cert => ({
        nama: cert.recipient_name,
        email: '',
        judulKelas: cert.course_title,
        tanggalSelesai: new Date(cert.issued_at).toLocaleDateString('id-ID')
    }));

    const filteredParticipants = allParticipants.filter(participant =>
        participant.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        participant.judulKelas.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('file', file);

            try {
                setIsGenerating(true);
                const token = localStorage.getItem('token');
                
                const response = await fetch('http://localhost:3000/api/v1/certificates/admin/bulk-generate', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                if (response.ok) {
                    const result = await response.json();
                    alert(`Berhasil! ${result.count} sertifikat telah dibuat.`);
                    // Refresh certificates list
                    window.location.reload();
                } else {
                    alert('Gagal mengupload CSV');
                }
            } catch (error) {
                console.error('Error uploading CSV:', error);
                alert('Terjadi kesalahan saat mengupload');
            } finally {
                setIsGenerating(false);
            }
        }
    };

    const handlePreview = () => {
        if (!selectedUserId || !selectedLearningPathId || !completionDate) {
            alert('Mohon lengkapi field: Nama Partisipan, Judul Kelas, dan Tanggal Selesai');
            return;
        }

        const selectedUser = users.find(u => u.id === selectedUserId);
        const selectedLearningPath = userEnrolledPaths.find(lp => lp.id === selectedLearningPathId);

        if (!selectedUser || !selectedLearningPath) {
            alert('Data tidak lengkap untuk preview');
            return;
        }

        const template = templates.find(t => t.id === selectedTemplate);
        const templateName = template ? template.name : 'Default Template';

        const previewMessage = `
Preview Certificate:

Nama Partisipan: ${selectedUser.username}
Judul Kelas: ${selectedLearningPath.title}
Tanggal Selesai: ${new Date(completionDate).toLocaleDateString('id-ID')}
Instructor: ${instructorName || 'Admin'}
Template: ${templateName}
Format Output: ${outputFormat}
        `;

        alert(previewMessage);
    };

    const handleGenerate = async () => {
        if (!selectedUserId || !selectedLearningPathId || !completionDate || !selectedTemplate) {
            alert('Mohon lengkapi semua field yang wajib diisi');
            return;
        }

        // Get selected user and learning path details
        const selectedUser = users.find(u => u.id === selectedUserId);
        const selectedLearningPath = userEnrolledPaths.find(lp => lp.id === selectedLearningPathId);

        if (!selectedUser || !selectedLearningPath) {
            alert('Data user atau learning path tidak ditemukan');
            return;
        }

        try {
            setIsGenerating(true);
            const token = localStorage.getItem('token');
            
            const requestBody = {
                user_id: selectedUserId,
                learning_path_id: selectedLearningPathId,
                participant_name: selectedUser.username,
                class_title: selectedLearningPath.title,
                completion_date: completionDate,
                instructor_name: instructorName || 'Admin',
                template_id: selectedTemplate,
                output_format: outputFormat
            };

            console.log('Sending certificate request:', requestBody);
            
            const response = await fetch('http://localhost:3000/api/v1/certificates/admin/generate', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            // Try to get response text first
            const responseText = await response.text();
            console.log('Response text:', responseText);

            if (response.ok) {
                try {
                    const result = JSON.parse(responseText);
                    alert('Sertifikat berhasil dibuat!');
                    // Reset form
                    setSelectedUserId('');
                    setSelectedLearningPathId('');
                    setParticipantName('');
                    setCourseName('');
                    setCompletionDate('');
                    setInstructorName('');
                    setSelectedTemplate('');
                    setShowGenerateForm(false);
                    // Refresh certificates list
                    window.location.reload();
                } catch (parseError) {
                    console.error('Failed to parse success response:', parseError);
                    alert('Sertifikat mungkin berhasil dibuat, tapi ada masalah parsing response');
                }
            } else {
                let errorMessage = 'Server error';
                try {
                    const errorData = JSON.parse(responseText);
                    console.error('Generate certificate error:', errorData);
                    errorMessage = errorData.message || errorData.error || 'Server error';
                } catch (parseError) {
                    console.error('Failed to parse error response:', responseText);
                    errorMessage = responseText || 'Server error';
                }
                alert(`Gagal membuat sertifikat: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error generating certificate:', error);
            alert(`Terjadi kesalahan: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsGenerating(false);
        }
    };

    // Handle template file selection with preview
    const handleTemplateFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setTemplateFile(file);
            
            // Create preview for image files
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setTemplatePreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            } else {
                setTemplatePreview(null);
            }
        }
    };

    // Handle template upload
    const handleTemplateUpload = async () => {
        if (!templateName.trim()) {
            alert('Nama template harus diisi');
            return;
        }

        if (!templateFile) {
            alert('Silakan pilih file template');
            return;
        }

        setIsUploadingTemplate(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Token tidak ditemukan. Silakan login kembali.');
                return;
            }

            const formData = new FormData();
            formData.append('name', templateName);
            formData.append('template', templateFile);

            const response = await fetch('http://localhost:3000/api/v1/certificates/admin/templates', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            });

            const result = await response.json();

            if (response.ok && result.success) {
                alert('Template berhasil diupload!');
                setShowTemplateModal(false);
                setTemplateName('');
                setTemplateFile(null);
                setTemplatePreview(null);
                window.location.reload();
            } else {
                alert(result.message || 'Gagal upload template');
            }
        } catch (error) {
            console.error('Error uploading template:', error);
            alert('Terjadi kesalahan saat upload template');
        } finally {
            setIsUploadingTemplate(false);
        }
    };

    // Bulk Upload View
    if (showBulkUpload) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <AdminSidebar />

                {/* Main Content */}
                <div className="flex-1 ml-[250px]">
                    <HeaderAdmin />

                    {/* Bulk Certificate Content */}
                    <main className="p-8">
                        {/* Back button */}
                        <button
                            onClick={() => {
                                setShowBulkUpload(false);
                                setShowGenerateForm(true);
                            }}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>Kembali</span>
                        </button>

                        {/* Title */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Buat lebih banyak sertifikat</h1>
                            <p className="text-gray-500">Input seluruh data partisipan dalam format excel atau CSV</p>
                        </div>

                        {/* Upload Button */}
                        <div className="mb-8">
                            <input
                                type="file"
                                accept=".csv,.xlsx,.xls"
                                onChange={handleCSVUpload}
                                className="hidden"
                                id="csv-upload"
                            />
                            <label htmlFor="csv-upload">
                                <div className="inline-block px-6 py-3 bg-[#6B21FF] text-white rounded-lg font-semibold hover:bg-[#5a1ad6] transition-colors cursor-pointer">
                                    Upload CSV/ Excel Data
                                </div>
                            </label>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-sm font-medium text-gray-700">Data Upload Progress</p>
                                <p className="text-sm font-medium text-gray-700">{uploadProgress}% Complete</p>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-[#6B21FF] h-2.5 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="mb-6">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    placeholder="Cari nama partisipan"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-6 py-3 border-2 border-[#6B21FF] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#6B21FF] focus:border-transparent text-gray-700 placeholder-gray-400"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <svg className="w-5 h-5 text-[#6B21FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Participants Table */}
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-[#E8DEFF]">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">Nama</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">Email</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">Judul Kelas</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">Tanggal Selesai</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredParticipants.map((participant, index) => (
                                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{participant.nama}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{participant.email}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{participant.judulKelas}</td>
                                                <td className="px-6 py-4 text-sm text-[#6B21FF]">{participant.tanggalSelesai}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    if (showGenerateForm) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <AdminSidebar />

                {/* Main Content */}
                <div className="flex-1 ml-[250px]">
                    <HeaderAdmin />

                    {/* Generate Certificate Form */}
                    <main className="p-8">
                        {/* Back button */}
                        <button
                            onClick={() => setShowGenerateForm(false)}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>Kembali</span>
                        </button>

                        {/* Title */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Buat sertifikat</h1>
                            <p className="text-gray-500">Buat sertifikat untuk partisipan kelas</p>
                        </div>

                        {/* Form Container */}
                        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
                            {/* Template Selection */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pilih Desain Sertifikat *</h3>
                                {templatesLoading ? (
                                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 flex items-center gap-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#6B21FF]"></div>
                                        <span className="text-sm text-gray-500">Memuat templates...</span>
                                    </div>
                                ) : templates.length === 0 ? (
                                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-yellow-50 text-yellow-700 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm">Belum ada template. Silakan upload template terlebih dahulu.</span>
                                    </div>
                                ) : (
                                    <select
                                        value={selectedTemplate}
                                        onChange={(e) => setSelectedTemplate(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B21FF] focus:border-transparent text-gray-700 bg-white cursor-pointer"
                                    >
                                        <option value="">Pilih Template Sertifikat</option>
                                        {templates.map((template) => (
                                            <option key={template.id} value={template.id}>
                                                {template.name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            {/* Form Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {/* Nama Partisipan */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nama Partisipan *
                                    </label>
                                    {usersLoading ? (
                                        <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 flex items-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#6B21FF]"></div>
                                            <span className="text-sm text-gray-500">Memuat users...</span>
                                        </div>
                                    ) : (
                                        <select
                                            value={selectedUserId}
                                            onChange={(e) => setSelectedUserId(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B21FF] focus:border-transparent text-gray-700 bg-white cursor-pointer"
                                        >
                                            <option value="">Pilih Partisipan</option>
                                            {users.map((user) => (
                                                <option key={user.id} value={user.id}>
                                                    {user.username} ({user.email})
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>

                                {/* Judul Kelas */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Judul Kelas *
                                    </label>
                                    {!selectedUserId ? (
                                        <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                                            Pilih partisipan terlebih dahulu
                                        </div>
                                    ) : learningPathsLoading ? (
                                        <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 flex items-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#6B21FF]"></div>
                                            <span className="text-sm text-gray-500">Memuat kelas yang diambil...</span>
                                        </div>
                                    ) : userEnrolledPaths.length === 0 ? (
                                        <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-yellow-50 text-yellow-700 flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-sm">User ini belum mengambil kelas apapun</span>
                                        </div>
                                    ) : (
                                        <select
                                            value={selectedLearningPathId}
                                            onChange={(e) => setSelectedLearningPathId(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B21FF] focus:border-transparent text-gray-700 bg-white cursor-pointer"
                                        >
                                            <option value="">Pilih Learning Path</option>
                                            {userEnrolledPaths.map((path) => (
                                                <option key={path.id} value={path.id}>
                                                    {path.title}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>

                                {/* Tanggal Selesai */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tanggal Selesai *
                                    </label>
                                    <input
                                        type="date"
                                        value={completionDate}
                                        onChange={(e) => setCompletionDate(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B21FF] focus:border-transparent text-gray-700"
                                    />
                                </div>

                                {/* Nama Instruktur */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nama Instruktur (Opsional)
                                    </label>
                                    <input
                                        type="text"
                                        value={instructorName}
                                        onChange={(e) => setInstructorName(e.target.value)}
                                        placeholder="Ketik nama instruktur atau kosongkan untuk 'Admin'"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B21FF] focus:border-transparent text-gray-700 placeholder-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Bulk Certificate Link */}
                            <div className="mb-8">
                                <p className="text-sm text-gray-600">
                                    Ingin buat sertifikat untuk banyak partisipan?{' '}
                                    <button
                                        onClick={() => {
                                            setShowGenerateForm(false);
                                            setShowBulkUpload(true);
                                        }}
                                        className="text-[#6B21FF] font-semibold hover:underline"
                                    >
                                        Klik disini
                                    </button>
                                </p>
                            </div>
                        </div>

                        {/* Output File Section */}
                        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Output File</h3>

                            <div className="space-y-3">
                                {/* PDF Option */}
                                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                    <input
                                        type="radio"
                                        name="outputFormat"
                                        value="PDF"
                                        checked={outputFormat === 'PDF'}
                                        onChange={(e) => setOutputFormat(e.target.value)}
                                        className="w-4 h-4 text-[#6B21FF] focus:ring-[#6B21FF]"
                                    />
                                    <span className="text-sm font-medium text-gray-900">PDF</span>
                                </label>

                                {/* PNG Option */}
                                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                    <input
                                        type="radio"
                                        name="outputFormat"
                                        value="PNG"
                                        checked={outputFormat === 'PNG'}
                                        onChange={(e) => setOutputFormat(e.target.value)}
                                        className="w-4 h-4 text-[#6B21FF] focus:ring-[#6B21FF]"
                                    />
                                    <span className="text-sm font-medium text-gray-900">PNG</span>
                                </label>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={handlePreview}
                                disabled={isGenerating}
                                className="px-8 py-3 bg-gray-400 text-white rounded-lg font-semibold hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Preview Certificate
                            </button>
                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating || !selectedUserId || !selectedLearningPathId || !completionDate || !selectedTemplate}
                                className="px-8 py-3 bg-[#6B21FF] text-white rounded-lg font-semibold hover:bg-[#5a1ad6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isGenerating ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Generating...</span>
                                    </>
                                ) : (
                                    'Generate Certificate'
                                )}
                            </button>
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

                {/* Certificate Content */}
                <main className="p-8">
                    {/* Title and Generate Button */}
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Certificate Template</h1>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowTemplateModal(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-[#6B21FF] text-[#6B21FF] rounded-lg hover:bg-[#6B21FF] hover:text-white transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <span className="font-semibold">Upload Template</span>
                            </button>
                            <button
                                onClick={() => setShowGenerateForm(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-[#6B21FF] text-white rounded-xl hover:bg-[#5a1ad6] transition-colors"
                            >
                                <span className="font-semibold">Buat sertifikat</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Upload Section */}
                    <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 mb-8">
                        <div className="text-center">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Upload desain sertifikat disini</h2>
                            <p className="text-sm text-gray-500 mb-6">Format: PDF, DOCX.</p>

                            <div className="flex flex-col items-center gap-4">
                                <input
                                    type="file"
                                    accept=".pdf,.docx"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="certificate-upload"
                                />
                                <label
                                    htmlFor="certificate-upload"
                                    className="cursor-pointer"
                                >
                                    <div className="px-6 py-3 bg-[#6B21FF] text-white rounded-xl hover:bg-[#5a1ad6] transition-colors font-semibold">
                                        Upload
                                    </div>
                                </label>
                                {selectedFile && (
                                    <p className="text-sm text-gray-600">
                                        Selected: {selectedFile.name}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Template Section */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Template Sertifikat lainnya</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {templatesLoading ? (
                                // Loading Skeletons
                                [...Array(4)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm animate-pulse">
                                        <div className="aspect-[3/4] bg-gray-200"></div>
                                        <div className="p-4 text-center">
                                            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                                        </div>
                                    </div>
                                ))
                            ) : templates.length === 0 ? (
                                <div className="col-span-full text-center py-12">
                                    <p className="text-gray-500">Tidak ada template tersedia</p>
                                </div>
                            ) : (
                                templates.map((template) => (
                                    <div
                                        key={template.id}
                                        className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
                                    >
                                        <div className="aspect-[3/4] bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center overflow-hidden">
                                            {template.preview_url ? (
                                                <img 
                                                    src={template.preview_url} 
                                                    alt={template.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                // Fallback placeholder
                                                <div className="text-center p-6">
                                                    <div className="text-amber-600 font-serif text-2xl mb-4">CERTIFICATE</div>
                                                    <div className="text-sm text-gray-600 mb-2">of Completion</div>
                                                    <div className="border-t-2 border-amber-600 w-32 mx-auto my-4"></div>
                                                    <div className="text-xs text-gray-500">
                                                        This certifies that
                                                    </div>
                                                    <div className="text-lg font-semibold text-gray-800 my-2">
                                                        [Name]
                                                    </div>
                                                    <div className="text-xs text-gray-500 mb-4">
                                                        has successfully completed
                                                    </div>
                                                    <div className="w-12 h-12 mx-auto bg-amber-400 rounded-full flex items-center justify-center">
                                                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4 text-center">
                                            <p className="text-sm font-semibold text-gray-900">{template.name}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Template Upload Modal */}
            {showTemplateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pl-[270px]" style={{ animation: 'fadeInOverlay 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
                    <div 
                        className="absolute inset-0 bg-black/20"
                        onClick={() => !isUploadingTemplate && setShowTemplateModal(false)}
                    ></div>
                    
                    <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full" style={{ animation: 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">Upload Template Sertifikat</h2>
                            <button 
                                onClick={() => !isUploadingTemplate && setShowTemplateModal(false)}
                                disabled={isUploadingTemplate}
                                className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            {/* Template Name */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Template *
                                </label>
                                <input
                                    type="text"
                                    value={templateName}
                                    onChange={(e) => setTemplateName(e.target.value)}
                                    placeholder="Contoh: Template Sertifikat Modern"
                                    disabled={isUploadingTemplate}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B21FF] focus:border-transparent text-gray-700 placeholder-gray-400 disabled:bg-gray-100"
                                />
                            </div>

                            {/* File Upload */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    File Template *
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#6B21FF] transition-colors">
                                    <input
                                        type="file"
                                        accept="image/*,.pdf"
                                        onChange={handleTemplateFileChange}
                                        disabled={isUploadingTemplate}
                                        className="hidden"
                                        id="templateFileInput"
                                    />
                                    <label htmlFor="templateFileInput" className="cursor-pointer">
                                        <div className="flex flex-col items-center">
                                            <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            <p className="text-sm text-gray-600 mb-1">
                                                {templateFile ? templateFile.name : 'Klik untuk upload atau drag & drop'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                PNG, JPG, PDF (Max. 10MB)
                                            </p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Preview */}
                            {templatePreview && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Preview
                                    </label>
                                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                        <img 
                                            src={templatePreview} 
                                            alt="Template preview" 
                                            className="max-h-64 mx-auto rounded"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowTemplateModal(false)}
                                    disabled={isUploadingTemplate}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleTemplateUpload}
                                    disabled={isUploadingTemplate || !templateName || !templateFile}
                                    className="px-6 py-3 bg-[#6B21FF] text-white rounded-lg hover:bg-[#5a1bd8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isUploadingTemplate ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            <span>Uploading...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            <span>Upload Template</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
