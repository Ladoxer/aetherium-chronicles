"use client";

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from "react";
import { Character, Action } from "@/types/combat";
import { useGame } from "@/context/GameContext";

export interface CombatState {
  player: Character;
  enemy: Character;
  currentTurn: "Player" | "Enemy";
  combatLog: string[];
  combatStatus: 'Active' | 'Victory' | 'Defeat';
  winner: "Player" | "Enemy" | null;
}

export const initialState: CombatState = {
  player: {
    id: "hero",
    name: "Hero",
    role: "Adventurer",
    description: "A brave soul.",
    image: "/mechanic.png",
    stats: { strength: 5, agility: 5, magic: 5 },
    maxHP: 100,
    currentHP: 100,
    attackPower: 10,
    defense: 5,
    isPlayer: true,
    level: 1,
    experience: 0,
    expToNextLevel: 100,
    statPoints: 0,
    inventory: []
  },
  enemy: {
    id: "enemy",
    name: "Clockwork Sentinel",
    role: "Guardian",
    description: "A mechanical guardian.",
    image: "/enemy-sentinel.png",
    stats: { strength: 8, agility: 2, magic: 0 },
    maxHP: 120,
    currentHP: 120,
    attackPower: 12,
    defense: 8,
    isPlayer: false,
    level: 1,
    experience: 0,
    expToNextLevel: 0,
    statPoints: 0,
    inventory: []
  },
  currentTurn: "Player",
  combatLog: ["Combat Started!"],
  combatStatus: 'Active',
  winner: null,
};

// Actions
export type CombatAction =
  | { type: "SET_PLAYER"; player: Character; enemy?: Character }
  | { type: "PLAYER_ACTION"; action: Action }
  | { type: "ENEMY_ACTION" }
  | { type: "RESET_COMBAT" };

// Reducer
export const combatReducer = (state: CombatState, action: CombatAction): CombatState => {
  switch (action.type) {
    case "SET_PLAYER":
      const newEnemy = action.enemy || { ...initialState.enemy, currentHP: initialState.enemy.maxHP };
      return {
        ...state,
        player: action.player,
        enemy: newEnemy,
        combatLog: [`Combat Started! ${newEnemy.name} blocks your path.`],
        combatStatus: 'Active',
        currentTurn: "Player",
      };
// ... (rest of reducer logic remains same, implicitly handled by next chunk if needed, but I'll include enough context)
    case "PLAYER_ACTION": {
      if (state.currentTurn !== "Player" || state.combatStatus !== 'Active') return state;

      const { action: playerAction } = action;
      const rawDamage = playerAction.damage + state.player.attackPower;
      const damage = Math.max(1, rawDamage - state.enemy.defense);
      
      const newEnemyHP = Math.max(0, state.enemy.currentHP - damage);
      const isEnemyDefeated = newEnemyHP === 0;

      const newLog = [
        ...state.combatLog,
        `You used ${playerAction.name} dealing ${damage} damage!`,
      ];

      if (isEnemyDefeated) {
        return {
          ...state,
          enemy: { ...state.enemy, currentHP: 0 },
          combatLog: [...newLog, "VICTORY! The Sentinel is Disabled."],
          combatStatus: 'Victory',
          winner: "Player",
        };
      }

      return {
        ...state,
        enemy: { ...state.enemy, currentHP: newEnemyHP },
        combatLog: newLog,
        currentTurn: "Enemy",
      };
    }

    case "ENEMY_ACTION": {
      if (state.currentTurn !== "Enemy" || state.combatStatus !== 'Active') return state;

      const rawDamage = state.enemy.attackPower + 10;
      const damage = Math.max(1, rawDamage - state.player.defense);
      
      const newPlayerHP = Math.max(0, state.player.currentHP - damage);
      const isPlayerDefeated = newPlayerHP === 0;

      const newLog = [
        ...state.combatLog,
        `Clockwork Sentinel used Steam Barrage for ${damage} damage.`,
      ];

      if (isPlayerDefeated) {
        return {
          ...state,
          player: { ...state.player, currentHP: 0 },
          combatLog: [...newLog, "DEFEAT. The Aether Fades."],
          combatStatus: 'Defeat',
          winner: "Enemy",
        };
      }

      return {
        ...state,
        player: { ...state.player, currentHP: newPlayerHP },
        combatLog: newLog,
        currentTurn: "Player",
      };
    }

    case "RESET_COMBAT":
      return initialState;

    default:
      return state;
  }
};
// Context
interface CombatContextType {
  state: CombatState;
  handlePlayerAction: (action: Action) => void;
  startCombat: (player: Character, enemy?: Character) => void;
  resetCombat: () => void;
}

const CombatContext = createContext<CombatContextType | undefined>(undefined);

export const CombatProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(combatReducer, initialState);
  const { gainExperience } = useGame();

  // Effect for Enemy Turn
  useEffect(() => {
    if (state.currentTurn === "Enemy" && state.combatStatus === 'Active') {
      const timer = setTimeout(() => {
        dispatch({ type: "ENEMY_ACTION" });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state.currentTurn, state.combatStatus]);

  // Effect for Victory XP
  useEffect(() => {
    if (state.combatStatus === 'Victory') {
      gainExperience(50);
    }
  }, [state.combatStatus, gainExperience]);

  const handlePlayerAction = (action: Action) => {
    dispatch({ type: "PLAYER_ACTION", action });
  };

  const startCombat = (player: Character, enemy?: Character) => {
    dispatch({ type: "SET_PLAYER", player, enemy });
  };

  const resetCombat = () => {
    dispatch({ type: "RESET_COMBAT" });
  };

  return (
    <CombatContext.Provider value={{ state, handlePlayerAction, startCombat, resetCombat }}>
      {children}
    </CombatContext.Provider>
  );
};

export const useCombat = () => {
  const context = useContext(CombatContext);
  if (context === undefined) {
    throw new Error("useCombat must be used within a CombatProvider");
  }
  return context;
};
