"use client";
import AdminSidebar from '@/app/components/AdminSidebar';
import Link from 'next/link';
import { useState } from 'react';

interface LearningPath {
    id: number;
    judulPath: string;
    jumlahKelas: number;
    status: 'Active' | 'Inactive';
}

export default function LearningPath() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    // Dummy data learning paths
    const allPaths: LearningPath[] = [
        { id: 1, judulPath: 'Software Developer Pemula', jumlahKelas: 24, status: 'Active' },
        { id: 2, judulPath: 'UI/UX Designer Profesional', jumlahKelas: 12, status: 'Inactive' },
        { id: 3, judulPath: 'Spesialis Pemasaran Digital', jumlahKelas: 18, status: 'Active' },
        { id: 4, judulPath: 'Wawancara Kerja Komprehensif', jumlahKelas: 20, status: 'Inactive' },
        { id: 5, judulPath: 'Kreator Brand Visual', jumlahKelas: 12, status: 'Active' },
    ];

    // Filter paths
    const filteredPaths = allPaths.filter(path => {
        const matchesSearch = path.judulPath.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || path.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleEdit = (pathId: number) => {
        console.log('Edit path:', pathId);
    };

    const handleDelete = (pathId: number) => {
        console.log('Delete path:', pathId);
    };

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

                {/* Learning Path Content */}
                <main className="p-8">
                    {/* Title and Add Button */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Learning Path</h1>
                        <Link href="/admin/learning-path/create">
                            <button className="bg-[#6B21FF] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#5518CC] transition flex items-center gap-2">
                                Buat Path Baru
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative max-w-2xl">
                            <input
                                type="text"
                                placeholder="Cari learning path..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-6 pr-12 py-4 rounded-full border-2 border-gray-300 focus:outline-none focus:border-[#6B21FF] text-gray-700 placeholder-gray-400 transition-all"
                            />
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="mb-6">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-6 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#6B21FF] text-gray-700 bg-white cursor-pointer"
                        >
                            <option value="all">Status Learning Path</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Learning Paths Table */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#E8DEFF]">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">Judul Path</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">Jumlah Kelas</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">Status</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredPaths.map((path) => (
                                        <tr key={path.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-900">{path.judulPath}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{path.jumlahKelas}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${path.status === 'Active'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {path.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {/* Edit Button */}
                                                    <button
                                                        onClick={() => handleEdit(path.id)}
                                                        className="text-[#6B21FF] hover:text-[#5518CC] transition"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    {/* Delete Button */}
                                                    <button
                                                        onClick={() => handleDelete(path.id)}
                                                        className="text-red-500 hover:text-red-700 transition"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center items-center gap-2 mt-8">
                        <button className="p-2 rounded-lg hover:bg-gray-100 transition">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        {[1, 2, 3, 4, 5].map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 rounded-lg font-semibold transition ${currentPage === page
                                    ? 'bg-[#6B21FF] text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button className="p-2 rounded-lg hover:bg-gray-100 transition">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}
