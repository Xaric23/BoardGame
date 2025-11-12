import type { PlayerClass, PlayerRace, Ability, PlayerStats } from '../types/game';

// Class-based abilities
export const WARRIOR_ABILITIES: Ability[] = [
  {
    id: 'cleave',
    name: 'Cleave',
    description: 'A powerful melee attack that deals heavy damage',
    damage: 15,
    cooldown: 2,
    currentCooldown: 0,
  },
  {
    id: 'shield_bash',
    name: 'Shield Bash',
    description: 'Bash enemy with shield, dealing damage and stunning',
    damage: 10,
    cooldown: 3,
    currentCooldown: 0,
  },
  {
    id: 'war_cry',
    name: 'War Cry',
    description: 'Boost attack temporarily',
    cooldown: 4,
    currentCooldown: 0,
  },
];

export const MAGE_ABILITIES: Ability[] = [
  {
    id: 'fireball',
    name: 'Fireball',
    description: 'Launch a ball of fire dealing massive damage',
    damage: 20,
    cooldown: 3,
    currentCooldown: 0,
  },
  {
    id: 'ice_shard',
    name: 'Ice Shard',
    description: 'Fire sharp ice dealing moderate damage',
    damage: 12,
    cooldown: 2,
    currentCooldown: 0,
  },
  {
    id: 'arcane_shield',
    name: 'Arcane Shield',
    description: 'Create a magical shield that absorbs damage',
    cooldown: 4,
    currentCooldown: 0,
  },
];

export const ROGUE_ABILITIES: Ability[] = [
  {
    id: 'backstab',
    name: 'Backstab',
    description: 'Strike from shadows for critical damage',
    damage: 18,
    cooldown: 2,
    currentCooldown: 0,
  },
  {
    id: 'poison_dart',
    name: 'Poison Dart',
    description: 'Throw poisoned dart that deals damage over time',
    damage: 8,
    cooldown: 2,
    currentCooldown: 0,
  },
  {
    id: 'evasion',
    name: 'Evasion',
    description: 'Dodge the next attack',
    cooldown: 3,
    currentCooldown: 0,
  },
];

export const CLERIC_ABILITIES: Ability[] = [
  {
    id: 'holy_smite',
    name: 'Holy Smite',
    description: 'Smite enemy with holy power',
    damage: 12,
    cooldown: 2,
    currentCooldown: 0,
  },
  {
    id: 'heal',
    name: 'Heal',
    description: 'Restore health to yourself',
    healing: 20,
    cooldown: 3,
    currentCooldown: 0,
  },
  {
    id: 'divine_protection',
    name: 'Divine Protection',
    description: 'Grant temporary invulnerability',
    cooldown: 5,
    currentCooldown: 0,
  },
];

// Base stats for each class
export const CLASS_BASE_STATS: Record<PlayerClass, PlayerStats> = {
  Warrior: {
    maxHealth: 100,
    currentHealth: 100,
    attack: 12,
    defense: 8,
    speed: 5,
  },
  Mage: {
    maxHealth: 70,
    currentHealth: 70,
    attack: 15,
    defense: 4,
    speed: 7,
  },
  Rogue: {
    maxHealth: 80,
    currentHealth: 80,
    attack: 14,
    defense: 5,
    speed: 9,
  },
  Cleric: {
    maxHealth: 90,
    currentHealth: 90,
    attack: 10,
    defense: 7,
    speed: 6,
  },
};

// Racial bonuses
export const RACE_BONUSES: Record<PlayerRace, Partial<PlayerStats>> = {
  Human: {
    maxHealth: 10,
    currentHealth: 10,
    attack: 2,
    defense: 2,
  },
  Elf: {
    speed: 3,
    attack: 3,
  },
  Dwarf: {
    maxHealth: 20,
    currentHealth: 20,
    defense: 3,
  },
  Orc: {
    attack: 5,
    maxHealth: 15,
    currentHealth: 15,
    defense: -2,
  },
};

export const getAbilitiesForClass = (playerClass: PlayerClass): Ability[] => {
  switch (playerClass) {
    case 'Warrior':
      return [...WARRIOR_ABILITIES];
    case 'Mage':
      return [...MAGE_ABILITIES];
    case 'Rogue':
      return [...ROGUE_ABILITIES];
    case 'Cleric':
      return [...CLERIC_ABILITIES];
  }
};

export const getBaseStats = (playerClass: PlayerClass, race: PlayerRace): PlayerStats => {
  const baseStats = { ...CLASS_BASE_STATS[playerClass] };
  const racialBonus = RACE_BONUSES[race];

  return {
    maxHealth: baseStats.maxHealth + (racialBonus.maxHealth || 0),
    currentHealth: baseStats.currentHealth + (racialBonus.currentHealth || 0),
    attack: baseStats.attack + (racialBonus.attack || 0),
    defense: baseStats.defense + (racialBonus.defense || 0),
    speed: baseStats.speed + (racialBonus.speed || 0),
  };
};

export const CLASS_DESCRIPTIONS: Record<PlayerClass, string> = {
  Warrior: 'Masters of melee combat with high health and defense',
  Mage: 'Wielders of powerful magic with devastating spells',
  Rogue: 'Swift assassins with high damage and evasion',
  Cleric: 'Holy warriors who can heal and smite enemies',
};

export const RACE_DESCRIPTIONS: Record<PlayerRace, string> = {
  Human: 'Balanced in all attributes with bonus to all stats',
  Elf: 'Agile and precise with bonus to speed and attack',
  Dwarf: 'Sturdy and resilient with high health and defense',
  Orc: 'Powerful brutes with massive attack but lower defense',
};
