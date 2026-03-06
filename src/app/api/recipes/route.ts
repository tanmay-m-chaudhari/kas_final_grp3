import { NextRequest, NextResponse } from "next/server";
import { getAllRecipes, getRecipeById, searchRecipes, getRecipesByCategory } from "@/lib/recipes";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const q = searchParams.get("q");
  const category = searchParams.get("category");
  if (id) {
    const recipe = getRecipeById(id);
    return recipe ? NextResponse.json(recipe) : NextResponse.json({ error: "Recipe not found" }, { status: 404 });
  }
  if (q) return NextResponse.json(searchRecipes(q));
  if (category) return NextResponse.json(getRecipesByCategory(category));
  return NextResponse.json(getAllRecipes());
}
