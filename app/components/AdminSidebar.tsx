"use client";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface SubMenuItem {
    name: string;
    href: string;
}

interface MenuItem {
    name: string;
    href?: string;
    icon: React.ReactNode;
    subItems?: SubMenuItem[];
}

export default function AdminSidebar() {
    const pathname = usePathname();
    const [isManagementOpen, setIsManagementOpen] = useState(true);

    const menuItems: MenuItem[] = [
        {
            name: 'Main Dashboard',
            href: '/admin/dashboard',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
        },
        {
            name: 'Management',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            subItems: [
                { name: 'User', href: '/admin/users' },
                { name: 'Mentor', href: '/admin/mentors' },
                { name: 'Categories', href: '/admin/categories' },
            ],
        },
        {
            name: 'Learning Content',
            href: '/admin/content',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
            ),
        },
        {
            name: 'Learning Path',
            href: '/admin/learning-path',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
            ),
        },
        {
            name: 'Report & Monitoring',
            href: '/admin/reports',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
        },
        {
            name: 'Certificate',
            href: '/admin/certificates',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
        },
        {
            name: 'Transactions',
            href: '/admin/transactions',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            ),
        },
    ];

    return (
        <aside className="w-[220px] h-screen bg-[#7C3AED] text-white fixed left-0 top-0 flex flex-col shadow-2xl">
            {/* Logo */}
            <div className="p-6 pb-8 flex justify-center">
                <Image
                    src="/images/lentera.png"
                    alt="Lentera Karir Logo"
                    width={160}
                    height={160}
                    className="object-contain"
                />
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-4 space-y-1">
                {menuItems.map((item) => {
                    if (item.subItems) {
                        // Collapsible menu item with submenu
                        return (
                            <div key={item.name}>
                                <button
                                    onClick={() => setIsManagementOpen(!isManagementOpen)}
                                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-white/90 hover:bg-white/10 transition-all duration-200"
                                >
                                    <div className="flex items-center gap-3">
                                        {item.icon}
                                        <span className="text-sm font-medium">{item.name}</span>
                                    </div>
                                    <svg
                                        className={`w-4 h-4 transition-transform duration-200 ${isManagementOpen ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Submenu */}
                                {isManagementOpen && (
                                    <div className="mt-1 ml-4 space-y-1">
                                        {item.subItems.map((subItem) => {
                                            const isActive = pathname === subItem.href;
                                            return (
                                                <Link
                                                    key={subItem.href}
                                                    href={subItem.href}
                                                    className={`block px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${isActive
                                                        ? 'bg-white text-[#7C3AED] font-semibold shadow-md'
                                                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                                                        }`}
                                                >
                                                    {subItem.name}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    } else {
                        // Regular menu item
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href!}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                    ? 'bg-white/10 text-white font-medium'
                                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                {item.icon}
                                <span className="text-sm">{item.name}</span>
                            </Link>
                        );
                    }
                })}
            </nav>
        </aside>
    );
}
