import type { GameBoard, Tile, TileType, Position, Enemy, Item } from '../types/game';

// Seeded random number generator
class SeededRandom {
  private seed: number;

  constructor(seed: string) {
    this.seed = this.hashCode(seed);
  }

  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  nextBool(probability = 0.5): boolean {
    return this.next() < probability;
  }
}

const positionToKey = (pos: Position): string => `${pos.x},${pos.y}`;

export const generateDungeon = (width: number, height: number, depth: number, seed: string): GameBoard => {
  const random = new SeededRandom(seed + depth);
  const tiles = new Map<string, Tile>();

  // Generate tiles
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const position: Position = { x, y };
      const key = positionToKey(position);

      let type: TileType = 'empty';

      // Starting position at center
      if (x === Math.floor(width / 2) && y === Math.floor(height / 2) && depth === 1) {
        type = 'start';
      }
      // Exit in one of the corners (only on floors 5, 10, 15, etc., not on floor 1)
      else if (depth > 1 && depth % 5 === 0 && x === width - 1 && y === height - 1) {
        type = 'exit';
      }
      // Boss every 5 levels
      else if (depth > 1 && depth % 5 === 0 && x === width - 2 && y === height - 2) {
        type = 'boss';
      }
      // Random tile types
      else {
        const roll = random.next();
        if (roll < 0.3) {
          type = 'enemy';
        } else if (roll < 0.45) {
          type = 'treasure';
        } else if (roll < 0.55) {
          type = 'event';
        } else {
          type = 'empty';
        }
      }

      const tile: Tile = {
        position,
        type,
        isRevealed: type === 'start',
        items: type === 'treasure' ? generateLoot(depth, random) : undefined,
        enemy: type === 'enemy' || type === 'boss' ? generateEnemy(depth, type === 'boss', random) : undefined,
      };

      tiles.set(key, tile);
    }
  }

  return {
    width,
    height,
    tiles,
    depth,
  };
};

const generateEnemy = (depth: number, isBoss: boolean, random: SeededRandom): Enemy => {
  const level = depth + (isBoss ? 5 : 0);
  const types = isBoss
    ? ['Dragon', 'Lich King', 'Demon Lord', 'Ancient Evil']
    : ['Goblin', 'Orc', 'Skeleton', 'Spider', 'Wolf', 'Bandit', 'Zombie'];

  const name = types[random.nextInt(0, types.length - 1)];
  const healthMultiplier = isBoss ? 3 : 1;

  return {
    id: `enemy_${random.next()}`,
    name: isBoss ? `${name} (Boss)` : name,
    level,
    stats: {
      maxHealth: (20 + level * 10) * healthMultiplier,
      currentHealth: (20 + level * 10) * healthMultiplier,
      attack: 5 + level * 2,
      defense: 2 + level,
    },
    position: { x: 0, y: 0 },
    goldReward: (10 + level * 5) * (isBoss ? 5 : 1),
    expReward: (5 + level * 3) * (isBoss ? 5 : 1),
  };
};

const generateLoot = (depth: number, random: SeededRandom): Item[] => {
  const items: Item[] = [];
  const numItems = random.nextInt(1, 3);

  for (let i = 0; i < numItems; i++) {
    const roll = random.next();
    let item: Item;

    if (roll < 0.3) {
      // Weapon - more variety
      const weaponTypes = [
        { name: 'Sword', bonus: 2 },
        { name: 'Axe', bonus: 3 },
        { name: 'Bow', bonus: 2 },
        { name: 'Dagger', bonus: 1 },
        { name: 'Mace', bonus: 2 },
        { name: 'Spear', bonus: 2 },
        { name: 'Staff', bonus: 2 },
      ];
      const weaponType = weaponTypes[random.nextInt(0, weaponTypes.length - 1)];
      item = {
        id: `weapon_${random.next()}`,
        name: `${weaponType.name} +${depth}`,
        type: 'weapon',
        attackBonus: weaponType.bonus + depth,
        value: 20 + depth * 10,
      };
    } else if (roll < 0.6) {
      // Armor - more variety
      const armorTypes = [
        { name: 'Shield', bonus: 1 },
        { name: 'Helmet', bonus: 1 },
        { name: 'Chestplate', bonus: 2 },
        { name: 'Boots', bonus: 1 },
        { name: 'Gauntlets', bonus: 1 },
        { name: 'Ring of Protection', bonus: 1 },
        { name: 'Amulet', bonus: 1 },
      ];
      const armorType = armorTypes[random.nextInt(0, armorTypes.length - 1)];
      item = {
        id: `armor_${random.next()}`,
        name: `${armorType.name} +${depth}`,
        type: 'armor',
        defenseBonus: armorType.bonus + depth,
        value: 15 + depth * 8,
      };
    } else if (roll < 0.9) {
      // Potion
      item = {
        id: `potion_${random.next()}`,
        name: 'Health Potion',
        type: 'potion',
        healAmount: 20 + depth * 5,
        value: 10,
      };
    } else {
      // Treasure
      item = {
        id: `treasure_${random.next()}`,
        name: 'Gold Coins',
        type: 'treasure',
        value: 50 + depth * 20,
      };
    }

    items.push(item);
  }

  return items;
};

export const getAdjacentPositions = (pos: Position): Position[] => {
  return [
    { x: pos.x, y: pos.y - 1 }, // north
    { x: pos.x, y: pos.y + 1 }, // south
    { x: pos.x + 1, y: pos.y }, // east
    { x: pos.x - 1, y: pos.y }, // west
  ];
};

export const isValidPosition = (pos: Position, board: GameBoard): boolean => {
  return pos.x >= 0 && pos.x < board.width && pos.y >= 0 && pos.y < board.height;
};

export const getTile = (pos: Position, board: GameBoard): Tile | undefined => {
  return board.tiles.get(positionToKey(pos));
};

export const setTile = (pos: Position, tile: Tile, board: GameBoard): void => {
  board.tiles.set(positionToKey(pos), tile);
};

export const revealAdjacentTiles = (pos: Position, board: GameBoard): void => {
  const adjacent = getAdjacentPositions(pos);
  adjacent.forEach((adjPos) => {
    if (isValidPosition(adjPos, board)) {
      const tile = getTile(adjPos, board);
      if (tile) {
        tile.isRevealed = true;
        setTile(adjPos, tile, board);
      }
    }
  });
};
