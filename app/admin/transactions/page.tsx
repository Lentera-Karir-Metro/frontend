"use client";
import AdminSidebar from '@/app/components/AdminSidebar';
import HeaderAdmin from '@/app/components/HeaderAdmin';
import { useState, useEffect } from 'react';

interface Transaction {
    id: string;
    user_name: string;
    class_name: string;
    amount: number;
    payment_method: string;
    status: 'success' | 'pending' | 'failed';
    date: string;
}

export default function TransactionsPage() {
    // API State
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 10
    });

    // Filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    // Fetch transactions from backend
    const fetchTransactions = async () => {
        setIsLoading(true);
        setError('');

        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: '10'
            });

            if (searchQuery) params.append('search', searchQuery);
            if (statusFilter !== 'All') params.append('status', statusFilter.toLowerCase());

            const token = localStorage.getItem('token');
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/admin/transactions?${params}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));

                // Handle specific error codes
                if (response.status === 401) {
                    throw new Error('Sesi Anda telah berakhir. Silakan login kembali.');
                } else if (response.status === 403) {
                    throw new Error('Anda tidak memiliki akses ke halaman ini.');
                } else {
                    throw new Error(errorData.message || `Error ${response.status}: Gagal mengambil data transaksi`);
                }
            }

            const data = await response.json();

            if (data.success) {
                // Check if data is empty
                if (!data.data || data.data.length === 0) {
                    setTransactions([]);
                    setPagination({
                        totalItems: 0,
                        totalPages: 0,
                        currentPage: 1,
                        itemsPerPage: 10
                    });
                } else {
                    setTransactions(data.data);
                    setPagination(data.pagination);
                }
            } else {
                throw new Error(data.message || 'Unknown error');
            }
        } catch (err: any) {
            setError(err.message || 'Gagal memuat data transaksi');
            setTransactions([]); // Clear transactions on error
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch on mount and when filters change
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchTransactions();
        }, 300); // Debounce

        return () => clearTimeout(timeoutId);
    }, [currentPage, searchQuery, statusFilter]);

    // Handle page change
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Status badge color
    const getStatusBadgeClass = (status: string) => {
        switch (status.toLowerCase()) {
            case 'success':
                return 'bg-green-100 text-green-700';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700';
            case 'failed':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />

            {/* Main Content */}
            <div className="flex-1 ml-[250px]">
                <HeaderAdmin />

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
                                placeholder="Cari transaction ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-[#6B21FF] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#6B21FF] focus:border-transparent text-gray-900"
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
                                className="px-6 py-3 border border-gray-300 rounded-2xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6B21FF] focus:border-transparent appearance-none pr-10 cursor-pointer"
                            >
                                <option value="All">Status Bayar</option>
                                <option value="success">Success</option>
                                <option value="pending">Pending</option>
                                <option value="failed">Failed</option>
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

                    {/* Loading State */}
                    {isLoading && (
                        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B21FF] mx-auto"></div>
                            <p className="mt-4 text-gray-600">Memuat data transaksi...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !isLoading && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                            <p className="text-red-800 font-semibold">{error}</p>
                            <button
                                onClick={fetchTransactions}
                                className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                                Coba Lagi
                            </button>
                        </div>
                    )}

                    {/* Transactions Table */}
                    {!isLoading && !error && (
                        <>
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-[#E8DEFF]">
                                            <tr>
                                                <th className="px-6 py-4 text-center text-sm font-semibold text-[#6B21FF]">ID Transaksi</th>
                                                <th className="px-6 py-4 text-center text-sm font-semibold text-[#6B21FF]">Nama</th>
                                                <th className="px-6 py-4 text-center text-sm font-semibold text-[#6B21FF]">Kelas yang dibeli</th>
                                                <th className="px-6 py-4 text-center text-sm font-semibold text-[#6B21FF]">Total bayar</th>
                                                <th className="px-6 py-4 text-center text-sm font-semibold text-[#6B21FF]">Metode bayar</th>
                                                <th className="px-6 py-4 text-center text-sm font-semibold text-[#6B21FF]">Tanggal</th>
                                                <th className="px-6 py-4 text-center text-sm font-semibold text-[#6B21FF]">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {transactions.length === 0 ? (
                                                <tr>
                                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                                        {error ? 'Terjadi kesalahan' : 'Belum ada transaksi'}
                                                    </td>
                                                </tr>
                                            ) : (
                                                transactions.map((transaction) => (
                                                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4 text-sm text-gray-600 font-mono text-center">{transaction.id}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-900 font-medium text-center">{transaction.user_name}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-600 text-center">{transaction.class_name}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-900 font-medium text-center">{formatCurrency(transaction.amount)}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-600 text-center">{transaction.payment_method || '-'}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-600 text-center">{formatDate(transaction.date)}</td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadgeClass(transaction.status)}`}>
                                                                {transaction.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
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
                                    {[...Array(Math.min(5, pagination.totalPages))].map((_, index) => {
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
                                        onClick={() => handlePageChange(Math.min(pagination.totalPages, currentPage + 1))}
                                        disabled={currentPage === pagination.totalPages}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
