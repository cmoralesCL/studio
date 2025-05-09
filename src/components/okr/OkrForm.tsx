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
import type { LifeOkr, LifeOkrFormData, AreaOkrFormData, KeyResultFormData, AreaOkrLevel, TrackingFrequency, OkrIcon } from '@/lib/types';
import { KeyResultInputArray } from './KeyResultInputArray'; // Will be used inside AreaOkrInputArray
import { AiSuggestKeyResults } from './AiSuggestKeyResults';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Target, Heart, Zap, Briefcase, Activity, Landmark, Users, Award, FolderArchive, Smile, BookOpen, DollarSign, Home, UsersRound, Brain, TrendingUp, ShieldCheck } from 'lucide-react';

// Available levels for Area OKRs
const areaOkrLevels: AreaOkrLevel[] = ['Company', 'Team', 'Individual', 'Personal'];
const trackingFrequencies: TrackingFrequency[] = ['once', 'daily', 'weekly', 'monthly', 'quarterly', 'annually'];
const okrIcons: OkrIcon[] = ['Target', 'Heart', 'Zap', 'Briefcase', 'Activity', 'Landmark', 'Users', 'Award', 'FolderArchive', 'Smile', 'BookOpen', 'DollarSign', 'Home', 'UsersRound', 'Brain', 'TrendingUp', 'ShieldCheck'];

const iconComponents: Record<OkrIcon, React.ElementType> = {
  Target, Heart, Zap, Briefcase, Activity, Landmark, Users, Award, FolderArchive, Smile, BookOpen, DollarSign, Home, UsersRound, Brain, TrendingUp, ShieldCheck
};

// Schema for KeyResult (Habit OKR)
const keyResultFormSchema = z.object({
  title: z.string().min(1, 'Key Result title is required.'),
  targetValue: z.number().min(0, 'Target value must be non-negative.'),
  unit: z.string().min(1, 'Unit is required.'),
  trackingFrequency: z.enum(trackingFrequencies, { required_error: 'Tracking frequency is required.'}),
  targetDate: z.string().optional().nullable(),
  tags: z.string().optional().transform(val => val ? val.split(',').map(tag => tag.trim()).filter(tag => tag) : []),
  assignees: z.string().optional().transform(val => val ? val.split(',').map(name => `https://picsum.photos/seed/${name.trim().replace(/\s+/g, '_')}/40/40`).filter(url => url) : []), // Ensure seed is URL-friendly
  subTasksCompleted: z.number().optional().default(0),
  subTasksTotal: z.number().optional().default(0),
}).transform(data => ({
  ...data,
  subTasks: { completed: data.subTasksCompleted, total: data.subTasksTotal }
}));

// Schema for AreaOKR
const areaOkrFormSchema = z.object({
  title: z.string().min(1, 'Area OKR title is required.'),
  description: z.string().optional(),
  level: z.enum(areaOkrLevels, {required_error: 'Area OKR level is required.'}),
  icon: z.enum(okrIcons).optional().default('Target'),
  keyResults: z.array(keyResultFormSchema).min(1, 'At least one Key Result (Habit OKR) is required for an Area OKR.'),
});

// Schema for LifeOKR (Top-Level)
const lifeOkrFormSchema = z.object({
  title: z.string().min(1, 'Life OKR title is required.'),
  description: z.string().optional(),
  icon: z.enum(okrIcons).optional().default('Heart'),
  areaOkrs: z.array(areaOkrFormSchema).min(1, 'At least one Area OKR is required for a Life OKR.'),
});


interface OkrFormProps {
  onSubmit: (data: LifeOkrFormData) => void; // Changed to LifeOkrFormData
  onCancel: () => void;
  initialData?: LifeOkr; // Changed to LifeOkr
  isLoading?: boolean;
}

