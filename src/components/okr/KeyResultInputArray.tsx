'use client';

import React from 'react';
import type { Control, FieldErrors } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, PlusCircle } from 'lucide-react';
import type { ObjectiveFormData } from '@/lib/types';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

interface KeyResultInputArrayProps {
  control: Control<ObjectiveFormData>;
  errors: FieldErrors<ObjectiveFormData>;
}

export function KeyResultInputArray({ control, errors }: KeyResultInputArrayProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'keyResults',
  });

  return (
    <div className="space-y-6">
      <Label className="text-lg font-semibold">Key Results</Label>
      {fields.map((field, index) => (
        <div key={field.id} className="p-4 border rounded-md shadow-sm space-y-3 bg-card/50">
          <div className="flex justify-between items-center">
            <Label htmlFor={`keyResults.${index}.title`} className="text-md font-medium">
              Key Result {index + 1}
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
            name={`keyResults.${index}.title`}
            render={({ field }) => (
              <FormItem>
                <Label htmlFor={field.name}>Title</Label>
                <FormControl>
                  <Textarea placeholder="e.g., Increase user engagement by 15%" {...field} />
                </FormControl>
                <FormMessage>{errors.keyResults?.[index]?.title?.message}</FormMessage>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name={`keyResults.${index}.targetValue`}
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor={field.name}>Target Value</Label>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 1000" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                  </FormControl>
                  <FormMessage>{errors.keyResults?.[index]?.targetValue?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`keyResults.${index}.unit`}
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor={field.name}>Unit</Label>
                  <FormControl>
                    <Input placeholder="e.g., %, users, $" {...field} />
                  </FormControl>
                  <FormMessage>{errors.keyResults?.[index]?.unit?.message}</FormMessage>
                </FormItem>
              )}
            />
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => append({ title: '', targetValue: 0, unit: '' })}
        className="w-full"
      >
        <PlusCircle className="mr-2 h-4 w-4" /> Add Key Result
      </Button>
      {errors.keyResults?.root && (
         <p className="text-sm font-medium text-destructive">{errors.keyResults.root.message}</p>
      )}
    </div>
  );
}
