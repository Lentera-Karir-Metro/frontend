"use client";
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardNavbar from '@/app/components/DashboardNavbar';
import Footer from '@/app/components/Footer';

function PaymentSuccessContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [countdown, setCountdown] = useState(5);

	// Auto-check payment status untuk sync dengan database
	useEffect(() => {
		const orderId = searchParams.get('order_id');
		if (orderId) {
			const checkStatus = async () => {
				try {
					console.log('[SuccessPage] Auto-checking payment status for:', orderId);
					const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
					const token = localStorage.getItem('token');
					
					if (token) {
						const response = await fetch(`${baseUrl}/payments/status/${orderId}`, {
							headers: {
								'Authorization': `Bearer ${token}`
							}
						});
						const data = await response.json();
						console.log('[SuccessPage] Status check result:', data);
						
						if (data.success) {
							console.log('[SuccessPage] ✅ Payment confirmed in database');
						}
					} else {
						console.warn('[SuccessPage] No token found, skipping auto-sync');
					}
				} catch (err) {
					console.error('[SuccessPage] Error checking payment status:', err);
				}
			};
			checkStatus();
		}
	}, [searchParams]);

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
					{/* Success Icon */}
					<div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
						<svg 
							className="w-12 h-12 text-green-600" 
							fill="none" 
							stroke="currentColor" 
							viewBox="0 0 24 24"
						>
							<path 
								strokeLinecap="round" 
								strokeLinejoin="round" 
								strokeWidth={2} 
								d="M5 13l4 4L19 7" 
							/>
						</svg>
					</div>

					{/* Success Message */}
					<h1 className="text-3xl font-bold text-gray-900 mb-3">
						Pembayaran Berhasil!
					</h1>
					<p className="text-gray-600 mb-6">
						Terima kasih! Pembayaran Anda telah berhasil diproses.
					</p>

					{/* Order Details */}
					{orderId && (
						<div className="bg-gray-50 rounded-lg p-4 mb-6">
							<p className="text-sm text-gray-600 mb-1">Order ID</p>
							<p className="font-mono font-semibold text-gray-900">{orderId}</p>
							{transactionStatus && (
								<>
									<p className="text-sm text-gray-600 mb-1 mt-3">Status</p>
									<p className="font-semibold text-green-600 capitalize">{transactionStatus}</p>
								</>
							)}
						</div>
					)}

					{/* Info */}
					<div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
						<p className="text-sm text-gray-700">
							Anda sekarang dapat mengakses kursus yang telah Anda beli di dashboard.
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

export default function PaymentSuccessPage() {
	return (
		<Suspense fallback={
			<div className="min-h-screen flex flex-col bg-gray-50">
				<DashboardNavbar />
				<main className="flex-grow flex items-center justify-center">
					<div className="text-center">
						<div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
						<p className="text-gray-600">Loading...</p>
					</div>
				</main>
				<Footer />
			</div>
		}>
			<PaymentSuccessContent />
		</Suspense>
	);
}
