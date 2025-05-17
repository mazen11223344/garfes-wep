'use server';
/**
 * @fileOverview A financial chart analysis AI agent.
 *
 * - analyzeFinancialChart - A function that handles the financial chart analysis process.
 * - AnalyzeFinancialChartInput - The input type for the analyzeFinancialChart function.
 * - AnalyzeFinancialChartOutput - The return type for the analyzeFinancialChart function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeFinancialChartInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a financial chart, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  userPrompt: z.string().optional().describe('Optional user prompt for specific analysis focus, e.g., "identify support and resistance for gold".')
});
export type AnalyzeFinancialChartInput = z.infer<typeof AnalyzeFinancialChartInputSchema>;

const AnalyzeFinancialChartOutputSchema = z.object({
  asset: z.string().optional().describe('الأصل المالي الذي تم تحديده في الرسم البياني (مثل الذهب، XAUUSD).'),
  supportLevels: z.array(z.string()).optional().describe('مستويات الدعم المحددة.'),
  resistanceLevels: z.array(z.string()).optional().describe('مستويات المقاومة المحددة.'),
  analysis: z.string().describe('تحليل فني مفصل للرسم البياني باللغة العربية، يتضمن الاتجاهات المحتملة وأي ملاحظات أخرى.'),
});
export type AnalyzeFinancialChartOutput = z.infer<typeof AnalyzeFinancialChartOutputSchema>;

export async function analyzeFinancialChart(input: AnalyzeFinancialChartInput): Promise<AnalyzeFinancialChartOutput> {
  return analyzeFinancialChartFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeFinancialChartPrompt',
  input: {schema: AnalyzeFinancialChartInputSchema},
  output: {schema: AnalyzeFinancialChartOutputSchema},
  prompt: `أنت محلل فني وخبير في الأسواق المالية. مهمتك هي تحليل صورة الرسم البياني المالي المقدمة.
  
  الصورة: {{media url=photoDataUri}}
  
  التعليمات:
  1.  حدد الأصل المالي المعروض في الرسم البياني (على سبيل المثال، الذهب، XAUUSD، سهم معين، إلخ).
  2.  استخرج مستويات الدعم والمقاومة الرئيسية الواضحة في الرسم البياني.
  3.  قدم تحليلًا فنيًا موجزًا للرسم البياني باللغة العربية. صف الاتجاهات الحالية أو الأنماط أو أي ملاحظات هامة أخرى.
  {{#if userPrompt}}
  4.  خذ في الاعتبار طلب المستخدم الإضافي: {{{userPrompt}}}
  {{/if}}
  
  يجب أن تكون جميع المخرجات باللغة العربية الفصحى والواضحة.
  إذا لم تكن الصورة واضحة أو لم تكن رسمًا بيانيًا ماليًا، وضح ذلك في تحليلك.
  اذكر مستويات الدعم والمقاومة كنقاط سعرية محددة إذا أمكن.
  `,
});

const analyzeFinancialChartFlow = ai.defineFlow(
  {
    name: 'analyzeFinancialChartFlow',
    inputSchema: AnalyzeFinancialChartInputSchema,
    outputSchema: AnalyzeFinancialChartOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
