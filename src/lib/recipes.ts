export interface Recipe {
  id: string;
  title: string;
  description: string;
  category: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: "Easy" | "Medium" | "Hard";
  ingredients: string[];
  steps: string[];
  author: string;
  imageUrl: string;
  tags: string[];
  createdAt: string;
}

const recipes: Recipe[] = [
  {
    id: "1",
    title: "Classic Margherita Pizza",
    description: "A timeless Italian pizza with fresh tomatoes, mozzarella, and basil on a crispy homemade crust.",
    category: "Italian",
    prepTime: 30, cookTime: 20, servings: 4, difficulty: "Medium",
    ingredients: [
      "500g strong bread flour", "7g instant yeast", "1 tsp salt", "2 tbsp olive oil", "300ml warm water",
      "400g canned San Marzano tomatoes", "250g fresh mozzarella, torn", "Fresh basil leaves",
      "2 cloves garlic, minced", "Salt and pepper to taste",
    ],
    steps: [
      "Mix flour, yeast, and salt in a large bowl. Add olive oil and warm water, knead for 10 minutes until smooth.",
      "Cover the dough and let it rise in a warm place for 1 hour until doubled in size.",
      "Crush the tomatoes by hand and mix with minced garlic, salt, and a drizzle of olive oil.",
      "Preheat oven to 250°C (480°F) with a baking stone or heavy baking tray inside.",
      "Stretch the dough on a floured surface into a 30cm round, transfer to a floured peel or parchment.",
      "Spread tomato sauce evenly, leaving a 2cm border. Add torn mozzarella pieces.",
      "Bake for 10–12 minutes until the crust is golden and cheese is bubbling.",
      "Remove from oven, add fresh basil leaves, drizzle with olive oil, and serve immediately.",
    ],
    author: "Chef Marco",
    imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800",
    tags: ["pizza", "italian", "vegetarian", "baking"],
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Thai Green Curry",
    description: "Aromatic and creamy Thai green curry with chicken, vegetables, and fragrant jasmine rice.",
    category: "Thai",
    prepTime: 20, cookTime: 30, servings: 4, difficulty: "Medium",
    ingredients: [
      "600g chicken breast, sliced", "400ml coconut milk", "3 tbsp green curry paste",
      "200g Thai eggplant, quartered", "100g snap peas", "2 kaffir lime leaves",
      "1 stalk lemongrass, bruised", "2 tbsp fish sauce", "1 tbsp palm sugar",
      "Fresh Thai basil", "1 red chili, sliced", "2 tbsp vegetable oil", "Jasmine rice to serve",
    ],
    steps: [
      "Heat oil in a wok over medium-high heat. Add curry paste and fry for 1–2 minutes until fragrant.",
      "Pour in half the coconut milk and stir to combine with the paste. Add lemongrass and kaffir lime leaves.",
      "Add chicken slices and cook for 5–6 minutes until sealed and cooked through.",
      "Pour in remaining coconut milk. Add fish sauce and palm sugar. Stir well.",
      "Add eggplant and snap peas. Simmer for 8–10 minutes until vegetables are tender.",
      "Taste and adjust seasoning with more fish sauce or sugar as needed.",
      "Remove lemongrass stalk. Garnish with Thai basil and sliced red chili.",
      "Serve immediately with steamed jasmine rice.",
    ],
    author: "Chef Nong",
    imageUrl: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800",
    tags: ["curry", "thai", "chicken", "spicy"],
    createdAt: "2024-02-03",
  },
  {
    id: "3",
    title: "Chocolate Lava Cake",
    description: "Decadent individual chocolate cakes with a warm, molten center. Perfect for a dinner party.",
    category: "Dessert",
    prepTime: 15, cookTime: 12, servings: 6, difficulty: "Hard",
    ingredients: [
      "200g dark chocolate (70%), chopped", "200g unsalted butter", "4 large eggs", "4 egg yolks",
      "200g caster sugar", "60g plain flour", "Cocoa powder for dusting",
      "Vanilla ice cream to serve", "Pinch of sea salt",
    ],
    steps: [
      "Preheat oven to 200°C (390°F). Butter six ramekins and dust with cocoa powder.",
      "Melt chocolate and butter in a heatproof bowl over simmering water, stirring until smooth.",
      "Whisk eggs, egg yolks, and sugar until pale and slightly thickened, about 3 minutes.",
      "Fold the chocolate mixture into the egg mixture gently until combined.",
      "Sift in flour and salt, fold until just incorporated — do not overmix.",
      "Divide the batter among the prepared ramekins. Can be refrigerated for up to 24 hours.",
      "Bake for 10–12 minutes. Edges should be set but the center should wobble slightly.",
      "Run a knife around the edge, invert onto plates immediately, and serve with ice cream.",
    ],
    author: "Chef Sophie",
    imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800",
    tags: ["chocolate", "dessert", "baking", "dinner-party"],
    createdAt: "2024-03-10",
  },
  {
    id: "4",
    title: "Shakshuka",
    description: "Eggs poached in a rich, spiced tomato and pepper sauce. A North African classic perfect for brunch.",
    category: "Middle Eastern",
    prepTime: 10, cookTime: 25, servings: 2, difficulty: "Easy",
    ingredients: [
      "4 large eggs", "400g canned chopped tomatoes", "1 red bell pepper, diced", "1 yellow onion, diced",
      "3 cloves garlic, minced", "1 tsp cumin", "1 tsp smoked paprika", "1/2 tsp chili flakes",
      "2 tbsp olive oil", "Salt and pepper to taste", "Fresh parsley, chopped",
      "Crumbled feta cheese", "Crusty bread to serve",
    ],
    steps: [
      "Heat olive oil in a large skillet over medium heat. Add onion and pepper, cook for 8 minutes.",
      "Add garlic, cumin, paprika, and chili flakes. Cook for 1 minute until fragrant.",
      "Pour in canned tomatoes. Season with salt and pepper. Simmer for 10 minutes until sauce thickens.",
      "Make four wells in the sauce with a spoon. Crack an egg into each well.",
      "Cover the skillet and cook for 5–7 minutes until whites are set but yolks are still runny.",
      "Remove from heat. Scatter crumbled feta and fresh parsley on top.",
      "Serve directly from the pan with plenty of crusty bread for scooping.",
    ],
    author: "Chef Layla",
    imageUrl: "https://images.unsplash.com/photo-1590412200988-a436970781fa?w=800",
    tags: ["eggs", "brunch", "vegetarian", "spiced"],
    createdAt: "2024-03-22",
  },
  {
    id: "5",
    title: "Beef Ramen",
    description: "A rich beef bone broth ramen with chashu pork, marinated eggs, and fresh noodles.",
    category: "Japanese",
    prepTime: 45, cookTime: 180, servings: 4, difficulty: "Hard",
    ingredients: [
      "1kg beef bones", "400g fresh ramen noodles", "4 soft boiled eggs, marinated",
      "200g chashu pork belly, sliced", "4 sheets nori", "100g bamboo shoots",
      "4 spring onions, sliced", "2 tbsp white miso paste", "2 tbsp soy sauce",
      "1 tbsp mirin", "1 tsp sesame oil", "4 cloves garlic", "5cm fresh ginger",
      "Corn kernels and butter to garnish",
    ],
    steps: [
      "Blanch beef bones in boiling water for 5 minutes. Drain and rinse well.",
      "Place bones in a large pot with 3 liters water, garlic, and ginger. Simmer for 3 hours.",
      "Strain broth. Return to pot, add miso, soy sauce, and mirin. Simmer 10 more minutes.",
      "Marinate soft boiled eggs in soy sauce, mirin, and water for at least 2 hours.",
      "Cook ramen noodles per package instructions. Drain and divide among four bowls.",
      "Ladle hot broth over noodles. Top with chashu, halved egg, bamboo shoots, and nori.",
      "Garnish with spring onions, corn, a pat of butter, and a drizzle of sesame oil.",
    ],
    author: "Chef Kenji",
    imageUrl: "https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=800",
    tags: ["ramen", "japanese", "noodles", "soup"],
    createdAt: "2024-04-05",
  },
  {
    id: "6",
    title: "Fish Tacos with Mango Salsa",
    description: "Fresh fish tacos with a tropical mango avocado salsa, lime crema, and crunchy slaw.",
    category: "Mexican",
    prepTime: 25, cookTime: 15, servings: 4, difficulty: "Easy",
    ingredients: [
      "600g white fish fillets (cod or tilapia)", "8 small corn tortillas",
      "1 ripe mango, diced", "1 avocado, diced", "1/2 red onion, finely diced",
      "1 jalapeño, seeded and minced", "Juice of 2 limes", "Fresh cilantro, chopped",
      "200g red cabbage, shredded", "4 tbsp sour cream", "1 tsp cumin",
      "1 tsp chili powder", "Salt and pepper", "2 tbsp olive oil",
    ],
    steps: [
      "Combine mango, avocado, red onion, jalapeño, lime juice, and cilantro. Season and set aside.",
      "Toss shredded cabbage with lime juice and a pinch of salt. Let lightly pickle.",
      "Mix sour cream with remaining lime juice and a pinch of salt to make lime crema.",
      "Season fish with cumin, chili powder, salt, and pepper on both sides.",
      "Heat olive oil in a skillet over medium-high heat. Cook fish 3–4 minutes per side until golden.",
      "Warm tortillas in a dry skillet for 30 seconds per side.",
      "Build tacos: tortilla, cabbage slaw, fish, mango salsa, drizzle of lime crema.",
    ],
    author: "Chef Rosa",
    imageUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800",
    tags: ["tacos", "mexican", "fish", "fresh"],
    createdAt: "2024-05-12",
  },
];

export function getAllRecipes(): Recipe[] { return recipes; }
export function getRecipeById(id: string): Recipe | undefined { return recipes.find((r) => r.id === id); }
export function getRecipesByCategory(category: string): Recipe[] {
  return recipes.filter((r) => r.category.toLowerCase() === category.toLowerCase());
}
export function searchRecipes(query: string): Recipe[] {
  const q = query.toLowerCase();
  return recipes.filter(
    (r) => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) ||
      r.tags.some((t) => t.includes(q)) || r.category.toLowerCase().includes(q)
  );
}
export function getCategories(): string[] { return [...new Set(recipes.map((r) => r.category))]; }
