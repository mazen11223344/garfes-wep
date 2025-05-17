
// src/ai/flows/rewrite-financial-news.ts
'use server';

/**
 * @fileOverview Rewrites financial news for forwarding to another channel, performing fundamental analysis.
 *
 * - rewriteFinancialNews - A function that rewrites financial news.
 * - RewriteFinancialNewsInput - The input type for the rewriteFinancialNews function.
 * - RewriteFinancialNewsOutput - The return type for the rewriteFinancialNews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RewriteFinancialNewsInputSchema = z.object({
  newsArticle: z
    .string()
    .describe('المقال الإخباري المالي لإعادة صياغته وتحليله.'),
});

export type RewriteFinancialNewsInput = z.infer<typeof RewriteFinancialNewsInputSchema>;

const RewriteFinancialNewsOutputSchema = z.object({
  rewrittenArticle: z
    .string()
    .describe('المقال الإخباري المالي المعاد صياغته مع التحليل الأساسي.'),
});

export type RewriteFinancialNewsOutput = z.infer<typeof RewriteFinancialNewsOutputSchema>;

export async function rewriteFinancialNews(
  input: RewriteFinancialNewsInput
): Promise<RewriteFinancialNewsOutput> {
  return rewriteFinancialNewsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rewriteFinancialNewsPrompt',
  input: {schema: RewriteFinancialNewsInputSchema},
  output: {schema: RewriteFinancialNewsOutputSchema},
  prompt: `أنت محلل مالي. أعد صياغة المقال الإخباري التالي، مع تقديم ملخص موجز وتحليل أساسي. ركز على المعلومات الأساسية لمتداولي الفوركس. يجب أن تكون جميع الردود باللغة العربية.\n\nالمقال الإخباري: {{{newsArticle}}}`,
});

const rewriteFinancialNewsFlow = ai.defineFlow(
  {
    name: 'rewriteFinancialNewsFlow',
    inputSchema: RewriteFinancialNewsInputSchema,
    outputSchema: RewriteFinancialNewsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
