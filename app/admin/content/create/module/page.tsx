"use client";
import AdminSidebar from '@/app/components/AdminSidebar';
import HeaderAdmin from '@/app/components/HeaderAdmin';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createModules, createQuiz } from '@/lib/moduleService';

interface UploadedVideo {
    id: number;
    file: File;
    progress: number;
    thumbnail?: string;
}

interface QuizQuestion {
    id: number;
    question: string;
    type: string;
    options: string[];
    correctAnswer: string;
}

interface Quiz {
    id: number;
    title: string;
    description: string;
    questions: QuizQuestion[];
}

interface UploadedEbook {
    id: number;
    file: File;
    progress: number;
}

export default function TambahModul() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const courseId = searchParams.get('courseId');
    
    const [moduleTitle, setModuleTitle] = useState('');
    const [activeTab, setActiveTab] = useState<'video' | 'ebook' | 'quiz'>('video');
    const [uploadedVideos, setUploadedVideos] = useState<UploadedVideo[]>([]);
    const [uploadedEbooks, setUploadedEbooks] = useState<UploadedEbook[]>([]);
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    // Auto-hide notification
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    // Show notification helper
    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
    };

    // Handle video upload
    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            
            // Validate file size (50MB limit for Supabase free tier)
            const maxSize = 50 * 1024 * 1024; // 50MB in bytes
            if (file.size > maxSize) {
                showNotification('error', `File ${file.name} terlalu besar! Maksimal ukuran file adalah 50MB. Ukuran file saat ini: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
                return;
            }

            // Create thumbnail from video
            const videoUrl = URL.createObjectURL(file);
            const video = document.createElement('video');
            video.src = videoUrl;
            video.currentTime = 1; // Get frame at 1 second

            video.onloadeddata = () => {
                const canvas = document.createElement('canvas');
                canvas.width = 160;
                canvas.height = 90;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(video, 0, 0, 160, 90);
                    const thumbnail = canvas.toDataURL('image/jpeg');

                    const newVideo: UploadedVideo = {
                        id: Date.now(),
                        file: file,
                        progress: 0, // Start from 0%
                        thumbnail: thumbnail
                    };
                    setUploadedVideos(prev => [...prev, newVideo]);
                }
                URL.revokeObjectURL(videoUrl);
            };
        }
    };

    // Animate progress bars
    useEffect(() => {
        const interval = setInterval(() => {
            setUploadedVideos(prevVideos =>
                prevVideos.map(video => {
                    if (video.progress < 100) {
                        // Increment progress with varying speed
                        const increment = Math.floor(Math.random() * 5) + 2; // 2-6% increment
                        const newProgress = Math.min(video.progress + increment, 100);
                        return { ...video, progress: newProgress };
                    }
                    return video;
                })
            );

            setUploadedEbooks(prevEbooks =>
                prevEbooks.map(ebook => {
                    if (ebook.progress < 100) {
                        const increment = Math.floor(Math.random() * 5) + 2;
                        const newProgress = Math.min(ebook.progress + increment, 100);
                        return { ...ebook, progress: newProgress };
                    }
                    return ebook;
                })
            );
        }, 200); // Update every 200ms

        return () => clearInterval(interval);
    }, [uploadedVideos, uploadedEbooks]);

    const handleRemoveVideo = (id: number) => {
        setUploadedVideos(uploadedVideos.filter(video => video.id !== id));
    };

    const handleEbookUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            
            // Validate file size (50MB limit for Supabase)
            const maxSize = 50 * 1024 * 1024; // 50MB in bytes
            if (file.size > maxSize) {
                showNotification('error', `File ${file.name} terlalu besar! Maksimal ukuran file adalah 50MB. Ukuran file saat ini: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
                return;
            }
            
            const newEbook: UploadedEbook = {
                id: Date.now(),
                file: file,
                progress: 0 // Start from 0%
            };
            setUploadedEbooks(prev => [...prev, newEbook]);
        }
    };

    const handleRemoveEbook = (id: number) => {
        setUploadedEbooks(uploadedEbooks.filter(ebook => ebook.id !== id));
    };

    const formatFileSize = (bytes: number): string => {
        return (bytes / (1024 * 1024)).toFixed(2) + ' mb';
    };

    const handleSaveModule = async () => {
        if (!courseId) {
            showNotification('error', 'Course ID tidak ditemukan!');
            return;
        }

        if (!moduleTitle) {
            showNotification('error', 'Nama modul harus diisi!');
            return;
        }

        // Check if at least one content is added
        const hasVideo = uploadedVideos.length > 0;
        const hasEbook = uploadedEbooks.length > 0;
        const hasQuiz = quizzes.length > 0;

        if (!hasVideo && !hasEbook && !hasQuiz) {
            showNotification('error', 'Tambahkan minimal 1 konten (video, ebook, atau quiz)!');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            let createdCount = 0;

            // Create modules for videos
            if (hasVideo) {
                await createModules(courseId, {
                    title: moduleTitle,
                    files: uploadedVideos.map(v => v.file),
                    moduleType: 'video',
                });
                createdCount += uploadedVideos.length;
            }

            // Create modules for ebooks
            if (hasEbook) {
                await createModules(courseId, {
                    title: moduleTitle,
                    files: uploadedEbooks.map(e => e.file),
                    moduleType: 'ebook',
                });
                createdCount += uploadedEbooks.length;
            }

            // Create modules for quizzes
            if (hasQuiz) {
                // Create each quiz and its module
                for (const quiz of quizzes) {
                    // Validate quiz has questions
                    if (quiz.questions.length === 0) {
                        showNotification('error', `Quiz "${quiz.title}" harus memiliki minimal 1 soal!`);
                        setLoading(false);
                        return;
                    }

                    // Create the quiz
                    const quizResponse = await createQuiz(courseId, {
                        title: quiz.title,
                        description: quiz.description,
                        questions: quiz.questions.map(q => ({
                            question_text: q.question,
                            question_type: q.type === 'Pilihan Ganda' ? 'multiple_choice' : 'true_false',
                            options: q.options.map((opt, idx) => ({
                                option_text: opt,
                                is_correct: opt === q.correctAnswer || idx.toString() === q.correctAnswer
                            }))
                        }))
                    });

                    // Then create the module with quiz_id
                    await createModules(courseId, {
                        title: moduleTitle,
                        files: [],
                        moduleType: 'quiz',
                        quizId: quizResponse.id,
                    });
                    createdCount += 1;
                }
            }

            showNotification('success', `Berhasil membuat modul "${moduleTitle}" dengan ${createdCount} konten!`);
            setTimeout(() => {
                router.push('/admin/content');
            }, 2000);
        } catch (err: any) {
            console.error('Error saving module:', err);
            setError(err.message || 'Gagal menyimpan modul');
            showNotification('error', err.message || 'Gagal menyimpan modul');
        } finally {
            setLoading(false);
        }
    };

    const handleAddQuiz = () => {
        const newQuiz: Quiz = {
            id: Date.now(),
            title: `Quiz ${quizzes.length + 1}`,
            description: '',
            questions: []
        };
        setQuizzes([...quizzes, newQuiz]);
    };

    const handleDeleteQuiz = (quizId: number) => {
        setQuizzes(quizzes.filter(q => q.id !== quizId));
    };

    const handleQuizTitleChange = (quizId: number, title: string) => {
        setQuizzes(quizzes.map(q => 
            q.id === quizId ? { ...q, title } : q
        ));
    };

    const handleQuizDescriptionChange = (quizId: number, description: string) => {
        setQuizzes(quizzes.map(q => 
            q.id === quizId ? { ...q, description } : q
        ));
    };

    const handleAddQuestion = (quizId: number) => {
        const newQuestion: QuizQuestion = {
            id: Date.now(),
            question: '',
            type: 'Pilihan Ganda',
            options: ['', '', '', ''],
            correctAnswer: ''
        };
        setQuizzes(quizzes.map(q => 
            q.id === quizId ? { ...q, questions: [...q.questions, newQuestion] } : q
        ));
    };

    const handleDeleteQuestion = (quizId: number, questionId: number) => {
        setQuizzes(quizzes.map(q => 
            q.id === quizId ? { ...q, questions: q.questions.filter(qu => qu.id !== questionId) } : q
        ));
    };

    const handleQuestionTypeChange = (quizId: number, questionId: number, newType: string) => {
        setQuizzes(quizzes.map(quiz => {
            if (quiz.id === quizId) {
                return {
                    ...quiz,
                    questions: quiz.questions.map(q => {
                        if (q.id === questionId) {
                            // Reset options based on type
                            let newOptions = ['', '', '', ''];
                            if (newType === 'Benar/Salah') {
                                newOptions = ['Benar', 'Salah'];
                            }
                            return { ...q, type: newType, options: newOptions, correctAnswer: '' };
                        }
                        return q;
                    })
                };
            }
            return quiz;
        }));
    };

    const handleQuestionTextChange = (quizId: number, questionId: number, text: string) => {
        setQuizzes(quizzes.map(quiz => {
            if (quiz.id === quizId) {
                return {
                    ...quiz,
                    questions: quiz.questions.map(q => 
                        q.id === questionId ? { ...q, question: text } : q
                    )
                };
            }
            return quiz;
        }));
    };

    const handleOptionChange = (quizId: number, questionId: number, optionIndex: number, text: string) => {
        setQuizzes(quizzes.map(quiz => {
            if (quiz.id === quizId) {
                return {
                    ...quiz,
                    questions: quiz.questions.map(q => {
                        if (q.id === questionId) {
                            const newOptions = [...q.options];
                            newOptions[optionIndex] = text;
                            return { ...q, options: newOptions };
                        }
                        return q;
                    })
                };
            }
            return quiz;
        }));
    };

    const handleCorrectAnswerChange = (quizId: number, questionId: number, answer: string) => {
        setQuizzes(quizzes.map(quiz => {
            if (quiz.id === quizId) {
                return {
                    ...quiz,
                    questions: quiz.questions.map(q => 
                        q.id === questionId ? { ...q, correctAnswer: answer } : q
                    )
                };
            }
            return quiz;
        }));
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />

            {/* Main Content */}
            <div className="flex-1 ml-[250px]">
                <HeaderAdmin />

                {/* Form Content */}
                <main className="p-8 max-w-5xl mx-auto">
                    {/* Back Button */}
                    <button
                        onClick={() => router.push('/admin/content')}
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
                        <p className="text-gray-500 text-sm">Pilih jenis modul yang ingin dibuat</p>
                        {courseId && (
                            <p className="text-sm text-[#6B21FF] mt-1">Course ID: {courseId}</p>
                        )}
                    </div>

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    <div className="space-y-6">
                        {/* Module Title Input */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Nama Modul <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Ketik nama modul disini (contoh: Pengenalan Python)"
                                value={moduleTitle}
                                onChange={(e) => setModuleTitle(e.target.value)}
                                className="w-full px-6 py-4 rounded-xl border-2 border-[#6B21FF] focus:outline-none focus:ring-2 focus:ring-[#6B21FF] focus:ring-opacity-20 text-gray-700 placeholder-gray-400"
                                disabled={loading}
                            />
                            <p className="mt-2 text-xs text-gray-500">
                                Semua konten (video, ebook, quiz) akan dikelompokkan dalam modul ini
                            </p>
                        </div>

                        {/* Section: Upload Videos */}
                        <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-6 border-2 border-purple-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">Video Pembelajaran</h2>
                                        <p className="text-sm text-gray-500">Upload satu atau lebih video (Max 50MB per file)</p>
                                    </div>
                                </div>
                            </div>

                            {/* Upload Area */}
                            <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center bg-white hover:bg-purple-50 transition">
                                <svg className="w-12 h-12 text-purple-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <p className="text-sm text-gray-600 mb-4">Drag & drop atau klik untuk upload video</p>
                                <label htmlFor="video-upload">
                                    <div className="inline-block bg-purple-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-purple-700 cursor-pointer transition">
                                        Pilih Video
                                    </div>
                                    <input
                                        id="video-upload"
                                        type="file"
                                        accept="video/mp4,video/avi,video/quicktime"
                                        onChange={handleVideoUpload}
                                        disabled={loading}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {/* Uploaded Videos List */}
                            {uploadedVideos.length > 0 && (
                                <div className="mt-4 space-y-3">
                                    <p className="text-sm font-semibold text-gray-700">{uploadedVideos.length} Video Terupload</p>
                                    {uploadedVideos.map((video) => (
                                        <div key={video.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                                            <div className="flex items-start gap-3">
                                                {/* Video Thumbnail */}
                                                <div className="w-[100px] h-[65px] bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                                                    {video.thumbnail ? (
                                                        <img
                                                            src={video.thumbnail}
                                                            alt="Video thumbnail"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                                                            <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>

                                                        {/* Video Info */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                                <span className="text-sm font-medium text-gray-900 truncate">
                                                                    {video.file.name}
                                                                </span>
                                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                                    <span className="text-sm text-gray-500">
                                                                        {formatFileSize(video.file.size)}
                                                                    </span>
                                                                    <span className="text-sm font-semibold text-[#6B21FF]">
                                                                        {video.progress}%
                                                                    </span>
                                                                    <button
                                                                        onClick={() => handleRemoveVideo(video.id)}
                                                                        className="text-gray-400 hover:text-red-500 transition"
                                                                    >
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {/* Progress Bar */}
                                                            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                                                <div
                                                                    className="bg-[#6B21FF] h-full rounded-full transition-all duration-500"
                                                                    style={{ width: `${video.progress}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                        </div>

                        {/* Section: Upload Ebooks */}
                        <div className="bg-gradient-to-br from-red-50 to-white rounded-xl p-6 border-2 border-red-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">Ebook / Materi PDF</h2>
                                        <p className="text-sm text-gray-500">Upload satu atau lebih ebook (Max 50MB per file)</p>
                                    </div>
                                </div>
                            </div>

                            {/* Upload Area */}
                            <div className="border-2 border-dashed border-red-300 rounded-xl p-8 text-center bg-white hover:bg-red-50 transition">
                                <svg className="w-12 h-12 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <p className="text-sm text-gray-600 mb-4">Drag & drop atau klik untuk upload PDF</p>
                                <label htmlFor="ebook-upload">
                                    <div className="inline-block bg-red-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-red-700 cursor-pointer transition">
                                        Pilih PDF
                                    </div>
                                    <input
                                        id="ebook-upload"
                                        type="file"
                                        accept="application/pdf"
                                        onChange={handleEbookUpload}
                                        disabled={loading}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {/* Uploaded Ebooks List */}
                            {uploadedEbooks.length > 0 && (
                                <div className="mt-4 space-y-3">
                                    <p className="text-sm font-semibold text-gray-700">{uploadedEbooks.length} Ebook Terupload</p>
                                    {uploadedEbooks.map((ebook) => (
                                        <div key={ebook.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                                            <div className="flex items-start gap-3">
                                                {/* PDF Icon */}
                                                <div className="w-12 h-12 bg-red-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                    </svg>
                                                </div>

                                                        {/* Ebook Info */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                                <span className="text-sm font-medium text-gray-900 truncate">
                                                                    {ebook.file.name}
                                                                </span>
                                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                                    <span className="text-sm text-gray-500">
                                                                        {formatFileSize(ebook.file.size)}
                                                                    </span>
                                                                    <span className="text-sm font-semibold text-[#6B21FF]">
                                                                        {ebook.progress}%
                                                                    </span>
                                                                    <button
                                                                        onClick={() => handleRemoveEbook(ebook.id)}
                                                                        className="text-gray-400 hover:text-red-500 transition"
                                                                    >
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {/* Progress Bar */}
                                                            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                                                <div
                                                                    className="bg-[#6B21FF] h-full rounded-full transition-all duration-500"
                                                                    style={{ width: `${ebook.progress}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                        </div>

                        {/* Section: Quiz */}
                        <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border-2 border-blue-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">Quiz / Latihan</h2>
                                        <p className="text-sm text-gray-500">
                                            Buat beberapa quiz, masing-masing bisa punya banyak soal
                                            {quizzes.length > 0 && (
                                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-600 text-white">
                                                    {quizzes.length} Quiz
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleAddQuiz}
                                    disabled={loading}
                                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 hover:scale-105 transition-all duration-300 shadow-md disabled:bg-gray-400"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span>Tambah Quiz</span>
                                </button>
                            </div>

                            {quizzes.length === 0 ? (
                                <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center bg-white">
                                    <svg className="w-12 h-12 text-blue-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm text-gray-500">Belum ada quiz. Klik tombol "Tambah Quiz" untuk membuat quiz baru</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {quizzes.map((quiz, quizIndex) => (
                                        <div key={quiz.id} className="bg-white rounded-xl border-2 border-blue-300 overflow-hidden shadow-sm">
                                            {/* Quiz Header */}
                                            <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <input
                                                            type="text"
                                                            value={quiz.title}
                                                            onChange={(e) => handleQuizTitleChange(quiz.id, e.target.value)}
                                                            placeholder="Judul Quiz"
                                                            className="w-full bg-white/20 backdrop-blur-sm text-white placeholder-white/70 px-4 py-2 rounded-lg font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-white/50"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={quiz.description}
                                                            onChange={(e) => handleQuizDescriptionChange(quiz.id, e.target.value)}
                                                            placeholder="Deskripsi quiz (opsional)"
                                                            className="w-full mt-2 bg-white/20 backdrop-blur-sm text-white placeholder-white/70 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-3 ml-4">
                                                        <span className="bg-white/30 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                            {quiz.questions.length} Soal
                                                        </span>
                                                        <button
                                                            onClick={() => handleDeleteQuiz(quiz.id)}
                                                            className="p-2 text-white hover:bg-white/20 rounded-lg transition-all duration-300 hover:scale-110"
                                                            title="Hapus quiz"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Quiz Content */}
                                            <div className="p-6 bg-blue-50/50">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-sm font-semibold text-gray-700">Daftar Pertanyaan</h3>
                                                    <button
                                                        onClick={() => handleAddQuestion(quiz.id)}
                                                        disabled={loading}
                                                        className="inline-flex items-center gap-2 bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-green-700 hover:scale-105 transition-all duration-300 shadow-sm disabled:bg-gray-400"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                        </svg>
                                                        <span>Tambah Soal</span>
                                                    </button>
                                                </div>

                                                {quiz.questions.length === 0 ? (
                                                    <div className="border-2 border-dashed border-blue-300 rounded-xl p-6 text-center bg-white">
                                                        <p className="text-sm text-gray-500">Belum ada soal. Klik "Tambah Soal" untuk menambahkan pertanyaan</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        {quiz.questions.map((question, index) => (
                                    <div key={question.id} className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
                                        {/* Header Section */}
                                        <div className="bg-gradient-to-r from-[#6B21FF]/5 to-purple-50 px-6 py-4 border-b border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-base font-semibold text-gray-900">Pertanyaan #{index + 1}</h3>
                                                <div className="flex items-center gap-3">
                                                    <select
                                                        value={question.type}
                                                        onChange={(e) => handleQuestionTypeChange(quiz.id, question.id, e.target.value)}
                                                        className="px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6B21FF] focus:border-[#6B21FF] text-sm text-gray-700 bg-white"
                                                    >
                                                        <option>Pilihan Ganda</option>
                                                        <option>Benar/Salah</option>
                                                    </select>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteQuestion(quiz.id, question.id)}
                                                        className="p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg flex items-center justify-center"
                                                        title="Hapus pertanyaan"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="p-6 space-y-6">
                                            {/* Question Input */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-900 mb-3">
                                                    Soal Pertanyaan
                                                </label>
                                                <textarea
                                                    value={question.question}
                                                    onChange={(e) => handleQuestionTextChange(quiz.id, question.id, e.target.value)}
                                                    placeholder="Ketik pertanyaan quiz disini..."
                                                    rows={4}
                                                    className="w-full px-4 py-3 rounded-xl border-2 border-[#6B21FF] focus:outline-none focus:ring-2 focus:ring-[#6B21FF] focus:ring-opacity-20 text-gray-700 placeholder-gray-400 resize-none transition-all"
                                                />
                                            </div>

                                            {/* Divider */}
                                            <div className="border-t border-gray-200"></div>

                                            {/* Options Section */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-900 mb-3">
                                                    {question.type === 'Benar/Salah' ? 'Pilihan' : 'Pilihan Jawaban'}
                                                </label>
                                                <div className="space-y-3">
                                                    {question.type === 'Benar/Salah' ? (
                                                        // True/False Options
                                                        ['Benar', 'Salah'].map((option, idx) => (
                                                            <div key={idx} className="flex items-center gap-3 group">
                                                                <div className="flex items-center justify-center">
                                                                    <input
                                                                        type="radio"
                                                                        name={`correct-answer-${quiz.id}-${question.id}`}
                                                                        id={`option-${quiz.id}-${question.id}-${idx}`}
                                                                        checked={question.correctAnswer === option}
                                                                        onChange={() => handleCorrectAnswerChange(quiz.id, question.id, option)}
                                                                        className="w-5 h-5 text-[#6B21FF] focus:ring-[#6B21FF] cursor-pointer"
                                                                    />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <input
                                                                        type="text"
                                                                        value={option}
                                                                        readOnly
                                                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-gray-50 text-gray-700 font-medium"
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        // Multiple Choice Options
                                                        [0, 1, 2, 3].map((idx) => (
                                                            <div key={idx} className="flex items-center gap-3 group">
                                                                <div className="flex items-center justify-center">
                                                                    <input
                                                                        type="radio"
                                                                        name={`correct-answer-${quiz.id}-${question.id}`}
                                                                        id={`option-${quiz.id}-${question.id}-${idx}`}
                                                                        checked={question.correctAnswer === question.options[idx]}
                                                                        onChange={() => handleCorrectAnswerChange(quiz.id, question.id, question.options[idx])}
                                                                        className="w-5 h-5 text-[#6B21FF] focus:ring-[#6B21FF] cursor-pointer"
                                                                    />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <input
                                                                        type="text"
                                                                        value={question.options[idx] || ''}
                                                                        onChange={(e) => handleOptionChange(quiz.id, question.id, idx, e.target.value)}
                                                                        placeholder={`Opsi ${idx + 1}`}
                                                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6B21FF] focus:border-[#6B21FF] text-gray-700 placeholder-gray-400 transition-all"
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                                <p className="mt-3 text-xs text-gray-500 italic">
                                                    Pilih opsi yang benar dengan menandai radio button di sebelah kiri
                                                </p>
                                            </div>

                                            {/* Divider */}
                                            <div className="border-t border-gray-200"></div>

                                            {/* Correct Answer Section */}
                                            <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                                                <label className="block text-sm font-semibold text-green-700 mb-3 flex items-center gap-2">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Jawaban yang Benar (otomatis terisi saat pilih radio button)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={question.correctAnswer}
                                                    readOnly
                                                    placeholder={question.type === 'Benar/Salah' ? 'Pilih Benar atau Salah' : 'Pilih jawaban yang benar'}
                                                    className="w-full px-4 py-3 rounded-lg border-2 border-green-300 bg-white text-gray-700 font-semibold"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6 border-t-2 border-gray-200">
                            <div className="bg-gradient-to-r from-[#6B21FF] to-purple-600 rounded-xl p-6 text-white shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold mb-1">Simpan Modul</h3>
                                        <p className="text-sm text-purple-100">
                                            {uploadedVideos.length} video · {uploadedEbooks.length} ebook · {quizzes.length} quiz
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleSaveModule}
                                        disabled={loading || !moduleTitle || !courseId}
                                        className="bg-white text-[#6B21FF] px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105 duration-300"
                                    >
                                        {loading ? 'Menyimpan...' : 'Simpan Modul'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Notification Toast */}
            {notification && (
                <div className="fixed top-4 right-4 z-50 animate-slide-in">
                    <div className={`rounded-xl px-6 py-4 shadow-2xl border-2 min-w-[300px] max-w-md ${notification.type === 'success'
                            ? 'bg-green-50 border-green-500 text-green-800'
                            : 'bg-red-50 border-red-500 text-red-800'
                        }`}>
                        <div className="flex items-start gap-3">
                            {notification.type === 'success' ? (
                                <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            )}
                            <div className="flex-1">
                                <p className="font-semibold text-sm">{notification.message}</p>
                            </div>
                            <button
                                onClick={() => setNotification(null)}
                                className="flex-shrink-0 text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                .animate-slide-in {
                    animation: slideIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}
