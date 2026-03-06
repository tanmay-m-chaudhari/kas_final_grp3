import { Suspense } from "react";
import { getAllRecipes, getRecipesByCategory, searchRecipes, getCategories } from "@/lib/recipes";
import RecipeCard from "@/components/RecipeCard";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";

export default async function HomePage({ searchParams }: { searchParams: { q?: string; category?: string } }) {
  const categories = getCategories();
  let recipes, heading: string;
  if (searchParams.q) { recipes = searchRecipes(searchParams.q); heading = `Results for "${searchParams.q}"`; }
  else if (searchParams.category) { recipes = getRecipesByCategory(searchParams.category); heading = `${searchParams.category} Recipes`; }
  else { recipes = getAllRecipes(); heading = "All Recipes"; }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Discover Delicious Recipes</h1>
        <p className="text-gray-500 mb-6 text-lg">From quick weeknight dinners to weekend showstoppers</p>
        <div className="flex justify-center">
          <Suspense fallback={null}><SearchBar /></Suspense>
        </div>
      </div>
      <div className="mb-8">
        <Suspense fallback={null}><CategoryFilter categories={categories} /></Suspense>
      </div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">{heading}</h2>
        <span className="text-sm text-gray-400">{recipes.length} recipes</span>
      </div>
      {recipes.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-lg">No recipes found. Try a different search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}
        </div>
      )}
    </div>
  );
}
