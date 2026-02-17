"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, Sparkles, Mic, Paperclip, Square } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as React from 'react';
import { cn } from "@/lib/utils";
import { Toast } from "@/components/ui/toast";

import { useAuth } from "@/components/auth-provider";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, orderBy, getDocs, serverTimestamp } from "firebase/firestore";
import { useHealth } from "@/lib/health-context";

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export default function ChatPage() {
    const { healthData } = useHealth();
    const { user } = useAuth();

    const [messages, setMessages] = React.useState<ChatMessage[]>([]);
    const [input, setInput] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [isLoadingHistory, setIsLoadingHistory] = React.useState(true);
    const [showSuggestions, setShowSuggestions] = React.useState(true);

    const [files, setFiles] = React.useState<FileList | undefined>(undefined);
    const [isRecording, setIsRecording] = React.useState(false);
    const [isTranscribing, setIsTranscribing] = React.useState(false);
    const [toast, setToast] = React.useState<{ message: string; type: "info" | "success" | "error" } | null>(null);

    const inputRef = React.useRef<HTMLInputElement>(null);
    const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
    const audioChunksRef = React.useRef<Blob[]>([]);
    const scrollRef = React.useRef<HTMLDivElement>(null);

    const showToast = (message: string, type: "info" | "success" | "error" = "info") => {
        setToast({ message, type });
    };

    // Firestore Helper
    const saveMessageToDb = async (role: 'user' | 'assistant', content: string) => {
        if (!user) return;
        try {
            await addDoc(collection(db, "users", user.uid, "messages"), {
                role,
                content,
                createdAt: serverTimestamp()
            });
        } catch (e) {
            console.error("Error saving message", e);
        }
    };

    // Load History
    React.useEffect(() => {
        if (!user) return;
        const loadHistory = async () => {
            const q = query(
                collection(db, "users", user.uid, "messages"),
                orderBy("createdAt", "asc")
            );
            const snapshot = await getDocs(q);
            const history: ChatMessage[] = snapshot.docs.map(doc => ({
                id: doc.id,
                role: doc.data().role as 'user' | 'assistant',
                content: doc.data().content
            }));

            if (history.length > 0) {
                setMessages(history);
                setShowSuggestions(false);
            }
            setIsLoadingHistory(false);
        };
        loadHistory();
    }, [user]);

    // Auto-scroll
    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Manual stream-based chat submit
    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmed = input.trim();
        if (!trimmed || isLoading) return;

        const userMsg: ChatMessage = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: trimmed
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setShowSuggestions(false);
        setIsLoading(true);
        saveMessageToDb('user', trimmed);

        const assistantId = `assistant-${Date.now()}`;
        setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '' }]);

        try {
            const allMessages = [...messages, userMsg].map(m => ({
                role: m.role,
                content: m.content
            }));

            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: allMessages,
                    dataContext: healthData
                }),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({ error: 'Unknown error' }));
                throw new Error(errData.error || `HTTP ${res.status}`);
            }

            const reader = res.body?.getReader();
            const decoder = new TextDecoder();
            let fullResponse = '';

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    fullResponse += chunk;

                    // Update the assistant message with accumulated text
                    setMessages(prev =>
                        prev.map(m =>
                            m.id === assistantId
                                ? { ...m, content: fullResponse }
                                : m
                        )
                    );
                }
            }

            saveMessageToDb('assistant', fullResponse);

        } catch (error: any) {
            console.error("Chat Error:", error);
            showToast(`Error: ${error.message}`, "error");

            // Remove the empty assistant message on error
            setMessages(prev => prev.filter(m => m.id !== assistantId));
        } finally {
            setIsLoading(false);
        }
    };

    // Suggestion chip click
    const handleSuggestionClick = (q: string) => {
        setInput(q);
        setShowSuggestions(false);
        inputRef.current?.focus();
    };

    // Voice input
    const handleVoiceInput = async () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const startRecording = async () => {
        try {
            showToast("Requesting microphone...", "info");
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                stream.getTracks().forEach(track => track.stop());
                await transcribeAudio(audioBlob);
            };

            mediaRecorder.start();
            setIsRecording(true);
            showToast("🎤 Recording... Click again to stop", "info");
        } catch (error: any) {
            if (error.name === 'NotAllowedError') {
                showToast("Mic blocked. Enable in browser settings.", "error");
            } else if (error.name === 'NotFoundError') {
                showToast("No microphone found.", "error");
            } else {
                showToast("Mic access failed.", "error");
            }
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setIsTranscribing(true);
            showToast("Processing audio...", "info");
        }
    };

    const transcribeAudio = async (audioBlob: Blob) => {
        try {
            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.webm');

            const response = await fetch('/api/transcribe', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Transcription failed');

            const transcript = data.text.trim();
            setInput(prev => prev ? `${prev} ${transcript}` : transcript);
            showToast(`Got it: "${transcript}"`, "success");
        } catch (error: any) {
            showToast(`Transcription failed: ${error.message}`, "error");
        } finally {
            setIsTranscribing(false);
        }
    };

    const isMicActive = isRecording || isTranscribing;

    return (
        <div className="min-h-screen bg-secondary/30 pt-24 pb-10 px-4 md:px-8 flex flex-col items-center">

            <div className="max-w-3xl w-full flex-1 flex flex-col gap-4">

                {/* Header */}
                <div className="text-center space-y-2 mb-4">
                    <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-2">
                        <Bot className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold">Health Twin AI</h1>
                    <p className="text-muted-foreground text-sm">
                        Analysis based on your daily stats (Sleep: {healthData.sleep}h, Stress: {healthData.stress}/10)
                    </p>
                </div>

                {/* Chat Window */}
                <div className="flex-1 bg-background border border-border rounded-3xl shadow-sm overflow-hidden flex flex-col min-h-[500px] max-h-[70vh]">

                    {/* Messages Area */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
                        {messages.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground opacity-50 space-y-4">
                                <Sparkles className="w-12 h-12" />
                                <p>Type &quot;Why am I tired?&quot; to see the magic.</p>
                            </div>
                        )}

                        <AnimatePresence initial={false}>
                            {messages.map(m => (
                                <motion.div
                                    key={m.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        "flex w-full",
                                        m.role === 'user' ? "justify-end" : "justify-start"
                                    )}
                                >
                                    <div className={cn(
                                        "flex max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm whitespace-pre-wrap",
                                        m.role === 'user'
                                            ? "bg-primary text-white rounded-br-none"
                                            : "bg-secondary text-foreground rounded-bl-none"
                                    )}>
                                        {m.content || (m.role === 'assistant' && isLoading ? '' : m.content)}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex justify-start"
                            >
                                <div className="bg-secondary text-muted-foreground rounded-2xl rounded-bl-none px-5 py-3 text-sm flex gap-1">
                                    <span className="animate-bounce">●</span>
                                    <span className="animate-bounce delay-100">●</span>
                                    <span className="animate-bounce delay-200">●</span>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* File Preview */}
                    {files && files.length > 0 && (
                        <div className="px-4 pb-2 flex gap-2 items-center">
                            <span className="text-xs text-muted-foreground">📎 Attached:</span>
                            {Array.from(files).map((file, i) => (
                                <div key={i} className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-xs text-primary">
                                    <span className="max-w-[120px] truncate">{file.name}</span>
                                    <button
                                        onClick={() => setFiles(undefined)}
                                        className="hover:text-red-500 ml-1"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Suggested Questions — only visible initially or when no messages */}
                    {showSuggestions && messages.length === 0 && (
                        <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
                            {["How is my sleep?", "Reduce stress tips?", "Am I hydrated?"].map((q, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSuggestionClick(q)}
                                    className="whitespace-nowrap px-3 py-1.5 rounded-full bg-secondary/50 text-xs font-medium text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input Area */}
                    <form
                        onSubmit={handleFormSubmit}
                        className="p-4 bg-secondary/20 border-t border-border flex items-center gap-3"
                    >
                        {/* Image Upload */}
                        <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={event => {
                                if (event.target.files) setFiles(event.target.files);
                            }}
                        />
                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className={cn("rounded-full text-muted-foreground hover:text-primary", files && files.length > 0 && "text-primary bg-primary/10")}
                            onClick={() => document.getElementById('file-upload')?.click()}
                        >
                            <Paperclip className="w-5 h-5" />
                        </Button>

                        {/* Voice Input */}
                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className={cn(
                                "rounded-full text-muted-foreground hover:text-primary transition-all",
                                isRecording && "text-red-500 animate-pulse bg-red-50",
                                isTranscribing && "text-blue-500 bg-blue-50"
                            )}
                            onClick={handleVoiceInput}
                            disabled={isTranscribing}
                        >
                            {isRecording ? (
                                <Square className="w-5 h-5" />
                            ) : (
                                <Mic className="w-5 h-5" />
                            )}
                        </Button>

                        <Input
                            ref={inputRef as any}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={
                                isTranscribing
                                    ? "🔄 Transcribing..."
                                    : isRecording
                                        ? "🎤 Recording..."
                                        : "Type, speak, or upload..."
                            }
                            className="flex-1 bg-background border-none shadow-sm focus-visible:ring-1 focus-visible:ring-primary rounded-full h-12 px-6"
                            disabled={isMicActive}
                        />
                        <Button type="submit" size="icon" disabled={isLoading || isMicActive} className="h-12 w-12 rounded-full shrink-0 shadow-md transition-transform active:scale-95">
                            <Send className="w-5 h-5 ml-0.5" />
                        </Button>
                    </form>

                </div>

            </div>

            {/* Toast Notifications */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
