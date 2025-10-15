import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface CalorieChartProps {
  userId: string;
}

const CalorieChart = ({ userId }: CalorieChartProps) => {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (userId) {
      loadChartData();
    }
  }, [userId]);

  const loadChartData = async () => {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);

    const { data, error } = await supabase
      .from("meals")
      .select("calories, meal_date")
      .eq("user_id", userId)
      .gte("meal_date", sevenDaysAgo.toISOString().split('T')[0])
      .lte("meal_date", today.toISOString().split('T')[0]);

    if (error) {
      console.error("Error loading chart data:", error);
      return;
    }

    // Group by date and sum calories
    const groupedData = (data || []).reduce((acc: any, meal: any) => {
      const date = meal.meal_date;
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += Number(meal.calories);
      return acc;
    }, {});

    // Create array for last 7 days
    const chartArray = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      chartArray.push({
        date: dayName,
        calories: groupedData[dateStr] || 0,
      });
    }

    setChartData(chartArray);
  };

  return (
    <Card className="p-6 shadow-soft">
      <h3 className="font-semibold text-lg mb-4">7-Day Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="date" 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
          />
          <Line
            type="monotone"
            dataKey="calories"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            dot={{ fill: 'hsl(var(--primary))', r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default CalorieChart;
