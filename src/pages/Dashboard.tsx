import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Apple, Plus, TrendingUp, LogOut, Sparkles, Settings } from "lucide-react";
import AddMealDialog from "@/components/AddMealDialog";
import MealList from "@/components/MealList";
import CalorieChart from "@/components/CalorieChart";
import AISuggestionsDialog from "@/components/AISuggestionsDialog";
import SettingsDialog from "@/components/SettingsDialog";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [meals, setMeals] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    checkUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          navigate("/auth");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUser(user);
      await loadProfile(user.id);
      await loadMeals(user.id);
    } catch (error) {
      console.error("Error checking user:", error);
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  };

  const loadProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error loading profile:", error);
      return;
    }
    setProfile(data);
  };

  const loadMeals = async (userId: string) => {
    const today = new Date().toISOString().split('T')[0];
    // @ts-ignore - Type mismatch between DB schema and generated types
    const { data, error } = await supabase
      .from("meals")
      .select("*")
      .eq("user_id", userId)
      .eq("meal_date", today)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading meals:", error);
      return;
    }
    setMeals(data || []);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleMealAdded = () => {
    if (user) {
      loadMeals(user.id);
    }
    setShowAddMeal(false);
  };

  const handleSettingsUpdate = () => {
    if (user) {
      loadProfile(user.id);
    }
  };

  const handleMealDeleted = async (mealId: string) => {
    const { error } = await supabase
      .from("meals")
      .delete()
      .eq("id", mealId);

    if (error) {
      toast.error("Failed to delete meal");
      return;
    }

    toast.success("Meal deleted");
    if (user) {
      loadMeals(user.id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalCalories = meals.reduce((sum, meal) => sum + Number(meal.calories), 0);
  const dailyGoal = profile?.daily_calorie_goal || 2000;
  const progress = Math.min((totalCalories / dailyGoal) * 100, 100);
  const remaining = Math.max(dailyGoal - totalCalories, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
              <Apple className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">CaloriTrack</h1>
              <p className="text-sm text-muted-foreground">Hello, {profile?.full_name || user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)}>
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-card to-primary/5 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Today's Calories</h3>
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <p className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {totalCalories}
            </p>
            <p className="text-sm text-muted-foreground mt-1">of {dailyGoal} goal</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-card to-accent/5 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Remaining</h3>
              <Apple className="w-5 h-5 text-accent" />
            </div>
            <p className="text-4xl font-bold text-accent">
              {remaining}
            </p>
            <p className="text-sm text-muted-foreground mt-1">calories left</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-card to-primary/5 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Meals Logged</h3>
              <Plus className="w-5 h-5 text-primary" />
            </div>
            <p className="text-4xl font-bold">{meals.length}</p>
            <p className="text-sm text-muted-foreground mt-1">today</p>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card className="p-6 mb-8 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Daily Goal Progress</h3>
            <span className="text-sm text-muted-foreground">{progress.toFixed(0)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
          {progress >= 100 && (
            <p className="text-sm text-accent mt-2">🎉 Goal reached! Great job!</p>
          )}
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button
            size="lg"
            onClick={() => setShowAddMeal(true)}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity flex-1 min-w-[200px]"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Meal
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => setShowAISuggestions(true)}
            className="flex-1 min-w-[200px]"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            AI Meal Suggestions
          </Button>
        </div>

        {/* Chart and Meals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CalorieChart userId={user?.id || ""} />
          <MealList meals={meals} onDeleteMeal={handleMealDeleted} />
        </div>
      </main>

      <AddMealDialog
        open={showAddMeal}
        onOpenChange={setShowAddMeal}
        onMealAdded={handleMealAdded}
        userId={user?.id || ""}
      />

      <AISuggestionsDialog
        open={showAISuggestions}
        onOpenChange={setShowAISuggestions}
        currentCalories={totalCalories}
        goalCalories={dailyGoal}
        recentMeals={meals.map(m => m.food_name)}
      />

      <SettingsDialog
        open={showSettings}
        onOpenChange={setShowSettings}
        userId={user?.id || ""}
        currentGoal={dailyGoal}
        currentName={profile?.full_name || ""}
        onUpdate={handleSettingsUpdate}
      />
    </div>
  );
};

export default Dashboard;
