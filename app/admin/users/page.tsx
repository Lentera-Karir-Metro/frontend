"use client";
import AdminSidebar from '@/app/components/AdminSidebar';
import HeaderAdmin from '@/app/components/HeaderAdmin';
import { useState, useEffect } from 'react';

interface User {
    id: string;
    username: string;
    email: string;
    role: 'user' | 'admin';
    status: 'active' | 'inactive';
    createdAt: string;
}

interface PaginationInfo {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
}

export default function UserManagement() {
    // User data state
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Pagination state
    const [pagination, setPagination] = useState<PaginationInfo>({
        totalItems: 0,
        totalPages: 1,
        currentPage: 1,
        itemsPerPage: 10
    });

    // Filter & Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Notification state
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    // Delete confirmation
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    // Loading states
    const [isResetPasswordLoading, setIsResetPasswordLoading] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: '',
        role: 'user' as 'user' | 'admin',
        status: 'active' as 'active' | 'inactive'
    });
    // Toggle for showing password in Add User modal
    const [showAddPassword, setShowAddPassword] = useState(false);

    // Fetch users from API
    const fetchUsers = async () => {
        setIsLoading(true);
        setError('');

        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: '10',
            });

            // Only request users with role 'user' for this admin view
            params.append('role', 'user');

            if (searchQuery) params.append('search', searchQuery);
            if (statusFilter !== 'all') params.append('status', statusFilter);

            const token = localStorage.getItem('token');
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/admin/users?${params}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('API Error:', {
                    status: response.status,
                    statusText: response.statusText,
                    error: errorData
                });
                throw new Error(`Failed to fetch users: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                // Ensure only users with role 'user' are shown (fallback in case backend doesn't filter)
                const filtered = Array.isArray(data.data) ? data.data.filter((u: any) => u.role === 'user') : [];
                setUsers(filtered);
                setPagination(data.pagination);
            } else {
                throw new Error(data.message || 'Unknown error');
            }
        } catch (err: any) {
            console.error('Error fetching users:', err);
            setError(err.message || 'Gagal memuat data users. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch users on mount and when filters change
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchUsers();
        }, 300); // Debounce search

        return () => clearTimeout(timeoutId);
    }, [currentPage, searchQuery, statusFilter]);

    // Auto-hide notification after 5 seconds
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

    // Sync formData when editing user
    useEffect(() => {
        if (showEditModal && selectedUser) {
            setFormData({
                email: selectedUser.email,
                password: '',
                username: selectedUser.username,
                role: selectedUser.role,
                status: selectedUser.status
            });
        }
    }, [showEditModal, selectedUser]);

    // Create user
    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    username: formData.username,
                    role: formData.role
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setShowAddModal(false);
                setFormData({ email: '', password: '', username: '', role: 'user', status: 'active' });
                fetchUsers();
                showNotification('success', 'User berhasil ditambahkan!');
            } else {
                showNotification('error', data.message || 'Gagal menambahkan user');
            }
        } catch (err) {
            console.error('Error creating user:', err);
            showNotification('error', 'Terjadi kesalahan saat menambahkan user');
        }
    };

    // Update user
    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedUser) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${selectedUser.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        username: formData.username,
                        status: formData.status
                    }),
                }
            );

            const data = await response.json();

            if (response.ok && data.success) {
                setShowEditModal(false);
                setSelectedUser(null);
                fetchUsers();
                showNotification('success', 'User berhasil diperbarui!');
            } else {
                showNotification('error', data.message || 'Gagal memperbarui user');
            }
        } catch (err) {
            console.error('Error updating user:', err);
            showNotification('error', 'Terjadi kesalahan saat memperbarui user');
        }
    };

    // Delete user
    const handleDeleteUser = async () => {
        if (!selectedUser) return;

        // Validate delete confirmation text
        if (deleteConfirmText !== 'hapus') {
            showNotification('error', 'Ketik "hapus" untuk konfirmasi');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${selectedUser.id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (response.ok && data.success) {
                setShowDeleteModal(false);
                setSelectedUser(null);
                setDeleteConfirmText('');
                fetchUsers();
                showNotification('success', 'User berhasil dihapus!');
            } else {
                showNotification('error', data.message || 'Gagal menghapus user');
            }
        } catch (err) {
            console.error('Error deleting user:', err);
            showNotification('error', 'Terjadi kesalahan saat menghapus user');
        }
    };

    // Reset password - Open modal for confirmation
    const handleResetPasswordClick = (user: User) => {
        setSelectedUser(user);
        setShowResetPasswordModal(true);
    };

    // Confirm reset password
    const handleResetPassword = async () => {
        if (!selectedUser) return;

        setIsResetPasswordLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${selectedUser.id}/reset-password`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                setShowResetPasswordModal(false);
                setSelectedUser(null);
                showNotification('success', 'Email reset password berhasil dikirim!');
            } else {
                showNotification('error', data.message || 'Gagal mengirim email reset password');
            }
        } catch (err) {
            console.error('Error resetting password:', err);
            showNotification('error', 'Terjadi kesalahan saat mengirim email');
        } finally {
            setIsResetPasswordLoading(false);
        }
    };

    // Open edit modal
    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setFormData({
            email: user.email,
            password: '',
            username: user.username,
            role: user.role,
            status: user.status
        });
        setShowEditModal(true);
    };

    // Open delete modal
    const handleDelete = (user: User) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <>
            <style jsx>{`
                @keyframes scaleUp {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
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
                .animate-scale-up {
                    animation: scaleUp 0.2s ease-out;
                }
                .animate-slide-in {
                    animation: slideIn 0.3s ease-out;
                }
            `}</style>
            <div className="flex min-h-screen bg-gray-50">
                <AdminSidebar />

                {/* Main Content */}
                <div className="flex-1 ml-[250px]">
                    <HeaderAdmin />

                    {/* User Management Content */}
                    <main className="p-8">
                        {/* Title and Add Button */}
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                            <button
                                onClick={() => {
                                    setFormData({ email: '', password: '', username: '', role: 'user', status: 'active' });
                                    setShowAddModal(true);
                                }}
                                className="bg-[#6B21FF] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#5518CC] transition flex items-center gap-2"
                            >
                                Tambah User
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>

                        {/* Search Bar */}
                        <div className="mb-6">
                            <div className="relative max-w-2xl">
                                <input
                                    type="text"
                                    placeholder="Cari user (nama atau email)..."
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
                                <option value="all">Semua Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                                {error}
                            </div>
                        )}

                        {/* Loading State */}
                        {isLoading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full"></div>
                            </div>
                        ) : (
                            <>
                                {/* Users Table */}
                                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-[#E8DEFF]">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">Username</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">Email</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">Role</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">Tanggal Registrasi</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">Status</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B21FF]">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {users.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                                            Tidak ada user ditemukan
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    users.map((user) => (
                                                        <tr key={user.id} className="hover:bg-gray-50">
                                                            <td className="px-6 py-4 text-sm text-gray-900">{user.username}</td>
                                                            <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                                                            <td className="px-6 py-4 text-sm">
                                                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'admin'
                                                                    ? 'bg-purple-100 text-purple-700'
                                                                    : 'bg-blue-100 text-blue-700'
                                                                    }`}>
                                                                    {user.role}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-600">{formatDate(user.createdAt)}</td>
                                                            <td className="px-6 py-4">
                                                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${user.status === 'active'
                                                                    ? 'bg-green-100 text-green-700'
                                                                    : 'bg-gray-100 text-gray-700'
                                                                    }`}>
                                                                    {user.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-3">
                                                                    {/* Edit Button */}
                                                                    <button
                                                                        onClick={() => handleEdit(user)}
                                                                        className="text-[#6B21FF] hover:text-white hover:bg-[#6B21FF] transition-all duration-300 flex items-center justify-center p-2 rounded-lg hover:scale-110 hover:shadow-lg"
                                                                        title="Edit User"
                                                                    >
                                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                        </svg>
                                                                    </button>
                                                                    {/* Reset Password Button */}
                                                                    <button
                                                                        onClick={() => handleResetPasswordClick(user)}
                                                                        className="text-orange-500 hover:text-white hover:bg-orange-500 transition-all duration-300 flex items-center justify-center p-2 rounded-lg hover:scale-110 hover:shadow-lg"
                                                                        title="Reset Password"
                                                                    >
                                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                                                        </svg>
                                                                    </button>
                                                                    {/* Delete Button */}
                                                                    <button
                                                                        onClick={() => handleDelete(user)}
                                                                        className="text-red-500 hover:text-white hover:bg-red-500 transition-all duration-300 flex items-center justify-center p-2 rounded-lg hover:scale-110 hover:shadow-lg hover:rotate-12"
                                                                        title="Delete User"
                                                                    >
                                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Pagination (centered) */}
                                <div className="flex flex-col items-center gap-3 mt-8">
                                    <div className="flex items-center gap-6">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                            disabled={currentPage === 1}
                                            className="p-2 rounded-full hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                            aria-label="Previous page"
                                        >
                                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>

                                        <div className="w-12 h-12 rounded-full bg-[#6B21FF] flex items-center justify-center text-white font-semibold text-lg shadow-xl">
                                            {currentPage}
                                        </div>

                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                                            disabled={currentPage === pagination.totalPages}
                                            className="p-2 rounded-full hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                            aria-label="Next page"
                                        >
                                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>

                                </div>
                            </>
                        )}
                    </main>
                </div>

                {/* Add User Modal */}
                {
                    showAddModal && (
                        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
                            <div className="bg-white rounded-xl p-8 max-w-md w-full animate-scale-up shadow-2xl">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Tambah User Baru</h2>
                                <form onSubmit={handleCreateUser} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#6B21FF] text-gray-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                                        <input
                                            type="text"
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#6B21FF] text-gray-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                        <div className="relative">
                                            <input
                                                type={showAddPassword ? 'text' : 'password'}
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#6B21FF] text-gray-900 pr-12"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowAddPassword(!showAddPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showAddPassword ? (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                                        <select
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value as 'user' | 'admin' })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#6B21FF] text-gray-900"
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                    <div className="flex gap-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setShowAddModal(false)}
                                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-4 py-2 bg-[#6B21FF] text-white rounded-lg hover:bg-[#5518CC] transition"
                                        >
                                            Tambah
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )
                }

                {/* Edit User Modal */}
                {
                    showEditModal && selectedUser && (
                        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
                            <div className="bg-white rounded-xl p-8 max-w-md w-full animate-scale-up shadow-2xl">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit User</h2>
                                <form onSubmit={handleUpdateUser} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            disabled
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-gray-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                                        <input
                                            type="text"
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#6B21FF] text-gray-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#6B21FF] text-gray-900"
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                    <div className="flex gap-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowEditModal(false);
                                                setSelectedUser(null);
                                            }}
                                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-4 py-2 bg-[#6B21FF] text-white rounded-lg hover:bg-[#5518CC] transition"
                                        >
                                            Simpan
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )
                }

                {/* Delete Confirmation Modal */}
                {
                    showDeleteModal && selectedUser && (
                        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
                            <div className="bg-white rounded-xl p-8 max-w-md w-full animate-scale-up shadow-2xl">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Konfirmasi Hapus</h2>
                                <p className="text-gray-600 mb-2">
                                    Apakah Anda yakin ingin menghapus user <strong>{selectedUser.username}</strong>?
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
                                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-500 transition-colors text-gray-900"
                                        autoFocus
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setShowDeleteModal(false);
                                            setSelectedUser(null);
                                            setDeleteConfirmText('');
                                        }}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={handleDeleteUser}
                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* Reset Password Confirmation Modal */}
                {showResetPasswordModal && selectedUser && (
                    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-8 max-w-md w-full animate-scale-up shadow-2xl">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Konfirmasi Reset Password</h2>
                            <p className="text-gray-600 mb-6">
                                Kirim email reset password ke <strong>{selectedUser.email}</strong>?
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowResetPasswordModal(false);
                                        setSelectedUser(null);
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleResetPassword}
                                    disabled={isResetPasswordLoading}
                                    className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isResetPasswordLoading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Mengirim...
                                        </>
                                    ) : (
                                        'Kirim Email'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

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
            </div>
        </>
    );
}
