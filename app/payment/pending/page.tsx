"use client";
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardNavbar from '@/app/components/DashboardNavbar';
import Footer from '@/app/components/Footer';

export default function PaymentPendingPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [countdown, setCountdown] = useState(10);

	// Auto-check payment status untuk sync dengan database
	useEffect(() => {
		const orderId = searchParams.get('order_id');
		if (orderId) {
			const checkStatus = async () => {
				try {
					console.log('[PendingPage] Auto-checking payment status for:', orderId);
					const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
					const token = localStorage.getItem('token');
					
					if (token) {
						const response = await fetch(`${baseUrl}/payments/status/${orderId}`, {
							headers: {
								'Authorization': `Bearer ${token}`
							}
						});
						const data = await response.json();
						console.log('[PendingPage] Status check result:', data);
						
						// Jika ternyata sudah success, redirect ke success page
						if (data.status === 'success') {
							console.log('[PendingPage] ✅ Payment confirmed! Redirecting to success page...');
							router.push(`/payment/success?order_id=${orderId}&transaction_status=settlement`);
						} else {
							console.log('[PendingPage] Payment still pending:', data.status);
						}
					} else {
						console.warn('[PendingPage] No token found, skipping auto-sync');
					}
				} catch (err) {
					console.error('[PendingPage] Error checking payment status:', err);
				}
			};
			checkStatus();
		}
	}, [searchParams, router]);

	useEffect(() => {
		const timer = setInterval(() => {
			setCountdown((prev) => prev - 1);
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	useEffect(() => {
		if (countdown <= 0) {
			router.push('/dashboard');
		}
	}, [countdown, router]);

	const orderId = searchParams.get('order_id');
	const transactionStatus = searchParams.get('transaction_status');

	return (
		<div className="min-h-screen flex flex-col bg-gray-50">
			<DashboardNavbar />

			<main className="flex-grow flex items-center justify-center px-6 py-12">
				<div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
					{/* Pending Icon */}
					<div className="mx-auto w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
						<svg 
							className="w-12 h-12 text-yellow-600" 
							fill="none" 
							stroke="currentColor" 
							viewBox="0 0 24 24"
						>
							<path 
								strokeLinecap="round" 
								strokeLinejoin="round" 
								strokeWidth={2} 
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
							/>
						</svg>
					</div>

					{/* Pending Message */}
					<h1 className="text-3xl font-bold text-gray-900 mb-3">
						Pembayaran Tertunda
					</h1>
					<p className="text-gray-600 mb-6">
						Pembayaran Anda sedang diproses. Kami akan memberitahu Anda setelah pembayaran dikonfirmasi.
					</p>

					{/* Order Details */}
					{orderId && (
						<div className="bg-gray-50 rounded-lg p-4 mb-6">
							<p className="text-sm text-gray-600 mb-1">Order ID</p>
							<p className="font-mono font-semibold text-gray-900">{orderId}</p>
							{transactionStatus && (
								<>
									<p className="text-sm text-gray-600 mb-1 mt-3">Status</p>
									<p className="font-semibold text-yellow-600 capitalize">{transactionStatus}</p>
								</>
							)}
						</div>
					)}

					{/* Info */}
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
						<p className="text-sm text-gray-700">
							Silakan selesaikan pembayaran Anda. Cek email untuk instruksi pembayaran atau status transaksi.
						</p>
					</div>

					{/* Countdown */}
					<p className="text-sm text-gray-500 mb-6">
						Mengalihkan ke dashboard dalam {countdown} detik...
					</p>

					{/* Action Buttons */}
					<div className="flex gap-3">
						<button
							onClick={() => router.push('/dashboard')}
							className="flex-1 bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 hover:shadow-lg text-white font-semibold py-3 rounded-full transition-all"
						>
							Ke Dashboard
						</button>
						<button
							onClick={() => router.push('/explore')}
							className="flex-1 bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold py-3 rounded-full transition-all"
						>
							Jelajahi Kelas
						</button>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
}
