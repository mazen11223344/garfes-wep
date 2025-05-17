'use server';
/**
 * @fileOverview A text translation AI agent.
 *
 * - translateText - A function that handles text translation.
 * - TranslateTextInput - The input type for the translateText function.
 * - TranslateTextOutput - The return type for the translateText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TargetLanguageSchema = z.enum(['English', 'Arabic']).describe('اللغة الهدف للترجمة (إنجليزية أو عربية).');

const TranslateTextInputSchema = z.object({
  textToTranslate: z.string().describe('النص المراد ترجمته.'),
  targetLanguage: TargetLanguageSchema,
});
export type TranslateTextInput = z.infer<typeof TranslateTextInputSchema>;

const TranslateTextOutputSchema = z.object({
  translatedText: z.string().describe('النص المترجم.'),
});
export type TranslateTextOutput = z.infer<typeof TranslateTextOutputSchema>;

export async function translateText(input: TranslateTextInput): Promise<TranslateTextOutput> {
  return translateTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateTextPrompt',
  input: {schema: TranslateTextInputSchema},
  output: {schema: TranslateTextOutputSchema},
  prompt: `أنت مترجم خبير. مهمتك هي ترجمة النص التالي إلى {{targetLanguage}}.
النص الأصلي: {{{textToTranslate}}}

قدم الترجمة فقط.
`,
});

const translateTextFlow = ai.defineFlow(
  {
    name: 'translateTextFlow',
    inputSchema: TranslateTextInputSchema,
    outputSchema: TranslateTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
