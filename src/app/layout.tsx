import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "AI Fashion Stylist",
  description: "Curated looks and visually similar items",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-100 antialiased text-gray-900">
        {/* Mobile wrapper to keep it looking like an app on desktop */}
        <div className="max-w-md mx-auto bg-white min-h-screen relative shadow-xl overflow-hidden flex flex-col">
          
          {/* Main content area with padding at the bottom for the nav */}
          <main className="flex-1 overflow-y-auto pb-16">
            {children}
          </main>

          <BottomNav />
        </div>
      </body>
    </html>
  );
}