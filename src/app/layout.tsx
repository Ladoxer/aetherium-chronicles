import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" });

export const metadata: Metadata = {
  title: "Chronicles of the Aetherium Spires",
  description: "A Steampunk RPG Adventure",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cinzel.variable} font-sans bg-slate-900 text-slate-200 min-h-screen flex flex-col`}>
        <header className="w-full p-6 border-b-2 border-gold-600/50 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-serif text-gold-500 tracking-widest uppercase shadow-gold-glow">
              Chronicles of the Aetherium Spires
            </h1>
            <div className="h-2 w-24 bg-gradient-to-r from-transparent via-gold-600 to-transparent"></div>
          </div>
        </header>

        <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10 z-0">
            <div className="absolute top-10 left-10 w-64 h-64 rounded-full border-4 border-dashed border-gold-500 animate-spin-slow"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full border-2 border-gold-500 opacity-50"></div>
          </div>
          
          <div className="relative z-10 w-full max-w-7xl">
            {children}
          </div>
        </main>

        <footer className="w-full p-4 border-t border-gold-600/30 bg-slate-950 text-center text-slate-500 text-sm">
          <p>© 2024 Aetherium Chronicles. All rights reserved.</p>
          <p className="text-xs mt-1 text-gold-600/60">Powered by Aether & Steam</p>
        </footer>
      </body>
    </html>
  );
}
