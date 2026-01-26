"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useHealth } from "@/lib/health-context";
import { Send, Bot, User } from "lucide-react";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function ChatPanel() {
    const { healthData } = useHealth();
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "Hello! I'm your Health Twin AI. I can analyze your daily metrics and provide personalized health insights. Try adjusting your metrics on the left, and I'll give you real-time advice!",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: input,
                    healthData,
                }),
            });

            const data = await response.json();

            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: data.message },
            ]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Sorry, I encountered an error. Please try again.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="card-elevated rounded-sm flex h-[calc(100vh-180px)] flex-col">
            {/* Chat Header */}
            <div className="border-b-2 border-border p-4">
                <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">AI Health Consultant</h3>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                    Context-aware insights based on your metrics
                </p>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"
                            }`}
                    >
                        {msg.role === "assistant" && (
                            <div className="rounded-sm bg-primary p-2 ring-2 ring-primary/20">
                                <Bot className="h-4 w-4 text-primary-foreground" />
                            </div>
                        )}
                        <div
                            className={`max-w-[80%] rounded-sm px-4 py-3 ${msg.role === "user"
                                    ? "bg-primary text-primary-foreground"
                                    : "border-2 border-border bg-card"
                                }`}
                        >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        </div>
                        {msg.role === "user" && (
                            <div className="rounded-sm bg-secondary p-2 ring-2 ring-secondary/20">
                                <User className="h-4 w-4 text-secondary-foreground" />
                            </div>
                        )}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-3">
                        <div className="rounded-sm bg-primary p-2">
                            <Bot className="h-4 w-4 animate-pulse text-primary-foreground" />
                        </div>
                        <div className="rounded-sm border-2 border-border bg-card px-4 py-3">
                            <p className="text-sm text-muted-foreground">Analyzing...</p>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t-2 border-border p-4">
                <div className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Ask about your health metrics..."
                        className="rounded-sm border-2"
                        disabled={isLoading}
                    />
                    <Button
                        onClick={sendMessage}
                        disabled={isLoading || !input.trim()}
                        className="rounded-sm"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </Card>
    );
}
