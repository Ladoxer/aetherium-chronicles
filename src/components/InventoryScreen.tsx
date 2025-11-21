"use client";

import { useGame } from "@/context/GameContext";
import { motion } from "framer-motion";
import { X, Package, Info } from "lucide-react";
import { useState } from "react";
import { InventoryItem } from "@/types/combat";

export default function InventoryScreen({ onClose }: { onClose: () => void }) {
  const { playerStats } = useGame();
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  if (!playerStats) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-4xl bg-slate-900 border-2 border-slate-600 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[600px]"
      >
        {/* Header */}
        <div className="p-6 bg-slate-950 border-b border-slate-700 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Package className="text-slate-400" />
            <h2 className="text-2xl font-serif text-slate-200">Inventory</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-grow overflow-hidden">
          {/* Item List */}
          <div className="w-2/3 p-6 overflow-y-auto custom-scrollbar border-r border-slate-700 bg-slate-900/50">
            <div className="grid grid-cols-3 gap-4">
              {playerStats.inventory.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`
                    aspect-square rounded-lg border-2 p-4 flex flex-col items-center justify-center gap-2 transition-all
                    ${selectedItem?.id === item.id 
                      ? "bg-slate-800 border-gold-500 shadow-[0_0_15px_rgba(184,134,11,0.2)]" 
                      : "bg-slate-800/50 border-slate-700 hover:border-slate-500 hover:bg-slate-800"}
                  `}
                >
                  <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center">
                    {/* Placeholder Icon Logic */}
                    <div className="text-2xl">
                      {item.type === 'Weapon' ? '⚔️' : item.type === 'Armor' ? '🛡️' : '🧪'}
                    </div>
                  </div>
                  <span className="text-xs text-center font-medium text-slate-300 line-clamp-2">{item.name}</span>
                </button>
              ))}
              
              {/* Empty Slots Filler */}
              {Array.from({ length: Math.max(0, 12 - playerStats.inventory.length) }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square rounded-lg border-2 border-slate-800/50 bg-slate-900/20 flex items-center justify-center">
                  <div className="w-2 h-2 bg-slate-800 rounded-full opacity-20" />
                </div>
              ))}
            </div>
          </div>

          {/* Item Details Sidebar */}
          <div className="w-1/3 p-6 bg-slate-950 flex flex-col">
            {selectedItem ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-gold-500">{selectedItem.type}</span>
                  <h3 className="text-2xl font-serif text-white">{selectedItem.name}</h3>
                </div>

                <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 text-slate-400 text-sm leading-relaxed">
                  {selectedItem.description}
                </div>

                {selectedItem.statBonus && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-slate-500 uppercase">Stats</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {Object.entries(selectedItem.statBonus).map(([stat, value]) => (
                        <div key={stat} className="flex justify-between items-center p-2 bg-slate-900 rounded border border-slate-800">
                          <span className="text-slate-400 capitalize">{stat.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="text-green-400 font-mono">+{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-auto pt-6">
                  <button className="w-full py-3 bg-gold-600 hover:bg-gold-500 text-black font-bold rounded transition-colors uppercase tracking-wider text-sm">
                    Equip Item
                  </button>
                  <p className="text-center text-xs text-slate-600 mt-2">Equipping not yet implemented</p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4">
                <Info size={48} className="opacity-20" />
                <p>Select an item to view details</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
