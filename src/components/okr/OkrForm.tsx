
'use client';

import React, { useState, useEffect } from 'react';
import { useForm, useWatch, useFieldArray } from 'react-hook-form'; // Added useFieldArray
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel as ShadcnFormLabel, FormMessage } from '@/components/ui/form'; // Renamed FormLabel to ShadcnFormLabel to avoid conflict
import { Label } from '@/components/ui/label'; // Added import for Label
import type { LifeOkr, LifeOkrFormData, AreaOkrFormData, KeyResultFormData, AreaOkrLevel, TrackingFrequency, OkrIcon } from '@/lib/types';
import { KeyResultInputArray } from './KeyResultInputArray'; 
import { AiSuggestKeyResults } from './AiSuggestKeyResults';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Target, Heart, Zap, Briefcase, Activity, Landmark, Users, Award, FolderArchive, Smile, BookOpen, DollarSign, Home, UsersRound, Brain, TrendingUp, ShieldCheck, PlusCircle, Trash2 } from 'lucide-react'; // Added PlusCircle, Trash2

// Available levels for Area OKRs
const areaOkrLevels: AreaOkrLevel[] = ['Company', 'Team', 'Individual', 'Personal'];
const trackingFrequencies: TrackingFrequency[] = ['once', 'daily', 'weekly', 'monthly', 'quarterly', 'annually'];
const okrIcons: OkrIcon[] = ['Target', 'Heart', 'Zap', 'Briefcase', 'Activity', 'Landmark', 'Users', 'Award', 'FolderArchive', 'Smile', 'BookOpen', 'DollarSign', 'Home', 'UsersRound', 'Brain', 'TrendingUp', 'ShieldCheck'];

const iconComponents: Record<OkrIcon, React.ElementType> = {
  Target, Heart, Zap, Briefcase, Activity, Landmark, Users, Award, FolderArchive, Smile, BookOpen, DollarSign, Home, UsersRound, Brain, TrendingUp, ShieldCheck,
  CheckCircle2: ShieldCheck, AlertTriangle: ShieldCheck, CalendarClock: ShieldCheck, ListTodo: ShieldCheck // Added dummy for type check, not used for selection
};

// Schema for KeyResult (Habit OKR)
const keyResultFormSchema = z.object({
  id: z.string().optional(), // For editing existing KRs
  title: z.string().min(1, 'Key Result title is required.'),
  targetValue: z.number().min(0, 'Target value must be non-negative.'),
  unit: z.string().min(1, 'Unit is required.'),
  trackingFrequency: z.enum(trackingFrequencies, { required_error: 'Tracking frequency is required.'}),
  targetDate: z.string().optional().nullable(),
  tags: z.string().optional().transform(val => val ? val.split(',').map(tag => tag.trim()).filter(tag => tag) : []),
  assignees: z.string().optional().transform(val => val ? val.split(',').map(name => `https://picsum.photos/seed/${name.trim().replace(/\s+/g, '_')}/40/40`).filter(url => url) : []),
  subTasksCompleted: z.number().optional().default(0),
  subTasksTotal: z.number().optional().default(0),
}).transform(data => ({
  ...data,
  subTasks: { completed: data.subTasksCompleted, total: data.subTasksTotal }
}));

// Schema for AreaOKR
const areaOkrFormSchema = z.object({
  id: z.string().optional(), // For editing existing AreaOKRs
  title: z.string().min(1, 'Area OKR title is required.'),
  description: z.string().optional(),
  level: z.enum(areaOkrLevels, {required_error: 'Area OKR level is required.'}),
  icon: z.enum(okrIcons).optional().default('Target'),
  keyResults: z.array(keyResultFormSchema).min(1, 'At least one Key Result (Habit OKR) is required for an Area OKR.'),
});

// Schema for LifeOKR (Top-Level)
const lifeOkrFormSchema = z.object({
  // LifeOKR ID is handled outside the form, managed by the parent during update/add
  title: z.string().min(1, 'Life OKR title is required.'),
  description: z.string().optional(),
  icon: z.enum(okrIcons).optional().default('Heart'),
  areaOkrs: z.array(areaOkrFormSchema).min(1, 'At least one Area OKR is required for a Life OKR.'),
});


interface OkrFormProps {
  onSubmit: (data: LifeOkrFormData) => void; 
  onCancel: () => void;
  initialData?: LifeOkr; 
  isLoading?: boolean;
}

