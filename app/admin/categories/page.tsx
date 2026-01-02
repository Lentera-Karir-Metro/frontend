"use client";
import AdminSidebar from '@/app/components/AdminSidebar';
import HeaderAdmin from '@/app/components/HeaderAdmin';
import { useState, useEffect } from 'react';

interface Category {
    id: string;
    name: string;
    description: string | null;
    icon: string;
    color: string;
    status: 'active' | 'inactive';
    courseCount: number;
    createdAt: string;
}

interface PaginationInfo {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
}

// Icon options for categories with SVG paths
const iconOptions = [
    { value: 'folder', label: 'Folder' },
    { value: 'code', label: 'Code' },
    { value: 'design', label: 'Design' },
    { value: 'business', label: 'Business' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'data', label: 'Data' },
    { value: 'language', label: 'Language' },
    { value: 'music', label: 'Music' },
    { value: 'photo', label: 'Photography' },
    { value: 'health', label: 'Health' },
    { value: 'finance', label: 'Finance' },
    { value: 'education', label: 'Education' },
];

// SVG Icon Component
const CategoryIcon = ({ iconValue, color, size = 24 }: { iconValue: string; color: string; size?: number }) => {
    const iconColor = color || '#6B21FF';

    const icons: Record<string, React.ReactNode> = {
        folder: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
        ),
        code: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
            </svg>
        ),
        design: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="13.5" cy="6.5" r=".5" fill={iconColor} />
                <circle cx="17.5" cy="10.5" r=".5" fill={iconColor} />
                <circle cx="8.5" cy="7.5" r=".5" fill={iconColor} />
                <circle cx="6.5" cy="12.5" r=".5" fill={iconColor} />
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z" />
            </svg>
        ),
        business: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
        ),
        marketing: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
        ),
        data: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
        ),
        language: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
        ),
        music: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
            </svg>
        ),
        photo: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
            </svg>
        ),
        health: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
        ),
        finance: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
        ),
        education: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
        ),
    };

    return <>{icons[iconValue] || icons.folder}</>;
};

// Color options
const colorOptions = [
    { value: '#6B21FF', label: 'Purple' },
    { value: '#3B82F6', label: 'Blue' },
    { value: '#10B981', label: 'Green' },
    { value: '#F59E0B', label: 'Orange' },
    { value: '#EF4444', label: 'Red' },
    { value: '#EC4899', label: 'Pink' },
    { value: '#8B5CF6', label: 'Violet' },
    { value: '#14B8A6', label: 'Teal' },
];

