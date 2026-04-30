"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, Bot, Loader2 } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
};

const PERSONAS = [
  {
    id: "anshuman",
    name: "Anshuman Singh",
    role: "Co-founder, Scaler",
    suggestions: [
      "How do I improve my system design skills?",
      "Is learning React enough for a job?",
      "What did you learn scaling Facebook Messenger?",
    ],
  },
  {
    id: "abhimanyu",
    name: "Abhimanyu Saxena",
    role: "Co-founder, Scaler",
    suggestions: [
      "How do I grow from SDE-1 to SDE-2?",
      "Are startups better than FAANG for freshers?",
      "What is the most important trait in an engineer?",
    ],
  },
  {
    id: "kshitij",
    name: "Kshitij Mishra",
    role: "Curriculum Head, Scaler",
    suggestions: [
      "I am struggling with Dynamic Programming. Help!",
      "How many Leetcode problems should I solve?",
      "What is the best way to dry-run a recursive function?",
    ],
  },
];

export default function ChatbotPage() {
  const [activePersona, setActivePersona] = useState(PERSONAS[0].id);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handlePersonaSelect = (id: string) => {
    setActivePersona(id);
    setMessages([]);
    setError("");
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, persona: activePersona }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch response.");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const botMsgId = (Date.now() + 1).toString();
      const botMsg: Message = { id: botMsgId, role: "bot", content: "" };
      setMessages((prev) => [...prev, botMsg]);

      let accumulatedContent = "";
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedContent += chunk;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMsgId ? { ...msg, content: accumulatedContent } : msg
          )
        );
      }
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const currentPersona = PERSONAS.find((p) => p.id === activePersona);

  return (
    <div className="flex flex-col h-screen bg-neutral-50 text-neutral-900 font-sans">
      <header className="bg-white border-b sticky top-0 z-10 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Scaler Persona Chat
          </h1>
          <p className="text-sm text-neutral-500">Assignment 01 — Prompt Engineering</p>
        </div>

        {/* Persona Switcher */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {PERSONAS.map((p) => (
            <button
              key={p.id}
              onClick={() => handlePersonaSelect(p.id)}
              className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
                activePersona === p.id
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 w-full max-w-4xl mx-auto flex flex-col gap-4 relative">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in duration-500">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Bot className="w-12 h-12 text-blue-600" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-neutral-800">Chat with {currentPersona?.name}</h2>
                <p className="text-neutral-500 mt-2">{currentPersona?.role}</p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center mt-8">
              {currentPersona?.suggestions.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(sug)}
                  className="bg-white border text-sm text-neutral-600 px-4 py-2 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors shadow-sm"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 w-full h-full justify-end">
            <div className="flex flex-col gap-4 mt-auto">
                {messages.map((msg) => (
                <div
                    key={msg.id}
                    className={`flex items-start gap-3 max-w-[85%] md:max-w-[75%] ${
                    msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                    }`}
                >
                    <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                        msg.role === "user" ? "bg-indigo-100 text-indigo-600" : "bg-blue-600 text-white"
                    }`}
                    >
                    {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div
                    className={`p-3 md:p-4 rounded-2xl whitespace-pre-wrap leading-relaxed ${
                        msg.role === "user"
                        ? "bg-indigo-600 text-white rounded-tr-none shadow-sm"
                        : "bg-white border text-neutral-800 rounded-tl-none shadow-sm"
                    }`}
                    >
                    {msg.content}
                    </div>
                </div>
                ))}
                
                {isLoading && (
                <div className="flex items-start gap-3 mr-auto max-w-[85%]">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-1">
                    <Bot size={16} />
                    </div>
                    <div className="p-4 bg-white border text-neutral-800 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span className="text-sm text-neutral-500">Typing...</span>
                    </div>
                </div>
                )}
                
                {error && (
                <div className="mx-auto bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm border border-red-100 shadow-sm mt-2">
                    {error}
                </div>
                )}
                <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t p-4 w-full sticky bottom-0 z-10 shrink-0 shadow-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="max-w-4xl mx-auto flex gap-2 relative bg-neutral-50 p-2 rounded-2xl border border-neutral-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder={`Message ${currentPersona?.name}...`}
            className="flex-1 px-4 py-2 bg-transparent focus:outline-none disabled:opacity-50 text-neutral-800"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors flex items-center justify-center shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </footer>
    </div>
  );
}
