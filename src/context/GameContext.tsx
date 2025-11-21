"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Character, InventoryItem } from "@/types/combat";

type GameState = {
  currentIsland: string;
  isTraveling: boolean;
  playerStats: Character | null;
};

type GameContextType = GameState & {
  travelToIsland: (islandName: string) => void;
  setPlayer: (character: Character) => void;
  gainExperience: (amount: number) => void;
  spendStatPoint: (stat: 'attackPower' | 'defense' | 'maxHP') => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const calculateLevelUp = (character: Character, amount: number): { newCharacter: Character, leveledUp: boolean } => {
  let { experience, level, expToNextLevel, statPoints, maxHP, attackPower, currentHP } = { ...character };
  experience += amount;

  let leveledUp = false;
  while (experience >= expToNextLevel) {
    experience -= expToNextLevel;
    level += 1;
    expToNextLevel = Math.floor(expToNextLevel * 1.5);
    statPoints += 3;
    maxHP += 10;
    currentHP = maxHP; // Heal on level up
    attackPower += 2;
    leveledUp = true;
  }

  return {
    newCharacter: {
      ...character,
      experience,
      level,
      expToNextLevel,
      statPoints,
      maxHP,
      currentHP,
      attackPower,
    },
    leveledUp
  };
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [currentIsland, setCurrentIsland] = useState("Aetherium Spire - Home");
  const [isTraveling, setIsTraveling] = useState(false);
  const [playerStats, setPlayerStats] = useState<Character | null>(null);

  const travelToIsland = (islandName: string) => {
    if (islandName === currentIsland) return;
    
    setIsTraveling(true);
    // Simulate travel time
    setTimeout(() => {
      setCurrentIsland(islandName);
      setIsTraveling(false);
    }, 1500);
  };

  const setPlayer = (character: Character) => {
    setPlayerStats(character);
  };

  const gainExperience = (amount: number) => {
    if (!playerStats) return;

    const { newCharacter, leveledUp } = calculateLevelUp(playerStats, amount);

    setPlayerStats(newCharacter);
    
    if (leveledUp) {
      // Could add a toast notification here later
      console.log("Level Up!", newCharacter.level);
    }
  };

  const spendStatPoint = (stat: 'attackPower' | 'defense' | 'maxHP') => {
    if (!playerStats || playerStats.statPoints <= 0) return;

    const updates: Partial<Character> = {
      statPoints: playerStats.statPoints - 1
    };

    if (stat === 'maxHP') {
      updates.maxHP = playerStats.maxHP + 5;
      updates.currentHP = playerStats.currentHP + 5;
    } else {
      updates[stat] = playerStats[stat] + 1;
    }

    setPlayerStats({ ...playerStats, ...updates });
  };

  return (
    <GameContext.Provider value={{ 
      currentIsland, 
      isTraveling, 
      playerStats, 
      travelToIsland, 
      setPlayer,
      gainExperience,
      spendStatPoint 
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
