"use client";
import { useState } from 'react';
import DashboardNavbar from '../components/DashboardNavbar';
import Footer from '../components/Footer';

export default function ContactPage() {
	const [formData, setFormData] = useState({
		username: '',
		email: '',
		message: ''
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle form submission (bisa disambungkan ke API)
		console.log('Form submitted:', formData);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	};

	return (
		<div className="min-h-screen flex flex-col bg-gray-50">
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
							className="w-full bg-[#661FFF] text-white py-4 rounded-full font-semibold text-base md:text-lg hover:bg-[#5518CC] transition-colors shadow-lg shadow-[#661FFF]/30"
						>
							Submit
						</button>
					</form>
				</div>
			</main>

			<Footer />
		</div>
	);
}
