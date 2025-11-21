"use client";

import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Search } from "lucide-react";
import { ENEMIES } from "@/data/enemies";

const islands = [
  { id: "home", name: "Aetherium Spire - Home", x: 50, y: 70, image: "/island-home.png", width: 160, delay: 0, query: "largest clock tower in London" },
  { id: "citadel", name: "Clockwork Citadel", x: 20, y: 40, image: "/island-citadel.png", width: 140, delay: 1, query: "historic military fort" },
  { id: "falls", name: "The Whispering Falls", x: 80, y: 30, image: "/island-falls.png", width: 150, delay: 2, query: "waterfall nature reserve" },
  { id: "den", name: "Sky-Pirate's Den", x: 50, y: 15, image: "/island-den.png", width: 130, delay: 1.5, query: "hidden pirate cove" },
];

// Mock function to simulate fetching flavor text
const fetchWorldFlavor = async (query: string): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const flavors: Record<string, string> = {
    "largest clock tower in London": "A colossal structure of brass and steam, ticking in rhythm with the heartbeat of the world.",
    "historic military fort": "An impenetrable fortress of iron, guarding the secrets of the ancient wars.",
    "waterfall nature reserve": "A mystical sanctuary where aether flows like water, healing all who enter.",
    "hidden pirate cove": "A treacherous haven for scoundrels, hidden amidst the thunderclouds."
  };

  return flavors[query] || "A mysterious land shrouded in fog.";
};

interface AetheriumMapProps {
  onOpenProfile: () => void;
  onOpenInventory: () => void;
}

