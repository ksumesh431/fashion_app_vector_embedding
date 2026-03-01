"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

type Product = {
    id: string;
    name: string;
    brand: string;
    price: string;
    image_url: string;
    category: string;
};

export default function CatalogPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAll() {
            const { data, error } = await supabase
                .from("products")
                .select("id, name, brand, price, image_url, category")
                .order("category");

            if (error) {
                console.error("Failed to load catalog:", error.message);
            } else {
                setProducts(data || []);
            }
            setLoading(false);
        }
        fetchAll();
    }, []);

    // Group by category
    const grouped: Record<string, Product[]> = {};
    for (const p of products) {
        if (!grouped[p.category]) grouped[p.category] = [];
        grouped[p.category].push(p);
    }

    return (
        <div className="relative bg-white min-h-screen pb-20">
            <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3">
                <Link href="/" className="p-1">
                    <ChevronLeft size={24} />
                </Link>
                <h1 className="text-xl font-bold text-gray-900">
                    Full Catalog ({products.length} items)
                </h1>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <p className="text-sm text-gray-500 animate-pulse">Loading catalog...</p>
                </div>
            ) : (
                <div className="px-4 pt-4">
                    {Object.entries(grouped).map(([category, items]) => (
                        <div key={category} className="mb-8">
                            <h2 className="text-lg font-bold text-gray-900 capitalize mb-4 sticky top-[65px] bg-white py-2 z-[5] border-b border-gray-100">
                                {category} ({items.length})
                            </h2>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex flex-col">
                                        <div className="bg-[#f5f5f5] rounded-xl overflow-hidden aspect-[3/4] mb-3">
                                            <img
                                                src={item.image_url}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
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
                    ))}
                </div>
            )}
        </div>
    );
}
