# Dungeon Delvers ⚔️

A roguelike board game built with TypeScript and React. Explore procedurally generated dungeons, battle enemies, collect loot, and delve deeper into the unknown!

![Character Creation](https://github.com/user-attachments/assets/b0ff1a04-1786-4f73-a92f-895f41472b41)
![Game Board](https://github.com/user-attachments/assets/ae7b46b7-cf1b-4616-bd84-cd7dcf35dd56)
![Combat](https://github.com/user-attachments/assets/53ccf329-6451-43bf-ba1d-6d450eedd937)

## 🎮 Features

### Core Gameplay
- **Turn-based gameplay** for 1-4 players
- **Procedurally generated dungeons** using seed-based generation
- **Character customization** with 4 classes and 4 races
- **Class-specific abilities** with cooldown mechanics
- **Dynamic enemy spawning** that scales with dungeon depth
- **Random loot and treasure** system
- **Roguelike permadeath** - when you die, the run resets

### Character Classes
- **Warrior** - Masters of melee combat with high health and defense
- **Mage** - Wielders of powerful magic with devastating spells
- **Rogue** - Swift assassins with high damage and evasion
- **Cleric** - Holy warriors who can heal and smite enemies

### Races
- **Human** - Balanced in all attributes with bonus to all stats
- **Elf** - Agile and precise with bonus to speed and attack
- **Dwarf** - Sturdy and resilient with high health and defense
- **Orc** - Powerful brutes with massive attack but lower defense

### Game Elements
- 🧙 **Player** - Your hero exploring the dungeon
- 👹 **Enemy** - Hostile creatures that scale with dungeon depth
- 💀 **Boss** - Powerful enemies that appear every 5 levels
- 💎 **Treasure** - Loot including weapons, armor, and gold
- 🚪 **Exit** - Portal to descend deeper into the dungeon
- ❓ **Events** - Random encounters (future feature)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🎯 How to Play

1. **Character Creation**
   - Choose number of players (1-4)
   - Name your hero
   - Select a class (Warrior, Mage, Rogue, or Cleric)
   - Choose a race (Human, Elf, Dwarf, or Orc)
   - Review your starting stats and abilities

2. **Movement**
   - Use arrow buttons (⬆️⬇️⬅️➡️) to move through the dungeon
   - Moving reveals nearby tiles
   - Explore to find enemies, treasure, and the exit

3. **Combat**
   - When you encounter an enemy, combat options appear
   - **Attack** - Basic attack using your weapon
   - **Abilities** - Use class-specific special abilities
   - Abilities have cooldowns that reset over turns
   - Defeat enemies to gain gold and experience

4. **Progression**
   - Collect treasure to improve your stats
   - Find weapons and armor to boost attack and defense
   - Locate the exit to descend to the next level
   - Enemies get stronger as you go deeper

5. **Game Over**
   - If your health reaches 0, your hero is defeated
   - When all players die, the game ends
   - Your run resets - procedural generation ensures each run is unique!

## 🏗️ Technical Architecture

### Tech Stack
- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: CSS with custom dark theme
- **State Management**: React Hooks (useState, useCallback)

### Project Structure
```
src/
├── components/          # React UI components
│   ├── CharacterCreationScreen.tsx
│   ├── GameScreen.tsx
│   ├── GameBoard.tsx
│   ├── GameControls.tsx
│   └── PlayerPanel.tsx
├── hooks/              # Custom React hooks
│   └── useGameState.ts
├── models/             # Game data models
│   └── characterData.ts
├── types/              # TypeScript type definitions
│   └── game.ts
├── utils/              # Game logic utilities
│   ├── dungeonGenerator.ts
│   └── combatSystem.ts
└── App.tsx            # Main application component
```

### Key Systems

#### Procedural Generation
- Seeded random number generator for reproducible dungeons
- Grid-based board with configurable dimensions (10x10 default)
- Tile types distributed using probability-based spawning
- Boss encounters every 5 levels
- Loot quality scales with dungeon depth

#### Combat System
- Turn-based combat with attack/defense calculations
- Damage reduction based on defense stat
- Ability system with cooldowns
- Enemy AI with counter-attacks
- Reward system (gold and experience)

#### State Management
- Immutable state updates using React hooks
- Centralized game state in `useGameState` hook
- Game log for tracking all actions
- Position tracking for all entities
- Cooldown management for abilities

## 🎨 Design

The game features a dark fantasy theme with:
- Deep blue/purple gradient backgrounds
- Red accent colors for important actions
- Green/teal colors for positive stats
- Emoji-based icons for quick visual recognition
- Responsive grid layout
- Smooth animations and transitions

## 🔮 Future Enhancements

- [ ] Save/load game functionality
- [ ] Meta-progression (persistent unlocks)
- [ ] Random event encounters
- [ ] Cooperative/competitive multiplayer
- [ ] Card-based item and skill system
- [ ] Sound effects and background music
- [ ] More enemy types and bosses
- [ ] Additional character classes and races
- [ ] Achievement system
- [ ] Leaderboards

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

Built as a demonstration of modern web game development with React and TypeScript.
