"use client";
import AdminSidebar from '@/app/components/AdminSidebar';
import { useState } from 'react';

interface CertificateTemplate {
    id: string;
    name: string;
    imageUrl: string;
}

interface Participant {
    nama: string;
    email: string;
    judulKelas: string;
    tanggalSelesai: string;
}

export default function CertificatePage() {
    const [showGenerateForm, setShowGenerateForm] = useState(false);
    const [showBulkUpload, setShowBulkUpload] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [outputFormat, setOutputFormat] = useState('PDF');
    const [uploadProgress, setUploadProgress] = useState(60);
    const [searchQuery, setSearchQuery] = useState('');

    // Form fields
    const [participantName, setParticipantName] = useState('');
    const [courseName, setCourseName] = useState('');
    const [completionDate, setCompletionDate] = useState('');
    const [instructorName, setInstructorName] = useState('');

    // Dummy certificate templates
    const templates: CertificateTemplate[] = [
        { id: 'A', name: 'Template A', imageUrl: '/images/cert-a.png' },
        { id: 'B', name: 'Template B', imageUrl: '/images/cert-b.png' },
        { id: 'C', name: 'Template C', imageUrl: '/images/cert-c.png' },
        { id: 'D', name: 'Template D', imageUrl: '/images/cert-d.png' },
    ];

    // Dummy participants data
    const allParticipants: Participant[] = [
        { nama: 'Ethan Harper', email: 'ethan.harper@email.com', judulKelas: 'Advanced Python', tanggalSelesai: '2024-03-15' },
        { nama: 'Olivia Bennett', email: 'olivia.bennett@email.com', judulKelas: 'Data Science Fundamentals', tanggalSelesai: '2024-03-15' },
        { nama: 'Noah Carter', email: 'noah.carter@email.com', judulKelas: 'Machine Learning', tanggalSelesai: '2024-03-15' },
        { nama: 'Ava Morgan', email: 'ava.morgan@email.com', judulKelas: 'Cloud Computing', tanggalSelesai: '2024-03-15' },
        { nama: 'Liam Foster', email: 'liam.foster@email.com', judulKelas: 'Web Development', tanggalSelesai: '2024-03-15' },
    ];

    const filteredParticipants = allParticipants.filter(participant =>
        participant.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        participant.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            console.log('CSV uploaded:', e.target.files[0].name);
            // Simulate upload progress
            setUploadProgress(60);
        }
    };

    const handlePreview = () => {
        console.log('Preview certificate');
        // Handle preview logic
    };

    const handleGenerate = () => {
        console.log('Generate certificate');
        // Handle generate logic
    };

    // Bulk Upload View
    if (showBulkUpload) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <AdminSidebar />

                {/* Main Content */}
                <div className="flex-1 ml-[220px]">
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
                <div className="flex-1 ml-[220px]">
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
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Generate Certificate</h1>
                            <p className="text-gray-500">Buat sertifikat untuk partisipan kelas</p>
                        </div>

                        {/* Form Container */}
                        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
                            {/* Template Selection */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pilih Desain Sertifikat</h3>
                                <select
                                    value={selectedTemplate}
                                    onChange={(e) => setSelectedTemplate(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B21FF] focus:border-transparent text-gray-700 bg-white cursor-pointer"
                                >
                                    <option value="">Template Sertifikat</option>
                                    {templates.map((template) => (
                                        <option key={template.id} value={template.id}>
                                            {template.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Form Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {/* Nama Partisipan */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nama Partisipan
                                    </label>
                                    <input
                                        type="text"
                                        value={participantName}
                                        onChange={(e) => setParticipantName(e.target.value)}
                                        placeholder="Ketik nama disini..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B21FF] focus:border-transparent text-gray-700 placeholder-gray-400"
                                    />
                                </div>

                                {/* Judul Kelas */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Judul Kelas
                                    </label>
                                    <input
                                        type="text"
                                        value={courseName}
                                        onChange={(e) => setCourseName(e.target.value)}
                                        placeholder="Ketik nama disini..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B21FF] focus:border-transparent text-gray-700 placeholder-gray-400"
                                    />
                                </div>

                                {/* Tanggal Selesai */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tanggal Selesai
                                    </label>
                                    <input
                                        type="text"
                                        value={completionDate}
                                        onChange={(e) => setCompletionDate(e.target.value)}
                                        placeholder="Ketik tanggal disini..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B21FF] focus:border-transparent text-gray-700 placeholder-gray-400"
                                    />
                                </div>

                                {/* Nama Instruktur */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nama Instruktur
                                    </label>
                                    <input
                                        type="text"
                                        value={instructorName}
                                        onChange={(e) => setInstructorName(e.target.value)}
                                        placeholder="Ketik tanggal disini..."
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
                                className="px-8 py-3 bg-gray-400 text-white rounded-lg font-semibold hover:bg-gray-500 transition-colors"
                            >
                                Preview Certificate
                            </button>
                            <button
                                onClick={handleGenerate}
                                className="px-8 py-3 bg-[#6B21FF] text-white rounded-lg font-semibold hover:bg-[#5a1ad6] transition-colors"
                            >
                                Generate Certificate
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
            <div className="flex-1 ml-[220px]">
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

                {/* Certificate Content */}
                <main className="p-8">
                    {/* Title and Generate Button */}
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Certificate Template</h1>
                        <button
                            onClick={() => setShowGenerateForm(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-[#6B21FF] text-white rounded-xl hover:bg-[#5a1ad6] transition-colors"
                        >
                            <span className="font-semibold">Generate Certificate</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
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
                            {templates.map((template) => (
                                <div
                                    key={template.id}
                                    className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
                                >
                                    <div className="aspect-[3/4] bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
                                        {/* Certificate Preview Placeholder */}
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
                                    </div>
                                    <div className="p-4 text-center">
                                        <p className="text-sm font-semibold text-gray-900">{template.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
