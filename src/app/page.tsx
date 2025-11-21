"use client";

import { useState, useEffect } from "react";
import { GameProvider, useGame } from "@/context/GameContext";
import { CombatProvider, useCombat } from "@/context/CombatContext";
import AetheriumMap from "@/components/AetheriumMap";
import CombatScreen from "@/components/CombatScreen";
import CharacterSheet from "@/components/CharacterSheet";
import InventoryScreen from "@/components/InventoryScreen";
import { motion, AnimatePresence } from "framer-motion";
import { Sword, Zap, Wind, ArrowRight, User, Package } from "lucide-react";
import Image from "next/image";
import { Character } from "@/types/combat";

const characters: Character[] = [
  {
    id: "mechanic",
    name: "Arin the Mechanic",
    role: "Gadgeteer",
    description: "Master of machines and steam-powered inventions.",
    image: "/mechanic.png",
    stats: { strength: 4, agility: 6, magic: 3 },
    maxHP: 110,
    currentHP: 110,
    attackPower: 12,
    defense: 6,
    isPlayer: true,
    level: 1,
    experience: 0,
    expToNextLevel: 100,
    statPoints: 0,
    inventory: []
  },
  {
    id: "skypirate",
    name: "Kael the Sky-Pirate",
    role: "Duelist",
    description: "A swift and cunning rogue of the high skies.",
    image: "/skypirate.png",
    stats: { strength: 6, agility: 8, magic: 2 },
    maxHP: 90,
    currentHP: 90,
    attackPower: 15,
    defense: 4,
    isPlayer: true,
    level: 1,
    experience: 0,
    expToNextLevel: 100,
    statPoints: 0,
    inventory: []
  },
  {
    id: "alchemist",
    name: "Lyra the Alchemist",
    role: "Scholar",
    description: "Wielder of volatile potions and arcane secrets.",
    image: "/alchemist.png",
    stats: { strength: 3, agility: 5, magic: 9 },
    maxHP: 80,
    currentHP: 80,
    attackPower: 8,
    defense: 3,
    isPlayer: true,
    level: 1,
    experience: 0,
    expToNextLevel: 100,
    statPoints: 0,
    inventory: []
  },
];

