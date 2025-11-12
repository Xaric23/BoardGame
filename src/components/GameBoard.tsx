import type { GameState } from '../types/game';
import { getTile } from '../utils/dungeonGenerator';
import './GameBoard.css';

interface Props {
  gameState: GameState;
}

export const GameBoard = ({ gameState }: Props) => {
  const { board, players } = gameState;

  const getTileSymbol = (x: number, y: number): string => {
    const tile = getTile({ x, y }, board);
    if (!tile || !tile.isRevealed) return '?';

    // Check if player is on this tile
    const player = players.find((p) => p.position.x === x && p.position.y === y);
    if (player) {
      return '🧙';
    }

    switch (tile.type) {
      case 'start':
        return '🏠';
      case 'exit':
        return '🚪';
      case 'enemy':
        return tile.enemy ? '👹' : '·';
      case 'boss':
        return '💀';
      case 'treasure':
        return tile.items && tile.items.length > 0 ? '💎' : '·';
      case 'event':
        return '❓';
      case 'empty':
        return '·';
      default:
        return '?';
    }
  };

  const getTileClass = (x: number, y: number): string => {
    const tile = getTile({ x, y }, board);
    if (!tile) return 'tile';

    const classes = ['tile'];

    if (!tile.isRevealed) {
      classes.push('unrevealed');
    } else {
      classes.push('revealed');
    }

    // Highlight current player position
    const currentPlayer = players[gameState.currentPlayerIndex];
    if (currentPlayer && currentPlayer.position.x === x && currentPlayer.position.y === y) {
      classes.push('current-player');
    }

    return classes.join(' ');
  };

  return (
    <div className="game-board">
      <div className="board-header">
        <h2>Level {board.depth}</h2>
      </div>
      <div
        className="board-grid"
        style={{
          gridTemplateColumns: `repeat(${board.width}, 1fr)`,
          gridTemplateRows: `repeat(${board.height}, 1fr)`,
        }}
      >
        {Array.from({ length: board.height }, (_, y) =>
          Array.from({ length: board.width }, (_, x) => (
            <div key={`${x},${y}`} className={getTileClass(x, y)}>
              <span className="tile-symbol">{getTileSymbol(x, y)}</span>
            </div>
          ))
        )}
      </div>
      <div className="board-legend">
        <div className="legend-item">
          <span>🧙</span> Player
        </div>
        <div className="legend-item">
          <span>👹</span> Enemy
        </div>
        <div className="legend-item">
          <span>💀</span> Boss
        </div>
        <div className="legend-item">
          <span>💎</span> Treasure
        </div>
        <div className="legend-item">
          <span>🚪</span> Exit
        </div>
        <div className="legend-item">
          <span>?</span> Unexplored
        </div>
      </div>
    </div>
  );
};
