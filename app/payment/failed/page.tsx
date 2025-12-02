"use client";
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardNavbar from '@/app/components/DashboardNavbar';
import Footer from '@/app/components/Footer';

export default function PaymentFailedPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [countdown, setCountdown] = useState(10);

	useEffect(() => {
		const timer = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					clearInterval(timer);
					router.push('/explore');
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [router]);

	const orderId = searchParams.get('order_id');
	const transactionStatus = searchParams.get('transaction_status');

	return (
		<div className="min-h-screen flex flex-col bg-gray-50">
			<DashboardNavbar />

			<main className="flex-grow flex items-center justify-center px-6 py-12">
				<div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
					{/* Failed Icon */}
					<div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
						<svg 
							className="w-12 h-12 text-red-600" 
							fill="none" 
							stroke="currentColor" 
							viewBox="0 0 24 24"
						>
							<path 
								strokeLinecap="round" 
								strokeLinejoin="round" 
								strokeWidth={2} 
								d="M6 18L18 6M6 6l12 12" 
							/>
						</svg>
					</div>

					{/* Failed Message */}
					<h1 className="text-3xl font-bold text-gray-900 mb-3">
						Pembayaran Gagal
					</h1>
					<p className="text-gray-600 mb-6">
						Maaf, pembayaran Anda tidak dapat diproses. Silakan coba lagi.
					</p>

					{/* Order Details */}
					{orderId && (
						<div className="bg-gray-50 rounded-lg p-4 mb-6">
							<p className="text-sm text-gray-600 mb-1">Order ID</p>
							<p className="font-mono font-semibold text-gray-900">{orderId}</p>
							{transactionStatus && (
								<>
									<p className="text-sm text-gray-600 mb-1 mt-3">Status</p>
									<p className="font-semibold text-red-600 capitalize">{transactionStatus}</p>
								</>
							)}
						</div>
					)}

					{/* Info */}
					<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
						<p className="text-sm text-gray-700">
							Pembayaran Anda dibatalkan atau terjadi kesalahan. Jika dana sudah terpotong, akan dikembalikan dalam 1-3 hari kerja.
						</p>
					</div>

					{/* Countdown */}
					<p className="text-sm text-gray-500 mb-6">
						Mengalihkan ke halaman jelajah dalam {countdown} detik...
					</p>

					{/* Action Buttons */}
					<div className="flex gap-3">
						<button
							onClick={() => router.push('/explore')}
							className="flex-1 bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 hover:shadow-lg text-white font-semibold py-3 rounded-full transition-all"
						>
							Coba Lagi
						</button>
						<button
							onClick={() => router.push('/dashboard')}
							className="flex-1 bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold py-3 rounded-full transition-all"
						>
							Ke Dashboard
						</button>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
}
