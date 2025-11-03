import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";

interface AddMealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMealAdded: () => void;
  userId: string;
}

const AddMealDialog = ({ open, onOpenChange, onMealAdded, userId }: AddMealDialogProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [manualEntry, setManualEntry] = useState({
    food_name: "",
    calories: "",
    quantity: "1",
    protein: "0",
    carbs: "0",
    fat: "0",
  });
  const [adding, setAdding] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke('search-nutrition', {
        body: { query: searchQuery }
      });

      if (error) throw error;

      if (data?.foods) {
        setSearchResults(data.foods);
      } else {
        toast.error("No results found");
      }
    } catch (error: any) {
      toast.error("Failed to search nutrition data");
      console.error(error);
    } finally {
      setSearching(false);
    }
  };

  const handleAddFromSearch = async (food: any) => {
    setAdding(true);
    try {
      const { error } = await supabase.from("meals").insert([{
        user_id: userId,
        food_name: food.name,
        calories: food.calories,
        protein: food.protein || 0,
        carbs: food.carbs || 0,
        fat: food.fat || 0,
      }] as any);

      if (error) throw error;

      toast.success(`${food.name} added!`);
      onMealAdded();
      setSearchQuery("");
      setSearchResults([]);
    } catch (error) {
      toast.error("Failed to add meal");
    } finally {
      setAdding(false);
    }
  };

  const handleManualAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const { error } = await supabase.from("meals").insert([{
        user_id: userId,
        food_name: manualEntry.food_name,
        calories: Number(manualEntry.calories),
        protein: Number(manualEntry.protein),
        carbs: Number(manualEntry.carbs),
        fat: Number(manualEntry.fat),
      }] as any);

      if (error) throw error;

      toast.success("Meal added!");
      onMealAdded();
      setManualEntry({
        food_name: "",
        calories: "",
        quantity: "1",
        protein: "0",
        carbs: "0",
        fat: "0",
      });
    } catch (error) {
      toast.error("Failed to add meal");
    } finally {
      setAdding(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add Meal</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search Section */}
          <div>
            <Label htmlFor="search" className="text-base font-semibold mb-3 block">
              Search Nutrition Database
            </Label>
            <div className="flex gap-2">
              <Input
                id="search"
                placeholder="e.g., 1 cup rice, 100g chicken breast"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button
                onClick={handleSearch}
                disabled={searching || !searchQuery.trim()}
                className="bg-gradient-to-r from-primary to-accent"
              >
                <Search className="w-4 h-4 mr-2" />
                {searching ? "Searching..." : "Search"}
              </Button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-4 space-y-2">
                {searchResults.map((food, index) => (
                  <Card key={index} className="p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                    <div>
                      <p className="font-medium capitalize">{food.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {food.serving_qty} {food.serving_unit} • {food.calories} cal
                        {food.protein > 0 && ` • ${food.protein}g protein`}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddFromSearch(food)}
                      disabled={adding}
                      className="bg-gradient-to-r from-primary to-accent"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or enter manually</span>
            </div>
          </div>

          {/* Manual Entry Form */}
          <form onSubmit={handleManualAdd} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="food_name">Food Name *</Label>
                <Input
                  id="food_name"
                  value={manualEntry.food_name}
                  onChange={(e) => setManualEntry({ ...manualEntry, food_name: e.target.value })}
                  required
                  placeholder="e.g., Grilled Chicken"
                />
              </div>

              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={manualEntry.quantity}
                  onChange={(e) => setManualEntry({ ...manualEntry, quantity: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="calories">Calories *</Label>
                <Input
                  id="calories"
                  type="number"
                  min="0"
                  value={manualEntry.calories}
                  onChange={(e) => setManualEntry({ ...manualEntry, calories: e.target.value })}
                  required
                  placeholder="250"
                />
              </div>

              <div>
                <Label htmlFor="protein">Protein (g)</Label>
                <Input
                  id="protein"
                  type="number"
                  min="0"
                  value={manualEntry.protein}
                  onChange={(e) => setManualEntry({ ...manualEntry, protein: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="carbs">Carbs (g)</Label>
                <Input
                  id="carbs"
                  type="number"
                  min="0"
                  value={manualEntry.carbs}
                  onChange={(e) => setManualEntry({ ...manualEntry, carbs: e.target.value })}
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="fat">Fat (g)</Label>
                <Input
                  id="fat"
                  type="number"
                  min="0"
                  value={manualEntry.fat}
                  onChange={(e) => setManualEntry({ ...manualEntry, fat: e.target.value })}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-accent"
              disabled={adding}
            >
              <Plus className="w-4 h-4 mr-2" />
              {adding ? "Adding..." : "Add Meal"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMealDialog;
