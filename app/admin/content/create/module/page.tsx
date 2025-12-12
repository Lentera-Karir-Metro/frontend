"use client";
import AdminSidebar from '@/app/components/AdminSidebar';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface QuizQuestion {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
    questionType: string;
}

export default function TambahModul() {
    const router = useRouter();
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [ebookFile, setEbookFile] = useState<File | null>(null);
    const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [questionType, setQuestionType] = useState('Multiple Choice');
    const [options, setOptions] = useState(['', '', '', '']);
    const [correctAnswer, setCorrectAnswer] = useState('');

    // Handle video upload
    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setVideoFile(e.target.files[0]);
            // Clear ebook if video is uploaded
            setEbookFile(null);
        }
    };

    // Handle ebook upload
    const handleEbookUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setEbookFile(e.target.files[0]);
            // Clear video if ebook is uploaded
            setVideoFile(null);
        }
    };

    // Add quiz question
    const handleAddQuestion = () => {
        if (currentQuestion.trim()) {
            const newQuestion: QuizQuestion = {
                id: quizQuestions.length + 1,
                question: currentQuestion,
                options: options,
                correctAnswer: correctAnswer,
                questionType: questionType,
            };
            setQuizQuestions([...quizQuestions, newQuestion]);
            // Reset form
            setCurrentQuestion('');
            setOptions(['', '', '', '']);
            setCorrectAnswer('');
        }
    };

    const handleSaveModule = () => {
        console.log('Save module:', { videoFile, ebookFile, quizQuestions });
        alert('Modul berhasil disimpan!');
        router.back();
    };

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

                {/* Form Content */}
                <main className="p-8 max-w-5xl mx-auto">
                    {/* Back Button */}
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-[#6B21FF] text-[#6B21FF] rounded-full font-semibold mb-6 hover:bg-[#6B21FF] hover:text-white hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-lg group"
                    >
                        <svg
                            className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>Kembali</span>
                    </button>

                    {/* Title */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tambah Modul</h1>
                        <p className="text-gray-500 text-sm">Isi selalu satu jenis modul yang diinginkan</p>
                    </div>

                    <div className="space-y-8">
                        {/* Video Upload Section */}
                        <div>
                            <h2 className="text-lg font-semibold text-[#6B21FF] mb-4">Video</h2>
                            <div className={`border-2 border-dashed rounded-xl p-12 text-center bg-white transition ${ebookFile ? 'border-gray-300 opacity-50 cursor-not-allowed' : 'border-[#6B21FF]'
                                }`}>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Video Here</h3>
                                <p className="text-sm text-gray-500 mb-6">Format: MP4, AVI, MOV</p>
                                <label htmlFor="video-upload" className={ebookFile ? 'cursor-not-allowed' : ''}>
                                    <div className={`inline-block bg-[#6B21FF] text-white px-8 py-3 rounded-lg font-semibold transition ${ebookFile ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#5518CC] cursor-pointer'
                                        }`}>
                                        Upload
                                    </div>
                                    <input
                                        id="video-upload"
                                        type="file"
                                        accept="video/mp4,video/avi,video/quicktime"
                                        onChange={handleVideoUpload}
                                        disabled={!!ebookFile}
                                        className="hidden"
                                    />
                                </label>
                                {videoFile && (
                                    <p className="mt-4 text-sm text-green-600">
                                        File uploaded: {videoFile.name}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Ebook Upload Section */}
                        <div>
                            <h2 className="text-lg font-semibold text-[#6B21FF] mb-4">Ebook</h2>
                            <div className={`border-2 border-dashed rounded-xl p-12 text-center bg-white transition ${videoFile ? 'border-gray-300 opacity-50 cursor-not-allowed' : 'border-[#6B21FF]'
                                }`}>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Ebook Here</h3>
                                <p className="text-sm text-gray-500 mb-6">Format: PDF, Max file size: 50MB</p>
                                <label htmlFor="ebook-upload" className={videoFile ? 'cursor-not-allowed' : ''}>
                                    <div className={`inline-block bg-[#6B21FF] text-white px-8 py-3 rounded-lg font-semibold transition ${videoFile ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#5518CC] cursor-pointer'
                                        }`}>
                                        Upload
                                    </div>
                                    <input
                                        id="ebook-upload"
                                        type="file"
                                        accept="application/pdf"
                                        onChange={handleEbookUpload}
                                        disabled={!!videoFile}
                                        className="hidden"
                                    />
                                </label>
                                {ebookFile && (
                                    <p className="mt-4 text-sm text-green-600">
                                        File uploaded: {ebookFile.name}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Quiz Interaktif Section */}
                        <div>
                            <h2 className="text-lg font-semibold text-[#6B21FF] mb-4">Quiz Interaktif</h2>

                            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
                                {/* Pertanyaan */}
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <label className="block text-sm font-semibold text-gray-900">Pertanyaan</label>
                                        <button
                                            onClick={handleAddQuestion}
                                            className="bg-[#6B21FF] text-white p-2 rounded-lg hover:bg-[#5518CC] transition"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                    </div>
                                    <textarea
                                        placeholder="Ketik soal quiz disini..."
                                        value={currentQuestion}
                                        onChange={(e) => setCurrentQuestion(e.target.value)}
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-[#6B21FF] focus:outline-none focus:ring-2 focus:ring-[#6B21FF] focus:ring-opacity-20 text-gray-700 placeholder-gray-400 resize-none"
                                    />
                                </div>

                                {/* Tipe Pertanyaan */}
                                <div>
                                    <select
                                        value={questionType}
                                        onChange={(e) => setQuestionType(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#6B21FF] text-gray-700 bg-white cursor-pointer"
                                    >
                                        <option value="Multiple Choice">Tipe Pertanyaan</option>
                                        <option value="Multiple Choice">Multiple Choice</option>
                                        <option value="True/False">True/False</option>
                                        <option value="Essay">Essay</option>
                                    </select>
                                </div>

                                {/* Options */}
                                <div className="space-y-3">
                                    {options.map((option, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="correct-answer"
                                                className="w-5 h-5 text-[#6B21FF]"
                                                checked={correctAnswer === `Opsi ${index + 1}`}
                                                onChange={() => setCorrectAnswer(`Opsi ${index + 1}`)}
                                            />
                                            <input
                                                type="text"
                                                placeholder={`Opsi ${index + 1}`}
                                                value={option}
                                                onChange={(e) => {
                                                    const newOptions = [...options];
                                                    newOptions[index] = e.target.value;
                                                    setOptions(newOptions);
                                                }}
                                                className="flex-1 px-4 py-2 border-b border-gray-300 focus:outline-none focus:border-[#6B21FF] text-gray-700 placeholder-gray-400"
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Jawaban yang Benar */}
                                <div>
                                    <label className="block text-sm font-semibold text-green-600 mb-2">
                                        Jawaban yang Benar
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ketik jawaban"
                                        value={correctAnswer}
                                        onChange={(e) => setCorrectAnswer(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-20 text-gray-700 placeholder-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Display Added Questions */}
                            {quizQuestions.length > 0 && (
                                <div className="mt-6 space-y-3">
                                    <h3 className="text-sm font-semibold text-gray-900">Pertanyaan yang Ditambahkan:</h3>
                                    {quizQuestions.map((q, index) => (
                                        <div key={q.id} className="bg-gray-100 rounded-lg p-4">
                                            <p className="text-sm font-semibold text-gray-900">{index + 1}. {q.question}</p>
                                            <p className="text-xs text-gray-600 mt-1">Jawaban: {q.correctAnswer}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6">
                            <button
                                onClick={handleSaveModule}
                                className="w-full bg-[#6B21FF] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#5518CC] transition"
                            >
                                Simpan Modul
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
