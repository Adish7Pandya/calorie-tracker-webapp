import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    
    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query parameter is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Using USDA FoodData Central API (free, no API key required for basic use)
    const searchUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(query)}&pageSize=5&api_key=DEMO_KEY`;

    const response = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('USDA API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch nutrition data' }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    
    // Transform USDA response to our format
    const foods = (data.foods || []).slice(0, 5).map((food: any) => {
      const getNutrient = (nutrientId: number) => {
        const nutrient = food.foodNutrients?.find((n: any) => n.nutrientId === nutrientId);
        return nutrient ? Math.round(nutrient.value) : 0;
      };

      return {
        name: food.description.toLowerCase(),
        serving_qty: 100,
        serving_unit: 'g',
        calories: getNutrient(1008), // Energy (kcal)
        protein: getNutrient(1003),  // Protein
        carbs: getNutrient(1005),    // Carbohydrates
        fat: getNutrient(1004),      // Total Fat
      };
    });

    return new Response(
      JSON.stringify({ foods }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in search-nutrition function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
