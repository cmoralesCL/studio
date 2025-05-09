
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
import type { Objective, ObjectiveFormData, ObjectiveLevel, KeyResultFormData, TrackingFrequency } from '@/lib/types';
import { KeyResultInputArray } from './KeyResultInputArray';
import { AiSuggestKeyResults } from './AiSuggestKeyResults';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Target, Heart, Zap, Briefcase, Activity, Landmark, Users, Award, FolderArchive } from 'lucide-react';


const objectiveLevels: ObjectiveLevel[] = ['Company', 'Team', 'Individual', 'Personal'];
const trackingFrequencies: TrackingFrequency[] = ['once', 'daily', 'weekly', 'monthly', 'quarterly', 'annually'];
const objectiveIcons: NonNullable<Objective['icon']>[] = ['Target', 'Heart', 'Zap', 'Briefcase', 'Activity', 'Landmark', 'Users', 'Award', 'FolderArchive'];

const iconComponents: Record<NonNullable<Objective['icon']>, React.ElementType> = {
  Target, Heart, Zap, Briefcase, Activity, Landmark, Users, Award, FolderArchive
};

const keyResultSchema = z.object({
  title: z.string().min(1, 'Key Result title is required.'),
  targetValue: z.number().min(0, 'Target value must be non-negative.'),
  unit: z.string().min(1, 'Unit is required.'),
  trackingFrequency: z.enum(trackingFrequencies, { required_error: 'Tracking frequency is required.'}),
  targetDate: z.string().optional().nullable(),
  tags: z.string().optional().transform(val => val ? val.split(',').map(tag => tag.trim()).filter(tag => tag) : []), // Comma-separated string to array
  assignees: z.string().optional().transform(val => val ? val.split(',').map(name => `https://picsum.photos/seed/${name.trim()}/40/40`).filter(url => url) : []),
  subTasksCompleted: z.number().optional().default(0),
  subTasksTotal: z.number().optional().default(0),
}).transform(data => ({
  ...data,
  subTasks: { completed: data.subTasksCompleted, total: data.subTasksTotal }
}));


const objectiveFormSchema = z.object({
  title: z.string().min(1, 'Objective title is required.'),
  description: z.string().optional(),
  level: z.enum(objectiveLevels),
  icon: z.enum(objectiveIcons).optional().default('Target'),
  keyResults: z.array(keyResultSchema).min(1, 'At least one Key Result is required.'),
});


interface OkrFormProps {
  onSubmit: (data: ObjectiveFormData) => void;
  onCancel: () => void;
  initialData?: Objective; 
  isLoading?: boolean;
}

export function OkrForm({ onSubmit, onCancel, initialData, isLoading }: OkrFormProps) {
  const form = useForm<z.infer<typeof objectiveFormSchema>>({ // Use inferred type from Zod schema
    resolver: zodResolver(objectiveFormSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description || '',
          level: initialData.level,
          icon: initialData.icon || 'Target',
          keyResults: initialData.keyResults.map(kr => ({
            title: kr.title,
            targetValue: kr.targetValue,
            unit: kr.unit,
            trackingFrequency: kr.trackingFrequency,
            targetDate: kr.targetDate || undefined,
            tags: kr.tags?.join(', ') || '',
            assignees: kr.assignees?.map(url => url.split('/')[4]).join(', ') || '', // Extract seed name
            subTasksCompleted: kr.subTasks?.completed || 0,
            subTasksTotal: kr.subTasks?.total || 0,
          })),
        }
      : {
          title: '',
          description: '',
          level: 'Personal',
          icon: 'Target',
          keyResults: [{ title: '', targetValue: 0, unit: '', trackingFrequency: 'once', targetDate: undefined, tags: '', assignees: '', subTasksCompleted: 0, subTasksTotal: 0 }],
        },
  });

  const objectiveTitleWatcher = useWatch({
    control: form.control,
    name: 'title',
  });

  const [currentObjectiveTitleForAI, setCurrentObjectiveTitleForAI] = useState(objectiveTitleWatcher || '');

  useEffect(() => {
    const handler = setTimeout(() => {
      setCurrentObjectiveTitleForAI(objectiveTitleWatcher);
    }, 500); 
    return () => clearTimeout(handler);
  }, [objectiveTitleWatcher]);


  const handleAddSuggestions = (suggestions: Pick<KeyResultFormData, 'title'>[]) => {
    const currentKRs = form.getValues('keyResults').filter(kr => kr.title !== ''); 
    const newKRs = suggestions.map(s => ({ 
        title: s.title, 
        targetValue: 0, 
        unit: '', 
        trackingFrequency: 'once' as TrackingFrequency,
        targetDate: undefined,
        tags: '',
        assignees: '',
        subTasksCompleted: 0,
        subTasksTotal: 0,
    }));
    // @ts-ignore // Zod transform makes type complex for reset
    form.reset({ 
        ...form.getValues(),
        keyResults: [...currentKRs, ...newKRs],
     });
  };
  
  const handleFormSubmit = (values: z.infer<typeof objectiveFormSchema>) => {
    // Map to ObjectiveFormData, especially for keyResults
    const mappedData: ObjectiveFormData = {
      ...values,
      keyResults: values.keyResults.map(kr => ({
        title: kr.title,
        targetValue: kr.targetValue,
        unit: kr.unit,
        trackingFrequency: kr.trackingFrequency,
        targetDate: kr.targetDate,
        tags: kr.tags as string[], // Already transformed by Zod
        assignees: kr.assignees as string[], // Already transformed by Zod
        subTasks: kr.subTasks,
      }))
    };
    onSubmit(mappedData);
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <ScrollArea className="h-[calc(100vh-20rem)] md:h-[60vh] pr-6"> 
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an icon" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {objectiveIcons.map(iconName => {
                          const IconComponent = iconComponents[iconName];
                          return (
                            <SelectItem key={iconName} value={iconName}>
                              <div className="flex items-center">
                                <IconComponent className="mr-2 h-4 w-4" />
                                {iconName}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <AiSuggestKeyResults 
              objectiveTitle={currentObjectiveTitleForAI} 
              onAddSuggestions={handleAddSuggestions}
              disabled={isLoading}
            />

            <KeyResultInputArray 
              control={form.control} 
              // @ts-ignore
              errors={form.formState.errors} 
              trackingFrequencies={trackingFrequencies}
            />
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

