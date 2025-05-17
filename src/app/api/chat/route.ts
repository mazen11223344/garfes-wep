import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    const apiKey = request.headers.get('x-gemini-key');
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'يرجى إدخال مفتاح Gemini API' },
        { status: 401 }
      );
    }

    try {
      // تهيئة Gemini
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      // اختبار المفتاح بمحتوى بسيط
      const result = await model.generateContent("Test message to verify API key");
      const response = await result.response;
      
      if (message === "TEST_API_KEY") {
        return NextResponse.json({ response: "تم التحقق من المفتاح بنجاح" });
      }

      // إذا وصلنا إلى هنا، فالمفتاح صالح ونستمر مع الرسالة الفعلية
      const actualResult = await model.generateContent(message);
      const actualResponse = await actualResult.response;
      const text = actualResponse.text();

      return NextResponse.json({ response: text });
    } catch (apiError: any) {
      console.error('Gemini API Error:', apiError);
      
      // التحقق من نوع الخطأ
      if (apiError.message?.includes('API key')) {
        return NextResponse.json(
          { error: 'مفتاح API غير صالح' },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { error: 'حدث خطأ في الاتصال مع Gemini API' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Server Error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
} 