"use client";
import AdminSidebar from '@/app/components/AdminSidebar';
import { useState } from 'react';

interface UserRegister {
    no: number;
    nama: string;
    email: string;
    tanggal: string;
}

interface Course {
    no: number;
    judul: string;
    kategori: string;
}

interface Transaction {
    id: string;
    nama: string;
    kelas: string;
    total: string;
    metode: string;
    status: 'Success' | 'Pending';
}

export default function AdminDashboard() {
    // Dummy data
    const userRegisters: UserRegister[] = [
        { no: 1, nama: 'Isabella Ben', email: 'isabell@gmail.com', tanggal: '2024-01-15' },
        { no: 2, nama: 'Owen Carter', email: 'wenn01@gmail.com', tanggal: '2024-01-15' },
        { no: 3, nama: 'Chloe Foster', email: 'chloe41@gmail.com', tanggal: '2024-01-15' },
        { no: 4, nama: 'Noah Hughes', email: 'imnoahh@gamil.com', tanggal: '2024-01-15' },
        { no: 5, nama: 'Emily Jenkins', email: 'melmeil@gmail.com', tanggal: '2024-01-15' },
    ];

    const courses: Course[] = [
        { no: 1, judul: 'Merancang User Experience dari Nol', kategori: 'Design' },
        { no: 2, judul: 'Pemasaran Digital untuk Pemula', kategori: 'Marketing' },
        { no: 3, judul: 'JavaScript untuk Web Interaktif', kategori: 'Programming' },
        { no: 4, judul: 'Teknik Jitu saat Wawancara', kategori: 'Interview & CV' },
        { no: 5, judul: 'Tipografi dan Hierarki Desain', kategori: 'Design' },
    ];

    const transactions: Transaction[] = [
        { id: 'TXN12345', nama: 'Sarah Chen', kelas: 'Digital Marketing Fundamental', total: 'Rp150.000', metode: 'DANA', status: 'Success' },
        { id: 'TXN67890', nama: 'David Lee', kelas: 'Javascript untuk Web Interaktif', total: 'Rp250.000', metode: 'QRIS', status: 'Pending' },
        { id: 'TXN24680', nama: 'Emily Wong', kelas: 'Web Development Bootcamp', total: 'Rp100.000', metode: 'Bank Transfer', status: 'Success' },
        { id: 'TXN13579', nama: 'Michael Tan', kelas: 'Graphic Design Masterclass', total: 'Rp200.000', metode: 'Bank Transfer', status: 'Pending' },
        { id: 'TXN98765', nama: 'Olivia Lim', kelas: 'Tips Lancar Wawancara Kerja', total: 'Rp100.000', metode: 'ShopeePay', status: 'Success' },
    ];

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

                {/* Dashboard Content */}
                <main className="p-8">
                    {/* Title */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                            <p className="text-sm text-gray-600 mb-2">Total Users</p>
                            <p className="text-3xl font-bold text-gray-900">1,250</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                            <p className="text-sm text-gray-600 mb-2">Active Courses</p>
                            <p className="text-3xl font-bold text-gray-900">75</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                            <p className="text-sm text-gray-600 mb-2">Total Sales</p>
                            <p className="text-3xl font-bold text-gray-900">Rp2.800.000</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                            <p className="text-sm text-gray-600 mb-2">Pending Payments</p>
                            <p className="text-3xl font-bold text-gray-900">Rp500.000</p>
                        </div>
                    </div>

                    {/* Aktivitas Terkini */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Aktivitas Terkini</h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* User Register Table */}
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-gray-900">User Register</h3>
                                    <a href="#" className="text-sm text-[#6B21FF] hover:underline flex items-center gap-1">
                                        Go to Users Page
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </a>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-[#E8DEFF]">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B21FF]">No</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B21FF]">Nama</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B21FF]">Email</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B21FF]">Tanggal Registrasi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {userRegisters.map((user) => (
                                                <tr key={user.no} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 text-sm text-gray-900">{user.no}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">{user.nama}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{user.tanggal}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Daftar Kelas Table */}
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-gray-900">Daftar Kelas</h3>
                                    <a href="#" className="text-sm text-[#6B21FF] hover:underline flex items-center gap-1">
                                        Go to Class Page
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </a>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-[#E8DEFF]">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B21FF]">No</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B21FF]">Judul Kelas</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B21FF]">Kategori</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {courses.map((course) => (
                                                <tr key={course.no} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 text-sm text-gray-900">{course.no}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">{course.judul}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{course.kategori}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transaksi Table */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-2xl font-bold text-gray-900">Transaksi</h3>
                            <a href="#" className="text-sm text-[#6B21FF] hover:underline flex items-center gap-1">
                                Go to Transaction Page
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </a>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#E8DEFF]">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B21FF]">ID Transaksi</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B21FF]">Nama</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B21FF]">Kelas yang dibeli</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B21FF]">Total bayar</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B21FF]">Metode bayar</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B21FF]">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {transactions.map((transaction) => (
                                        <tr key={transaction.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-900">{transaction.id}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{transaction.nama}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{transaction.kelas}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{transaction.total}</td>
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
                </main>
            </div>
        </div>
    );
}
