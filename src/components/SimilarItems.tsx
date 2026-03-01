"use client";

import { useEffect, useState } from "react";

type SimilarItem = {
  id: string;
  name: string;
  brand: string;
  price: string;
  image_url: string;
  category: string;
  similarity: number;
};

type Product = {
  id: string;
  name: string;
  brand: string;
  imageUrl: string;
  supabaseId?: string;
};

export default function SimilarItems({ products }: { products: Product[] }) {
  const [similarItems, setSimilarItems] = useState<SimilarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showScores, setShowScores] = useState(false);

  useEffect(() => {
    async function fetchMatches() {
      setLoading(true);
      const allMatches: SimilarItem[] = [];
      const seenIds = new Set<string>();

      // Fetch all product matches in parallel (3x faster than sequential)
      const fetchPromises = products
        .filter((p) => p.supabaseId)
        .map(async (product) => {
          try {
            const res = await fetch("/api/similar-products", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ productId: product.supabaseId }),
            });

            if (!res.ok) {
              console.error(`Server error for ${product.name}:`, await res.text());
              return [];
            }

            const data = await res.json();
            return (data.items || []).map((item: SimilarItem) => ({
              ...item,
              category: item.category || product.name,
            }));
          } catch (error) {
            console.error("Failed to fetch matches for", product.name, error);
            return [];
          }
        });

      const results = await Promise.all(fetchPromises);

      // Deduplicate across all results
      for (const items of results) {
        for (const item of items) {
          if (!seenIds.has(item.id)) {
            seenIds.add(item.id);
            allMatches.push(item);
          }
        }
      }

      const categoryOrder: Record<string, number> = {
        sweatshirt: 0,
        jeans: 1,
        trousers: 1,
        shorts: 1,
        sneakers: 2,
        shoes: 2,
      };
      allMatches.sort((a, b) => {
        const catA = categoryOrder[a.category] ?? 99;
        const catB = categoryOrder[b.category] ?? 99;
        if (catA !== catB) return catA - catB;
        return (b.similarity || 0) - (a.similarity || 0);
      });

      setSimilarItems(allMatches);
      setLoading(false);
    }

    if (products && products.length > 0) {
      fetchMatches();
    } else {
      setLoading(false);
    }
  }, [products]);

  if (loading) {
    return (
      <div className="mt-8 px-4 pb-12">
        <h2 className="text-xl font-bold mb-6 text-gray-900">
          Visually Similar Items
        </h2>
        <div className="flex justify-center items-center py-12">
          <p className="text-sm font-medium text-gray-500 animate-pulse">
            Finding similar items ✨...
          </p>
        </div>
      </div>
    );
  }

  if (similarItems.length === 0) return null;

  return (
    <div className="mt-8 px-4 pb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Visually Similar Items
        </h2>
        <button
          onClick={() => setShowScores(!showScores)}
          className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${showScores
            ? "bg-black text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
        >
          {showScores ? "Score: ON" : "Score: OFF"}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8">
        {similarItems.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="flex flex-col cursor-pointer group"
          >
            <div className="bg-[#f5f5f5] rounded-xl overflow-hidden aspect-[3/4] mb-3 relative">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {showScores && item.similarity && (
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full font-semibold">
                  {Math.round(item.similarity * 100)}%
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <p className="font-bold text-gray-900 text-sm">{item.brand}</p>
              <p className="text-gray-500 text-sm truncate">{item.name}</p>
              <p className="text-gray-900 text-sm mt-1">{item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
