import Link from "next/link";
import Image from "next/image";
import { Recipe } from "@/lib/recipes";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const totalTime = recipe.prepTime + recipe.cookTime;
  const difficultyColor = { Easy: "bg-green-100 text-green-800", Medium: "bg-yellow-100 text-yellow-800", Hard: "bg-red-100 text-red-800" }[recipe.difficulty];
  return (
    <Link href={`/recipes/${recipe.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
        <div className="relative h-48 w-full overflow-hidden">
          <Image src={recipe.imageUrl} alt={recipe.title} fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
          <div className="absolute top-3 right-3">
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${difficultyColor}`}>{recipe.difficulty}</span>
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-orange-500 uppercase tracking-wide">{recipe.category}</span>
            <span className="text-xs text-gray-400">{recipe.author}</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">{recipe.title}</h3>
          <p className="text-sm text-gray-500 mb-4 line-clamp-2">{recipe.description}</p>
          <div className="flex items-center gap-4 text-xs text-gray-400 border-t border-gray-50 pt-3">
            <span>⏱ {totalTime} min</span>
            <span>👥 {recipe.servings} servings</span>
            <span>📋 {recipe.ingredients.length} ingredients</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
