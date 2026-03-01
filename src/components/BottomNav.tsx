"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Home, Search, Sparkles, Bookmark } from "lucide-react";

export default function BottomNav() {
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    // Show tooltip only once per session
    const seen = sessionStorage.getItem("catalog-tip-seen");
    if (!seen) {
      const timer = setTimeout(() => setShowTip(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  function dismissTip() {
    setShowTip(false);
    sessionStorage.setItem("catalog-tip-seen", "true");
  }

  return (
    <>
      {/* Catalog tip tooltip */}
      {showTip && (
        <div className="fixed bottom-[72px] z-[60] max-w-md mx-auto left-0 right-0 px-4 animate-fade-in">
          <div className="relative mx-auto w-fit">
            <div
              className="bg-[#1a1a1a] text-white rounded-2xl px-5 py-4 shadow-2xl flex items-start gap-3 max-w-[320px]"
              style={{ animation: "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
            >
              <div className="mt-0.5 bg-white/10 rounded-full p-2 shrink-0">
                <Search size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold leading-tight">Browse Full Catalog</p>
                <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                  Tap the search icon below to see all products in our catalog that power the AI similarity matching.
                </p>
              </div>
              <button
                onClick={dismissTip}
                className="text-gray-400 hover:text-white text-lg leading-none mt-0.5 shrink-0"
              >
                ✕
              </button>
            </div>
            {/* Arrow pointing down to search icon */}
            <div className="flex justify-center -mt-1">
              <div
                className="w-0 h-0"
                style={{
                  borderLeft: "10px solid transparent",
                  borderRight: "10px solid transparent",
                  borderTop: "10px solid #1a1a1a",
                  marginLeft: "-40px",
                }}
              />
            </div>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto">
          <Link href="/" className="p-2 text-black transition-colors">
            <Home size={24} />
          </Link>
          <Link
            href="/catalog"
            className={`p-2 transition-colors relative ${showTip ? "text-black" : "text-gray-400 hover:text-black"}`}
            onClick={dismissTip}
          >
            <Search size={24} />
            {showTip && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
            )}
          </Link>
          <button className="p-2 text-gray-400 hover:text-black transition-colors">
            <Sparkles size={24} />
          </button>
          <button className="p-2 text-gray-400 hover:text-black transition-colors">
            <Bookmark size={24} />
          </button>
        </div>
      </nav>
    </>
  );
}