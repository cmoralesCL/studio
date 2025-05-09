'use client';

import React from 'react';
import type { Control, FieldErrors, Path } from 'react-hook-form'; // Import Path
import { useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, PlusCircle } from 'lucide-react';
import type { LifeOkrFormData, TrackingFrequency, KeyResultFormData } from '@/lib/types';
import { FormField, FormItem, FormControl, FormMessage, FormLabel as ShadcnFormLabel } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';

interface KeyResultInputArrayProps<TFieldValues extends LifeOkrFormData = LifeOkrFormData> { // Make generic for TFieldValues
  control: Control<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
  trackingFrequencies: TrackingFrequency[];
  // Use Path to ensure name is a valid path in TFieldValues for an array of KeyResultFormData-like objects
  name: Path<TFieldValues>; 
}


export function KeyResultInputArray<TFieldValues extends LifeOkrFormData = LifeOkrFormData>({ 
  control, 
  errors, 
  trackingFrequencies,
  name 
}: KeyResultInputArrayProps<TFieldValues>) {
  const { fields, append, remove } = useFieldArray({
    control,
    // @ts-ignore // `name` is now dynamically passed, TS might struggle with exact type match for complex paths
    name: name, 
  });

  // Helper to get nested errors
  const getNestedError = (index: number, fieldName: keyof KeyResultFormData | `subTasks.${'completed'|'total'}` | 'subTasksCompleted' | 'subTasksTotal') => {
    // @ts-ignore
    let pathSegments = name.split('.');
    let errorObject: any = errors;
    for (const segment of pathSegments) {
        errorObject = errorObject?.[segment];
        if (!errorObject) return undefined;
    }
    // @ts-ignore
    return errorObject?.[index]?.[fieldName]?.message || errorObject?.[index]?.subTasks?.[fieldName.split('.')[1]]?.message;

  };


  return (
    <div className="space-y-6">
      <Label className="text-base font-semibold">Habit OKRs (Key Results)</Label>
      {fields.map((field, index) => (
        <div key={field.id} className="p-4 border rounded-md shadow-sm space-y-3 bg-card/70">
          <div className="flex justify-between items-center">
            <Label htmlFor={`${name}.${index}.title`} className="text-sm font-medium">
              Habit OKR {index + 1}
            </Label>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
              aria-label="Remove Key Result"
              className="text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <FormField
            control={control}
            // @ts-ignore
            name={`${name}.${index}.title`}
            render={({ field: formField }) => ( // Renamed field to formField to avoid conflict
              <FormItem>
                <ShadcnFormLabel htmlFor={formField.name}>Title</ShadcnFormLabel>
                <FormControl>
                  <Textarea placeholder="e.g., Increase user engagement by 15%" {...formField} />
                </FormControl>
                <FormMessage>{getNestedError(index, 'title')}</FormMessage>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              // @ts-ignore
              name={`${name}.${index}.targetValue`}
              render={({ field: formField }) => (
                <FormItem>
                  <ShadcnFormLabel htmlFor={formField.name}>Target Value</ShadcnFormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 1000" {...formField} onChange={e => formField.onChange(parseFloat(e.target.value))} />
                  </FormControl>
                  <FormMessage>{getNestedError(index, 'targetValue')}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              // @ts-ignore
              name={`${name}.${index}.unit`}
              render={({ field: formField }) => (
                <FormItem>
                  <ShadcnFormLabel htmlFor={formField.name}>Unit</ShadcnFormLabel>
                  <FormControl>
                    <Input placeholder="e.g., %, users, $" {...formField} />
                  </FormControl>
                  <FormMessage>{getNestedError(index, 'unit')}</FormMessage>
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              // @ts-ignore
              name={`${name}.${index}.trackingFrequency`}
              render={({ field: formField }) => (
                <FormItem>
                  <ShadcnFormLabel>Tracking Frequency</ShadcnFormLabel>
                  <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tracking frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {trackingFrequencies.map(freq => (
                        <SelectItem key={freq} value={freq}>
                          {freq.charAt(0).toUpperCase() + freq.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage>{getNestedError(index, 'trackingFrequency')}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              // @ts-ignore
              name={`${name}.${index}.targetDate`}
              render={({ field: formField }) => (
                <FormItem>
                  <ShadcnFormLabel htmlFor={formField.name}>Target Date (Optional)</ShadcnFormLabel>
                  <FormControl>
                     <DatePicker
                        value={formField.value ? new Date(formField.value) : undefined}
                        onChange={(date) => formField.onChange(date ? date.toISOString() : undefined)}
                        placeholder="Select target date"
                      />
                  </FormControl>
                  <FormMessage>{getNestedError(index, 'targetDate')}</FormMessage>
                </FormItem>
              )}
            />
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              // @ts-ignore
              name={`${name}.${index}.tags`}
              render={({ field: formField }) => (
                <FormItem>
                  <ShadcnFormLabel htmlFor={formField.name}>Tags (comma-separated)</ShadcnFormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Product, Marketing" {...formField} />
                  </FormControl>
                  <FormMessage>{getNestedError(index, 'tags')}</FormMessage>
                </FormItem>
              )}
            />
             <FormField
              control={control}
              // @ts-ignore
              name={`${name}.${index}.assignees`}
              render={({ field: formField }) => (
                <FormItem>
                  <ShadcnFormLabel htmlFor={formField.name}>Assignees (comma-separated names)</ShadcnFormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Alice, Bob" {...formField} />
                  </FormControl>
                  <FormMessage>{getNestedError(index, 'assignees')}</FormMessage>
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              // @ts-ignore
              name={`${name}.${index}.subTasksCompleted`}
              render={({ field: formField }) => (
                <FormItem>
                  <ShadcnFormLabel htmlFor={formField.name}>Sub-tasks Completed</ShadcnFormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 2" {...formField} onChange={e => formField.onChange(parseInt(e.target.value, 10) || 0)} />
                  </FormControl>
                  <FormMessage>{getNestedError(index, 'subTasksCompleted') || getNestedError(index, 'subTasks.completed')}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              // @ts-ignore
              name={`${name}.${index}.subTasksTotal`}
              render={({ field: formField }) => (
                <FormItem>
                  <ShadcnFormLabel htmlFor={formField.name}>Sub-tasks Total</ShadcnFormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 5" {...formField} onChange={e => formField.onChange(parseInt(e.target.value, 10) || 0)} />
                  </FormControl>
                  <FormMessage>{getNestedError(index, 'subTasksTotal') || getNestedError(index, 'subTasks.total')}</FormMessage>
                </FormItem>
              )}
            />
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        // @ts-ignore
        onClick={() => append({ title: '', targetValue: 0, unit: '', trackingFrequency: 'once', targetDate: undefined, tags: '', assignees: '', subTasksCompleted: 0, subTasksTotal: 0 } as KeyResultFormData)}
        className="w-full"
      >
        <PlusCircle className="mr-2 h-4 w-4" /> Add Habit OKR (Key Result)
      </Button>
       {/* 
        // @ts-ignore
        errors[name]?.root && (
        // @ts-ignore
         <p className="text-sm font-medium text-destructive">{errors[name].root.message}</p>
      )}
       // @ts-ignore
       {errors[name] && !errors[name].root && typeof errors[name].message === 'string' && (
        // @ts-ignore
        <p className="text-sm font-medium text-destructive">{errors[name].message}</p>
      )} 
      */}
    </div>
  );
}