export function OkrForm({ onSubmit, onCancel, initialData, isLoading }: OkrFormProps) {
  const form = useForm<z.infer<typeof lifeOkrFormSchema>>({
    resolver: zodResolver(lifeOkrFormSchema),
    defaultValues: initialData
      ? { // Map LifeOkr to LifeOkrFormData for the form
          title: initialData.title,
          description: initialData.description || '',
          icon: initialData.icon || 'Heart',
          areaOkrs: initialData.areaOkrs.map(areaOkr => ({
            id: areaOkr.id, // Preserve AreaOKR ID for potential future fine-grained updates
            title: areaOkr.title,
            description: areaOkr.description || '',
            level: areaOkr.level,
            icon: areaOkr.icon || 'Target',
            keyResults: areaOkr.keyResults.map(kr => ({
              id: kr.id, // Preserve KeyResult ID
              title: kr.title,
              targetValue: kr.targetValue,
              unit: kr.unit,
              trackingFrequency: kr.trackingFrequency,
              targetDate: kr.targetDate || undefined,
              tags: kr.tags?.join(', ') || '',
              assignees: kr.assignees?.map(url => {
                const parts = url.split('/seed/');
                if (parts.length > 1) {
                    const seedPart = parts[1].split('/')[0];
                    return seedPart.replace(/_/g, ' ');
                }
                return ''; // Fallback if URL format is unexpected
              }).join(', ') || '',
              subTasksCompleted: kr.subTasks?.completed || 0,
              subTasksTotal: kr.subTasks?.total || 0,
            })),
          })),
        }
      : { 
          title: '',
          description: '',
          icon: 'Heart',
          areaOkrs: [{ 
            title: '',
            description: '',
            level: 'Personal',
            icon: 'Target',
            keyResults: [{ title: '', targetValue: 0, unit: '', trackingFrequency: 'once', targetDate: undefined, tags: '', assignees: '', subTasksCompleted: 0, subTasksTotal: 0 }],
          }],
        },
  });

  const { fields: areaOkrFields, append: appendAreaOkr, remove: removeAreaOkr } = useFieldArray({
    control: form.control,
    name: "areaOkrs",
  });

  const [activeAreaOkrIndexForAI, setActiveAreaOkrIndexForAI] = useState<number | null>(null);
  const watchedAreaOkrTitles = useWatch({ control: form.control, name: "areaOkrs" });

  const handleAddSuggestionsToAreaOkr = (areaIndex: number, suggestions: Pick<KeyResultFormData, 'title'>[]) => {
    const currentKRs = form.getValues(`areaOkrs.${areaIndex}.keyResults`).filter(kr => kr.title !== '');
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
    form.setValue(`areaOkrs.${areaIndex}.keyResults`, [...currentKRs, ...newKRs]);
  };
  
  const handleFormSubmit = (values: z.infer<typeof lifeOkrFormSchema>) => {
    // The Zod schema already transforms tags and assignees into arrays of strings.
    // The subTasks are also transformed.
    // The IDs (if present from initialData) are part of `values`.
    // The parent `handleUpdateLifeOkr` will be responsible for using the top-level `LifeOkr.id`.
    onSubmit(values as LifeOkrFormData);
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
                  <ShadcnFormLabel className="text-lg">Life OKR Title</ShadcnFormLabel>
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
                  <ShadcnFormLabel>Life OKR Description (Optional)</ShadcnFormLabel>
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
                    <ShadcnFormLabel>Life OKR Icon</ShadcnFormLabel>
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
            
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Area OKRs</Label>
              {areaOkrFields.map((areaField, areaIndex) => (
                <div key={areaField.id} className="p-4 border rounded-md shadow-sm space-y-3 bg-card/50">
                  <div className="flex justify-between items-center">
                    <Label className="text-md font-semibold">Area OKR {areaIndex + 1}</Label>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeAreaOkr(areaIndex)} className="text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormField
                    control={form.control}
                    name={`areaOkrs.${areaIndex}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <ShadcnFormLabel>Title</ShadcnFormLabel>
                        <FormControl><Input placeholder="e.g., Improve Physical Fitness" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`areaOkrs.${areaIndex}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <ShadcnFormLabel>Description (Optional)</ShadcnFormLabel>
                        <FormControl><Textarea placeholder="Describe this area objective" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`areaOkrs.${areaIndex}.level`}
                      render={({ field }) => (
                        <FormItem>
                          <ShadcnFormLabel>Level</ShadcnFormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger></FormControl>
                            <SelectContent>{areaOkrLevels.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`areaOkrs.${areaIndex}.icon`}
                      render={({ field }) => (
                        <FormItem>
                          <ShadcnFormLabel>Icon</ShadcnFormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select an icon" /></SelectTrigger></FormControl>
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
                  </div>
                  
                  <AiSuggestKeyResults 
                    objectiveTitle={watchedAreaOkrTitles?.[areaIndex]?.title || ''}
                    onAddSuggestions={(suggestions) => handleAddSuggestionsToAreaOkr(areaIndex, suggestions)}
                    disabled={isLoading || !watchedAreaOkrTitles?.[areaIndex]?.title}
                  />

                  <KeyResultInputArray 
                    control={form.control}
                    // @ts-ignore Property 'areaOkrs' does not exist on type 'FieldErrorsImpl<DeepRequired...'. It does.
                    errors={form.formState.errors.areaOkrs?.[areaIndex]?.keyResults || {}}
                    trackingFrequencies={trackingFrequencies}
                    name={`areaOkrs.${areaIndex}.keyResults`}
                  />
                   {/* @ts-ignore */}
                  {form.formState.errors.areaOkrs?.[areaIndex]?.keyResults?.message && (
                     // @ts-ignore
                    <p className="text-sm font-medium text-destructive">{form.formState.errors.areaOkrs?.[areaIndex]?.keyResults.message}</p>
                  )}
                   {/* @ts-ignore */}
                  {form.formState.errors.areaOkrs?.[areaIndex]?.keyResults?.root?.message && (
                     // @ts-ignore
                    <p className="text-sm font-medium text-destructive">{form.formState.errors.areaOkrs?.[areaIndex]?.keyResults.root.message}</p>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => appendAreaOkr({ title: '', description: '', level: 'Personal', icon: 'Target', keyResults: [{ title: '', targetValue: 0, unit: '', trackingFrequency: 'once', subTasksCompleted: 0, subTasksTotal: 0 }] })}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Area OKR
              </Button>
              {form.formState.errors.areaOkrs?.message && (
                 <p className="text-sm font-medium text-destructive">{form.formState.errors.areaOkrs.message}</p>
              )}
              {form.formState.errors.areaOkrs?.root?.message && (
                 <p className="text-sm font-medium text-destructive">{form.formState.errors.areaOkrs.root.message}</p>
              )}
            </div>
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

