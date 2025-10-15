import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface MealListProps {
  meals: any[];
  onDeleteMeal: (mealId: string) => void;
}

const MealList = ({ meals, onDeleteMeal }: MealListProps) => {
  if (meals.length === 0) {
    return (
      <Card className="p-8 text-center shadow-soft">
        <p className="text-muted-foreground">No meals logged yet today</p>
        <p className="text-sm text-muted-foreground mt-1">Add your first meal to get started!</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 shadow-soft">
      <h3 className="font-semibold text-lg mb-4">Today's Meals</h3>
      <div className="space-y-3">
        {meals.map((meal) => (
          <div
            key={meal.id}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-card to-primary/5 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex-1">
              <p className="font-medium capitalize">{meal.food_name}</p>
              <div className="flex gap-3 mt-1 text-sm text-muted-foreground">
                <span>{Math.round(meal.calories)} cal</span>
                {meal.protein > 0 && <span>• {Math.round(meal.protein)}g protein</span>}
                {meal.carbs > 0 && <span>• {Math.round(meal.carbs)}g carbs</span>}
                {meal.fat > 0 && <span>• {Math.round(meal.fat)}g fat</span>}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDeleteMeal(meal.id)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default MealList;
