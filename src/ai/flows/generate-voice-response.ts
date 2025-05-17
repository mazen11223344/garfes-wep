
'use server';
/**
 * @fileOverview Generates voice responses using the Google Cloud Text-to-Speech API.
 *
 * - generateVoiceResponse - A function that generates voice responses.
 * - GenerateVoiceResponseInput - The input type for the generateVoiceResponse function.
 * - GenerateVoiceResponseOutput - The return type for the generateVoiceResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateVoiceResponseInputSchema = z.object({
  text: z.string().describe('النص المراد تحويله إلى كلام.'),
  languageCode: z.string().optional().default('ar-XA').describe('رمز اللغة (مثل ar-XA).'),
  voiceName: z.string().optional().default('ar-XA-Wavenet-B').describe('اسم الصوت (مثل ar-XA-Wavenet-B).'),
});
export type GenerateVoiceResponseInput = z.infer<typeof GenerateVoiceResponseInputSchema>;

const GenerateVoiceResponseOutputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      'الصوت المُنشأ كـ data URI يجب أن يتضمن نوع MIME ويستخدم ترميز Base64. التنسيق المتوقع: data:audio/mp3;base64,<encoded_data>.'
    ),
});
export type GenerateVoiceResponseOutput = z.infer<typeof GenerateVoiceResponseOutputSchema>;

export async function generateVoiceResponse(
  input: GenerateVoiceResponseInput
): Promise<GenerateVoiceResponseOutput> {
  return generateVoiceResponseFlow(input);
}

const generateVoiceResponseFlow = ai.defineFlow(
  {
    name: 'generateVoiceResponseFlow',
    inputSchema: GenerateVoiceResponseInputSchema,
    outputSchema: GenerateVoiceResponseOutputSchema,
  },
  async (input: GenerateVoiceResponseInput) => {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error('لم يتم تعيين GEMINI_API_KEY. يستخدم هذا المفتاح أيضًا لخدمة Google Cloud Text-to-Speech. تأكد من تكوينه وتمكين واجهة برمجة تطبيقات Cloud Text-to-Speech في مشروع GCP الخاص بك.');
    }

    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

    const requestBody = {
      input: { text: input.text },
      voice: { languageCode: input.languageCode || 'ar-XA', name: input.voiceName || 'ar-XA-Wavenet-B' }, // Default to Arabic voice
      audioConfig: { audioEncoding: 'MP3' },
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Google TTS API Error Body:', errorBody);
        throw new Error(`Google Cloud Text-to-Speech API error! Status: ${response.status}. Response: ${errorBody}`);
      }

      const responseData = await response.json();
      
      if (!responseData.audioContent) {
        console.error('Google TTS API No Audio Content:', responseData);
        throw new Error('Google Cloud Text-to-Speech API did not return audio content.');
      }
      
      const audioDataUri = `data:audio/mp3;base64,${responseData.audioContent}`;
      return { audioDataUri };

    } catch (error) {
      console.error('Error generating voice response with Google Cloud TTS:', error);
      throw error; 
    }
  }
);
