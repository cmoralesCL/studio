'use server';
import type { SuggestKeyResultsInput } from '@/ai/flows/suggest-key-results';
import { suggestKeyResults as suggestKeyResultsFlow } from '@/ai/flows/suggest-key-results';

export async function suggestKeyResultsAction(objectiveTitle: string): Promise<string[]> {
  try {
    const input: SuggestKeyResultsInput = { objective: objectiveTitle };
    // console.log('Calling AI flow with input:', input); // For debugging
    const result = await suggestKeyResultsFlow(input);
    // console.log('AI flow result:', result); // For debugging
    return result.keyResults;
  } catch (error) {
    console.error("Error suggesting key results:", error);
    // Consider how to propagate this error to the client more gracefully
    // For now, returning an empty array or throwing the error
    // throw new Error('Failed to suggest key results.');
    return [];
  }
}
