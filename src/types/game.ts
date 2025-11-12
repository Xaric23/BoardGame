// Core game types and interfaces

export interface User {
  id: string;
  name: string;
  email?: string;
  loginMethod: 'username' | 'google';
  loginTime: number;
}

export type PlayerClass = 'Warrior' | 'Mage' | 'Rogue' | 'Cleric' | 'Ranger' | 'Paladin';
export type PlayerRace = 'Human' | 'Elf' | 'Dwarf' | 'Orc' | 'Halfling' | 'Dragonborn';
export type TileType = 'empty' | 'start' | 'enemy' | 'treasure' | 'event' | 'boss' | 'exit';
export type Direction = 'north' | 'south' | 'east' | 'west';

export interface Position {
  x: number;
  y: number;
}

export interface Ability {
  id: string;
  name: string;
  description: string;
  damage?: number;
  healing?: number;
  cooldown: number;
  currentCooldown: number;
}

export interface RacialPassive {
  id: string;
  name: string;
  description: string;
  effectType: 'combat' | 'survival' | 'utility';
  // Passive effects applied automatically
  damageReduction?: number; // Percentage or flat reduction
  criticalChance?: number; // Percentage chance for critical hits
  dodgeChance?: number; // Percentage chance to dodge attacks
  healingBonus?: number; // Percentage bonus to healing received
  goldBonus?: number; // Percentage bonus to gold found
  experienceBonus?: number; // Percentage bonus to experience gained
}

export interface PlayerStats {
  maxHealth: number;
  currentHealth: number;
  attack: number;
  defense: number;
  speed: number;
}

export interface Player {
  id: string;
  name: string;
  class: PlayerClass;
  race: PlayerRace;
  stats: PlayerStats;
  abilities: Ability[];
  racialPassive: RacialPassive;
  position: Position;
  isAlive: boolean;
  inventory: Item[];
  gold: number;
}

export interface Enemy {
  id: string;
  name: string;
  level: number;
  stats: {
    maxHealth: number;
    currentHealth: number;
    attack: number;
    defense: number;
  };
  position: Position;
  goldReward: number;
  expReward: number;
}

export interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'potion' | 'treasure';
  attackBonus?: number;
  defenseBonus?: number;
  healAmount?: number;
  value: number;
}

export interface Tile {
  position: Position;
  type: TileType;
  isRevealed: boolean;
  enemy?: Enemy;
  items?: Item[];
  event?: GameEvent;
}

export interface GameEvent {
  id: string;
  type: 'trap' | 'shrine' | 'merchant' | 'mystery';
  description: string;
  effect: (player: Player) => void;
}

export interface GameBoard {
  width: number;
  height: number;
  tiles: Map<string, Tile>;
  depth: number;
}

export interface GameState {
  board: GameBoard;
  players: Player[];
  currentPlayerIndex: number;
  turnNumber: number;
  isGameOver: boolean;
  seed: string;
  runStartTime: number;
}

export interface CharacterCreation {
  name: string;
  class: PlayerClass;
  race: PlayerRace;
  selectedAbilities: Ability[];
}
