"use client";

import { useGame } from "@/context/GameContext";
import { motion } from "framer-motion";
import { X, Shield, Sword, Heart, Zap } from "lucide-react";

export default function CharacterSheet({ onClose }: { onClose: () => void }) {
  const { playerStats, spendStatPoint } = useGame();

  if (!playerStats) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl bg-slate-900 border-2 border-gold-600 rounded-xl overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="p-6 bg-slate-950 border-b border-gold-600/30 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-serif text-gold-400">{playerStats.name}</h2>
            <p className="text-slate-400 text-sm">{playerStats.role} - Level {playerStats.level}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 grid grid-cols-2 gap-12">
          
          {/* Left Column: Avatar & XP */}
          <div className="space-y-6">
            <div className="aspect-[3/4] bg-slate-800 rounded-lg relative overflow-hidden border border-slate-700">
               {/* Placeholder for Avatar if image fails or is just a path */}
               <div className="absolute inset-0 flex items-center justify-center text-slate-600">
                 [Character Avatar]
               </div>
               {playerStats.image && (
                 <img src={playerStats.image} alt={playerStats.name} className="absolute inset-0 w-full h-full object-cover" />
               )}
            </div>

            {/* XP Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gold-200 uppercase tracking-wider">
                <span>Experience</span>
                <span>{playerStats.experience} / {playerStats.expToNextLevel}</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gold-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(playerStats.experience / playerStats.expToNextLevel) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Stats */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-xl font-serif text-slate-200 border-b border-slate-800 pb-2">Attributes</h3>
              
              <div className="space-y-4">
                {/* Attack */}
                <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-950/50 rounded text-red-400"><Sword size={18} /></div>
                    <span className="text-slate-300">Attack Power</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-bold text-white">{playerStats.attackPower}</span>
                    {playerStats.statPoints > 0 && (
                      <button 
                        onClick={() => spendStatPoint('attackPower')}
                        className="w-8 h-8 flex items-center justify-center bg-gold-600 hover:bg-gold-500 text-black font-bold rounded transition-colors"
                      >
                        +
                      </button>
                    )}
                  </div>
                </div>

                {/* Defense */}
                <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-950/50 rounded text-blue-400"><Shield size={18} /></div>
                    <span className="text-slate-300">Defense</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-bold text-white">{playerStats.defense}</span>
                    {playerStats.statPoints > 0 && (
                      <button 
                        onClick={() => spendStatPoint('defense')}
                        className="w-8 h-8 flex items-center justify-center bg-gold-600 hover:bg-gold-500 text-black font-bold rounded transition-colors"
                      >
                        +
                      </button>
                    )}
                  </div>
                </div>

                {/* Max HP */}
                <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-950/50 rounded text-green-400"><Heart size={18} /></div>
                    <span className="text-slate-300">Max HP</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-bold text-white">{playerStats.maxHP}</span>
                    {playerStats.statPoints > 0 && (
                      <button 
                        onClick={() => spendStatPoint('maxHP')}
                        className="w-8 h-8 flex items-center justify-center bg-gold-600 hover:bg-gold-500 text-black font-bold rounded transition-colors"
                      >
                        +
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stat Points Available */}
            {playerStats.statPoints > 0 && (
              <div className="p-4 bg-gold-900/20 border border-gold-500/30 rounded-lg flex items-center gap-3">
                <Zap className="text-gold-400" size={20} />
                <span className="text-gold-200 font-medium">
                  {playerStats.statPoints} Stat Points Available
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
