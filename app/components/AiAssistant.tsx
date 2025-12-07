'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles } from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function AiAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [streamingContent, setStreamingContent] = useState('');
    const [showTooltip, setShowTooltip] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Quick action questions
    const quickActions = [
        'Cara memilih course yang tepat',
        'Rekomendasi learning path',
        'Cara mendaftar course',
        'Tips membangun karir',
    ];

    // Get dynamic greeting based on time
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Selamat pagi';
        if (hour < 15) return 'Selamat siang';
        if (hour < 18) return 'Selamat sore';
        return 'Selamat malam';
    };

    // Auto scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, streamingContent]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
        }
    }, [isOpen]);

    const sendMessage = async (messageText: string) => {
        if (!messageText.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: messageText };
        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);
        setStreamingContent('');

        try {
            const response = await fetch('/api/assistant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: messageText }),
            });

            if (!response.ok) {
                // Check if it's a quota limit error
                if (response.status === 429) {
                    throw new Error('QUOTA_EXCEEDED');
                }
                throw new Error(`API_ERROR_${response.status}`);
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let accumulatedContent = '';

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                        // Stream finished - save final message
                        if (accumulatedContent.trim()) {
                            setMessages((prev) => [
                                ...prev,
                                { role: 'assistant', content: accumulatedContent },
                            ]);
                        }
                        setStreamingContent('');
                        setIsLoading(false);
                        break;
                    }

                    // Decode chunk as PLAIN TEXT (bukan JSON!)
                    const text = decoder.decode(value, { stream: true });

                    if (text) {
                        accumulatedContent += text;
                        setStreamingContent(accumulatedContent);
                    }
                }
            }
        } catch (error) {
            console.error('Error sending message:', error);

            let errorMessage = '';

            if (error instanceof Error) {
                // Handle quota exceeded error
                if (error.message === 'QUOTA_EXCEEDED') {
                    errorMessage = `⏱️ Batas Penggunaan Tercapai\n\nMaaf, quota API Gemini untuk hari ini sudah habis (limit: 20 requests/hari untuk free tier).\n\n✅ Solusi:\n1. Tunggu 24 jam untuk quota reset otomatis\n2. Upgrade ke paid plan untuk quota lebih besar\n3. Gunakan API key berbeda\n\nSilakan coba lagi nanti!`;
                }
                // Handle other API errors
                else if (error.message.startsWith('API_ERROR_')) {
                    const statusCode = error.message.replace('API_ERROR_', '');
                    errorMessage = `❌ Terjadi Kesalahan (Error ${statusCode})\n\nMaaf, tidak dapat terhubung ke AI assistant saat ini.\n\nSilakan coba lagi dalam beberapa saat.`;
                }
                // Generic error
                else {
                    errorMessage = `❌ Terjadi Kesalahan\n\nMaaf, ada masalah teknis yang tidak terduga.\n\nSilakan coba lagi atau hubungi administrator jika masalah berlanjut.`;
                }
            } else {
                errorMessage = 'Maaf, terjadi kesalahan yang tidak diketahui. Silakan coba lagi.';
            }

            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: errorMessage,
                },
            ]);
            setIsLoading(false);
            setStreamingContent('');
        }
    };

    const handleQuickAction = (question: string) => {
        sendMessage(question);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(inputValue);
    };

    return (
        <>
            <style jsx>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px) scale(0.92);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                
                @keyframes shimmer {
                    0% {
                        background-position: -468px 0;
                    }
                    100% {
                        background-position: 468px 0;
                    }
                }
                
                .chat-panel-enter {
                    animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }
                
                .skeleton {
                    background: linear-gradient(
                        90deg,
                        #f0f0f0 0%,
                        #e0e0e0 20%,
                        #f0f0f0 40%,
                        #f0f0f0 100%
                    );
                    background-size: 468px 100%;
                    animation: shimmer 1.2s ease-in-out infinite;
                }
            `}</style>

            {/* Floating Chat Button with Tooltip */}
            <div className="fixed bottom-5 right-5 z-50">
                {/* Tooltip - di samping kiri */}
                {showTooltip && !isOpen && (
                    <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-2xl shadow-lg whitespace-nowrap">
                        Chatbot Lentera
                        {/* Arrow pointing right */}
                        <div className="absolute left-full top-1/2 -translate-y-1/2 -ml-1 border-4 border-transparent border-l-purple-600"></div>
                    </div>
                )}

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className="bg-purple-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 relative overflow-hidden"
                    aria-label="Toggle AI Assistant"
                >
                    <div className="relative w-6 h-6">
                        {/* Bot Icon with Animation */}
                        <div
                            className={`absolute inset-0 transition-all duration-300 ${isOpen
                                ? 'rotate-90 scale-0 opacity-0'
                                : 'rotate-0 scale-100 opacity-100'
                                }`}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="w-6 h-6"
                            >
                                <rect x="5" y="7" width="14" height="12" rx="2" />
                                <circle cx="9" cy="12" r="1" fill="currentColor" />
                                <circle cx="15" cy="12" r="1" fill="currentColor" />
                                <path d="M9 16c.5.7 1.5 1 3 1s2.5-.3 3-1" />
                                <line x1="12" y1="7" x2="12" y2="4" />
                                <circle cx="12" cy="3" r="1" fill="currentColor" />
                            </svg>
                            {/* Online Indicator */}
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-purple-600 animate-pulse"></span>
                        </div>

                        {/* X Icon with Animation */}
                        <div
                            className={`absolute inset-0 transition-all duration-300 ${isOpen
                                ? 'rotate-0 scale-100 opacity-100'
                                : '-rotate-90 scale-0 opacity-0'
                                }`}
                        >
                            <X className="w-6 h-6" />
                        </div>
                    </div>
                </button>
            </div>

            {/* Chat Panel */}
            {isOpen && (
                <div className="fixed bottom-24 right-5 z-50 w-80 h-[480px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden chat-panel-enter">
                    {/* Header */}
                    <div className="bg-purple-600 text-white px-4 py-3 flex items-center gap-2.5 rounded-t-2xl">
                        <div className="relative w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="w-5 h-5 text-purple-600"
                            >
                                <rect x="5" y="7" width="14" height="12" rx="2" />
                                <circle cx="9" cy="12" r="1" fill="currentColor" />
                                <circle cx="15" cy="12" r="1" fill="currentColor" />
                                <path d="M9 16c.5.7 1.5 1 3 1s2.5-.3 3-1" />
                                <line x1="12" y1="7" x2="12" y2="4" />
                                <circle cx="12" cy="3" r="1" fill="currentColor" />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm">Asisten Lentera</h3>
                            <p className="text-xs text-purple-100">Online</p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:bg-purple-500 rounded-full p-1 transition-colors flex-shrink-0"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
                        {/* Greeting */}
                        {messages.length === 0 && (
                            <div className="text-center py-4 px-3">
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
                                    <Sparkles className="w-6 h-6 text-purple-600" />
                                </div>
                                <h4 className="text-base font-semibold text-gray-900 mb-1.5">
                                    {getGreeting()}!
                                </h4>
                                <p className="text-gray-600 text-xs mb-4 leading-relaxed">
                                    Saya Asisten Lentera, siap membantu perjalanan karir Anda
                                </p>

                                {/* Quick Actions */}
                                <div className="space-y-1.5">
                                    {quickActions.map((action, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleQuickAction(action)}
                                            className="w-full text-left px-3 py-2 bg-white hover:bg-purple-50 border border-gray-200 hover:border-purple-300 rounded-xl transition-all duration-200 text-xs text-gray-700 hover:text-purple-700"
                                        >
                                            {action}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Messages */}
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
                                    }`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-3 py-2 ${message.role === 'user'
                                        ? 'bg-purple-600 text-white rounded-br-md'
                                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
                                        }`}
                                >
                                    {message.role === 'assistant' && (
                                        <div className="flex items-center gap-1.5 mb-1.5">
                                            <div className="w-4 h-4 bg-purple-100 rounded-full flex items-center justify-center">
                                                <Sparkles className="w-2.5 h-2.5 text-purple-600" />
                                            </div>
                                            <span className="text-xs font-medium text-gray-500">
                                                Asisten
                                            </span>
                                        </div>
                                    )}
                                    <p className="text-xs whitespace-pre-wrap leading-relaxed">
                                        {message.content}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {/* Streaming Message */}
                        {streamingContent && (
                            <div className="flex justify-start">
                                <div className="max-w-[80%] rounded-2xl rounded-bl-md px-3 py-2 bg-white text-gray-800 border border-gray-200">
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                        <div className="w-4 h-4 bg-purple-100 rounded-full flex items-center justify-center">
                                            <Sparkles className="w-2.5 h-2.5 text-purple-600" />
                                        </div>
                                        <span className="text-xs font-medium text-gray-500">
                                            Asisten
                                        </span>
                                    </div>
                                    <p className="text-xs whitespace-pre-wrap leading-relaxed">
                                        {streamingContent}
                                        <span className="inline-block w-0.5 h-3 bg-purple-600 ml-0.5 animate-pulse"></span>
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Skeleton Loading */}
                        {isLoading && !streamingContent && (
                            <div className="flex justify-start animate-in fade-in duration-200">
                                <div className="max-w-[80%] rounded-2xl rounded-bl-md px-3 py-2 bg-white border border-gray-200">
                                    {/* Avatar & Name Skeleton */}
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                        <div className="w-4 h-4 bg-purple-100 rounded-full flex items-center justify-center">
                                            <Sparkles className="w-2.5 h-2.5 text-purple-600 animate-pulse" />
                                        </div>
                                        <span className="text-xs font-medium text-gray-500">Asisten</span>
                                    </div>
                                    {/* Message Skeleton */}
                                    <div className="space-y-2">
                                        <div className="skeleton h-2.5 rounded-full w-32"></div>
                                        <div className="skeleton h-2.5 rounded-full w-24"></div>
                                        <div className="skeleton h-2.5 rounded-full w-28"></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Form */}
                    <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-200 rounded-b-2xl">
                        <div className="flex gap-2 items-end">
                            <textarea
                                ref={inputRef}
                                value={inputValue}
                                onChange={(e) => {
                                    setInputValue(e.target.value);
                                    // Auto resize
                                    e.target.style.height = 'auto';
                                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                                }}
                                onKeyDown={(e) => {
                                    // Enter to send, Shift+Enter for new line
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSubmit(e as any);
                                    }
                                }}
                                placeholder="Ketik pesan..."
                                rows={1}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-xs text-gray-800 placeholder:text-gray-400 resize-none overflow-y-auto max-h-[120px]"
                                disabled={isLoading}
                                style={{ minHeight: '36px' }}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !inputValue.trim()}
                                className="bg-purple-600 text-white rounded-full p-2 hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-purple-600 flex-shrink-0"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}