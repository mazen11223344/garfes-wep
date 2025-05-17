// src/ai/flows/analyze-financial-news.ts
'use server';

/**
 * @fileOverview Rewrites financial news for forwarding to another channel, performing fundamental analysis.
 *
 * - analyzeFinancialNews - A function that rewrites financial news.
 * - AnalyzeFinancialNewsInput - The input type for the analyzeFinancialNews function.
 * - AnalyzeFinancialNewsOutput - The return type for the analyzeFinancialNews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeFinancialNewsInputSchema = z.object({
  newsArticle: z
    .string()
    .describe('The financial news article to rewrite and analyze.'),
});

export type AnalyzeFinancialNewsInput = z.infer<typeof AnalyzeFinancialNewsInputSchema>;

const AnalyzeFinancialNewsOutputSchema = z.object({
  rewrittenArticle: z
    .string()
    .describe('The rewritten financial news article with fundamental analysis.'),
});

export type AnalyzeFinancialNewsOutput = z.infer<typeof AnalyzeFinancialNewsOutputSchema>;

export async function analyzeFinancialNews(
  input: AnalyzeFinancialNewsInput
): Promise<AnalyzeFinancialNewsOutput> {
  return analyzeFinancialNewsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeFinancialNewsPrompt',
  input: {schema: AnalyzeFinancialNewsInputSchema},
  output: {schema: AnalyzeFinancialNewsOutputSchema},
  prompt: `You are a financial analyst. Rewrite the following news article, providing a concise summary and including fundamental analysis. Focus on key information for forex traders and gold market participants.\n\nNews Article: {{{newsArticle}}}`,
});

const analyzeFinancialNewsFlow = ai.defineFlow(
  {
    name: 'analyzeFinancialNewsFlow',
    inputSchema: AnalyzeFinancialNewsInputSchema,
    outputSchema: AnalyzeFinancialNewsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
