"use client";
import { useState } from 'react';
import emailjs from 'emailjs-com';
import DashboardNavbar from '../components/DashboardNavbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';

export default function ContactPage() {
	const [formData, setFormData] = useState({
		username: '',
		email: '',
		message: ''
	});
	const [isLoading, setIsLoading] = useState(false);
	const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setStatusMessage(null);

		try {
			// EmailJS configuration
			const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID';
			const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID';
			const userId = process.env.NEXT_PUBLIC_EMAILJS_USER_ID || 'YOUR_USER_ID';

			// Template parameters
			const templateParams = {
				from_name: formData.username,
				from_email: formData.email,
				message: formData.message,
				to_email: 'lentera.karir.internship15@gmail.com'
			};

			// Send email via EmailJS
			await emailjs.send(serviceId, templateId, templateParams, userId);

			// Success
			setStatusMessage({ 
				type: 'success', 
				text: 'Pesan Anda berhasil dikirim' 
			});
			
			// Reset form
			setFormData({
				username: '',
				email: '',
				message: ''
			});
		} catch (error) {
			console.error('EmailJS Error:', error);
			setStatusMessage({ 
				type: 'error', 
				text: 'Gagal mengirim pesan. Silakan coba lagi.' 
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	};

	return (
		<div className="min-h-screen flex flex-col bg-gray-50">
			{/* Toast Notification */}
			{statusMessage && (
				<Toast
					type={statusMessage.type}
					message={
						statusMessage.type === 'success'
							? 'Pesan Anda berhasil dikirim'
							: 'Pesan gagal dikirim'
					}
					subMessage={
						statusMessage.type === 'success'
							? 'Terima kasih — tim admin akan membaca dan menindaklanjuti pesan Anda.'
							: 'Silakan coba lagi nanti atau hubungi tim admin jika masalah berlanjut.'
					}
					onClose={() => setStatusMessage(null)}
				/>
			)}

			<DashboardNavbar />

			{/* Main Content */}
			<main className="flex-grow py-12 md:py-16 lg:py-20">
				<div className="max-w-[600px] mx-auto px-6 sm:px-8 md:px-12">
					{/* Header */}
					<div className="mb-8 md:mb-10 text-center">
						<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
							Get In Touch
						</h1>
						<p className="text-gray-600 text-base md:text-lg">
							We are here for you! How can we help?
						</p>
					</div>

					{/* Contact Form */}
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Username Field */}
						<div>
							<label htmlFor="username" className="block text-sm font-medium text-gray-900 mb-2">
								Username
							</label>
							<input
								type="text"
								id="username"
								name="username"
								value={formData.username}
								onChange={handleChange}
								placeholder="Input your username"
								className="w-full px-6 py-3.5 border-2 border-[#661FFF] rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#661FFF] focus:ring-2 focus:ring-[#661FFF]/20 transition-all text-sm md:text-base"
								required
							/>
						</div>

						{/* Email Field */}
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
								Email Address
							</label>
							<input
								type="email"
								id="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								placeholder="Input your email"
								className="w-full px-6 py-3.5 border-2 border-[#661FFF] rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#661FFF] focus:ring-2 focus:ring-[#661FFF]/20 transition-all text-sm md:text-base"
								required
							/>
						</div>

						{/* Message Field */}
						<div>
							<textarea
								id="message"
								name="message"
								value={formData.message}
								onChange={handleChange}
								placeholder="Go ahead, we are listening..."
								rows={4}
								className="w-full px-6 py-4 border-2 border-[#661FFF] rounded-3xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#661FFF] focus:ring-2 focus:ring-[#661FFF]/20 transition-all text-sm md:text-base resize-none"
								required
							/>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={isLoading}
							className={`w-full py-4 rounded-full font-semibold text-base md:text-lg transition-colors shadow-lg ${
								isLoading
									? 'bg-gray-400 cursor-not-allowed'
									: 'bg-[#661FFF] hover:bg-[#5518CC] shadow-[#661FFF]/30'
							} text-white flex items-center justify-center gap-2`}
						>
							{isLoading ? (
								<>
									<svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Mengirim...
								</>
							) : (
								'Submit'
							)}
						</button>
					</form>
				</div>
			</main>

			<Footer />
		</div>
	);
}
