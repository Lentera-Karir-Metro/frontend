"use client";
import AdminSidebar from '@/app/components/AdminSidebar';
import { useState } from 'react';

interface Transaction {
    id: string;
    nama: string;
    kelas: string;
    total: string;
    metode: string;
    status: 'Success' | 'Pending';
}

export default function TransactionsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Dummy data - 20 transactions untuk pagination
    const allTransactions: Transaction[] = [
        { id: 'TXN12345', nama: 'Sarah Chen', kelas: 'Digital Marketing Fundamental', total: 'Rp150.000', metode: 'DANA', status: 'Success' },
        { id: 'TXN67890', nama: 'David Lee', kelas: 'Javascript untuk Web Interaktif', total: 'Rp250.000', metode: 'QRIS', status: 'Pending' },
        { id: 'TXN24680', nama: 'Emily Wong', kelas: 'Web Development Bootcamp', total: 'Rp100.000', metode: 'Bank Transfer', status: 'Success' },
        { id: 'TXN13579', nama: 'Michael Tan', kelas: 'Graphic Design Masterclass', total: 'Rp200.000', metode: 'Bank Transfer', status: 'Pending' },
        { id: 'TXN98765', nama: 'Olivia Lim', kelas: 'Tips Lancar Wawancara Kerja', total: 'Rp100.000', metode: 'ShopeePay', status: 'Success' },
        { id: 'TXN98765', nama: 'Olivia Lim', kelas: 'Tips Lancar Wawancara Kerja', total: 'Rp100.000', metode: 'ShopeePay', status: 'Success' },
        { id: 'TXN24680', nama: 'Emily Wong', kelas: 'Web Development Bootcamp', total: 'Rp100.000', metode: 'Bank Transfer', status: 'Success' },
        { id: 'TXN12345', nama: 'Sarah Chen', kelas: 'Digital Marketing Fundamental', total: 'Rp150.000', metode: 'DANA', status: 'Success' },
        { id: 'TXN67890', nama: 'David Lee', kelas: 'Javascript untuk Web Interaktif', total: 'Rp250.000', metode: 'QRIS', status: 'Pending' },
        { id: 'TXN13579', nama: 'Michael Tan', kelas: 'Graphic Design Masterclass', total: 'Rp200.000', metode: 'Bank Transfer', status: 'Pending' },
        { id: 'TXN12345', nama: 'Sarah Chen', kelas: 'Digital Marketing Fundamental', total: 'Rp150.000', metode: 'DANA', status: 'Success' },
        { id: 'TXN67890', nama: 'David Lee', kelas: 'Javascript untuk Web Interaktif', total: 'Rp250.000', metode: 'QRIS', status: 'Pending' },
        { id: 'TXN24680', nama: 'Emily Wong', kelas: 'Web Development Bootcamp', total: 'Rp100.000', metode: 'Bank Transfer', status: 'Success' },
        { id: 'TXN13579', nama: 'Michael Tan', kelas: 'Graphic Design Masterclass', total: 'Rp200.000', metode: 'Bank Transfer', status: 'Pending' },
        { id: 'TXN98765', nama: 'Olivia Lim', kelas: 'Tips Lancar Wawancara Kerja', total: 'Rp100.000', metode: 'ShopeePay', status: 'Success' },
        { id: 'TXN98765', nama: 'Olivia Lim', kelas: 'Tips Lancar Wawancara Kerja', total: 'Rp100.000', metode: 'ShopeePay', status: 'Success' },
        { id: 'TXN24680', nama: 'Emily Wong', kelas: 'Web Development Bootcamp', total: 'Rp100.000', metode: 'Bank Transfer', status: 'Success' },
        { id: 'TXN12345', nama: 'Sarah Chen', kelas: 'Digital Marketing Fundamental', total: 'Rp150.000', metode: 'DANA', status: 'Success' },
        { id: 'TXN67890', nama: 'David Lee', kelas: 'Javascript untuk Web Interaktif', total: 'Rp250.000', metode: 'QRIS', status: 'Pending' },
        { id: 'TXN13579', nama: 'Michael Tan', kelas: 'Graphic Design Masterclass', total: 'Rp200.000', metode: 'Bank Transfer', status: 'Pending' },
    ];

    // Filter transactions based on search and status
    const filteredTransactions = allTransactions.filter(transaction => {
        const matchesSearch = transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.kelas.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || transaction.status.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    // Pagination
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
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

                {/* Transactions Content */}
                <main className="p-8">
                    {/* Title */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Transactions</h1>

                    {/* Search and Filter Section */}
                    <div className="mb-6">
                        {/* Search Input */}
                        <div className="relative w-full mb-4">
                            <input
                                type="text"
                                placeholder="Cari id bayar..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-[#6B21FF] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#6B21FF] focus:border-transparent"
                            />
                            <svg
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B21FF]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        {/* Status Filter Dropdown */}
                        <div className="relative inline-block">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-6 py-3 border border-gray-300 rounded-2xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#6B21FF] focus:border-transparent appearance-none pr-10 cursor-pointer"
                            >
                                <option value="all">Status Bayar</option>
                                <option value="success">Success</option>
                                <option value="pending">Pending</option>
                            </select>
                            <svg
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    {/* Transactions Table */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#E8DEFF]">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">ID Transaksi</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">Nama</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">Kelas yang dibeli</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">Total bayar</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">Metode bayar</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {currentTransactions.map((transaction, index) => (
                                        <tr key={`${transaction.id}-${index}`} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-gray-600">{transaction.id}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">{transaction.nama}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{transaction.kelas}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">{transaction.total}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{transaction.metode}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${transaction.status === 'Success'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {transaction.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center items-center gap-2">
                        {/* Previous Button */}
                        <button
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        {/* Page Numbers */}
                        {[...Array(Math.min(5, totalPages))].map((_, index) => {
                            const pageNumber = index + 1;
                            return (
                                <button
                                    key={pageNumber}
                                    onClick={() => handlePageChange(pageNumber)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${currentPage === pageNumber
                                        ? 'bg-[#6B21FF] text-white'
                                        : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {pageNumber}
                                </button>
                            );
                        })}

                        {/* Next Button */}
                        <button
                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}
