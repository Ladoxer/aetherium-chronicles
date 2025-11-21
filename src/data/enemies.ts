import { Character } from "@/types/combat";

export const ENEMIES: Record<string, Character[]> = {
  "Aetherium Spire - Home": [
    {
      id: "training-automaton",
      name: "Training Automaton",
      role: "Construct",
      description: "A basic combat unit used for training new recruits.",
      image: "/enemy-sentinel.png", // Keep original sentinel for this one
      stats: { strength: 3, agility: 2, magic: 0 },
      maxHP: 50,
      currentHP: 50,
      attackPower: 5,
      defense: 2,
      isPlayer: false,
      level: 1,
      experience: 0,
      expToNextLevel: 0,
      statPoints: 0,
      inventory: []
    }
  ],
  "Clockwork Citadel": [
    {
      id: "clockwork-sentinel",
      name: "Clockwork Sentinel",
      role: "Guardian",
      description: "A standard security unit of the Citadel.",
      image: "/enemy-sentinel.png",
      stats: { strength: 8, agility: 2, magic: 0 },
      maxHP: 120,
      currentHP: 120,
      attackPower: 12,
      defense: 8,
      isPlayer: false,
      level: 3,
      experience: 0,
      expToNextLevel: 0,
      statPoints: 0,
      inventory: []
    },
    {
      id: "steam-golem",
      name: "Steam Golem",
      role: "Heavy Construct",
      description: "A massive, steam-powered juggernaut.",
      image: "/steam-golem.png",
      stats: { strength: 12, agility: 1, magic: 0 },
      maxHP: 200,
      currentHP: 200,
      attackPower: 18,
      defense: 12,
      isPlayer: false,
      level: 5,
      experience: 0,
      expToNextLevel: 0,
      statPoints: 0,
      inventory: []
    }
  ],
  "The Whispering Falls": [
    {
      id: "aether-wisp",
      name: "Aether Wisp",
      role: "Spirit",
      description: "A volatile manifestation of raw aether.",
      image: "/aether-wisp.png",
      stats: { strength: 2, agility: 10, magic: 8 },
      maxHP: 60,
      currentHP: 60,
      attackPower: 15,
      defense: 2,
      isPlayer: false,
      level: 2,
      experience: 0,
      expToNextLevel: 0,
      statPoints: 0,
      inventory: []
    },
    {
      id: "mist-stalker",
      name: "Mist Stalker",
      role: "Beast",
      description: "A predatory creature that hunts in the fog.",
      image: "/mist-stalker.png",
      stats: { strength: 9, agility: 9, magic: 2 },
      maxHP: 100,
      currentHP: 100,
      attackPower: 14,
      defense: 4,
      isPlayer: false,
      level: 4,
      experience: 0,
      expToNextLevel: 0,
      statPoints: 0,
      inventory: []
    }
  ],
  "Sky-Pirate's Den": [
    {
      id: "pirate-grunt",
      name: "Sky-Pirate Grunt",
      role: "Humanoid",
      description: "A low-ranking crew member looking for trouble.",
      image: "/sky-pirate-grunt.png",
      stats: { strength: 6, agility: 6, magic: 1 },
      maxHP: 90,
      currentHP: 90,
      attackPower: 10,
      defense: 5,
      isPlayer: false,
      level: 3,
      experience: 0,
      expToNextLevel: 0,
      statPoints: 0,
      inventory: []
    },
    {
      id: "captain-vance",
      name: "Dread Captain Vance",
      role: "Boss",
      description: "The ruthless leader of the Sky-Pirates.",
      image: "/dread-captain-vance.png",
      stats: { strength: 10, agility: 8, magic: 5 },
      maxHP: 250,
      currentHP: 250,
      attackPower: 20,
      defense: 10,
      isPlayer: false,
      level: 8,
      experience: 0,
      expToNextLevel: 0,
      statPoints: 0,
      inventory: []
    }
  ]
};
