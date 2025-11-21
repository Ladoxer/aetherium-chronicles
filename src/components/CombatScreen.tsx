"use client";

import { useCombat } from "@/context/CombatContext";
import { motion, AnimatePresence } from "framer-motion";
import { Sword, Shield, Zap, Activity, RefreshCw, Search } from "lucide-react";
import { Action } from "@/types/combat";
import Image from "next/image";

const ACTIONS: Action[] = [
  { name: "Aether Surge", damage: 15, type: "Aetherial", description: "Blast the enemy with raw aether." },
  { name: "Clockwork Strike", damage: 10, type: "Physical", description: "A precise mechanical hit." },
  { name: "Overcharge", damage: 25, type: "Aetherial", description: "High risk, high damage attack." },
  { name: "Quick Shot", damage: 8, type: "Physical", description: "Fast attack with low cooldown." },
];

export default function CombatScreen({ onExit }: { onExit: () => void }) {
  const { state, handlePlayerAction, resetCombat } = useCombat();
  const { player, enemy, currentTurn, combatLog, combatStatus } = state;

  const handleDefeat = () => {
    resetCombat();
  };

  const handleVictory = () => {
    resetCombat();
    onExit();
  };

  return (
    <div className="w-full max-w-6xl min-h-screen md:h-[800px] flex flex-col bg-slate-950 rounded-xl border-4 border-gold-600 overflow-hidden shadow-2xl relative">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-40 z-0 grayscale-[50%] sepia-[20%]"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950/90 z-0"></div>
      
      {/* Battle View (Top Half) */}
      <div className="flex-grow relative z-10 flex flex-col md:flex-row justify-between items-center md:items-end px-4 py-4 pb-20 md:px-12 md:py-12 md:pb-24 gap-8 md:gap-0">
        
        {/* Enemy Side (Top on Mobile) */}
        <div className="flex flex-col items-center gap-4 md:gap-6 w-full md:w-1/3 relative order-1 md:order-3">
          {/* Stats Card */}
          <div className="w-full bg-slate-900/90 border border-red-900/50 p-3 md:p-4 rounded-lg backdrop-blur-md shadow-lg absolute -top-2 md:-top-12 right-0 z-20">
            <div className="flex justify-between items-end mb-2">
              <h3 className="text-lg md:text-xl font-serif text-red-400">{enemy.name}</h3>
              <span className="text-xs md:text-sm text-slate-400">Elite Construct</span>
            </div>
            {/* HP Bar */}
            <div className="w-full h-3 md:h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700 relative">
              <div className="absolute inset-0 bg-slate-900/50 z-10" />
              <motion.div 
                className="h-full bg-gradient-to-r from-red-600 to-orange-600 relative z-20"
                initial={{ width: "100%" }}
                animate={{ width: `${(enemy.currentHP / enemy.maxHP) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="text-right text-xs text-slate-500 mt-1 font-mono">{enemy.currentHP} / {enemy.maxHP} HP</div>
          </div>

          {/* Enemy Avatar */}
          <motion.div 
             animate={currentTurn === "Enemy" ? { scale: 1.05, x: [0, -5, 5, 0] } : { scale: 1 }}
             transition={currentTurn === "Enemy" ? { repeat: Infinity, duration: 0.2, repeatDelay: 3 } : {}}
             className="relative w-40 h-48 md:w-80 md:h-96 z-10 mt-16 md:mt-0"
          >
             {/* Aura */}
             {currentTurn === "Enemy" && (
               <motion.div 
                 className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full -z-10"
                 animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.1, 1] }}
                 transition={{ duration: 1.5, repeat: Infinity }}
               />
             )}

             <Image 
               src={enemy.image || "/enemy-sentinel.png"} 
               alt={enemy.name} 
               fill 
               className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
             />
          </motion.div>
        </div>

        {/* VS / Turn Indicator */}
        <div className="flex flex-col items-center gap-2 md:gap-4 mb-4 md:mb-20 order-2">
          <div className="text-4xl md:text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-gold-300 to-amber-700 font-bold drop-shadow-lg italic">VS</div>
          <motion.div 
            key={currentTurn}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`px-4 py-1 md:px-6 md:py-2 rounded-full border-2 ${currentTurn === "Player" ? "bg-green-950/50 border-green-500 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]" : "bg-red-950/50 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]"} text-xs md:text-sm font-bold uppercase tracking-[0.2em] backdrop-blur-md whitespace-nowrap`}
          >
            {currentTurn}'s Turn
          </motion.div>
        </div>

        {/* Player Side (Bottom on Mobile) */}
        <div className="flex flex-col items-center gap-4 md:gap-6 w-full md:w-1/3 relative order-3 md:order-1">
          {/* Stats Card */}
          <div className="w-full bg-slate-900/90 border border-gold-600/50 p-3 md:p-4 rounded-lg backdrop-blur-md shadow-lg absolute -top-2 md:-top-12 left-0 z-20">
            <div className="flex justify-between items-end mb-2">
              <h3 className="text-lg md:text-xl font-serif text-gold-400">{player.name}</h3>
              <span className="text-xs md:text-sm text-slate-400">Lvl {player.level}</span>
            </div>
            {/* HP Bar */}
            <div className="w-full h-3 md:h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700 relative">
               <div className="absolute inset-0 bg-slate-900/50 z-10" />
              <motion.div 
                className="h-full bg-gradient-to-r from-green-600 to-emerald-400 relative z-20"
                initial={{ width: "100%" }}
                animate={{ width: `${(player.currentHP / player.maxHP) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="text-right text-xs text-slate-500 mt-1 font-mono">{player.currentHP} / {player.maxHP} HP</div>
          </div>
          
          {/* Player Avatar */}
          <motion.div 
            animate={currentTurn === "Player" ? { scale: 1.05, filter: "brightness(1.2)" } : { scale: 1, filter: "brightness(1)" }}
            className="relative w-32 h-40 md:w-64 md:h-80 z-10 mt-16 md:mt-0"
          >
             {/* Aura */}
             {currentTurn === "Player" && (
               <motion.div 
                 className="absolute inset-0 bg-gold-500/20 blur-3xl rounded-full -z-10"
                 animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.1, 1] }}
                 transition={{ duration: 2, repeat: Infinity }}
               />
             )}
             
             <Image 
               src={player.image || "/mechanic.png"} 
               alt={player.name} 
               fill 
               className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
             />
          </motion.div>
        </div>
      </div>

      {/* Action Bar (Bottom Half) */}
      <div className="h-auto md:h-1/3 bg-slate-950 border-t-4 border-gold-600 relative z-20 flex flex-col-reverse md:flex-row shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        
        {/* Actions */}
        <div className="w-full md:w-2/3 p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 bg-[url('/noise.png')]">
          {ACTIONS.map((action) => (
            <button
              key={action.name}
              onClick={() => handlePlayerAction(action)}
              disabled={currentTurn !== "Player" || combatStatus !== 'Active'}
              className={`
                relative group overflow-hidden rounded-xl border-2 transition-all duration-300
                flex items-center px-4 md:px-6 gap-3 md:gap-5 py-3 md:py-0
                ${currentTurn === "Player" && combatStatus === 'Active'
                  ? "bg-gradient-to-br from-slate-800 to-slate-900 border-gold-600/40 hover:border-gold-400 hover:shadow-[0_0_20px_rgba(184,134,11,0.4)] hover:-translate-y-1" 
                  : "bg-slate-900 border-slate-800 opacity-40 cursor-not-allowed grayscale"}
              `}
            >
              <div className={`
                p-2 md:p-3 rounded-full shadow-inner
                ${action.type === 'Physical' 
                  ? 'bg-amber-950 border border-amber-700 text-amber-500' 
                  : 'bg-cyan-950 border border-cyan-700 text-cyan-400'}
              `}>
                {action.type === 'Physical' ? <Sword size={20} className="md:w-6 md:h-6" /> : <Zap size={20} className="md:w-6 md:h-6" />}
              </div>
              <div className="text-left z-10">
                <div className={`font-serif text-base md:text-lg font-bold transition-colors ${currentTurn === "Player" ? "text-slate-200 group-hover:text-gold-300" : "text-slate-500"}`}>
                  {action.name}
                </div>
                <div className="text-[10px] md:text-xs text-slate-400 group-hover:text-slate-300">{action.description}</div>
              </div>
              
              {/* Hover Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
            </button>
          ))}
        </div>

        {/* Combat Log */}
        <div className="w-full md:w-1/3 bg-black/60 border-b-2 md:border-b-0 md:border-l-2 border-gold-600/30 flex flex-col h-32 md:h-auto">
          <div className="p-2 md:p-3 bg-slate-900/80 border-b border-slate-800 flex items-center gap-2">
            <Activity size={14} className="text-gold-500" />
            <span className="text-xs text-gold-500 uppercase tracking-widest font-bold">Combat Log</span>
          </div>
          <div className="flex-grow p-3 md:p-4 overflow-y-auto font-mono text-xs md:text-sm space-y-2 md:space-y-3 custom-scrollbar">
            {[...combatLog].reverse().map((log, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`
                  pb-2 border-b border-slate-800/50 last:border-0
                  ${i === 0 ? "text-white font-bold" : "text-slate-400"}
                `}
              >
                <span className="text-gold-600 mr-2 opacity-50">{">"}</span>
                {log}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Victory/Defeat Overlay */}
      <AnimatePresence>
        {combatStatus !== 'Active' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className={`
                text-center space-y-6 md:space-y-8 p-6 md:p-12 rounded-2xl border-2 shadow-2xl max-w-lg w-full
                ${combatStatus === 'Victory' ? 'border-gold-500/30 bg-slate-900/90' : 'border-red-900/30 bg-slate-950/90'}
              `}
            >
              <h2 className={`text-5xl md:text-7xl font-serif font-bold ${combatStatus === 'Victory' ? 'text-transparent bg-clip-text bg-gradient-to-b from-gold-300 to-amber-600' : 'text-red-600'} drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]`}>
                {combatStatus === 'Victory' ? 'VICTORY' : 'DEFEAT'}
              </h2>
              
              <p className="text-slate-300 text-base md:text-lg">
                {combatStatus === 'Victory' 
                  ? "The Sentinel lies in ruins. You have secured the area." 
                  : "You have fallen in battle. The Spires remain unconquered."}
              </p>

              {combatStatus === 'Victory' ? (
                <button 
                  onClick={handleVictory}
                  className="
                    group relative px-8 md:px-10 py-3 md:py-4 
                    bg-slate-800 border border-gold-500/50 
                    text-gold-100 font-serif text-lg md:text-xl tracking-widest uppercase
                    hover:bg-slate-700 hover:border-gold-400 hover:shadow-[0_0_20px_rgba(184,134,11,0.4)]
                    transition-all duration-300 rounded-sm overflow-hidden
                  "
                >
                  <span className="relative z-10">Return to Map</span>
                  <div className="absolute inset-0 bg-gold-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                </button>
              ) : (
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <button 
                    onClick={handleDefeat}
                    className="
                      group relative px-6 md:px-8 py-3 md:py-4 
                      bg-red-950/50 border border-red-500/50 
                      text-red-100 font-serif text-lg md:text-xl tracking-widest uppercase
                      hover:bg-red-900/50 hover:border-red-400 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)]
                      transition-all duration-300 rounded-sm overflow-hidden
                    "
                  >
                    <span className="relative z-10">Try Again</span>
                    <div className="absolute inset-0 bg-red-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                  </button>
                  
                  <button 
                    onClick={() => { resetCombat(); onExit(); }}
                    className="
                      group relative px-6 md:px-8 py-3 md:py-4 
                      bg-slate-800 border border-slate-600 
                      text-slate-300 font-serif text-lg md:text-xl tracking-widest uppercase
                      hover:bg-slate-700 hover:border-slate-500 hover:text-white
                      transition-all duration-300 rounded-sm overflow-hidden
                    "
                  >
                    <span className="relative z-10">Give Up</span>
                    <div className="absolute inset-0 bg-slate-600/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
