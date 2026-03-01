import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Product = {
    id: string;
    name: string;
    brand: string;
    price: string;
    image_url: string;
    category: string;
};

export default async function CatalogPage() {
    const { data: products, error } = await supabase
        .from("products")
        .select("id, name, brand, price, image_url, category")
        .order("category");

    if (error) {
        console.error("Failed to load catalog:", error.message);
    }

    const items = products || [];

    // Group by category
    const grouped: Record<string, Product[]> = {};
    for (const p of items) {
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
                    Full Catalog ({items.length} items)
                </h1>
            </div>

            <div className="px-4 pt-4">
                {Object.entries(grouped).map(([category, catItems]) => (
                    <div key={category} className="mb-8">
                        <h2 className="text-lg font-bold text-gray-900 capitalize mb-4 sticky top-[65px] bg-white py-2 z-[5] border-b border-gray-100">
                            {category} ({catItems.length})
                        </h2>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                            {catItems.map((item) => (
                                <div key={item.id} className="flex flex-col">
                                    <div className="bg-[#f5f5f5] rounded-xl overflow-hidden aspect-[3/4] mb-3 relative">
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
        </div>
    );
}
