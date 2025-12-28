"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Script from 'next/script';
import DashboardNavbar from '@/app/components/DashboardNavbar';
import Footer from '@/app/components/Footer';

type Course = {
	id: string;
	title: string;
	description?: string;
	price: number;
	thumbnail_url?: string;
	discount_amount?: number;
	rating: number;
	review_count: number;
	category: string;
	level?: string;
	mentor_name?: string;
	mentor_title?: string;
	mentor_photo_profile?: string;
}

declare global {
	interface Window {
		snap: any;
	}
}

export default function CheckoutPage() {
	const params = useParams();
	const router = useRouter();
	const courseId = params?.id as string;

	const [course, setCourse] = useState<Course | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [agreeToTerms, setAgreeToTerms] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [snapLoaded, setSnapLoaded] = useState(false);
	const [isPaymentPopupOpen, setIsPaymentPopupOpen] = useState(false);

	useEffect(() => {
		const fetchCourse = async () => {
			try {
				setIsLoading(true);
				const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
				const response = await fetch(`${baseUrl}/catalog/courses/${courseId}`);

				if (!response.ok) {
					throw new Error(`Failed to fetch: ${response.status}`);
				}

				const data = await response.json();
				setCourse(data);
			} catch (err: any) {
				setError(err.message || 'Failed to load course details');
			} finally {
				setIsLoading(false);
			}
		};

		if (courseId) {
			fetchCourse();
		}
	}, [courseId]);

	const calculatePrices = () => {
		if (!course) return { originalPrice: 0, discount: 0, finalPrice: 0 };

		const originalPrice = Number(course.price);
		const discount = Number(course.discount_amount || 0);
		const finalPrice = originalPrice - discount;

		return { originalPrice, discount, finalPrice };
	};

	const handleCheckout = async () => {
		if (!agreeToTerms) {
			alert('Silakan setuju dengan Terms and Conditions terlebih dahulu');
			return;
		}

		if (!snapLoaded) {
			alert('Payment system belum siap. Silakan tunggu sebentar.');
			return;
		}

		setIsProcessing(true);
		setError(null);

		try {
			const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
			const token = localStorage.getItem('token'); // Ambil token dari localStorage

			if (!token) {
				router.push('/sign-in');
				return;
			}

			const response = await fetch(`${baseUrl}/payments/checkout`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify({
					course_id: courseId
				})
			});

			const data = await response.json();

			if (!response.ok) {
				// Jika token tidak valid, redirect ke login
				if (response.status === 401) {
					localStorage.clear();
					alert('Sesi Anda telah berakhir. Silakan login kembali.');
					router.push('/sign-in');
					return;
				}
				throw new Error(data.message || data.error || 'Checkout failed');
			}

			// Helper function untuk check payment status
			const checkPaymentStatus = async (orderId: string) => {
				try {
					console.log('[AutoSync] Checking payment status for:', orderId);
					const checkResponse = await fetch(`${baseUrl}/payments/status/${orderId}`, {
						headers: {
							'Authorization': `Bearer ${token}`
						}
					});
					const statusData = await checkResponse.json();
					console.log('[AutoSync] Payment status response:', statusData);

					if (statusData.success && statusData.status === 'success') {
						console.log('[AutoSync] ✅ Payment confirmed and synced to database!');
					}

					return statusData;
				} catch (err) {
					console.error('[AutoSync] Error checking payment status:', err);
					return null;
				}
			};

			// Gunakan Snap.js untuk embed payment form
			if (data.transaction && data.transaction.token) {
				setIsPaymentPopupOpen(true); // Aktifkan blur overlay

				window.snap.pay(data.transaction.token, {
					onSuccess: async function (result: any) {
						console.log('[Midtrans] Payment success:', result);
						setIsPaymentPopupOpen(false);

						// Auto-check payment status untuk sync dengan database
						if (result.order_id) {
							console.log('[AutoSync] Starting auto-sync for order:', result.order_id);
							const syncResult = await checkPaymentStatus(result.order_id);
							if (syncResult?.success) {
								console.log('[AutoSync] ✅ Sync successful!');
							} else {
								console.warn('[AutoSync] ⚠️ Sync failed or incomplete');
							}
						}

						router.push(`/payment/success?order_id=${result.order_id}&transaction_status=${result.transaction_status}`);
					},
					onPending: async function (result: any) {
						console.log('[Midtrans] Payment pending:', result);
						setIsPaymentPopupOpen(false);

						// Auto-check payment status untuk sync dengan database
						if (result.order_id) {
							console.log('[AutoSync] Checking pending payment:', result.order_id);
							await checkPaymentStatus(result.order_id);
						}

						router.push(`/payment/pending?order_id=${result.order_id}&transaction_status=${result.transaction_status}`);
					},
					onError: function (result: any) {
						console.log('Payment error:', result);
						setIsPaymentPopupOpen(false);
						setError('Pembayaran gagal. Silakan coba lagi.');
						setIsProcessing(false);
					},
					onClose: async function () {
						console.log('[Midtrans] Payment popup closed by user');
						setIsPaymentPopupOpen(false);
						setIsProcessing(false);

						// Sync semua pending payments saat popup ditutup
						try {
							console.log('[AutoSync] Syncing all pending payments...');
							const syncResponse = await fetch(`${baseUrl}/payments/sync`, {
								method: 'POST',
								headers: {
									'Authorization': `Bearer ${token}`
								}
							});
							const syncData = await syncResponse.json();
							console.log('[AutoSync] Sync result:', syncData);

							if (syncData.synced > 0) {
								console.log(`[AutoSync] ✅ Synced ${syncData.synced} payment(s)`);
							}
						} catch (err) {
							console.error('[AutoSync] Error syncing payments:', err);
						}
					}
				});
			} else {
				throw new Error('Payment token not received');
			}

		} catch (err: any) {
			console.error('Checkout error:', err);
			setError(err.message || 'Failed to process checkout');
			setIsProcessing(false);
		}
	};

	const { originalPrice, discount, finalPrice } = calculatePrices();

	if (isLoading) {
		return (
			<div className="min-h-screen flex flex-col bg-gray-50">
				<DashboardNavbar />
				<main className="flex-grow flex items-center justify-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#661FFF]"></div>
				</main>
				<Footer />
			</div>
		);
	}

	if (error && !course) {
		return (
			<div className="min-h-screen flex flex-col bg-gray-50">
				<DashboardNavbar />
				<main className="flex-grow flex items-center justify-center">
					<div className="text-center">
						<p className="text-red-500 mb-4">{error}</p>
						<button
							onClick={() => router.back()}
							className="text-purple-600 hover:text-purple-700 font-semibold"
						>
							Kembali
						</button>
					</div>
				</main>
				<Footer />
			</div>
		);
	}

	if (!course) return null;

	return (
		<>
			{/* Load Midtrans Snap.js */}
			<Script
				src={process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true'
					? 'https://app.midtrans.com/snap/snap.js'
					: 'https://app.sandbox.midtrans.com/snap/snap.js'}
				data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
				onLoad={() => setSnapLoaded(true)}
				strategy="afterInteractive"
			/>

			<div className={`min-h-screen flex flex-col bg-gray-50 transition-all duration-300 ${isPaymentPopupOpen ? 'blur-sm opacity-50' : ''}`}>
				<DashboardNavbar />

				<main className="flex-grow py-8 md:py-12">
					<div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
						{/* Page Title */}
						<div className="mb-8">
							<h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
								Checkout Kelas
							</h1>
							<p className="text-gray-600">
								Bergabung dengan kami di kelas Premium dan dapatkan bahan ajar yang bermutu
							</p>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
							{/* Left Section - Course Card */}
							<div className="lg:col-span-4">
								<div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
									<div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4 bg-gray-100">
										<Image
											src={course.thumbnail_url || '/images/dashboard.png'}
											alt={course.title}
											fill
											className="object-cover"
										/>
									</div>
									<h2 className="text-lg font-bold text-gray-900 mb-2">
										{course.title}
									</h2>
									{course.description && (
										<p className="text-gray-600 text-sm mb-3 line-clamp-2">
											{course.description}
										</p>
									)}
									{course.mentor_name && (
										<div className="flex items-center gap-2 mb-3">
											{course.mentor_photo_profile && (
												<div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
													<Image
														src={course.mentor_photo_profile}
														alt={course.mentor_name}
														width={32}
														height={32}
														className="object-cover w-full h-full"
													/>
												</div>
											)}
											<div>
												<p className="text-gray-800 text-sm font-medium">{course.mentor_name}</p>
												{course.mentor_title && (
													<p className="text-gray-500 text-xs">{course.mentor_title}</p>
												)}
											</div>
										</div>
									)}
									<p className="text-purple-600 font-bold text-xl">
										Rp{originalPrice.toLocaleString('id-ID')}
									</p>
								</div>
							</div>

							{/* Right Section - Course Details & Payment */}
							<div className="lg:col-span-8">
								<div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
									{/* Tentang Kursus Ini */}
									<div className="mb-8">
										<h3 className="text-xl font-bold text-gray-900 mb-4">Tentang Kursus Ini</h3>
										<p className="text-gray-700 mb-6 leading-relaxed">
											{course.description}
										</p>

										<div className="space-y-3">
											<div className="flex items-center gap-3">
												<div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
													<svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
														<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
													</svg>
												</div>
												<span className="text-gray-700">Forum diskusi belajar</span>
											</div>
											<div className="flex items-center gap-3">
												<div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
													<svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
														<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
													</svg>
												</div>
												<span className="text-gray-700">Sertifikat penyelesaian resmi</span>
											</div>
											<div className="flex items-center gap-3">
												<div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
													<svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
														<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
													</svg>
												</div>
												<span className="text-gray-700">Well-prepared learning assets</span>
											</div>
										</div>
									</div>

									{/* Payment Details */}
									<div className="border-t border-gray-200 pt-8">
										<h3 className="text-xl font-bold text-gray-900 mb-6">Payment Details</h3>

										<div className="space-y-4 mb-6">
											<div className="flex justify-between text-gray-700">
												<span>Harga Kelas</span>
												<span className="font-semibold">Rp{originalPrice.toLocaleString('id-ID')}</span>
											</div>

											<div className="flex justify-between text-gray-700">
												<span>Diskon</span>
												<span className="font-semibold">Rp{discount.toLocaleString('id-ID')}</span>
											</div>

											<div className="border-t border-gray-200 pt-4">
												<div className="flex justify-between text-gray-900">
													<span className="font-bold">Total Transfer</span>
													<span className="font-bold text-xl">Rp{finalPrice.toLocaleString('id-ID')}</span>
												</div>
											</div>
										</div>

										{error && (
											<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
												<p className="text-sm text-red-600">{error}</p>
											</div>
										)}

										{!snapLoaded && (
											<div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
												<p className="text-sm text-blue-600">Memuat sistem pembayaran...</p>
											</div>
										)}

										<div className="mb-6">
											<label className="flex items-start gap-3 cursor-pointer">
												<input
													type="checkbox"
													checked={agreeToTerms}
													onChange={(e) => setAgreeToTerms(e.target.checked)}
													className="w-4 h-4 text-[#5B21D6] border-gray-300 rounded focus:ring-[#5B21D6] mt-1 flex-shrink-0"
												/>
												<span className="text-sm text-gray-700">
													Saya setuju dengan{' '}
													<a href="#" className="text-[#5B21D6] hover:underline font-medium">
														Terms and Conditions
													</a>
												</span>
											</label>
										</div>

										<button
											onClick={handleCheckout}
											disabled={!agreeToTerms || isProcessing || !snapLoaded}
											className={`w-full py-4 rounded-full font-semibold text-white text-base transition-all ${!agreeToTerms || isProcessing || !snapLoaded
												? 'bg-gray-300 cursor-not-allowed'
												: 'bg-[#5B21D6] hover:bg-[#4C1D95] hover:shadow-lg'
												}`}
										>
											{isProcessing ? 'Memproses...' : 'Bayar dan Gabung Kursus'}
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</main>

				<Footer />
			</div>
		</>
	);
}
