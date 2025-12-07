import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AIMessage = {
    role: "user" | "assistant" | "system";
    content: string;
};

type RequestBody = {
    messages?: AIMessage[];
    prompt?: string;
    message?: string;
    model?: string;
    stream?: boolean;
};

const DEFAULT_MODEL = "gemini-flash-latest";
const MODEL_FALLBACKS = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.0-flash-lite",
];

export async function POST(req: Request) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey || apiKey === 'your_gemini_api_key_here') {
            console.error('❌ GEMINI_API_KEY is not configured properly');
            return NextResponse.json(
                { error: "GEMINI_API_KEY tidak dikonfigurasi dengan benar di server" },
                { status: 500 }
            );
        }

        let body: RequestBody;
        try {
            body = await req.json();
        } catch {
            return NextResponse.json(
                { error: "Invalid JSON body" },
                { status: 400 }
            );
        }

        const { messages, prompt, message, model = DEFAULT_MODEL, stream = true } = body;

        let finalPrompt = (message ?? prompt ?? "").trim();
        if (!finalPrompt && Array.isArray(messages) && messages.length > 0) {
            const lastUser = [...messages].reverse().find((m) => m.role === "user");
            finalPrompt = (lastUser?.content ?? "").trim();
        }

        if (!finalPrompt) {
            return NextResponse.json(
                { error: "Provide a 'message', 'prompt' or at least one user message" },
                { status: 400 }
            );
        }

        console.log('✅ API key found, generating response for:', finalPrompt.substring(0, 50) + '...');

        const systemContext = `Kamu adalah "Asisten Lentera", asisten AI untuk platform Lentera Karir. Gunakan bahasa Indonesia yang natural dan ramah.

TENTANG LENTERA KARIR:
Platform pengembangan karir dengan kursus online, mentorship, learning paths, dan job board untuk berbagai bidang seperti Web Development, Data Science, UI/UX Design, Digital Marketing, dan soft skills.

ATURAN KETAT - CARA MENULIS RESPONS:

1. DILARANG pakai simbol markdown:
   ❌ JANGAN: **bold**, *italic*, # heading, - list, 1. 2. 3. numbered list
   ✅ PAKAI: teks biasa tanpa format apapun

2. Untuk list atau poin-poin, tulis dengan paragraf terpisah atau pakai emoji (📚 🎯 💼)

3. Tulis dalam paragraf pendek maksimal 3-4 kalimat

4. Pakai baris kosong (enter 2x) untuk pemisah paragraf

5. Bahasa natural conversational: "banget", "kok", "nih", "dong", "sih"

6. Jawab langsung to-the-point, jangan bertele-tele

7. Akhiri dengan pertanyaan atau ajakan engage

CONTOH BENAR:

Q: "Gimana cara daftar kursus?"
A: "Gampang kok! Kamu bisa langsung explore kursus di platform, pilih yang sesuai minat, lalu klik tombol Daftar.

Setelah daftar, kamu bisa langsung mulai belajar dari video pertama. Progress belajarmu bakal kesimpen otomatis, jadi bisa lanjut kapan aja.

Kalau ada yang bingung saat belajar, kamu juga bisa tanya di forum diskusi atau konsultasi sama mentor loh!

Mau mulai belajar skill apa nih? 😊"

Q: "Perbedaan frontend dan backend?"
A: "Oke jadi gini bedanya:

Frontend itu yang kamu lihat dan klik di website. Tampilan, button, animasi, form isian. Pakai HTML, CSS, JavaScript. Cocok buat yang suka design dan visual.

Backend itu yang di belakang layar. Database, server, API, logic bisnis. Pakai Node.js, Python, PHP. Cocok buat yang suka problem solving dan data.

Fullstack bisa keduanya, makanya paling dicari di industri tapi ya butuh effort lebih buat belajar.

Kamu lebih tertarik yang mana? 🤔"

YANG HARUS DIHINDARI:
❌ Jangan pakai "pertama", "kedua", "ketiga" 
❌ Jangan pakai numbered list 1. 2. 3.
❌ Jangan pakai bullet points - atau *
❌ Jangan pakai **bold**
❌ Jangan terlalu formal

Jawab pertanyaan user dengan gaya natural dan friendly seperti contoh di atas: "${finalPrompt}"`;

        const genAI = new GoogleGenerativeAI(apiKey);
        const modelsToTry = uniqueModels([model, ...MODEL_FALLBACKS]);
        let geminiModel = null;
        let lastError: Error | null = null;

        for (const m of modelsToTry) {
            try {
                console.log(`Trying model: ${m}`);
                geminiModel = genAI.getGenerativeModel({ model: m });
                break;
            } catch (e: any) {
                console.error(`Model ${m} failed:`, e.message);
                lastError = e;
                continue;
            }
        }

        if (!geminiModel) {
            return NextResponse.json(
                {
                    error: "Gemini API error",
                    details: lastError?.message || "No compatible model found",
                },
                { status: 404 }
            );
        }

        if (stream) {
            try {
                const result = await geminiModel.generateContentStream(systemContext);
                const encoder = new TextEncoder();

                const streamBody = new ReadableStream<Uint8Array>({
                    async start(controller) {
                        try {
                            for await (const chunk of result.stream) {
                                try {
                                    if (!chunk) continue;
                                    const text = chunk.text();
                                    if (!text || text.trim() === '') continue;

                                    controller.enqueue(encoder.encode(text));
                                } catch (chunkError: any) {
                                    console.warn('Chunk processing error (skipping):', chunkError.message);
                                    continue;
                                }
                            }
                            controller.close();
                        } catch (err: any) {
                            console.error('Streaming error:', err);
                            controller.close();
                        }
                    },
                });

                return new Response(streamBody, {
                    headers: {
                        "Content-Type": "text/plain; charset=utf-8",
                        "Cache-Control": "no-cache, no-transform",
                        "X-Accel-Buffering": "no",
                    },
                });
            } catch (err: any) {
                console.error('Gemini streaming error:', err);

                // Check if it's a quota error
                const errorMessage = err.message || '';
                if (errorMessage.includes('quota') || errorMessage.includes('429') || errorMessage.includes('Too Many Requests')) {
                    return NextResponse.json(
                        { error: "Quota exceeded", details: err.message },
                        { status: 429 }
                    );
                }

                return NextResponse.json(
                    { error: "Gemini streaming error", details: err.message },
                    { status: 500 }
                );
            }
        }

        try {
            const result = await geminiModel.generateContent(systemContext);
            const response = await result.response;
            const text = response.text();

            return new Response(text || "(no response)", {
                headers: { "Content-Type": "text/plain; charset=utf-8" },
            });
        } catch (err: any) {
            console.error('Gemini API error:', err);

            // Check if it's a quota error
            const errorMessage = err.message || '';
            if (errorMessage.includes('quota') || errorMessage.includes('429') || errorMessage.includes('Too Many Requests')) {
                return NextResponse.json(
                    { error: "Quota exceeded", details: err.message },
                    { status: 429 }
                );
            }

            return NextResponse.json(
                { error: "Gemini API error", details: err.message },
                { status: 500 }
            );
        }
    } catch (err: any) {
        console.error('Unexpected server error:', err);
        return NextResponse.json(
            { error: "Unexpected server error", details: String(err?.message || err) },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        status: "ok",
        message: "Lentera Karir AI Assistant API"
    });
}

function uniqueModels(models: (string | undefined)[]): string[] {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const m of models) {
        if (!m) continue;
        const v = m.trim();
        if (!v || seen.has(v)) continue;
        seen.add(v);
        out.push(v);
    }
    return out;
}
