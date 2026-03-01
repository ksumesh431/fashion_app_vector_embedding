import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Bookmark } from "lucide-react";
import { looks } from "@/lib/data";
import SimilarItems from "@/components/SimilarItems";

export async function generateStaticParams() {
  return looks.map((look) => ({ id: look.id }));
}

export default async function LookDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const look = looks.find((l) => l.id === resolvedParams.id);

  if (!look) {
    return <div className="p-8 text-center mt-20">Look not found</div>;
  }

  return (
    <div className="relative bg-white min-h-screen pb-20">
      {/* Top Nav / Back Button */}
      <Link href="/" className="absolute top-4 left-4 z-10 bg-white/50 backdrop-blur-md p-2 rounded-full text-black">
        <ChevronLeft size={24} />
      </Link>

      {/* Hero Image */}
      <div className="w-full h-[70vh] bg-gray-100 relative">
        <Image
          src={look.imageUrl}
          alt={look.title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 448px) 100vw, 448px"
        />
      </div>

      {/* Look Info & CTA */}
      <div className="p-4 pt-6">
        <h1 className="text-3xl font-bold text-gray-900">{look.title}</h1>
        <p className="text-sm text-gray-500 mt-1 uppercase tracking-wide flex items-center gap-1">
          WHY THIS WORKS FOR YOU <span className="text-yellow-500">✨</span>
        </p>
        <p className="text-gray-600 mt-2">{look.description}</p>

        <div className="flex gap-4 mt-6 items-center">
          <button className="flex-1 bg-[#1a1a1a] text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-black transition-colors">
            Try this look ✨
          </button>
          <button className="p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
            <Bookmark size={24} className="text-black" />
          </button>
        </div>
      </div>

      {/* Products Carousel */}
      {look.products && look.products.length > 0 && (
        <div className="mt-8 border-b border-gray-100 pb-8">
          <h2 className="text-lg font-semibold px-4 mb-4 text-gray-900">Products in this look</h2>
          <div className="flex overflow-x-auto gap-3 px-4 pb-4 snap-x hide-scrollbar">
            {look.products.map((product) => (
              <div key={product.id} className="min-w-[110px] w-[110px] snap-start flex flex-col">
                <div className="bg-[#f5f5f5] rounded-2xl overflow-hidden aspect-[3/4] mb-3 relative">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="110px"
                  />
                </div>
                <div className="flex flex-col gap-0.5 px-1">
                  <p className="font-semibold text-gray-900 text-sm leading-tight">{product.name}</p>
                  <p className="text-gray-500 text-xs">{product.brand}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {look.products && <SimilarItems products={look.products} />}
    </div>
  );
}