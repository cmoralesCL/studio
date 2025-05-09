
'use client';

import React from 'react';
import type { Control, FieldErrors } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, PlusCircle } from 'lucide-react';
import type { ObjectiveFormData, TrackingFrequency } from '@/lib/types';
import { FormField, FormItem, FormControl, FormMessage, FormLabel as ShadcnFormLabel } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';


interface KeyResultInputArrayProps {
  control: Control<ObjectiveFormData>;
  errors: FieldErrors<ObjectiveFormData>;
  trackingFrequencies: TrackingFrequency[];
}

export function KeyResultInputArray({ control, errors, trackingFrequencies }: KeyResultInputArrayProps) {
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
                <ShadcnFormLabel htmlFor={field.name}>Title</ShadcnFormLabel>
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
                  <ShadcnFormLabel htmlFor={field.name}>Target Value</ShadcnFormLabel>
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
                  <ShadcnFormLabel htmlFor={field.name}>Unit</ShadcnFormLabel>
                  <FormControl>
                    <Input placeholder="e.g., %, users, $" {...field} />
                  </FormControl>
                  <FormMessage>{errors.keyResults?.[index]?.unit?.message}</FormMessage>
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name={`keyResults.${index}.trackingFrequency`}
              render={({ field }) => (
                <FormItem>
                  <ShadcnFormLabel>Tracking Frequency</ShadcnFormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <FormMessage>{errors.keyResults?.[index]?.trackingFrequency?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`keyResults.${index}.targetDate`}
              render={({ field }) => (
                <FormItem>
                  <ShadcnFormLabel htmlFor={field.name}>Target Date (Optional)</ShadcnFormLabel>
                  <FormControl>
                     <DatePicker
                        value={field.value ? new Date(field.value) : undefined}
                        onChange={(date) => field.onChange(date ? date.toISOString() : undefined)}
                        placeholder="Select target date"
                      />
                  </FormControl>
                  <FormMessage>{errors.keyResults?.[index]?.targetDate?.message}</FormMessage>
                </FormItem>
              )}
            />
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => append({ title: '', targetValue: 0, unit: '', trackingFrequency: 'once', targetDate: undefined })}
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
