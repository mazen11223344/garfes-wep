
'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing user input, 
 * responding to the user, storing it in memory if explicitly asked or deemed important, 
 * and retrieving information from memory.
 *
 * - analyzeAndStoreMemory - A function that takes user input and current memory, 
 *   processes it for response and storage/retrieval, and returns the outcome.
 * - AnalyzeAndStoreMemoryInput - The input type for the analyzeAndStoreMemory function.
 * - AnalyzeAndStoreMemoryOutput - The return type for the analyzeAndStoreMemory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeAndStoreMemoryInputSchema = z.object({
  userInput: z.string().describe('مدخلات المستخدم لتحليلها أو الاستعلام عنها أو تخزينها أو الرد عليها كمحادثة عامة.'),
  existingMemory: z.string().optional().describe('الذاكرة الحالية للمساعد كنص. إذا كانت فارغة، فهذه أول معلومة.'),
});
export type AnalyzeAndStoreMemoryInput = z.infer<typeof AnalyzeAndStoreMemoryInputSchema>;

const AnalyzeAndStoreMemoryOutputSchema = z.object({
  responseForUser: z.string().describe('الرد المباشر للمستخدم أو نتيجة عملية الذاكرة.'),
  updatedMemory: z.string().describe('نص الذاكرة المحدث.'),
});
export type AnalyzeAndStoreMemoryOutput = z.infer<typeof AnalyzeAndStoreMemoryOutputSchema>;

export async function analyzeAndStoreMemory(input: AnalyzeAndStoreMemoryInput): Promise<AnalyzeAndStoreMemoryOutput> {
  return analyzeAndStoreMemoryFlow(input);
}

const analyzeAndStoreMemoryPrompt = ai.definePrompt({
  name: 'analyzeAndStoreMemoryPrompt',
  input: {schema: AnalyzeAndStoreMemoryInputSchema},
  output: {schema: AnalyzeAndStoreMemoryOutputSchema},
  prompt: `مهمتك الأساسية هي إجراء محادثة مفيدة مع المستخدم باللغة العربية الفصحى والواضحة.
لديك ذاكرة. بعد فهم مدخلات المستخدم وصياغة ردك، قرر ما إذا كانت أي معلومات من مدخلات المستخدم أو ردك مهمة لتذكرها للتفاعلات المستقبلية (مثل الحقائق عن المستخدم، أو التفضيلات، أو السياق الهام).

1.  إذا قال المستخدم "تذكر أن [س]"، قم بتخزين [س] في الذاكرة. يجب أن يكون \`responseForUser\` الخاص بك هو إقرار مثل "تم تذكر أن [س]". يجب أن تحتوي \`updatedMemory\` على الذاكرة السابقة بالإضافة إلى [س] كما أدخلها المستخدم.
2.  إذا سأل المستخدم "ما هو [ص]؟" أو "ما هي [ص]؟"، حاول الإجابة من \`existingMemory\` بشكل دقيق.
    -   إذا وجدت المعلومة (مثلاً، إذا كانت \`existingMemory\` تحتوي على "اسمي هو مازن." وسأل المستخدم "ما هو اسمي؟")، فإن \`responseForUser\` هي الإجابة الدقيقة من الذاكرة (مثال: "اسمك هو مازن."). \`updatedMemory\` يجب أن تكون نفس \`existingMemory\`.
    -   إذا لم تجد المعلومة المطلوبة بشكل واضح ومباشر في \`existingMemory\`, فإن \`responseForUser\` هي "عفواً، لا أعرف هذه المعلومة.". \`updatedMemory\` يجب أن تكون نفس \`existingMemory\`. لا تفترض أو تستنتج الإجابة إذا لم تكن موجودة نصًا.
3.  لأي مدخلات أخرى (محادثة عامة، أو أمر مثل "حلل هذا: [معلومة]"):
    أ.  قم بصياغة رد مفيد ومباشر على استفسار المستخدم ليكون هو \`responseForUser\`.
    ب.  حدد ما إذا كانت هناك أي معلومات من هذا التفاعل (مدخلات المستخدم أو ردك الذي صغته في الخطوة 'أ') يجب إضافتها إلى الذاكرة.
    ج.  يجب أن تحتوي \`updatedMemory\` على الذاكرة السابقة بالإضافة إلى أي معلومات جديدة قررت إضافتها. إذا لم تقرر إضافة أي شيء جديد للذاكرة، فإن \`updatedMemory\` يجب أن تكون مطابقة لـ \`existingMemory\`.

الذاكرة الحالية (إذا كانت فارغة، فهذه أول محادثة):
{{{existingMemory}}}

مدخلات المستخدم:
{{{userInput}}}

عندما تُسأل عن نفسك أو من أنت، يجب أن تجيب: "أنا جارفيس، مساعد شخصي. تم تصميمي بواسطة FOREX TRADING ACADEMY."

قم بالرد باستخدام \`responseForUser\` (ردك المباشر على المستخدم) و \`updatedMemory\` (نص الذاكرة المحدث).
تأكد من أن جميع الردود في \`responseForUser\` باللغة العربية الفصحى.
تأكد من أن حقل \`updatedMemory\` يحتوي دائماً على السلسلة الكاملة للذاكرة المحدثة أو الحالية، وأن كل معلومة جديدة تضاف إلى ما قبلها.
`,
});

const analyzeAndStoreMemoryFlow = ai.defineFlow(
  {
    name: 'analyzeAndStoreMemoryFlow',
    inputSchema: AnalyzeAndStoreMemoryInputSchema,
    outputSchema: AnalyzeAndStoreMemoryOutputSchema,
  },
  async input => {
    const currentInput = {
      ...input,
      existingMemory: input.existingMemory || "", 
    };
    const {output} = await analyzeAndStoreMemoryPrompt(currentInput);
    return output!;
  }
);

