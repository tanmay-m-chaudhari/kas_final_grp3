import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "RecipeHub — Discover & Share Recipes",
  description: "Browse hundreds of recipes from around the world.",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <span className="text-2xl">🍳</span>
              <span className="text-xl font-bold text-gray-900">RecipeHub</span>
            </a>
            <nav className="flex items-center gap-6 text-sm text-gray-600">
              <a href="/" className="hover:text-orange-500 transition-colors">Browse</a>
              <a href="/api/recipes" className="hover:text-orange-500 transition-colors">API</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-16 bg-white border-t border-gray-100 py-8 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} RecipeHub. Made with ❤️ for food lovers.
        </footer>
      </body>
    </html>
  );
}