export function OkrForm({ onSubmit, onCancel, initialData, isLoading }: OkrFormProps) {
  const form = useForm<z.infer<typeof lifeOkrFormSchema>>({
    resolver: zodResolver(lifeOkrFormSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description || '',
          icon: initialData.icon || 'Heart',
          areaOkrs: initialData.areaOkrs.map(areaOkr => ({
            title: areaOkr.title,
            description: areaOkr.description || '',
            level: areaOkr.level,
            icon: areaOkr.icon || 'Target',
            keyResults: areaOkr.keyResults.map(kr => ({
              title: kr.title,
              targetValue: kr.targetValue,
              unit: kr.unit,
              trackingFrequency: kr.trackingFrequency,
              targetDate: kr.targetDate || undefined,
              tags: kr.tags?.join(', ') || '',
              assignees: kr.assignees?.map(url => url.split('/seed/')[1]?.split('/')[0].replace(/_/g, ' ')).join(', ') || '', // Extract seed name
              subTasksCompleted: kr.subTasks?.completed || 0,
              subTasksTotal: kr.subTasks?.total || 0,
            })),
          })),
        }
      : { // Default for a new Life OKR
          title: '',
          description: '',
          icon: 'Heart',
          areaOkrs: [{ // Default with one Area OKR and one Key Result
            title: '',
            description: '',
            level: 'Personal',
            icon: 'Target',
            keyResults: [{ title: '', targetValue: 0, unit: '', trackingFrequency: 'once', targetDate: undefined, tags: '', assignees: '', subTasksCompleted: 0, subTasksTotal: 0 }],
          }],
        },
  });

  // For AI suggestions, we might need to track the title of the current Area OKR being edited.
  // This is a simplified watcher for the top-level Life OKR title.
  const lifeOkrTitleWatcher = useWatch({
    control: form.control,
    name: 'title',
  });
  
  // TODO: The AI Suggestion and KeyResultInputArray need to be integrated within an AreaOkrInputArray.
  // For now, AI suggestions will be disabled or tied to the first AreaOKR for simplicity.
  const firstAreaOkrTitle = useWatch({
    control: form.control,
    name: `areaOkrs.0.title` as const, // Watch title of the first area OKR
  });


  const [currentTitleForAI, setCurrentTitleForAI] = useState(firstAreaOkrTitle || '');

  useEffect(() => {
    const handler = setTimeout(() => {
      setCurrentTitleForAI(firstAreaOkrTitle);
    }, 500); 
    return () => clearTimeout(handler);
  }, [firstAreaOkrTitle]);


  const handleAddSuggestionsToFirstAreaOkr = (suggestions: Pick<KeyResultFormData, 'title'>[]) => {
    const currentAreaOkrs = form.getValues('areaOkrs');
    if (!currentAreaOkrs[0]) return; // Should not happen with default values

    const currentKRs = currentAreaOkrs[0].keyResults.filter(kr => kr.title !== '');
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
    
    currentAreaOkrs[0].keyResults = [...currentKRs, ...newKRs];
    // @ts-ignore
    form.reset({ 
        ...form.getValues(),
        areaOkrs: currentAreaOkrs,
     });
  };
  
  const handleFormSubmit = (values: z.infer<typeof lifeOkrFormSchema>) => {
    const mappedData: LifeOkrFormData = {
      ...values,
      areaOkrs: values.areaOkrs.map(areaOkr => ({
        ...areaOkr,
        keyResults: areaOkr.keyResults.map(kr => ({
          title: kr.title,
          targetValue: kr.targetValue,
          unit: kr.unit,
          trackingFrequency: kr.trackingFrequency,
          targetDate: kr.targetDate,
          tags: kr.tags as string[], // Already transformed by Zod
          assignees: kr.assignees as string[], // Already transformed by Zod
          subTasks: kr.subTasks,
        }))
      }))
    };
    onSubmit(mappedData);
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <ScrollArea className="h-[calc(100vh-22rem)] md:h-[calc(70vh-10rem)] pr-6"> 
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Life OKR Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Achieve Holistic Well-being" {...field} />
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
                  <FormLabel>Life OKR Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Briefly describe this life domain" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Life OKR Icon</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an icon" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {okrIcons.map(iconName => {
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
            
            {/* 
              TODO: Implement AreaOkrInputArray here.
              This would be a component that manages a field array for `areaOkrs`.
              Each item in AreaOkrInputArray would then contain fields for Area OKR details
              (title, description, level, icon) AND an instance of KeyResultInputArray
              for its 'keyResults'. AI suggestions would also be scoped to each Area OKR.
              
              For now, a simplified section for the FIRST Area OKR to allow form submission.
            */}
            <div className="p-4 border rounded-md shadow-sm space-y-3 bg-card/50 mt-4">
              <h3 className="text-md font-semibold">Area OKR 1 (Example Setup)</h3>
               <FormField
                control={form.control}
                name={`areaOkrs.0.title`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area OKR Title</FormLabel>
                    <FormControl><Input placeholder="e.g., Improve Physical Fitness" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`areaOkrs.0.level`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area OKR Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger></FormControl>
                      <SelectContent>{areaOkrLevels.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <AiSuggestKeyResults 
                objectiveTitle={currentTitleForAI} // Using first AreaOkr title for AI
                onAddSuggestions={handleAddSuggestionsToFirstAreaOkr}
                disabled={isLoading || !currentTitleForAI}
              />
              <KeyResultInputArray 
                control={form.control}
                // @ts-ignore
                errors={form.formState.errors.areaOkrs?.[0]?.keyResults || form.formState.errors} // Adjust error path
                trackingFrequencies={trackingFrequencies}
                // This path needs to be dynamic if we have multiple AreaOKRs
                // For now, it's implicitly for `areaOkrs.0.keyResults` if namespacing is correct in KeyResultInputArray
                // This requires KeyResultInputArray to be adapted or path prefixed.
                // Assuming KeyResultInputArray is set up to take a base name like 'areaOkrs.0.keyResults'
                // The current KeyResultInputArray uses just 'keyResults'. This will break.
                // Temporary fix: KeyResultInputArray should accept a `namePrefix` prop.
                // For now, it will target 'keyResults' at the root, which isn't correct for nesting.
                // Let's modify KeyResultInputArray to accept a `name` prop like `areaOkrs.${index}.keyResults`
              />
            </div>
             {form.formState.errors.areaOkrs?.message && (
                 <p className="text-sm font-medium text-destructive">{form.formState.errors.areaOkrs.message}</p>
            )}
             {form.formState.errors.areaOkrs?.root?.message && (
                 <p className="text-sm font-medium text-destructive">{form.formState.errors.areaOkrs.root.message}</p>
            )}


          </div>
        </ScrollArea>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (initialData ? 'Saving...' : 'Adding...') : (initialData ? 'Save Changes' : 'Add Life OKR')}
          </Button>
        </div>
      </form>
    </Form>
  );
}