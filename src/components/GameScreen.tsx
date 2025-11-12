import type { GameState, User } from '../types/game';
import { GameBoard } from './GameBoard';
import { PlayerPanel } from './PlayerPanel';
import { GameControls } from './GameControls';
import './GameScreen.css';

interface Props {
  gameState: GameState;
  gameLog: string[];
  onMove: (direction: 'north' | 'south' | 'east' | 'west') => void;
  onAttack: () => void;
  onUseAbility: (index: number) => void;
  onReset: () => void;
  user: User;
  onLogout: () => void;
}

export const GameScreen = ({ gameState, gameLog, onMove, onAttack, onUseAbility, onReset, user, onLogout }: Props) => {
  return (
    <div className="game-screen">
      <div className="game-header">
        <div className="header-left">
          <h1>⚔️ Dungeon Delvers ⚔️</h1>
          <span className="user-name">Playing as: {user.name}</span>
        </div>
        <div className="header-right">
          <button className="reset-button" onClick={onReset}>
            🔄 New Game
          </button>
          <button className="logout-button" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      {gameState.isGameOver && (
        <div className="game-over-overlay">
          <div className="game-over-panel">
            <h2>Game Over!</h2>
            <p>All heroes have fallen...</p>
            <p>You survived {gameState.turnNumber} turns and reached level {gameState.board.depth}</p>
            <button onClick={onReset}>Start New Game</button>
          </div>
        </div>
      )}

      <div className="game-content">
        <div className="left-panel">
          <GameBoard gameState={gameState} />
        </div>

        <div className="middle-panel">
          <GameControls
            gameState={gameState}
            gameLog={gameLog}
            onMove={onMove}
            onAttack={onAttack}
            onUseAbility={onUseAbility}
          />
        </div>

        <div className="right-panel">
          <h2>Players</h2>
          <div className="players-list">
            {gameState.players.map((player, index) => (
              <PlayerPanel
                key={player.id}
                player={player}
                isCurrentPlayer={index === gameState.currentPlayerIndex}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