export default function AetheriumMap({ onOpenProfile, onOpenInventory }: AetheriumMapProps) {
  const { currentIsland, isTraveling, travelToIsland } = useGame();
  const [selectedIsland, setSelectedIsland] = useState<typeof islands[0] | null>(null);
  const [flavorText, setFlavorText] = useState<string | null>(null);
  const [isLoadingFlavor, setIsLoadingFlavor] = useState(false);

  const handleIslandClick = async (island: typeof islands[0]) => {
    if (isTraveling || currentIsland === island.name) return;
    
    setSelectedIsland(island);
    setIsLoadingFlavor(true);
    setFlavorText(null);

    try {
      const text = await fetchWorldFlavor(island.query);
      setFlavorText(text);
    } catch (error) {
      setFlavorText("Failed to retrieve archive data.");
    } finally {
      setIsLoadingFlavor(false);
    }
  };

  const handleTravel = () => {
    if (selectedIsland) {
      travelToIsland(selectedIsland.name);
      setSelectedIsland(null);
    }
  };

  return (
    <div className="relative w-full h-[700px] bg-slate-900 rounded-xl overflow-hidden border-4 border-gold-600 shadow-2xl group">
      {/* Map Background (Sky) */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-60 grayscale-[30%] sepia-[20%]"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/40 to-slate-950/90"></div>
      
      {/* Grid Lines for Map Feel */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(184,134,11,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(184,134,11,0.1)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none"></div>

      {/* Top Right UI Icons */}
      <div className="absolute top-6 right-6 z-30 flex gap-4">
        <button
          onClick={onOpenProfile}
          className="p-3 bg-slate-900/80 border border-gold-600/50 rounded-full hover:bg-slate-800 hover:border-gold-500 transition-all shadow-lg group backdrop-blur-sm"
          title="Character Sheet"
        >
          {/* We need to import User and Package icons here or pass them as children, but importing is easier */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold-400 group-hover:text-gold-300"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </button>
        <button
          onClick={onOpenInventory}
          className="p-3 bg-slate-900/80 border border-gold-600/50 rounded-full hover:bg-slate-800 hover:border-gold-500 transition-all shadow-lg group backdrop-blur-sm"
          title="Inventory"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold-400 group-hover:text-gold-300"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22v-10"/></svg>
        </button>
      </div>

      {/* Islands */}
      {islands.map((island) => {
        const isCurrent = currentIsland === island.name;
        
        return (
          <motion.button
            key={island.id}
            onClick={() => handleIslandClick(island)}
            disabled={isTraveling}
            initial={{ y: 0 }}
            animate={{ 
              y: [0, -10, 0],
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: island.delay 
            }}
            className={`
              absolute transform -translate-x-1/2 -translate-y-1/2
              flex flex-col items-center justify-center
              transition-all duration-500
              ${isTraveling ? "cursor-wait opacity-50 grayscale" : "cursor-pointer"}
              ${isCurrent ? "z-20 scale-110" : "z-10 opacity-90 hover:opacity-100 hover:scale-105"}
            `}
            style={{ left: `${island.x}%`, top: `${island.y}%` }}
          >
            {/* Selection Glow */}
            {isCurrent && (
              <motion.div 
                className="absolute inset-0 bg-gold-500/20 blur-2xl rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}

            {/* Island Image */}
            <div className={`relative transition-all duration-300 ${isCurrent ? "drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]" : "drop-shadow-xl"}`}>
              <Image 
                src={island.image} 
                alt={island.name} 
                width={island.width} 
                height={island.width}
                className="object-contain"
              />
            </div>
            
            {/* Label */}
            <div className={`
              mt-2 px-3 py-1 rounded-full backdrop-blur-md border transition-colors duration-300
              ${isCurrent 
                ? "bg-slate-900/90 border-gold-500 text-gold-400 shadow-lg" 
                : "bg-slate-900/60 border-slate-600 text-slate-300 group-hover:border-gold-500/50"
              }
            `}>
              <span className="text-xs font-bold uppercase tracking-wider whitespace-nowrap">
                {island.name}
              </span>
            </div>
          </motion.button>
        );
      })}

      {/* Information Panel Overlay */}
      <AnimatePresence>
        {selectedIsland && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-6 right-6 w-80 bg-slate-900/95 border border-gold-600 rounded-lg p-6 shadow-2xl backdrop-blur-xl z-40"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-serif text-gold-400">{selectedIsland.name}</h3>
              <button 
                onClick={() => setSelectedIsland(null)}
                className="text-slate-500 hover:text-gold-400 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="min-h-[80px] mb-6">
              {isLoadingFlavor ? (
                <div className="flex items-center gap-2 text-slate-400 text-sm animate-pulse">
                  <Search size={16} />
                  <span>Scanning archives...</span>
                </div>
              ) : (
                <p className="text-slate-300 text-sm leading-relaxed italic">
                  "{flavorText}"
                </p>
              )}
            </div>

            <button
              onClick={handleTravel}
              disabled={isLoadingFlavor}
              className="w-full py-3 bg-gold-600 hover:bg-gold-500 text-slate-950 font-bold uppercase tracking-widest rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Travel Here
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Travel Overlay */}
      <AnimatePresence>
        {isTraveling && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
          >
            <div className="text-center">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full mx-auto mb-4"
              />
              <div className="text-2xl font-serif text-gold-500 animate-pulse">
                Traveling through the Aether...
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* HUD / Status */}
      <div className="absolute bottom-6 left-6 bg-slate-950/90 p-4 rounded-lg border border-gold-600/50 text-gold-100 shadow-xl backdrop-blur-md flex items-center gap-6 z-30">
        <div>
          <div className="text-xs text-slate-400 uppercase tracking-widest mb-1">Current Location</div>
          <div className="text-xl font-serif text-gold-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
            {currentIsland}
          </div>
        </div>
        
        {/* Combat Trigger */}
        <button 
          onClick={() => {
            const islandEnemies = ENEMIES[currentIsland] || ENEMIES["Aetherium Spire - Home"];
            const randomEnemy = islandEnemies[Math.floor(Math.random() * islandEnemies.length)];
            
            // Dispatch custom event with enemy data
            const event = new CustomEvent('START_COMBAT', { detail: { enemy: randomEnemy } });
            window.dispatchEvent(event);
          }}
          className="px-4 py-2 bg-red-900/50 border border-red-500 text-red-200 rounded hover:bg-red-800/50 transition-colors text-sm font-bold uppercase tracking-wider"
        >
          Engage Enemy
        </button>
      </div>
    </div>
  );
}
