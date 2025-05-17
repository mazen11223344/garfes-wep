
// src/lib/actions.ts
"use server";

import { analyzeAndStoreMemory as genkitAnalyzeAndStoreMemory, type AnalyzeAndStoreMemoryInput, type AnalyzeAndStoreMemoryOutput } from "@/ai/flows/analyze-and-store-memory";
import { rewriteFinancialNews as genkitRewriteFinancialNews, type RewriteFinancialNewsInput, type RewriteFinancialNewsOutput } from "@/ai/flows/rewrite-financial-news";
import { analyzeFinancialChart as genkitAnalyzeFinancialChart, type AnalyzeFinancialChartInput, type AnalyzeFinancialChartOutput } from "@/ai/flows/analyze-financial-chart";
import { translateText as genkitTranslateText, type TranslateTextInput, type TranslateTextOutput } from "@/ai/flows/translate-text-flow";


export async function analyzeAndStoreMemory(userInput: string, existingMemory?: string): Promise<AnalyzeAndStoreMemoryOutput> {
  const input: AnalyzeAndStoreMemoryInput = {
    userInput,
    existingMemory: existingMemory || "",
  };
  return genkitAnalyzeAndStoreMemory(input);
}

export async function rewriteFinancialNews(newsArticle: string): Promise<RewriteFinancialNewsOutput> {
  const input: RewriteFinancialNewsInput = {
    newsArticle,
  };
  return genkitRewriteFinancialNews(input);
}

export async function analyzeFinancialChart(photoDataUri: string, userPrompt?: string): Promise<AnalyzeFinancialChartOutput> {
  const input: AnalyzeFinancialChartInput = { photoDataUri, userPrompt };
  return genkitAnalyzeFinancialChart(input);
}

export async function translateText(textToTranslate: string, targetLanguage: 'English' | 'Arabic'): Promise<TranslateTextOutput> {
  const input: TranslateTextInput = { textToTranslate, targetLanguage };
  return genkitTranslateText(input);
}
