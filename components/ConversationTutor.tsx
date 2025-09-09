import React, { useState, useEffect, useRef } from 'react';
import { useLugha } from '../hooks/useLugha';
import { GoogleGenAI, Chat } from '@google/genai';

const PageHeader: React.FC<{ title: string; onBack: () => void }> = ({ title, onBack }) => (
    <div className="flex items-center mb-6 relative">
        <button onClick={onBack} className="absolute left-0 p-2 rounded-full hover:bg-slate-200 transition-colors" aria-label="Back">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
        </button>
        <h1 className="flex-grow text-center text-3xl font-extrabold text-slate-800 tracking-tight">{title}</h1>
    </div>
);

type Message = {
    role: 'user' | 'model';
    text: string;
};

const ConversationTutor: React.FC = () => {
    const { setView, selectedLanguage } = useLugha();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatRef = useRef<Chat | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initChat = () => {
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
                chatRef.current = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: {
                         systemInstruction: `You are a friendly and patient language tutor for ${selectedLanguage?.name}. Your name is Kazi. Engage the user in a simple, encouraging conversation. Keep your responses short and clear. Correct the user's mistakes gently and explain the correction. Start the conversation by greeting the user in ${selectedLanguage?.name} and asking them how they are.`
                    }
                });
                
                // Start the conversation with the model's greeting
                handleSendMessage("Hello", true);

            } catch (error) {
                console.error("Failed to initialize chat:", error);
                setMessages([{ role: 'model', text: "Sorry, I'm having trouble starting our chat. Please try again later." }]);
            }
        };
        if (selectedLanguage) {
            initChat();
        }
    }, [selectedLanguage]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (messageText?: string, isInitial = false) => {
        const textToSend = messageText || input;
        if (!textToSend.trim() || !chatRef.current) return;

        if (!isInitial) {
             setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
        }
        setInput('');
        setIsLoading(true);

        try {
            const stream = await chatRef.current.sendMessageStream({ message: textToSend });
            let modelResponse = '';
            setMessages(prev => [...prev, { role: 'model', text: '' }]); // Add empty model message

            for await (const chunk of stream) {
                modelResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text = modelResponse;
                    return newMessages;
                });
            }
        } catch (error) {
            console.error("Error sending message:", error);
             setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Let's try that again." }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSendMessage();
    };

    return (
        <div className="p-1 flex flex-col h-[calc(100vh-3rem)]">
            <PageHeader title={`${selectedLanguage?.name} Tutor`} onBack={() => setView('dashboard')} />

            <div ref={chatContainerRef} className="flex-grow bg-white p-4 rounded-2xl shadow-inner border border-slate-200/80 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl ${msg.role === 'user' ? 'bg-blue-500 text-white rounded-br-lg' : 'bg-slate-200 text-slate-800 rounded-bl-lg'}`}>
                            {msg.text || ( <div className="animate-pulse flex space-x-1"><div className="w-2 h-2 bg-slate-400 rounded-full"></div><div className="w-2 h-2 bg-slate-400 rounded-full"></div><div className="w-2 h-2 bg-slate-400 rounded-full"></div></div> )}
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleFormSubmit} className="mt-4 flex items-center gap-3">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    disabled={isLoading}
                    className="flex-grow w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow shadow-sm"
                />
                <button type="submit" disabled={isLoading || !input.trim()} className="bg-blue-500 text-white rounded-full p-3 shadow-md hover:bg-blue-600 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all transform hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                </button>
            </form>
        </div>
    );
};

export default ConversationTutor;