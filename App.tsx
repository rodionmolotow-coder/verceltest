import React, { useState, useRef, useEffect } from 'react';
import { generateGeminiResponse } from './services/geminiService';
import ChatMessage from './components/ChatMessage';
import LoadingDots from './components/LoadingDots';
import { Message } from './types';
import { Send, Zap, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hello! I'm your Gemini AI assistant running on Vercel. How can I help you test your deployment today?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    // Focus input on mount for quick testing
    inputRef.current?.focus();
  }, [messages, error]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const responseText = await generateGeminiResponse(userMessage.text);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      // Check if it is a missing API key error to give a helpful hint
      if (err.message && err.message.includes("API Key")) {
        setError("Missing API_KEY environment variable. Check your Vercel Project Settings.");
      } else {
        setError("Failed to get response. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-gray-950 shadow-2xl overflow-hidden md:border-x md:border-gray-800">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">Gemini Vercel Test</h1>
            <p className="text-xs text-indigo-300 font-medium">Deployment Status: Active</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs text-gray-400 font-mono">v1.0.0</span>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 scroll-smooth space-y-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        
        {isLoading && (
          <div className="flex justify-start animate-fade-in">
             <div className="bg-gray-800 rounded-2xl rounded-bl-none px-4 py-3 border border-gray-700">
                <LoadingDots />
             </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center my-4 animate-bounce">
            <div className="bg-red-900/50 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg flex items-center gap-2 text-sm shadow-lg backdrop-blur-sm">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span>{error}</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <footer className="p-4 bg-gray-900/90 backdrop-blur border-t border-gray-800">
        <form onSubmit={handleSend} className="relative flex items-center gap-2 max-w-3xl mx-auto">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message to test the API..."
            className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-xl py-3.5 pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-gray-750 transition-all border border-gray-700 shadow-inner"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="text-center mt-3">
          <p className="text-[10px] text-gray-500">
            Powered by Google Gemini 3 Flash • Built for Vercel
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;