"use client";
import AdminSidebar from '@/app/components/AdminSidebar';
import HeaderAdmin from '@/app/components/HeaderAdmin';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Interface untuk response API
interface DashboardStats {
    users: {
        total: number;
        active: number;
        inactive: number;
        newLast7Days: number;
        newLast30Days: number;
    };
    content: {
        totalLearningPaths: number;
        totalCourses: number;
        totalModules: number;
    };
    enrollments: {
        total: number;
        active: number;
    };
    certificates: {
        total: number;
    };
    revenue: {
        total: number;
    };
}

interface RecentTransaction {
    id: string;
    userName: string;
    userEmail: string;
    courseTitle: string;
    amount: number;
    date: string;
    status: string;
}

interface UserGrowthData {
    month: string;
    newUsers: number;
    newMentors?: number;
}

interface RecentUser {
    id: string;
    username: string;
    email: string;
    createdAt: string;
}

interface RecentCourse {
    id: string;
    title: string;
    category: string;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [transactions, setTransactions] = useState<RecentTransaction[]>([]);
    const [userGrowth, setUserGrowth] = useState<UserGrowthData[]>([]);
    const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
    const [recentCourses, setRecentCourses] = useState<RecentCourse[]>([]);

    const [statsLoading, setStatsLoading] = useState(true);
    const [transactionsLoading, setTransactionsLoading] = useState(true);
    const [chartLoading, setChartLoading] = useState(true);
    const [usersLoading, setUsersLoading] = useState(true);
    const [coursesLoading, setCoursesLoading] = useState(true);

    const [statsError, setStatsError] = useState<string | null>(null);
    const [transactionsError, setTransactionsError] = useState<string | null>(null);
    const [chartError, setChartError] = useState<string | null>(null);
    const [usersError, setUsersError] = useState<string | null>(null);
    const [coursesError, setCoursesError] = useState<string | null>(null);

