import Link from "next/link";
import Image from "next/image";
import { looks } from "@/lib/data";

export default function Home() {
  return (
    <div className="p-4 pt-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-serif text-black">For You</h1>
      </div>

      {/* Masonry Layout using CSS columns */}
      <div className="columns-2 gap-4 space-y-4">
        {looks.map((look) => (
          <Link href={`/look/${look.id}`} key={look.id} className="block break-inside-avoid">
            <div className="relative rounded-2xl overflow-hidden bg-gray-100 mb-4 group cursor-pointer">
              <Image
                src={look.imageUrl}
                alt={look.title}
                width={540}
                height={720}
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 448px) 50vw, 224px"
                priority={look.id === "1"}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}