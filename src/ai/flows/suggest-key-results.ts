// use server'

/**
 * @fileOverview Suggests potential Key Results based on a given Objective.
 *
 * - suggestKeyResults - A function that suggests key results based on an objective.
 * - SuggestKeyResultsInput - The input type for the suggestKeyResults function.
 * - SuggestKeyResultsOutput - The return type for the suggestKeyResults function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestKeyResultsInputSchema = z.object({
  objective: z.string().describe('The objective to generate key results for.'),
});
export type SuggestKeyResultsInput = z.infer<typeof SuggestKeyResultsInputSchema>;

const SuggestKeyResultsOutputSchema = z.object({
  keyResults: z.array(z.string()).describe('The suggested key results for the objective.'),
});
export type SuggestKeyResultsOutput = z.infer<typeof SuggestKeyResultsOutputSchema>;

export async function suggestKeyResults(input: SuggestKeyResultsInput): Promise<SuggestKeyResultsOutput> {
  return suggestKeyResultsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestKeyResultsPrompt',
  input: {schema: SuggestKeyResultsInputSchema},
  output: {schema: SuggestKeyResultsOutputSchema},
  prompt: `You are an expert in OKR (Objectives and Key Results) methodology. Given an objective, you will suggest 3-5 key results that are specific, measurable, achievable, relevant, and time-bound.

Objective: {{{objective}}}

Key Results:`,
});

const suggestKeyResultsFlow = ai.defineFlow(
  {
    name: 'suggestKeyResultsFlow',
    inputSchema: SuggestKeyResultsInputSchema,
    outputSchema: SuggestKeyResultsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