export default function CategoryManagement() {
    // Data state
    const [categories, setCategories] = useState<Category[]>([]);
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
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    // Notification state
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    // Delete confirmation
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        icon: 'folder',
        color: '#6B21FF',
        status: 'active' as 'active' | 'inactive'
    });

    // Fetch categories from API
    const fetchCategories = async () => {
        setIsLoading(true);
        setError('');

        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: '10',
            });

            if (searchQuery) params.append('search', searchQuery);
            if (statusFilter !== 'all') params.append('status', statusFilter);

            const token = localStorage.getItem('token');
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/admin/categories?${params}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch categories: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                setCategories(data.data);
                setPagination(data.pagination);
            } else {
                throw new Error(data.message || 'Unknown error');
            }
        } catch (err: any) {
            console.error('Error fetching categories:', err);
            setError(err.message || 'Gagal memuat data kategori.');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch on mount and when filters change
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchCategories();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [currentPage, searchQuery, statusFilter]);

    // Auto-hide notification
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
    };

    // Create category
    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setShowAddModal(false);
                setFormData({ name: '', description: '', icon: 'folder', color: '#6B21FF', status: 'active' });
                fetchCategories();
                showNotification('success', 'Kategori berhasil ditambahkan!');
            } else {
                showNotification('error', data.message || 'Gagal menambahkan kategori');
            }
        } catch (err) {
            console.error('Error creating category:', err);
            showNotification('error', 'Terjadi kesalahan saat menambahkan kategori');
        }
    };

    // Update category
    const handleUpdateCategory = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedCategory) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/admin/categories/${selectedCategory.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();

            if (response.ok && data.success) {
                setShowEditModal(false);
                setSelectedCategory(null);
                fetchCategories();
                showNotification('success', 'Kategori berhasil diperbarui!');
            } else {
                showNotification('error', data.message || 'Gagal memperbarui kategori');
            }
        } catch (err) {
            console.error('Error updating category:', err);
            showNotification('error', 'Terjadi kesalahan saat memperbarui kategori');
        }
    };

    // Delete category
    const handleDeleteCategory = async () => {
        if (!selectedCategory) return;

        if (deleteConfirmText !== 'hapus') {
            showNotification('error', 'Ketik "hapus" untuk konfirmasi');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/admin/categories/${selectedCategory.id}`,
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
                setSelectedCategory(null);
                setDeleteConfirmText('');
                fetchCategories();
                showNotification('success', 'Kategori berhasil dihapus!');
            } else {
                showNotification('error', data.message || 'Gagal menghapus kategori');
            }
        } catch (err) {
            console.error('Error deleting category:', err);
            showNotification('error', 'Terjadi kesalahan saat menghapus kategori');
        }
    };

    // Open edit modal
    const handleEdit = (category: Category) => {
        setSelectedCategory(category);
        setFormData({
            name: category.name,
            description: category.description || '',
            icon: category.icon,
            color: category.color,
            status: category.status
        });
        setShowEditModal(true);
    };

    // Open delete modal
    const handleDelete = (category: Category) => {
        setSelectedCategory(category);
        setShowDeleteModal(true);
    };

    // Render category icon (SVG)
    const renderCategoryIcon = (iconValue: string, color: string, size: number = 24) => {
        return <CategoryIcon iconValue={iconValue} color={color} size={size} />;
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

    // Icon selector component for modals
    const IconSelector = () => (
        <div className="grid grid-cols-6 gap-2">
            {iconOptions.map(icon => (
                <button
                    key={icon.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: icon.value })}
                    className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center ${formData.icon === icon.value
                        ? 'border-[#6B21FF] bg-[#6B21FF]/10 scale-105'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                    title={icon.label}
                >
                    <CategoryIcon iconValue={icon.value} color={formData.icon === icon.value ? '#6B21FF' : '#6B7280'} size={20} />
                </button>
            ))}
        </div>
    );

    return (
        <>
            <style jsx>{`
                @keyframes scaleUp {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-scale-up { animation: scaleUp 0.2s ease-out; }
                .animate-slide-in { animation: slideIn 0.3s ease-out; }
            `}</style>
            <div className="flex min-h-screen bg-gray-50">
                <AdminSidebar />

                <div className="flex-1 ml-[220px]">
                    <HeaderAdmin />

                    <main className="p-8">
                        {/* Title and Add Button */}
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
                                <p className="text-gray-500 mt-1">Kelola kategori untuk kelas Anda</p>
                            </div>
                            <button
                                onClick={() => {
                                    setFormData({ name: '', description: '', icon: 'folder', color: '#6B21FF', status: 'active' });
                                    setShowAddModal(true);
                                }}
                                className="bg-[#6B21FF] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#5518CC] transition flex items-center gap-2 shadow-lg hover:shadow-xl"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Tambah Kategori
                            </button>
                        </div>

                        {/* Search and Filter */}
                        <div className="flex flex-wrap gap-4 mb-6">
                            <div className="relative flex-1 max-w-md">
                                <input
                                    type="text"
                                    placeholder="Cari kategori..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6B21FF] focus:border-transparent text-gray-700 bg-white shadow-sm"
                                />
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#6B21FF] cursor-pointer shadow-sm"
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
                                {/* Category Cards Grid */}
                                {categories.length === 0 ? (
                                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                                        <div className="flex justify-center mb-4">
                                            <CategoryIcon iconValue="folder" color="#9CA3AF" size={64} />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Belum ada kategori</h3>
                                        <p className="text-gray-500">Klik "Tambah Kategori" untuk membuat kategori baru</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {categories.map((category) => (
                                            <div
                                                key={category.id}
                                                className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 group"
                                            >
                                                {/* Category Header */}
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                                                            style={{ backgroundColor: `${category.color}20` }}
                                                        >
                                                            {renderCategoryIcon(category.icon, category.color, 24)}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-gray-900 text-lg">{category.name}</h3>
                                                            <span
                                                                className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${category.status === 'active'
                                                                    ? 'bg-green-100 text-green-700'
                                                                    : 'bg-gray-100 text-gray-600'
                                                                    }`}
                                                            >
                                                                {category.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="w-4 h-4 rounded-full border-2 border-white shadow-md"
                                                        style={{ backgroundColor: category.color }}
                                                    />
                                                </div>

                                                {/* Description */}
                                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                                                    {category.description || 'Tidak ada deskripsi'}
                                                </p>

                                                {/* Stats */}
                                                <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">
                                                    <div className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                        </svg>
                                                        <span>{category.courseCount} Kelas</span>
                                                    </div>
                                                    <span>{formatDate(category.createdAt)}</span>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(category)}
                                                        className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-[#6B21FF] hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(category)}
                                                        className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-500 hover:text-white transition-all duration-300"
                                                        title="Hapus"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Pagination */}
                                {pagination.totalPages > 1 && (
                                    <div className="flex justify-center mt-8">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                disabled={currentPage === 1}
                                                className="p-2 rounded-full hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </button>
                                            <div className="w-10 h-10 rounded-full bg-[#6B21FF] flex items-center justify-center text-white font-semibold">
                                                {currentPage}
                                            </div>
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                                                disabled={currentPage === pagination.totalPages}
                                                className="p-2 rounded-full hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>

                {/* Add Category Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 animate-scale-up shadow-2xl max-h-[90vh] overflow-y-auto">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tambah Kategori Baru</h2>
                            <form onSubmit={handleCreateCategory} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Kategori *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        placeholder="Contoh: Web Development"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6B21FF] focus:border-transparent text-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Deskripsi singkat tentang kategori ini..."
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6B21FF] focus:border-transparent text-gray-900 resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                                    <IconSelector />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Warna</label>
                                    <div className="flex flex-wrap gap-2">
                                        {colorOptions.map(color => (
                                            <button
                                                key={color.value}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, color: color.value })}
                                                className={`w-8 h-8 rounded-full transition-all ${formData.color === color.value ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-105'}`}
                                                style={{ backgroundColor: color.value }}
                                                title={color.label}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6B21FF] text-gray-900"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                                <div className="flex gap-3 mt-6 pt-4 border-t">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-3 bg-[#6B21FF] text-white rounded-xl hover:bg-[#5518CC] transition font-medium"
                                    >
                                        Tambah Kategori
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Category Modal */}
                {showEditModal && selectedCategory && (
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 animate-scale-up shadow-2xl max-h-[90vh] overflow-y-auto">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Kategori</h2>
                            <form onSubmit={handleUpdateCategory} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Kategori *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6B21FF] focus:border-transparent text-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6B21FF] focus:border-transparent text-gray-900 resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                                    <IconSelector />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Warna</label>
                                    <div className="flex flex-wrap gap-2">
                                        {colorOptions.map(color => (
                                            <button
                                                key={color.value}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, color: color.value })}
                                                className={`w-8 h-8 rounded-full transition-all ${formData.color === color.value ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-105'}`}
                                                style={{ backgroundColor: color.value }}
                                                title={color.label}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6B21FF] text-gray-900"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                                <div className="flex gap-3 mt-6 pt-4 border-t">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowEditModal(false);
                                            setSelectedCategory(null);
                                        }}
                                        className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-3 bg-[#6B21FF] text-white rounded-xl hover:bg-[#5518CC] transition font-medium"
                                    >
                                        Simpan Perubahan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && selectedCategory && (
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 animate-scale-up shadow-2xl">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Hapus Kategori?</h2>
                                <p className="text-gray-600">
                                    Anda akan menghapus kategori <strong>{selectedCategory.name}</strong>.
                                    {selectedCategory.courseCount > 0 && (
                                        <span className="block text-red-500 mt-2">
                                            ⚠️ Kategori ini memiliki {selectedCategory.courseCount} kelas dan tidak dapat dihapus.
                                        </span>
                                    )}
                                </p>
                            </div>
                            {selectedCategory.courseCount === 0 && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ketik <span className="font-mono bg-gray-100 px-2 py-1 rounded text-red-600">hapus</span> untuk konfirmasi
                                    </label>
                                    <input
                                        type="text"
                                        value={deleteConfirmText}
                                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                                        placeholder="Ketik 'hapus'"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition text-gray-900"
                                        autoFocus
                                    />
                                </div>
                            )}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setSelectedCategory(null);
                                        setDeleteConfirmText('');
                                    }}
                                    className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium"
                                >
                                    Batal
                                </button>
                                {selectedCategory.courseCount === 0 && (
                                    <button
                                        onClick={handleDeleteCategory}
                                        className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium"
                                    >
                                        Hapus
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Notification Toast */}
                {notification && (
                    <div className="fixed top-4 right-4 z-50 animate-slide-in">
                        <div className={`rounded-xl px-6 py-4 shadow-2xl border-2 min-w-[300px] ${notification.type === 'success'
                            ? 'bg-green-50 border-green-500 text-green-800'
                            : 'bg-red-50 border-red-500 text-red-800'
                            }`}>
                            <div className="flex items-center gap-3">
                                {notification.type === 'success' ? (
                                    <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                )}
                                <p className="font-medium">{notification.message}</p>
                                <button
                                    onClick={() => setNotification(null)}
                                    className="ml-auto text-gray-400 hover:text-gray-600"
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
