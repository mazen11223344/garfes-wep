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
      
      // التأكد من أن النتيجة صالحة
      if (!result || !result.response) {
        throw new Error('لم يتم استلام رد من Gemini API');
      }

      const response = await result.response;
      
      if (message === "TEST_API_KEY") {
        return NextResponse.json({ response: "تم التحقق من المفتاح بنجاح" });
      }

      // إذا وصلنا إلى هنا، فالمفتاح صالح ونستمر مع الرسالة الفعلية
      const actualResult = await model.generateContent(message);
      
      if (!actualResult || !actualResult.response) {
        throw new Error('لم يتم استلام رد من Gemini API للرسالة الفعلية');
      }

      const actualResponse = await actualResult.response;
      const text = actualResponse.text();

      if (!text) {
        throw new Error('الرد من Gemini API فارغ');
      }

      return NextResponse.json({ response: text });
    } catch (apiError: any) {
      console.error('Gemini API Error Details:', {
        message: apiError.message,
        name: apiError.name,
        stack: apiError.stack,
        details: apiError.details || 'No additional details'
      });
      
      // التحقق من أنواع الأخطاء المختلفة
      if (apiError.message?.includes('API key')) {
        return NextResponse.json(
          { error: 'مفتاح API غير صالح أو منتهي الصلاحية' },
          { status: 401 }
        );
      }

      if (apiError.message?.includes('PERMISSION_DENIED')) {
        return NextResponse.json(
          { error: 'تم رفض الوصول. تأكد من تفعيل Gemini API في مشروعك' },
          { status: 403 }
        );
      }

      if (apiError.message?.includes('QUOTA_EXCEEDED')) {
        return NextResponse.json(
          { error: 'تم تجاوز الحد الأقصى للاستخدام. حاول لاحقاً' },
          { status: 429 }
        );
      }

      if (apiError.message?.includes('INVALID_ARGUMENT')) {
        return NextResponse.json(
          { error: 'محتوى الرسالة غير صالح' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { 
          error: 'حدث خطأ في الاتصال مع Gemini API',
          details: apiError.message || 'لا توجد تفاصيل إضافية'
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Server Error Details:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    
    return NextResponse.json(
      { 
        error: 'حدث خطأ في الخادم',
        details: error.message || 'لا توجد تفاصيل إضافية'
      },
      { status: 500 }
    );
  }
} 