"use client";

import { useState, useEffect } from "react";

export function GeminiKeySetup() {
  const [apiKey, setApiKey] = useState("");
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  useEffect(() => {
    const storedKey = localStorage.getItem("gemini-api-key");
    if (storedKey) {
      setApiKey(storedKey);
      setIsFirstVisit(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("gemini-api-key", apiKey);
    setIsFirstVisit(false);
  };

  if (!isFirstVisit) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-black p-6 rounded-lg shadow-lg max-w-md w-full border border-gold-500">
        <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">مرحباً بك!</h2>
        <p className="mb-4 text-black/70 dark:text-white/70">
          للاستفادة من التطبيق، يرجى إدخال مفتاح Gemini API الخاص بك. يمكنك الحصول عليه من Google AI Studio.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="أدخل مفتاح Gemini API"
            className="w-full p-2 border border-gold-200 dark:border-gold-800 rounded mb-4 bg-white dark:bg-black text-black dark:text-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
            required
            dir="rtl"
          />
          <button
            type="submit"
            className="w-full bg-gold-500 text-black py-2 px-4 rounded hover:bg-gold-600 transition-colors"
          >
            حفظ المفتاح
          </button>
        </form>
      </div>
    </div>
  );
} 