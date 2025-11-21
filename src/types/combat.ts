export interface InventoryItem {
  id: string;
  name: string;
  type: 'Weapon' | 'Armor' | 'Consumable';
  statBonus?: { [key: string]: number };
  description: string;
}

export interface Character {
  id: string;
  name: string;
  role?: string;
  description?: string;
  maxHP: number;
  currentHP: number;
  attackPower: number;
  defense: number;
  stats?: { strength: number; agility: number; magic: number };
  level: number;
  experience: number;
  expToNextLevel: number;
  statPoints: number;
  inventory: InventoryItem[];
  isPlayer: boolean;
  image?: string;
}

export interface Action {
  name: string;
  damage: number;
  type: 'Physical' | 'Aetherial';
  description?: string;
}

export interface CombatState {
  player: Character;
  enemy: Character;
  currentTurn: 'Player' | 'Enemy';
  combatLog: string[];
  isCombatOver: boolean;
  winner?: 'Player' | 'Enemy';
}
