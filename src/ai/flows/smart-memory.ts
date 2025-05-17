// src/ai/flows/smart-memory.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for determining if a piece of information is worth remembering and storing it.
 *
 * - smartMemory - A function that analyzes user input and stores it if deemed important.
 * - SmartMemoryInput - The input type for the smartMemory function.
 * - SmartMemoryOutput - The return type for the smartMemory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartMemoryInputSchema = z.object({
  userInput: z.string().describe('The user input to analyze for importance.'),
  existingMemory: z.string().optional().describe('The existing memory to compare against.'),
});

export type SmartMemoryInput = z.infer<typeof SmartMemoryInputSchema>;

const SmartMemoryOutputSchema = z.object({
  shouldRemember: z.boolean().describe('Whether the user input is important enough to remember.'),
  updatedMemory: z.string().describe('The updated memory string, incorporating the new information if relevant.'),
  reason: z.string().describe('The reason for the decision on whether to remember the input.'),
});

export type SmartMemoryOutput = z.infer<typeof SmartMemoryOutputSchema>;

export async function smartMemory(input: SmartMemoryInput): Promise<SmartMemoryOutput> {
  return smartMemoryFlow(input);
}

const smartMemoryPrompt = ai.definePrompt({
  name: 'smartMemoryPrompt',
  input: {schema: SmartMemoryInputSchema},
  output: {schema: SmartMemoryOutputSchema},
  prompt: `You are an AI assistant that helps determine if user input should be stored in memory for later use.  Your goal is to help the user remember important details from their conversations without having to manually save them.

  Analyze the following user input and determine if it contains information that is important and should be stored in memory.  Consider things like reminders, important facts, key decisions, or updates to existing knowledge.  If the input refers to an entity or concept already in memory, incorporate it into the existing memory.

  User Input: {{{userInput}}}
  Existing Memory: {{{existingMemory}}}

  Respond with a JSON object indicating whether the input should be remembered, an updated memory string, and the reason for your decision. If the input should not be remembered, the updatedMemory field should return the existingMemory.
`,
});

const smartMemoryFlow = ai.defineFlow(
  {
    name: 'smartMemoryFlow',
    inputSchema: SmartMemoryInputSchema,
    outputSchema: SmartMemoryOutputSchema,
  },
  async input => {
    const {output} = await smartMemoryPrompt(input);
    return output!;
  }
);
