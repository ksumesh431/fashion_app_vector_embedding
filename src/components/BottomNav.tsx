import Link from 'next/link';
import { Home, Search, Sparkles, Bookmark } from 'lucide-react';

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        <Link href="/" className="p-2 text-black transition-colors">
          <Home size={24} />
        </Link>
        <Link href="/catalog" className="p-2 text-gray-400 hover:text-black transition-colors">
          <Search size={24} />
        </Link>
        <button className="p-2 text-gray-400 hover:text-black transition-colors">
          <Sparkles size={24} />
        </button>
        <button className="p-2 text-gray-400 hover:text-black transition-colors">
          <Bookmark size={24} />
        </button>
      </div>
    </nav>
  );
}