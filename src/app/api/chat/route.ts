import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    
    // الحصول على مفتاح API من headers
    const apiKey = request.headers.get('x-gemini-key');
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'يرجى إدخال مفتاح Gemini API' },
        { status: 401 }
      );
    }

    // تهيئة Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // إرسال الرسالة وانتظار الرد
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error: any) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء معالجة طلبك' },
      { status: 500 }
    );
  }
} 