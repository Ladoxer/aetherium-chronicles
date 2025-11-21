
import { combatReducer, initialState as initialCombatState, CombatAction, CombatState } from './src/context/CombatContext';
import { calculateLevelUp } from './src/context/GameContext';
import { Character, Action } from './src/types/combat';

// --- Helper for Assertions ---
function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

console.log("🚀 Starting Game Workflow Test Script...");

// --- 1. Setup Test ---
console.log("\n--- 1. Setup Test ---");

const mockPlayer: Character = {
  id: "test-hero",
  name: "Test Hero",
  role: "Tester",
  description: "A hero for testing.",
  image: "/mechanic.png",
  stats: { strength: 5, agility: 5, magic: 5 },
  maxHP: 1000,
  currentHP: 1000,
  attackPower: 50,
  defense: 5,
  isPlayer: true,
  level: 1,
  experience: 0,
  expToNextLevel: 100,
  statPoints: 0,
  inventory: []
};

// Verify Player Object Integrity
assert(mockPlayer.currentHP === 1000, "Player starts with full HP");
assert(mockPlayer.level === 1, "Player starts at level 1");

// --- 2. Combat Test (The Core Loop) ---
console.log("\n--- 2. Combat Test ---");

// Initialize Combat
let combatState = combatReducer(initialCombatState, { type: "SET_PLAYER", player: mockPlayer });

assert(combatState.combatStatus === 'Active', "Combat initialized and Active");
assert(combatState.player.id === mockPlayer.id, "Player set correctly in combat");
assert(combatState.currentTurn === "Player", "Player starts first");

// Player Action
const attackAction: Action = { name: "Test Attack", damage: 10, type: "Physical", description: "Test" };
console.log(`> Player uses ${attackAction.name}`);

combatState = combatReducer(combatState, { type: "PLAYER_ACTION", action: attackAction });

// Expected Damage Calculation:
// Damage = (ActionDmg 10 + PlayerAtk 50) - EnemyDef 8 = 52
// Enemy HP = 120 - 52 = 68
assert(combatState.enemy.currentHP === 68, `Enemy HP decreased correctly (Expected 68, Got ${combatState.enemy.currentHP})`);
assert(combatState.currentTurn === "Enemy", "Turn switched to Enemy");

// Enemy Action
console.log("> Enemy attacks back");
combatState = combatReducer(combatState, { type: "ENEMY_ACTION" });

// Expected Damage Calculation:
// Damage = (EnemyAtk 12 + 10) - PlayerDef 5 = 17
// Player HP = 1000 - 17 = 983
assert(combatState.player.currentHP === 983, `Player HP decreased correctly (Expected 983, Got ${combatState.player.currentHP})`);
assert(combatState.currentTurn === "Player", "Turn switched back to Player");


// --- 3. Resolution and Progression Test ---
console.log("\n--- 3. Resolution and Progression Test ---");

// Force Victory
// We need to deal 108 more damage. 
// Let's hack the state slightly to speed up the test or just loop.
// Let's loop attacks.
let turns = 0;
while (combatState.enemy.currentHP > 0 && turns < 20) {
  combatState = combatReducer(combatState, { type: "PLAYER_ACTION", action: attackAction });
  if (combatState.combatStatus === 'Victory') break;
  
  // If still active, enemy turn (unless we want to simulate a one-sided beatdown for speed, but reducer enforces turns)
  // The reducer checks turn, so we must respect it.
  // Wait, my reducer logic for PLAYER_ACTION sets turn to Enemy.
  // So I must simulate Enemy action too if I want to get back to Player turn.
  // But I can just mock the state to be Player turn if I want to cheat, but let's play fair.
  
  if (combatState.combatStatus === 'Active') {
      combatState = combatReducer(combatState, { type: "ENEMY_ACTION" });
  }
  turns++;
}

assert(combatState.combatStatus === 'Victory', "Combat ended in Victory");
assert(combatState.enemy.currentHP === 0, "Enemy HP is 0");

// Progression
console.log("> Checking Progression Logic");
const xpGain = 50;
const { newCharacter, leveledUp } = calculateLevelUp(mockPlayer, xpGain);

assert(newCharacter.experience === 50, "Experience increased by 50");
assert(newCharacter.level === 1, "Player did not level up yet (50/100)");
assert(leveledUp === false, "LeveledUp flag is false");

// Level Up Test
console.log("> Checking Level Up Logic");
const bigXpGain = 60; // Total 110
const { newCharacter: leveledChar, leveledUp: isLevelUp } = calculateLevelUp(newCharacter, bigXpGain);

assert(leveledChar.level === 2, "Player leveled up to 2");
assert(leveledChar.experience === 10, "Experience carried over correctly (110 - 100 = 10)");
assert(leveledChar.statPoints === 3, "Granted 3 stat points");
assert(isLevelUp === true, "LeveledUp flag is true");


// --- 4. Defeat Test ---
console.log("\n--- 4. Defeat Test ---");

const weakPlayer: Character = {
  ...mockPlayer,
  maxHP: 10,
  currentHP: 10,
  defense: 0
};

// Reset Combat with Weak Player
combatState = combatReducer(initialCombatState, { type: "SET_PLAYER", player: weakPlayer });

// Force Defeat
// Enemy deals ~22 dmg (12+10 - 0). 1 hit kills.
for (let i = 0; i < 10; i++) {
    combatState = { ...combatState, currentTurn: "Enemy" };
    combatState = combatReducer(combatState, { type: "ENEMY_ACTION" });
    if (combatState.combatStatus === 'Defeat') break;
}

assert(combatState.combatStatus === 'Defeat', "Combat ended in Defeat");
assert(combatState.player.currentHP === 0, "Player HP is 0");

console.log("\n🎉 All Tests Passed Successfully!");