    const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);
    const [isCoursesModalOpen, setIsCoursesModalOpen] = useState(false);

    // Fetch Dashboard Stats
    useEffect(() => {
        const fetchStats = async () => {
            setStatsLoading(true);
            setStatsError(null);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    // Redirect akan ditangani oleh HeaderAdmin
                    return;
                }

                const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
                const response = await fetch(`${baseUrl}/admin/dashboard/stats`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => null);
                    throw new Error(errorData?.message || `HTTP Error: ${response.status}`);
                }

                const result = await response.json();
                if (result.success) {
                    setStats(result.data);
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
                setStatsError(error instanceof Error ? error.message : 'Terjadi kesalahan');
            } finally {
                setStatsLoading(false);
            }
        };

        fetchStats();
    }, []);

    // Fetch Recent Transactions
    useEffect(() => {
        const fetchTransactions = async () => {
            setTransactionsLoading(true);
            setTransactionsError(null);
            try {
                const token = localStorage.getItem('token');
                if (!token) return; // Redirect akan ditangani oleh HeaderAdmin

                const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
                const response = await fetch(`${baseUrl}/admin/dashboard/recent-transactions?limit=5`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => null);
                    throw new Error(errorData?.message || `HTTP Error: ${response.status}`);
                }

                const result = await response.json();
                if (result.success) {
                    setTransactions(result.data);
                }
            } catch (error) {
                console.error('Error fetching transactions:', error);
                setTransactionsError(error instanceof Error ? error.message : 'Terjadi kesalahan');
            } finally {
                setTransactionsLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    // Fetch User Growth Chart
    useEffect(() => {
        const fetchUserGrowth = async () => {
            setChartLoading(true);
            setChartError(null);
            try {
                const token = localStorage.getItem('token');
                if (!token) return; // Redirect akan ditangani oleh HeaderAdmin

                const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
                const response = await fetch(`${baseUrl}/admin/dashboard/user-growth?months=6`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => null);
                    throw new Error(errorData?.message || `HTTP Error: ${response.status}`);
                }

                const result = await response.json();
                if (result.success) {
                    setUserGrowth(result.data);
                }
            } catch (error) {
                console.error('Error fetching user growth:', error);
                setChartError(error instanceof Error ? error.message : 'Terjadi kesalahan');
            } finally {
                setChartLoading(false);
            }
        };

        fetchUserGrowth();
    }, []);

    // Fetch Recent Users
    useEffect(() => {
        const fetchRecentUsers = async () => {
            setUsersLoading(true);
            setUsersError(null);
            try {
                const token = localStorage.getItem('token');
                if (!token) return; // Redirect akan ditangani oleh HeaderAdmin

                const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
                const response = await fetch(`${baseUrl}/admin/dashboard/recent-users?limit=5`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => null);
                    throw new Error(errorData?.message || `HTTP Error: ${response.status}`);
                }

                const result = await response.json();
                if (result.success) {
                    setRecentUsers(result.data);
                }
            } catch (error) {
                console.error('Error fetching recent users:', error);
                setUsersError(error instanceof Error ? error.message : 'Terjadi kesalahan');
            } finally {
                setUsersLoading(false);
            }
        };

        fetchRecentUsers();
    }, []);

    // Fetch Recent Learning Paths
    useEffect(() => {
        const fetchRecentCourses = async () => {
            setCoursesLoading(true);
            setCoursesError(null);
            try {
                const token = localStorage.getItem('token');
                if (!token) return; // Redirect akan ditangani oleh HeaderAdmin

                const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
                const response = await fetch(`${baseUrl}/admin/dashboard/recent-learning-paths?limit=5`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => null);
                    throw new Error(errorData?.message || `HTTP Error: ${response.status}`);
                }

                const result = await response.json();
                if (result.success) {
                    setRecentCourses(result.data);
                }
            } catch (error) {
                console.error('Error fetching recent courses:', error);
                setCoursesError(error instanceof Error ? error.message : 'Terjadi kesalahan');
            } finally {
                setCoursesLoading(false);
            }
        };

        fetchRecentCourses();
    }, []);

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <AdminSidebar />

            {/* Main Content */}
            <div className={`flex-1 ml-[220px] flex flex-col h-screen ${isUsersModalOpen || isCoursesModalOpen ? 'blur-sm' : ''}`}>
                <HeaderAdmin />

                {/* Dashboard Content */}
                <main className="p-8 flex-1 overflow-y-auto">
                    {/* Title */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {statsLoading ? (
                            <div className="col-span-4 text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#6B21FF]"></div>
                                <p className="text-gray-500 mt-2">Memuat statistik...</p>
                            </div>
                        ) : statsError ? (
                            <div className="col-span-4 text-center py-12">
                                <p className="text-red-500">{statsError}</p>
                            </div>
                        ) : (
                            <>
                                <div className="bg-white rounded-xl p-6 border border-gray-200">
                                    <p className="text-sm text-gray-600 mb-2">Total Users</p>
                                    <p className="text-3xl font-bold text-gray-900">{stats?.users.total.toLocaleString() || 0}</p>
                                    <p className="text-xs text-gray-500 mt-1">Active: {stats?.users.active || 0}</p>
                                </div>
                                <div className="bg-white rounded-xl p-6 border border-gray-200">
                                    <p className="text-sm text-gray-600 mb-2">Learning Paths</p>
                                    <p className="text-3xl font-bold text-gray-900">{stats?.content.totalLearningPaths || 0}</p>
                                    <p className="text-xs text-gray-500 mt-1">Courses: {stats?.content.totalCourses || 0}</p>
                                </div>
                                <div className="bg-white rounded-xl p-6 border border-gray-200">
                                    <p className="text-sm text-gray-600 mb-2">Total Revenue</p>
                                    <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats?.revenue.total || 0)}</p>
                                    <p className="text-xs text-gray-500 mt-1">From {stats?.enrollments.active || 0} enrollments</p>
                                </div>
                                <div className="bg-white rounded-xl p-6 border border-gray-200">
                                    <p className="text-sm text-gray-600 mb-2">Total Enrollments</p>
                                    <p className="text-3xl font-bold text-gray-900">{stats?.enrollments.total || 0}</p>
                                    <p className="text-xs text-gray-500 mt-1">Active: {stats?.enrollments.active || 0}</p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Chart Section */}
                    <div className="mb-8">
                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Pertumbuhan Pengguna</h2>
                            </div>
                            {chartLoading ? (
                                <div className="text-center py-12">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#6B21FF]"></div>
                                    <p className="text-gray-500 mt-2">Memuat grafik...</p>
                                </div>
                            ) : chartError ? (
                                <div className="text-center py-12">
                                    <p className="text-red-500">{chartError}</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-sm" style={{ background: '#6B21FF' }}></span>
                                            <span className="text-sm text-gray-600">Users</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-sm" style={{ background: '#10B981' }}></span>
                                            <span className="text-sm text-gray-600">Mentors</span>
                                        </div>
                                    </div>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <AreaChart
                                            data={userGrowth}
                                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                        >
                                            <defs>
                                                <linearGradient id="colorNewUsers" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#6B21FF" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#6B21FF" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorMentors" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                            <XAxis
                                                dataKey="month"
                                                stroke="#9ca3af"
                                                style={{ fontSize: '14px' }}
                                            />
                                            <YAxis
                                                stroke="#9ca3af"
                                                style={{ fontSize: '14px' }}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#6B21FF',
                                                    border: 'none',
                                                    borderRadius: '12px',
                                                    color: 'white',
                                                    padding: '8px 12px'
                                                }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="newUsers"
                                                stroke="#6B21FF"
                                                strokeWidth={3}
                                                fillOpacity={1}
                                                fill="url(#colorNewUsers)"
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="newMentors"
                                                stroke="#10B981"
                                                strokeWidth={3}
                                                fillOpacity={1}
                                                fill="url(#colorMentors)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Aktivitas Terkini */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Aktivitas Terkini</h2>

                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                            {/* User Register Table */}
                            <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-gray-900">User Register</h3>
                                    <Link href="/admin/users" className="text-sm text-[#6B21FF] hover:underline flex items-center gap-1">
                                        Lihat Semua
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>

                                {usersLoading ? (
                                    <div className="text-center py-12">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#6B21FF]"></div>
                                        <p className="text-gray-500 mt-2">Memuat data...</p>
                                    </div>
                                ) : usersError ? (
                                    <div className="text-center py-12">
                                        <p className="text-red-500">{usersError}</p>
                                    </div>
                                ) : recentUsers.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500">Belum ada user terbaru</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-[#E8DEFF]">
                                                <tr>
                                                    <th className="px-6 py-3 text-center text-xs font-semibold text-[#6B21FF]">No</th>
                                                    <th className="px-6 py-3 text-center text-xs font-semibold text-[#6B21FF]">Nama</th>
                                                    <th className="px-6 py-3 text-center text-xs font-semibold text-[#6B21FF]">Email</th>
                                                    <th className="px-6 py-3 text-center text-xs font-semibold text-[#6B21FF]">Tanggal Registrasi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {recentUsers.map((user, index) => (
                                                    <tr key={user.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 text-sm text-gray-900 text-center">{index + 1}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-900 text-center">{user.username}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-600 text-center">{user.email}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-600 text-center">
                                                            {new Date(user.createdAt).toLocaleDateString('id-ID')}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* Daftar Kelas Table */}
                            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-gray-900">Daftar Kelas</h3>
                                    <Link href="/admin/content" className="text-sm text-[#6B21FF] hover:underline flex items-center gap-1">
                                        Lihat Semua
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>

                                {coursesLoading ? (
                                    <div className="text-center py-12">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#6B21FF]"></div>
                                        <p className="text-gray-500 mt-2">Memuat data...</p>
                                    </div>
                                ) : coursesError ? (
                                    <div className="text-center py-12">
                                        <p className="text-red-500">{coursesError}</p>
                                    </div>
                                ) : recentCourses.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500">Belum ada kelas terbaru</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-[#E8DEFF]">
                                                <tr>
                                                    <th className="px-6 py-3 text-center text-xs font-semibold text-[#6B21FF]">No</th>
                                                    <th className="px-6 py-3 text-center text-xs font-semibold text-[#6B21FF]">Judul Kelas</th>
                                                    <th className="px-6 py-3 text-center text-xs font-semibold text-[#6B21FF]">Kategori</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {recentCourses.map((course, index) => (
                                                    <tr key={course.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 text-sm text-gray-900 text-center">{index + 1}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-900 text-center">{course.title}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-600 text-center">{course.category}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Transaksi Terbaru */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-2xl font-bold text-gray-900">Transaksi Terbaru</h3>
                            <a href="/admin/transactions" className="text-sm text-[#6B21FF] hover:underline flex items-center gap-1">
                                Lihat Semua
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </a>
                        </div>

                        {transactionsLoading ? (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#6B21FF]"></div>
                                <p className="text-gray-500 mt-2">Memuat transaksi...</p>
                            </div>
                        ) : transactionsError ? (
                            <div className="text-center py-12">
                                <p className="text-red-500\">{transactionsError}</p>
                            </div>
                        ) : transactions.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500">Belum ada transaksi</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-[#E8DEFF]">
                                        <tr>
                                            <th className="px-6 py-3 text-center text-xs font-semibold text-[#6B21FF]">ID</th>
                                            <th className="px-6 py-3 text-center text-xs font-semibold text-[#6B21FF]">Nama User</th>
                                            <th className="px-6 py-3 text-center text-xs font-semibold text-[#6B21FF]">Email</th>
                                            <th className="px-6 py-3 text-center text-xs font-semibold text-[#6B21FF]">Learning Path</th>
                                            <th className="px-6 py-3 text-center text-xs font-semibold text-[#6B21FF]">Total</th>
                                            <th className="px-6 py-3 text-center text-xs font-semibold text-[#6B21FF]">Tanggal</th>
                                            <th className="px-6 py-3 text-center text-xs font-semibold text-[#6B21FF]">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {transactions.map((transaction) => (
                                            <tr key={transaction.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 text-sm text-gray-800 text-center">{transaction.id}</td>
                                                <td className="px-6 py-4 text-sm text-gray-800 text-center">{transaction.userName}</td>
                                                <td className="px-6 py-4 text-sm text-gray-800 text-center">{transaction.userEmail}</td>
                                                <td className="px-6 py-4 text-sm text-gray-800 text-center">{transaction.courseTitle}</td>
                                                <td className="px-6 py-4 text-sm font-semibold text-gray-800 text-center">{formatCurrency(transaction.amount)}</td>
                                                <td className="px-6 py-4 text-sm text-gray-800 text-center">{new Date(transaction.date).toLocaleDateString('id-ID')}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                                        {transaction.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Users Modal */}
            {isUsersModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pl-[270px]" style={{ animation: 'fadeInOverlay 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
                    <div
                        className="absolute inset-0"
                        onClick={() => setIsUsersModalOpen(false)}
                    ></div>

                    <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden" style={{ animation: 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">Semua User Register</h2>
                            <button
                                onClick={() => setIsUsersModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
                            {usersLoading ? (
                                <div className="text-center py-12">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#6B21FF]"></div>
                                    <p className="text-gray-500 mt-2">Memuat data...</p>
                                </div>
                            ) : usersError ? (
                                <div className="text-center py-12">
                                    <p className="text-red-500">{usersError}</p>
                                </div>
                            ) : recentUsers.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">Belum ada user terbaru</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-[#E8DEFF]">
                                            <tr>
                                                <th className="px-6 py-3 text-center text-xs font-semibold text-[#6B21FF]">No</th>
                                                <th className="px-6 py-3 text-center text-xs font-semibold text-[#6B21FF]">Nama</th>
                                                <th className="px-6 py-3 text-center text-xs font-semibold text-[#6B21FF]">Email</th>
                                                <th className="px-6 py-3 text-center text-xs font-semibold text-[#6B21FF]">Tanggal Registrasi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {recentUsers.map((user, index) => (
                                                <tr key={user.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 text-sm text-gray-900 text-center">{index + 1}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-900 text-center">{user.username}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600 text-center">{user.email}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600 text-center">
                                                        {new Date(user.createdAt).toLocaleDateString('id-ID')}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Courses Modal */}
            {isCoursesModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pl-[270px]" style={{ animation: 'fadeInOverlay 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
                    <div
                        className="absolute inset-0"
                        onClick={() => setIsCoursesModalOpen(false)}
                    ></div>

                    <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden" style={{ animation: 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">Semua Daftar Kelas</h2>
                            <button
                                onClick={() => setIsCoursesModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
                            {coursesLoading ? (
                                <div className="text-center py-12">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#6B21FF]"></div>
                                    <p className="text-gray-500 mt-2">Memuat data...</p>
                                </div>
                            ) : coursesError ? (
                                <div className="text-center py-12">
                                    <p className="text-red-500">{coursesError}</p>
                                </div>
                            ) : recentCourses.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">Belum ada kelas terbaru</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-[#E8DEFF]">
                                            <tr>
                                                <th className="px-6 py-3 text-center text-xs font-semibold text-[#6B21FF]">No</th>
                                                <th className="px-6 py-3 text-center text-xs font-semibold text-[#6B21FF]">Judul Kelas</th>
                                                <th className="px-6 py-3 text-center text-xs font-semibold text-[#6B21FF]">Kategori</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {recentCourses.map((course, index) => (
                                                <tr key={course.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 text-sm text-gray-900 text-center">{index + 1}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-900 text-center">{course.title}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600 text-center">{course.category}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
