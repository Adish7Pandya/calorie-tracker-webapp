/// <reference types="https://deno.land/x/deno_types@0.1.0/index.d.ts" />
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

    // Read both App ID and App Key from environment variables so they can be managed in Supabase
    const nutritionixApiKey = Deno.env.get('NUTRITIONIX_API_KEY');
    const nutritionixAppId = Deno.env.get('NUTRITIONIX_APP_ID'); // set this to your Nutritionix Application ID (e.g. 4557aa6b)

    const missingVars = [];
    if (!nutritionixAppId) missingVars.push('NUTRITIONIX_APP_ID');
    if (!nutritionixApiKey) missingVars.push('NUTRITIONIX_API_KEY');
    if (missingVars.length) {
      console.error('Missing Nutritionix environment variables:', missingVars.join(', '));
      return new Response(
        JSON.stringify({ error: 'Nutritionix credentials not configured', missing: missingVars }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const response = await fetch('https://trackapi.nutritionix.com/v2/natural/nutrients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-app-id': nutritionixAppId,
        'x-app-key': nutritionixApiKey,
        'User-Agent': 'calorie-tracker/1.0 (supabase function)'
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Nutritionix API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch nutrition data' }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    
    // Transform Nutritionix response to our format
    const foods = data.foods.map((food: any) => ({
      name: food.food_name,
      serving_qty: food.serving_qty,
      serving_unit: food.serving_unit,
      calories: Math.round(food.nf_calories),
      protein: Math.round(food.nf_protein),
      carbs: Math.round(food.nf_total_carbohydrate),
      fat: Math.round(food.nf_total_fat),
    }));

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
