"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import DashboardNavbar from '@/app/components/DashboardNavbar';
import Footer from '@/app/components/Footer';

type Question = {
	id: number;
	question_text: string;
	options: {
		id: number;
		option_text: string;
		is_correct?: boolean;
	}[];
};

type Quiz = {
	id: string;
	title: string;
	description?: string;
	pass_threshold: number;
	questions: Question[];
};

export default function QuizPage() {
	const params = useParams();
	const router = useRouter();
	const courseId = params?.id as string;
	const quizId = params?.quizId as string;

	const [quiz, setQuiz] = useState<Quiz | null>(null);
	const [currentAttemptId, setCurrentAttemptId] = useState<string | null>(null);
	const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});
	const [isLoading, setIsLoading] = useState(true);
	const [showSubmitModal, setShowSubmitModal] = useState(false);
	const [showResultModal, setShowResultModal] = useState(false);
	const [quizResult, setQuizResult] = useState<any>(null);
	const [quizBestScore, setQuizBestScore] = useState<number | null>(null);
	const [quizHasPassed, setQuizHasPassed] = useState<boolean>(false);

	useEffect(() => {
		if (quizId) {
			loadQuiz();
		}
	}, [quizId]);

	const loadQuiz = async () => {
		try {
			setIsLoading(true);
			const token = localStorage.getItem('token');
			const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

			const response = await fetch(`${baseUrl}/learn/quiz/${quizId}/start`, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || 'Failed to load quiz');
			}

			const data = await response.json();
			setQuiz(data.quiz);
			setCurrentAttemptId(data.attempt_id);
			setQuizAnswers(data.partial_answers || {});
			setQuizBestScore(data.best_score);
			setQuizHasPassed(data.has_passed || false);
		} catch (err: any) {
			console.error('[Quiz] Error loading quiz:', err);
			alert(err.message || 'Gagal memuat quiz. Silakan coba lagi.');
			router.back();
		} finally {
			setIsLoading(false);
		}
	};

	const savePartialAnswer = async (questionId: number, optionId: number) => {
		try {
			const token = localStorage.getItem('token');
			const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

			await fetch(`${baseUrl}/learn/attempts/${currentAttemptId}/answer`, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					question_id: questionId,
					selected_option_id: optionId
				})
			});
		} catch (err) {
			console.error('[Quiz] Error saving partial answer:', err);
		}
	};

	const handleSubmit = async () => {
		try {
			const token = localStorage.getItem('token');
			const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

			const response = await fetch(`${baseUrl}/learn/attempts/${currentAttemptId}/submit`, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || 'Failed to submit quiz');
			}

			setQuizResult(result);
			setShowSubmitModal(false);
			setShowResultModal(true);
		} catch (err: any) {
			console.error('[Quiz] Submit error:', err);
			alert(err.message || 'Gagal mengirim quiz. Silakan coba lagi.');
			setShowSubmitModal(false);
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen flex flex-col bg-gray-50">
				<DashboardNavbar />
				<div className="flex-1 flex items-center justify-center">
					<div className="text-center">
						<div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
							<svg className="w-8 h-8 text-purple-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
							</svg>
						</div>
						<p className="text-gray-500 font-medium">Memuat quiz...</p>
					</div>
				</div>
				<Footer />
			</div>
		);
	}

	if (!quiz) return null;

	return (
		<motion.div 
			className="min-h-screen flex flex-col bg-gray-50"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ 
				duration: 0.3,
				ease: 'easeInOut'
			}}
		>
			<DashboardNavbar />

			{/* Header Section */}
			<div className="relative bg-gradient-to-br from-[#661FFF] via-[#8B5CF6] to-[#A78BFA] text-white py-8 md:py-12">
				<div className="max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
					<button
						onClick={() => router.push(`/course/${courseId}/learn`)}
						className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors group"
					>
						<svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
						</svg>
						<span className="text-sm font-medium">Kembali ke Course</span>
					</button>

					<div className="flex items-center gap-3 mb-4">
						<div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
							<svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
								<path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
								<path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
							</svg>
							<span className="text-sm font-medium text-white">Kuis Interaktif</span>
						</div>
						{quizHasPassed && (
							<div className="inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-sm text-white border border-green-300/30 px-4 py-2 rounded-full">
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
								</svg>
								<span className="font-semibold text-sm">Lulus</span>
							</div>
						)}
					</div>

					<h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
						{quiz.title}
					</h1>
					<p className="text-white/90 text-base">
						Jawab semua pertanyaan dengan teliti untuk mendapatkan hasil terbaik
					</p>
				</div>
			</div>

			{/* Main Content */}
			<div className="flex-1 py-8 md:py-12">
				<div className="max-w-4xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
					{/* Best Score Card */}
					{quizBestScore !== null && (
						<div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 mb-8 shadow-sm">
							<div className="flex items-center gap-4">
								<div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
									<svg className="w-7 h-7 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
										<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
									</svg>
								</div>
								<div>
									<p className="text-sm text-blue-600 font-medium mb-1">Nilai Terbaik Anda</p>
									<p className="text-3xl font-bold text-blue-700">{Math.round(quizBestScore * 100)}%</p>
								</div>
							</div>
						</div>
					)}

					{/* Questions */}
					<div className="space-y-6">
						{quiz.questions?.map((question, qIndex) => (
							<div key={question.id} className="group">
								{/* Question Card */}
								<div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
									{/* Question Number Badge & Text */}
									<div className="relative bg-gradient-to-br from-gray-50 to-white px-8 py-6">
										{/* Decorative elements */}
										<div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-3xl opacity-50 -z-0"></div>
										<div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-50 rounded-full blur-2xl opacity-50 -z-0"></div>
										
										<div className="relative z-10 flex items-start gap-4">
											{/* Number Badge */}
											<div className="flex-shrink-0">
												<div className="relative">
													<div className="w-12 h-12 bg-gradient-to-br from-[#661FFF] to-[#8B5CF6] rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 transform rotate-3 group-hover:rotate-6 transition-transform duration-300">
														<span className="text-white font-bold text-lg">{qIndex + 1}</span>
													</div>
												</div>
											</div>
											
											{/* Question Text */}
											<div className="flex-1 pt-2">
												<p className="text-gray-800 font-semibold text-lg leading-relaxed">
													{question.question_text}
												</p>
											</div>
										</div>
									</div>

									{/* Options */}
									<div className="px-8 py-6 bg-white space-y-3">
										{question.options?.map((option, optionIndex) => {
											const isSelected = quizAnswers[question.id] === option.id;
											const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
											return (
												<button
													key={option.id}
													onClick={() => {
														setQuizAnswers({ ...quizAnswers, [question.id]: option.id });
														savePartialAnswer(question.id, option.id);
													}}
													className={`group/option w-full text-left rounded-xl transition-all duration-300 transform ${
														isSelected 
															? 'bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 border-2 border-[#8B5CF6] shadow-lg shadow-purple-200/50 scale-[1.02]' 
															: 'bg-gray-50 border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50/30 hover:shadow-md hover:scale-[1.01]'
													}`}
												>
													<div className="flex items-center gap-4 px-5 py-4">
														{/* Letter Badge */}
														<div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm transition-all duration-300 ${
															isSelected 
																? 'bg-gradient-to-br from-[#661FFF] to-[#8B5CF6] text-white shadow-md' 
																: 'bg-white text-gray-600 border-2 border-gray-300 group-hover/option:border-purple-400 group-hover/option:text-purple-600'
														}`}>
															{letters[optionIndex]}
														</div>
														
														{/* Option Text */}
														<span className={`flex-1 text-base leading-relaxed transition-colors duration-300 ${
															isSelected ? 'text-gray-900 font-semibold' : 'text-gray-700 font-medium group-hover/option:text-gray-900'
														}`}>
															{option.option_text}
														</span>
														
														{/* Check Icon */}
														{isSelected && (
															<div className="flex-shrink-0">
																<div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-sm animate-scale-in">
																	<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
																	</svg>
																</div>
															</div>
														)}
													</div>
												</button>
											);
										})}
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Submit Button */}
					<div className="mt-12 flex justify-center">
						<button
							onClick={() => setShowSubmitModal(true)}
							disabled={!quiz || !currentAttemptId}
							className="group bg-gradient-to-r from-[#661FFF] to-[#7C3AED] hover:from-[#5518dd] hover:to-[#6D28D9] text-white px-24 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
						>
							<span className="flex items-center gap-2">
								Submit Quiz
								<svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
								</svg>
							</span>
						</button>
					</div>
				</div>
			</div>

			<Footer />

			{/* Submit Modal */}
			{showSubmitModal && (
				<div className="fixed inset-0 backdrop-blur-sm bg-gray-900/60 flex items-center justify-center z-50 animate-fadeIn">
					<div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative shadow-2xl animate-scale-up">
						<div className="flex justify-center mb-6">
							<div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
								<svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
						</div>

						<h3 className="text-2xl font-bold text-gray-900 text-center mb-3">Selesaikan?</h3>
						<p className="text-gray-600 text-center mb-8">
							{Object.keys(quizAnswers).length < (quiz?.questions?.length || 0) ? (
								<>
									Anda belum menjawab semua pertanyaan. <br />
									Jawab: {Object.keys(quizAnswers).length} dari {quiz?.questions?.length || 0} soal. <br />
									Apakah Anda yakin ingin submit?
								</>
							) : (
								'Anda sudah menjawab semua pertanyaan. Yakin ingin submit?'
							)}
						</p>

						<div className="flex gap-4">
							<button
								onClick={() => setShowSubmitModal(false)}
								className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-full font-semibold transition-colors"
							>
								Batal
							</button>
							<button
								onClick={handleSubmit}
								className="flex-1 bg-[#661FFF] hover:bg-[#5518dd] text-white py-3 rounded-full font-semibold transition-colors"
							>
								Submit
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Result Modal */}
			{showResultModal && quizResult && (
				<div className="fixed inset-0 backdrop-blur-sm bg-gray-900/60 flex items-center justify-center z-50 animate-fadeIn">
					<div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-up">
						<div className="flex justify-center mb-6">
							<div className={`w-24 h-24 ${quizResult.is_passed ? 'bg-green-100' : 'bg-red-100'} rounded-full flex items-center justify-center`}>
								{quizResult.is_passed ? (
									<svg className="w-14 h-14 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
									</svg>
								) : (
									<svg className="w-14 h-14 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
									</svg>
								)}
							</div>
						</div>

						<h3 className="text-3xl font-bold text-gray-900 text-center mb-3">
							{quizResult.is_passed ? 'Selamat! Kamu Lulus' : 'Belum Berhasil'}
						</h3>
						<p className="text-center text-gray-600 mb-6">
							Score kamu <span className={`font-bold text-xl ${quizResult.is_passed ? 'text-green-500' : 'text-red-500'}`}>
								{Math.round(quizResult.score * 100)}%
							</span> dari {quizResult.correct_count}/{quizResult.total_questions} jawaban benar
							<br />
							<span className="text-sm mt-2 inline-block">Passing grade: {Math.round(quizResult.pass_threshold * 100)}%</span>
						</p>

						{quizResult.best_score !== undefined && quizResult.best_score !== quizResult.score && (
							<div className="text-center mb-6">
								<p className="text-sm text-gray-600">
									{quizResult.is_new_best ? (
										<span className="text-green-600 font-semibold">
											🎊 Ini nilai terbaik kamu! (sebelumnya: {Math.round((quizResult.best_score || 0) * 100)}%)
										</span>
									) : (
										<span>
											Nilai terbaik kamu: <span className="font-semibold text-blue-600">{Math.round((quizResult.best_score || 0) * 100)}%</span>
										</span>
									)}
								</p>
							</div>
						)}

						<div className="bg-gray-50 rounded-xl p-6 mb-8">
							<p className="text-center text-gray-700">
								{quizResult.is_passed ? (
									<>
										🎉 Selamat! Kamu berhasil menyelesaikan quiz ini dengan baik.
										<br />
										Modul quiz telah ditandai sebagai selesai.
									</>
								) : (
									<>
										Jangan menyerah! Pelajari lagi materinya dan coba kembali.
										<br />
										Kamu bisa mengulang quiz ini kapan saja.
									</>
								)}
							</p>
						</div>

						<div className="flex gap-4">
							<button
								onClick={() => router.push(`/course/${courseId}/learn`)}
								className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-full font-semibold transition-colors"
							>
								Kembali ke Course
							</button>
							{!quizResult.is_passed && (
								<button
									onClick={() => {
										setShowResultModal(false);
										setQuizAnswers({});
										loadQuiz();
									}}
									className="flex-1 bg-[#661FFF] hover:bg-[#5518dd] text-white py-3 rounded-full font-semibold transition-colors"
								>
									Coba Lagi
								</button>
							)}
						</div>
					</div>
				</div>
			)}
		</motion.div>
	);
}
