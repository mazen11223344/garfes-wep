"use client";

import { useState, useEffect } from 'react';
import { MessageBubble } from '@/components/MessageBubble';
import { VoiceInputButton } from '@/components/VoiceInputButton';

export default function Home() {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    const apiKey = localStorage.getItem('gemini-api-key');
    if (!apiKey) {
      setMessages(prev => [...prev, { 
        text: 'يرجى إدخال مفتاح Gemini API أولاً', 
        isUser: false 
      }]);
      return;
    }

    setMessages(prev => [...prev, { text, isUser: true }]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-key': apiKey
        },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) {
        throw new Error('فشل الاتصال بالخادم');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages(prev => [...prev, { text: data.response, isUser: false }]);
    } catch (error: any) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        text: error.message || 'عذراً، حدث خطأ ما. يرجى المحاولة مرة أخرى.', 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 bg-white dark:bg-black">
      <div className="w-full max-w-4xl mx-auto flex flex-col h-screen">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
              مرحباً بك! كيف يمكنني مساعدتك اليوم؟
            </div>
          )}
          {messages.map((message, index) => (
            <MessageBubble
              key={index}
              text={message.text}
              isUser={message.isUser}
            />
          ))}
          {isLoading && (
            <div className="flex justify-center">
              <div className="animate-pulse text-gold-500">جاري التحميل...</div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gold-200 dark:border-gold-800">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
              placeholder="اكتب رسالتك هنا..."
              className="flex-1 p-2 rounded-lg border border-gold-200 dark:border-gold-800 bg-white dark:bg-black text-black dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              dir="rtl"
            />
            <button
              onClick={() => handleSendMessage(inputText)}
              className="px-4 py-2 bg-gold-500 text-black rounded-lg hover:bg-gold-600 transition-colors disabled:opacity-50"
              disabled={isLoading || !inputText.trim()}
            >
              إرسال
            </button>
            <VoiceInputButton onTranscript={(text) => setInputText(text)} />
          </div>
        </div>
      </div>
    </main>
  );
}
