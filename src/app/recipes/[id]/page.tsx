import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getRecipeById, getAllRecipes } from "@/lib/recipes";

export async function generateStaticParams() {
  return getAllRecipes().map((r) => ({ id: r.id }));
}
export async function generateMetadata({ params }: { params: { id: string } }) {
  const r = getRecipeById(params.id);
  return r ? { title: `${r.title} — RecipeHub`, description: r.description } : { title: "Not Found" };
}

export default function RecipeDetailPage({ params }: { params: { id: string } }) {
  const recipe = getRecipeById(params.id);
  if (!recipe) notFound();
  const totalTime = recipe.prepTime + recipe.cookTime;
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-orange-500 mb-6 transition-colors">
        ← Back to all recipes
      </Link>
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-orange-500 uppercase tracking-wide">{recipe.category}</span>
          <span className="text-gray-300">•</span>
          <span className="text-xs text-gray-400">by {recipe.author}</span>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">{recipe.title}</h1>
        <p className="text-gray-500 text-lg mb-5">{recipe.description}</p>
        <div className="flex flex-wrap gap-4 text-sm">
          {[["Prep", `${recipe.prepTime} min`], ["Cook", `${recipe.cookTime} min`], ["Total", `${totalTime} min`],
            ["Servings", `${recipe.servings}`], ["Difficulty", recipe.difficulty]].map(([label, value]) => (
            <div key={label} className="bg-orange-50 px-4 py-2 rounded-xl text-center min-w-[80px]">
              <div className="font-bold text-orange-600">{value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="relative h-80 rounded-2xl overflow-hidden mb-10 shadow-md">
        <Image src={recipe.imageUrl} alt={recipe.title} fill className="object-cover" priority
          sizes="(max-width: 900px) 100vw, 900px" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-1">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Ingredients</h2>
          <ul className="space-y-2">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />{ing}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag) => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">#{tag}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Instructions</h2>
          <ol className="space-y-5">
            {recipe.steps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">{i + 1}</div>
                <p className="text-gray-700 text-sm leading-relaxed pt-1">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