function GameContent() {
  const [selectedCharId, setSelectedCharId] = useState<string | null>(null);
  const [view, setView] = useState<"CHARACTER_SELECT" | "MAP" | "COMBAT">("CHARACTER_SELECT");
  const [showCharacterSheet, setShowCharacterSheet] = useState(false);
  const [showInventory, setShowInventory] = useState(false);

  const { startCombat } = useCombat();
  const { setPlayer, playerStats } = useGame();

  useEffect(() => {
    const handleStartCombat = (e: Event) => {
      if (playerStats) {
        const customEvent = e as CustomEvent;
        const enemy = customEvent.detail?.enemy;
        startCombat(playerStats, enemy);
        setView("COMBAT");
      }
    };
    window.addEventListener('START_COMBAT', handleStartCombat);
    return () => window.removeEventListener('START_COMBAT', handleStartCombat);
  }, [playerStats, startCombat]);

  const handleSelect = (id: string) => {
    setSelectedCharId(id);
  };

  const handleStartAdventure = () => {
    if (selectedCharId) {
      const char = characters.find(c => c.id === selectedCharId);
      if (char) {
        // Initialize player with inventory
        const initialPlayer: Character = {
          ...char,
          inventory: [
            {
              id: 'potion-1',
              name: 'Health Potion',
              type: 'Consumable',
              description: 'Restores 50 HP',
              statBonus: { currentHP: 50 }
            },
            {
              id: 'sword-1',
              name: 'Rusty Sword',
              type: 'Weapon',
              description: 'A basic sword',
              statBonus: { attackPower: 2 }
            }
          ]
        };
        setPlayer(initialPlayer);
        setView("MAP");
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-slate-950 text-slate-200 relative">



      {/* Modals */}
      <AnimatePresence>
        {showCharacterSheet && <CharacterSheet onClose={() => setShowCharacterSheet(false)} />}
        {showInventory && <InventoryScreen onClose={() => setShowInventory(false)} />}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {view === "CHARACTER_SELECT" ? (
          <motion.div
            key="char-select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="z-10 w-full max-w-6xl flex flex-col items-center gap-12"
          >
            <div className="text-center space-y-4">
              <h1 className="text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-gold-300 to-amber-700 drop-shadow-lg">
                Chronicles of the Aetherium Spires
              </h1>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Select your champion and ascend the floating realms.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              {characters.map((char) => (
                <motion.div
                  key={char.id}
                  whileHover={{ y: -10, transition: { duration: 0.2 } }}
                  onClick={() => handleSelect(char.id)}
                  className={`
                    relative cursor-pointer group
                    bg-slate-900/80 backdrop-blur-sm rounded-xl overflow-hidden
                    border-2 transition-all duration-300
                    ${selectedCharId === char.id ? "border-gold-500 shadow-[0_0_30px_rgba(184,134,11,0.3)]" : "border-slate-700 hover:border-slate-500"}
                  `}
                >
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
                    <Image
                      src={char.image || "/placeholder.png"}
                      alt={char.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <h3 className={`text-2xl font-serif font-bold mb-1 ${selectedCharId === char.id ? "text-gold-400" : "text-slate-200"}`}>
                      {char.name}
                    </h3>
                    <p className="text-sm text-slate-400 mb-4">{char.description}</p>

                    <div className="flex gap-4 text-sm font-mono">
                      <div className="flex items-center gap-1 text-red-400">
                        <Sword size={14} /> {char.stats?.strength}
                      </div>
                      <div className="flex items-center gap-1 text-green-400">
                        <Wind size={14} /> {char.stats?.agility}
                      </div>
                      <div className="flex items-center gap-1 text-blue-400">
                        <Zap size={14} /> {char.stats?.magic}
                      </div>
                    </div>
                  </div>

                  {/* Selection Glow */}
                  {selectedCharId === char.id && (
                    <motion.div
                      layoutId="selection-glow"
                      className="absolute inset-0 border-2 border-gold-500 rounded-xl pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Start Button */}
            <div className="h-24 flex items-center justify-center">
              <AnimatePresence>
                {selectedCharId && (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onClick={handleStartAdventure}
                    className="
                      group relative px-16 py-5
                      bg-gradient-to-r from-amber-900 to-slate-900
                      border border-gold-500
                      text-gold-100 font-serif text-xl tracking-[0.2em] uppercase
                      hover:shadow-[0_0_30px_rgba(184,134,11,0.6)]
                      active:scale-95
                      transition-all duration-300
                      overflow-hidden rounded-sm
                    "
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      Start Adventure
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gold-500/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : view === "MAP" ? (
          <motion.div
            key="map-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-6xl"
          >
            <div className="text-center mb-8 space-y-2">
              <h2 className="text-4xl font-serif text-gold-500 drop-shadow-md">The Aetherium Spires</h2>
              <p className="text-slate-400">Navigate the floating islands to begin your quest.</p>
            </div>
            <AetheriumMap 
              onOpenProfile={() => setShowCharacterSheet(true)} 
              onOpenInventory={() => setShowInventory(true)} 
            />
            <div className="mt-8 text-center">
              <button
                onClick={() => setView("CHARACTER_SELECT")}
                className="text-sm text-slate-500 hover:text-gold-400 underline transition-colors"
              >
                Return to Character Selection
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="combat-view"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full flex justify-center"
          >
            <CombatScreen onExit={() => setView("MAP")} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function Home() {
  return (
    <GameProvider>
      <CombatProvider>
        <GameContent />
      </CombatProvider>
    </GameProvider>
  );
}
