'use client';

import React, { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { Objective, ObjectiveFormData, ObjectiveLevel, KeyResultFormData } from '@/lib/types';
import { KeyResultInputArray } from './KeyResultInputArray';
import { AiSuggestKeyResults } from './AiSuggestKeyResults';
import { ScrollArea } from '@/components/ui/scroll-area';

const objectiveLevels: ObjectiveLevel[] = ['Company', 'Team', 'Individual', 'Personal'];

const keyResultSchema = z.object({
  title: z.string().min(1, 'Key Result title is required.'),
  targetValue: z.number().min(0, 'Target value must be non-negative.'),
  unit: z.string().min(1, 'Unit is required.'),
});

const objectiveFormSchema = z.object({
  title: z.string().min(1, 'Objective title is required.'),
  description: z.string().optional(),
  level: z.enum(objectiveLevels),
  keyResults: z.array(keyResultSchema).min(1, 'At least one Key Result is required.'),
});

interface OkrFormProps {
  onSubmit: (data: ObjectiveFormData) => void;
  onCancel: () => void;
  initialData?: Objective; // For editing
  isLoading?: boolean;
}

export function OkrForm({ onSubmit, onCancel, initialData, isLoading }: OkrFormProps) {
  const form = useForm<ObjectiveFormData>({
    resolver: zodResolver(objectiveFormSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description || '',
          level: initialData.level,
          keyResults: initialData.keyResults.map(kr => ({
            title: kr.title,
            targetValue: kr.targetValue,
            unit: kr.unit,
          })),
        }
      : {
          title: '',
          description: '',
          level: 'Personal',
          keyResults: [{ title: '', targetValue: 0, unit: '' }],
        },
  });

  const objectiveTitleWatcher = useWatch({
    control: form.control,
    name: 'title',
  });

  const [currentObjectiveTitleForAI, setCurrentObjectiveTitleForAI] = useState(objectiveTitleWatcher || '');

  useEffect(() => {
    // Debounce or use a button to update AI context to avoid too many re-renders if AI component reacts directly
    const handler = setTimeout(() => {
      setCurrentObjectiveTitleForAI(objectiveTitleWatcher);
    }, 500); // Delay for user to finish typing
    return () => clearTimeout(handler);
  }, [objectiveTitleWatcher]);


  const handleAddSuggestions = (suggestions: Pick<KeyResultFormData, 'title'>[]) => {
    suggestions.forEach(suggestion => {
      form.setValue('keyResults', [
        ...form.getValues('keyResults').filter(kr => kr.title !== ''), // Keep existing filled KRs
        { title: suggestion.title, targetValue: 0, unit: '' }
      ]);
    });
     // Trigger re-render of KeyResultInputArray if necessary or useFieldArray's append
     // A more robust way with useFieldArray:
     const currentKRs = form.getValues('keyResults').filter(kr => kr.title !== ''); // Remove empty ones first
     const newKRs = suggestions.map(s => ({ title: s.title, targetValue: 0, unit: '' }));
     form.reset({ // reset form to update field array correctly
        ...form.getValues(),
        keyResults: [...currentKRs, ...newKRs],
     });
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ScrollArea className="h-[calc(100vh-20rem)] md:h-[60vh] pr-6"> {/* Adjust height as needed */}
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Objective Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Achieve market leadership" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Briefly describe the objective" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select objective level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {objectiveLevels.map(level => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <AiSuggestKeyResults 
              objectiveTitle={currentObjectiveTitleForAI} 
              onAddSuggestions={handleAddSuggestions}
              disabled={isLoading}
            />

            <KeyResultInputArray control={form.control} errors={form.formState.errors} />
          </div>
        </ScrollArea>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (initialData ? 'Saving...' : 'Adding...') : (initialData ? 'Save Changes' : 'Add Objective')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
