'use client';

import type { Dispatch, SetStateAction } from 'react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { suggestKeyResultsAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import type { KeyResultFormData } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface AiSuggestKeyResultsProps {
  objectiveTitle: string;
  onAddSuggestions: (suggestions: Pick<KeyResultFormData, 'title'>[]) => void;
  disabled?: boolean;
}

export function AiSuggestKeyResults({ objectiveTitle, onAddSuggestions, disabled }: AiSuggestKeyResultsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSuggestKeyResults = async () => {
    if (!objectiveTitle.trim()) {
      toast({
        title: 'Objective Title Required',
        description: 'Please enter an objective title to get suggestions.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setSuggestions([]);
    setSelectedSuggestions([]);
    try {
      const results = await suggestKeyResultsAction(objectiveTitle);
      if (results.length > 0) {
        setSuggestions(results);
        toast({
          title: 'Suggestions Loaded',
          description: `Found ${results.length} key result suggestions.`,
        });
      } else {
        toast({
          title: 'No Suggestions Found',
          description: 'The AI could not generate suggestions for this objective. Try rephrasing or be more specific.',
          variant: 'default'
        });
      }
    } catch (error) {
      toast({
        title: 'Error Fetching Suggestions',
        description: (error as Error).message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSuggestion = (suggestionTitle: string, checked: boolean) => {
    setSelectedSuggestions(prev =>
      checked ? [...prev, suggestionTitle] : prev.filter(s => s !== suggestionTitle)
    );
  };

  const handleAddSelectedToForm = () => {
    const suggestionsToAdd = selectedSuggestions.map(title => ({ title }));
    onAddSuggestions(suggestionsToAdd);
    // Optionally clear suggestions after adding
    // setSuggestions([]); 
    // setSelectedSuggestions([]);
    toast({
        title: 'Suggestions Added',
        description: `${suggestionsToAdd.length} key results added to the form.`,
    });
  };

  return (
    <div className="space-y-4 my-4">
      <Button
        type="button"
        onClick={handleSuggestKeyResults}
        disabled={isLoading || disabled || !objectiveTitle.trim()}
        variant="outline"
        className="w-full"
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-4 w-4 text-yellow-500" />
        )}
        Suggest Key Results with AI
      </Button>

      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">AI Suggested Key Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Select the suggestions you'd like to add to your Key Results.
            </p>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 rounded-md border hover:bg-accent/50">
                  <Checkbox
                    id={`suggestion-${index}`}
                    checked={selectedSuggestions.includes(suggestion)}
                    onCheckedChange={(checked) => handleToggleSuggestion(suggestion, !!checked)}
                  />
                  <Label htmlFor={`suggestion-${index}`} className="font-normal flex-1 cursor-pointer">
                    {suggestion}
                  </Label>
                </div>
              ))}
            </div>
            {selectedSuggestions.length > 0 && (
              <Button type="button" onClick={handleAddSelectedToForm} className="w-full mt-2" size="sm">
                Add Selected ({selectedSuggestions.length}) to Form
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
