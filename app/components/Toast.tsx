"use client";
import { useEffect } from 'react';

type ToastProps = {
	type: 'success' | 'error';
	message: string;
	subMessage?: string;
	onClose: () => void;
	duration?: number;
};

export default function Toast({ type, message, subMessage, onClose, duration = 5000 }: ToastProps) {
	useEffect(() => {
		const timer = setTimeout(() => {
			onClose();
		}, duration);

		return () => clearTimeout(timer);
	}, [duration, onClose]);

	return (
		<div className="fixed top-20 md:top-24 right-2 md:right-6 z-50 animate-slide-right">
			<div
				className={`w-auto max-w-[420px] rounded-md shadow-md p-2 ${
					type === 'success'
						? 'bg-gradient-to-r from-teal-700 via-teal-800 to-indigo-900'
						: 'bg-gradient-to-r from-rose-900 via-purple-900 to-indigo-900'
				}`}
			>
				<div className="flex items-center gap-2">
					{/* Icon */}
					<div
						className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
							type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'
						}`}
					>
						{type === 'success' ? (
							<svg
								className="w-4 h-4 text-white"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								strokeWidth={3}
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M5 13l4 4L19 7"
								/>
							</svg>
						) : (
							<svg
								className="w-4 h-4 text-white"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								strokeWidth={3}
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						)}
					</div>

					{/* Content */}
					<div className="flex-1">
						<h3 className={`font-bold text-sm mb-1 ${
							type === 'success' ? 'text-green-400' : 'text-red-300'
						}`}>
							{message}
						</h3>
						{subMessage && (
							<p className="text-gray-200 text-[12px] leading-normal">
								{subMessage}
							</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}