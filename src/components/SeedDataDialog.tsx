import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SeedDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  onComplete: () => void;
}

const SeedDataDialog = ({ open, onOpenChange, userId, onComplete }: SeedDataDialogProps) => {
  const [loading, setLoading] = useState(false);

  const seedMeals = [
    { name: "Oatmeal with banana", calories: 350, protein: 12, carbs: 55, fat: 8 },
    { name: "Grilled chicken salad", calories: 420, protein: 35, carbs: 25, fat: 18 },
    { name: "Salmon with vegetables", calories: 480, protein: 38, carbs: 28, fat: 22 },
    { name: "Greek yogurt with berries", calories: 220, protein: 18, carbs: 28, fat: 5 },
    { name: "Turkey sandwich", calories: 380, protein: 28, carbs: 42, fat: 12 },
    { name: "Pasta with marinara", calories: 520, protein: 18, carbs: 78, fat: 14 },
    { name: "Protein smoothie", calories: 280, protein: 25, carbs: 32, fat: 6 },
    { name: "Scrambled eggs toast", calories: 340, protein: 22, carbs: 28, fat: 16 },
    { name: "Quinoa bowl", calories: 460, protein: 18, carbs: 62, fat: 15 },
    { name: "Tuna salad", calories: 320, protein: 32, carbs: 15, fat: 14 },
  ];

  const handleSeedData = async () => {
    try {
      setLoading(true);
      
      const today = new Date();
      const mealsToInsert = [];

      // Create meals for the past 7 days
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        // Add 2-3 random meals per day
        const mealsPerDay = Math.floor(Math.random() * 2) + 2; // 2 or 3 meals
        for (let j = 0; j < mealsPerDay; j++) {
          const randomMeal = seedMeals[Math.floor(Math.random() * seedMeals.length)];
          mealsToInsert.push({
            user_id: userId,
            food_name: randomMeal.name,
            calories: randomMeal.calories,
            protein: randomMeal.protein,
            carbs: randomMeal.carbs,
            fat: randomMeal.fat,
            quantity: 1,
            meal_date: dateStr,
          });
        }
      }

      const { error } = await supabase
        .from("meals")
        .insert(mealsToInsert);

      if (error) {
        toast.error("Failed to seed data");
        console.error("Error seeding meals:", error);
        return;
      }

      toast.success(`Successfully added ${mealsToInsert.length} meals for the past 7 days!`);
      onComplete();
      onOpenChange(false);
    } catch (error) {
      console.error("Error seeding data:", error);
      toast.error("Failed to seed data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Demo Data</DialogTitle>
          <DialogDescription>
            This will add sample meals for the past 7 days to help you visualize the trend chart.
            This is useful for testing and demo purposes.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p className="text-sm font-medium">What will be added:</p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>2-3 meals per day for the past 7 days</li>
              <li>Random healthy meals with accurate nutrition data</li>
              <li>Total of approximately 15-20 meal entries</li>
            </ul>
          </div>
          <div className="flex gap-3 justify-end">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleSeedData} disabled={loading}>
              {loading ? "Adding Data..." : "Add Demo Data"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SeedDataDialog;
