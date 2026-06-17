import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { MessageSquare, X, Send, Bot, RefreshCw, Sparkles } from "lucide-react";

export default function AiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "bot-init",
      role: "model",
      text: "Hello! I am your Cognitive AI Careers Assistant. Ask me anything about improving your Employability Rating, closing technical gaps, preparing resumes, or optimizing simulation scores!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const triggerChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      text: inputVal,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    const originalInput = inputVal;
    setInputVal("");
    setIsLoading(true);

    try {
      // Map history for Gemini
      const formattedHistory = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: originalInput,
          history: formattedHistory
        }),
      });

      const data = await response.json();
      if (data && !data.error) {
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-bot-${Date.now()}`,
            role: "model",
            text: data.text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error("AI Assistant response failure:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          role: "model",
          text: "I apologies, our cognitive AI servers encountered a brief tracking hiccup. Set up your live `GEMINI_API_KEY` or review network routes to reactivate streaming responses.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="ai-chat-bubble-container" className="fixed bottom-6 right-6 z-50">
      
      {/* Floating expanded Panel */}
      {isOpen ? (
        <div className="w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl flex flex-col justify-between h-[450px] animate-in slide-in-from-bottom-5">
          
          {/* Header */}
          <div className="flex justify-between items-center border-b border-slate-105 pb-2">
            <div className="flex items-center space-x-2">
              <span className="p-1 px-2.5 rounded-lg bg-teal-600 font-bold text-white text-xs flex items-center space-x-1">
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                <span>Career AI</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Evaluation Mentor</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-650 hover:bg-slate-100 rounded"
              title="Collapse"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-2 space-y-3.5 text-xs max-h-[300px]">
            {messages.map((m) => (
              <div key={m.id} className={`flex items-start gap-2 text-left ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role !== "user" && <span className="text-base select-none">🤖</span>}
                <div className={`p-3 rounded-2xl max-w-[260px] leading-normal ${
                  m.role === "user" 
                    ? "bg-teal-600 text-white rounded-tr-none" 
                    : "bg-slate-50 border border-slate-200 text-slate-700 rounded-tl-none shadow-sm"
                }`}>
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  <span className="block text-[8px] text-slate-400 font-mono text-right mt-1">{m.timestamp}</span>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input field */}
          <form onSubmit={triggerChatSubmit} className="border-t border-slate-150 pt-2 flex items-center space-x-1.5">
            <input
              type="text"
              required
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask Career AI Mentor..."
              className="flex-1 block text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <button
              id="chat-send-btn"
              type="submit"
              disabled={isLoading || !inputVal.trim()}
              className="p-2 bg-teal-605 bg-teal-600 hover:bg-teal-700 text-white rounded-lg disabled:bg-slate-300"
            >
              {isLoading ? <RefreshCw className="h-4.5 w-4.5 animate-spin" /> : <Send className="h-4.5 w-4.5" />}
            </button>
          </form>

        </div>
      ) : (
        /* Floating click trigger button */
        <button
          id="trigger-ai-chat"
          onClick={() => setIsOpen(true)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-800 text-white shadow-xl hover:scale-105 active:scale-95 transition-all animate-bounce cursor-pointer"
          title="Open AI Careers Mentor Chatbot"
        >
          <MessageSquare className="h-5.5 w-5.5" />
        </button>
      )}

    </div>
  );
}
