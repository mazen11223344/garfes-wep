"use client";

import { useState, useEffect } from "react";

export function GeminiKeySetup() {
  const [apiKey, setApiKey] = useState("");
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<{ message: string; details?: string } | null>(null);

  useEffect(() => {
    const storedKey = localStorage.getItem("gemini-api-key");
    if (storedKey) {
      validateApiKey(storedKey);
    }
  }, []);

  const validateApiKey = async (key: string) => {
    setIsValidating(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-key': key
        },
        body: JSON.stringify({ message: "TEST_API_KEY" }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("gemini-api-key", key);
        setApiKey(key);
        setIsFirstVisit(false);
      } else {
        setError({
          message: data.error,
          details: data.details
        });
        localStorage.removeItem("gemini-api-key");
      }
    } catch (err) {
      console.error('Error validating API key:', err);
      setError({
        message: 'حدث خطأ أثناء التحقق من المفتاح',
        details: err instanceof Error ? err.message : 'خطأ غير معروف'
      });
      localStorage.removeItem("gemini-api-key");
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError({
        message: 'يرجى إدخال مفتاح API'
      });
      return;
    }
    await validateApiKey(apiKey.trim());
  };

  if (!isFirstVisit && !error) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-black p-8 rounded-xl shadow-lg max-w-md w-full border border-gold-500 transform transition-all">
        <h2 className="text-2xl font-bold mb-4 text-black dark:text-white text-right">مرحباً بك!</h2>
        <p className="mb-6 text-black/70 dark:text-white/70 text-right">
          للاستفادة من خدمات الذكاء الاصطناعي، يرجى إدخال مفتاح Gemini API الخاص بك.
          يمكنك الحصول عليه من{' '}
          <a
            href="https://makersuite.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold-500 hover:text-gold-600 underline"
          >
            Google AI Studio
          </a>
        </p>
        <div className="mb-4 text-right">
          <p className="text-sm text-black/70 dark:text-white/70">تأكد من:</p>
          <ul className="list-disc list-inside text-sm text-black/70 dark:text-white/70 space-y-1 mt-2">
            <li>نسخ المفتاح بشكل صحيح</li>
            <li>تفعيل Gemini API في مشروعك</li>
            <li>عدم تجاوز الحد الأقصى للاستخدام</li>
          </ul>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="أدخل مفتاح Gemini API"
              className="w-full p-3 border border-gold-200 dark:border-gold-800 rounded-lg bg-white dark:bg-black text-black dark:text-white focus:border-gold-500 focus:ring-2 focus:ring-gold-500 transition-all"
              required
              dir="rtl"
            />
            {error && (
              <div className="mt-2 text-right">
                <p className="text-red-500 text-sm">{error.message}</p>
                {error.details && (
                  <p className="text-red-400 text-xs mt-1">{error.details}</p>
                )}
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={isValidating || !apiKey.trim()}
            className="w-full bg-gold-500 text-black py-3 px-4 rounded-lg hover:bg-gold-600 transition-colors disabled:opacity-50"
          >
            {isValidating ? 'جاري التحقق...' : 'حفظ المفتاح'}
          </button>
        </form>
      </div>
    </div>
  );
} 