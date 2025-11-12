import { useState, useCallback } from 'react';
import type { GameState, Player, Position, CharacterCreation } from '../types/game';
import { generateDungeon, getTile, setTile, revealAdjacentTiles, isValidPosition } from '../utils/dungeonGenerator';
import { performAttack, useAbility as applyAbility, updateCooldowns, pickupItem, checkPlayerDeath, checkEnemyDeath, gainRewards } from '../utils/combatSystem';
import { getBaseStats, getAbilitiesForClass } from '../models/characterData';

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [gameLog, setGameLog] = useState<string[]>([]);

  const addLog = useCallback((message: string) => {
    setGameLog((prev) => [...prev, message]);
  }, []);

  const startNewGame = useCallback((characters: CharacterCreation[], numPlayers: number) => {
    const seed = Date.now().toString();
    const board = generateDungeon(10, 10, 1, seed);

    const players: Player[] = characters.slice(0, numPlayers).map((char, index) => ({
      id: `player_${index}`,
      name: char.name,
      class: char.class,
      race: char.race,
      stats: getBaseStats(char.class, char.race),
      abilities: getAbilitiesForClass(char.class).slice(0, 3),
      position: { x: Math.floor(board.width / 2), y: Math.floor(board.height / 2) },
      isAlive: true,
      inventory: [],
      gold: 0,
    }));

    const newGameState: GameState = {
      board,
      players,
      currentPlayerIndex: 0,
      turnNumber: 1,
      isGameOver: false,
      seed,
      runStartTime: Date.now(),
    };

    setGameState(newGameState);
    setGameLog([`Game started with ${numPlayers} players!`]);
  }, []);

  const endTurn = useCallback(() => {
    setGameState((prevState) => {
      if (!prevState) return null;

      const currentPlayer = prevState.players[prevState.currentPlayerIndex];
      updateCooldowns(currentPlayer);

      // Move to next player
      let nextIndex = (prevState.currentPlayerIndex + 1) % prevState.players.length;

      // Skip dead players
      let attempts = 0;
      while (!prevState.players[nextIndex].isAlive && attempts < prevState.players.length) {
        nextIndex = (nextIndex + 1) % prevState.players.length;
        attempts++;
      }

      return {
        ...prevState,
        currentPlayerIndex: nextIndex,
        turnNumber: nextIndex === 0 ? prevState.turnNumber + 1 : prevState.turnNumber,
      };
    });
  }, []);

  const checkGameOver = useCallback(() => {
    setGameState((prevState) => {
      if (!prevState) return null;

      const allDead = prevState.players.every((p) => !p.isAlive);
      if (allDead) {
        addLog('Game Over! All players have fallen!');
        return { ...prevState, isGameOver: true };
      }
      return prevState;
    });
  }, [addLog]);

  const movePlayer = useCallback((direction: 'north' | 'south' | 'east' | 'west') => {
    setGameState((prevState) => {
      if (!prevState) return null;

      const newState = { ...prevState };
      const currentPlayer = newState.players[newState.currentPlayerIndex];
      
      if (!currentPlayer.isAlive) {
        addLog(`${currentPlayer.name} is dead and cannot move!`);
        return prevState;
      }

      const newPos: Position = { ...currentPlayer.position };

      switch (direction) {
        case 'north':
          newPos.y -= 1;
          break;
        case 'south':
          newPos.y += 1;
          break;
        case 'east':
          newPos.x += 1;
          break;
        case 'west':
          newPos.x -= 1;
          break;
      }

      if (!isValidPosition(newPos, newState.board)) {
        addLog("Can't move there - out of bounds!");
        return prevState;
      }

      currentPlayer.position = newPos;
      const tile = getTile(newPos, newState.board);

      if (tile) {
        tile.isRevealed = true;
        setTile(newPos, tile, newState.board);
        revealAdjacentTiles(newPos, newState.board);

        // Handle tile encounter
        if (tile.type === 'enemy' && tile.enemy) {
          addLog(`${currentPlayer.name} encountered a ${tile.enemy.name}!`);
        } else if (tile.type === 'treasure' && tile.items && tile.items.length > 0) {
          tile.items.forEach((item) => {
            const message = pickupItem(currentPlayer, item);
            addLog(message);
          });
          tile.items = [];
        } else if (tile.type === 'exit') {
          addLog(`${currentPlayer.name} found the exit! Descending deeper...`);
          // Generate new level
          const newDepth = newState.board.depth + 1;
          newState.board = generateDungeon(10, 10, newDepth, newState.seed);
          currentPlayer.position = { x: Math.floor(newState.board.width / 2), y: Math.floor(newState.board.height / 2) };
          addLog(`Now on level ${newDepth}!`);
        }
      }

      return newState;
    });
    
    // End turn after state update
    setTimeout(endTurn, 0);
  }, [addLog, endTurn]);

  const attackEnemy = useCallback(() => {
    setGameState((prevState) => {
      if (!prevState) return null;

      const newState = { ...prevState };
      const currentPlayer = newState.players[newState.currentPlayerIndex];
      
      if (!currentPlayer.isAlive) return prevState;

      const tile = getTile(currentPlayer.position, newState.board);
      if (!tile || !tile.enemy) {
        addLog('No enemy to attack here!');
        return prevState;
      }

      const enemy = tile.enemy;

      // Player attacks
      const playerDamage = performAttack(currentPlayer, enemy);
      addLog(`${currentPlayer.name} attacks ${enemy.name} for ${playerDamage} damage!`);

      // Check if enemy died
      if (checkEnemyDeath(enemy)) {
        const reward = gainRewards(currentPlayer, enemy);
        addLog(reward);
        tile.enemy = undefined;
        tile.type = 'empty';
        return newState;
      }

      // Enemy counter-attacks
      const enemyDamage = performAttack(enemy, currentPlayer);
      addLog(`${enemy.name} attacks ${currentPlayer.name} for ${enemyDamage} damage!`);

      // Check if player died
      if (checkPlayerDeath(currentPlayer)) {
        addLog(`${currentPlayer.name} has been defeated!`);
        setTimeout(checkGameOver, 0);
      }

      return newState;
    });

    // End turn after state update
    setTimeout(endTurn, 0);
  }, [addLog, endTurn, checkGameOver]);

  const usePlayerAbility = useCallback((abilityIndex: number) => {
    setGameState((prevState) => {
      if (!prevState) return null;

      const newState = { ...prevState };
      const currentPlayer = newState.players[newState.currentPlayerIndex];
      
      if (!currentPlayer.isAlive) return prevState;

      const ability = currentPlayer.abilities[abilityIndex];
      if (!ability) return prevState;

      const tile = getTile(currentPlayer.position, newState.board);
      const enemy = tile?.enemy;

      const result = applyAbility(currentPlayer, ability, enemy);
      addLog(result.message);

      // Check if enemy died
      if (enemy && checkEnemyDeath(enemy)) {
        const reward = gainRewards(currentPlayer, enemy);
        addLog(reward);
        tile!.enemy = undefined;
        tile!.type = 'empty';
      }

      return newState;
    });

    // End turn after state update
    setTimeout(endTurn, 0);
  }, [addLog, endTurn]);

  const resetGame = useCallback(() => {
    setGameState(null);
    setGameLog([]);
  }, []);

  return {
    gameState,
    gameLog,
    startNewGame,
    movePlayer,
    attackEnemy,
    usePlayerAbility,
    resetGame,
  };
};
