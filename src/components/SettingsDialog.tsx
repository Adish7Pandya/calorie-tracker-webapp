import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  currentGoal: number;
  currentName: string;
  onUpdate: () => void;
}

const settingsSchema = z.object({
  daily_calorie_goal: z.number()
    .min(800, { message: "Goal must be at least 800 calories" })
    .max(10000, { message: "Goal must be less than 10,000 calories" }),
  full_name: z.string()
    .trim()
    .max(100, { message: "Name must be less than 100 characters" })
    .optional(),
});

const SettingsDialog = ({ 
  open, 
  onOpenChange, 
  userId, 
  currentGoal, 
  currentName,
  onUpdate 
}: SettingsDialogProps) => {
  const [goal, setGoal] = useState(currentGoal.toString());
  const [name, setName] = useState(currentName || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      
      const goalNumber = parseInt(goal);
      
      // Validate input
      const validation = settingsSchema.safeParse({
        daily_calorie_goal: goalNumber,
        full_name: name || undefined,
      });

      if (!validation.success) {
        toast.error(validation.error.errors[0].message);
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({ 
          daily_calorie_goal: goalNumber,
          full_name: name.trim() || null,
        })
        .eq("id", userId);

      if (error) {
        toast.error("Failed to update settings");
        console.error("Error updating profile:", error);
        return;
      }

      toast.success("Settings updated successfully");
      onUpdate();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              maxLength={100}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="goal">Daily Calorie Goal</Label>
            <Input
              id="goal"
              type="number"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="2000"
              min={800}
              max={10000}
            />
            <p className="text-sm text-muted-foreground">
              Recommended range: 1,200 - 3,000 calories
            </p>
          </div>
          <div className="flex gap-3 justify-end">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
