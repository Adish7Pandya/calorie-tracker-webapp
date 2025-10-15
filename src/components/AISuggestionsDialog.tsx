import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface AISuggestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCalories: number;
  goalCalories: number;
  recentMeals: string[];
}

const AISuggestionsDialog = ({
  open,
  onOpenChange,
  currentCalories,
  goalCalories,
  recentMeals,
}: AISuggestionsDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState("");

  const handleGetSuggestions = async () => {
    setLoading(true);
    setSuggestions("");

    try {
      const { data, error } = await supabase.functions.invoke('ai-suggest-meals', {
        body: {
          currentCalories,
          goalCalories,
          recentMeals,
        }
      });

      if (error) {
        if (error.message?.includes('429')) {
          toast.error("Rate limit exceeded. Please try again in a moment.");
        } else if (error.message?.includes('402')) {
          toast.error("AI service unavailable. Please add credits to continue.");
        } else {
          toast.error("Failed to get suggestions");
        }
        return;
      }

      if (data?.suggestions) {
        setSuggestions(data.suggestions);
      }
    } catch (error: any) {
      console.error("Error getting AI suggestions:", error);
      toast.error("Failed to get suggestions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            AI Meal Suggestions
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="p-4 bg-gradient-to-r from-primary/10 to-accent/10">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Current</p>
                <p className="text-2xl font-bold text-primary">{currentCalories}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Goal</p>
                <p className="text-2xl font-bold">{goalCalories}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Remaining</p>
                <p className="text-2xl font-bold text-accent">{Math.max(0, goalCalories - currentCalories)}</p>
              </div>
            </div>
          </Card>

          {!suggestions && !loading && (
            <Button
              onClick={handleGetSuggestions}
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
              size="lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Get AI Meal Suggestions
            </Button>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Generating personalized suggestions...</p>
            </div>
          )}

          {suggestions && !loading && (
            <Card className="p-6 bg-gradient-to-br from-card to-primary/5">
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-foreground">{suggestions}</div>
              </div>
              <Button
                onClick={handleGetSuggestions}
                variant="outline"
                className="w-full mt-6"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Get New Suggestions
              </Button>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AISuggestionsDialog;
