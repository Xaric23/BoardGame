import type { GameState } from '../types/game';
import { getTile } from '../utils/dungeonGenerator';
import './GameControls.css';

interface Props {
  gameState: GameState;
  onMove: (direction: 'north' | 'south' | 'east' | 'west') => void;
  onAttack: () => void;
  onUseAbility: (index: number) => void;
  gameLog: string[];
}

export const GameControls = ({ gameState, onMove, onAttack, onUseAbility, gameLog }: Props) => {
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const tile = getTile(currentPlayer.position, gameState.board);
  const hasEnemy = tile?.enemy !== undefined;

  return (
    <div className="game-controls">
      <div className="turn-info">
        <h3>Turn {gameState.turnNumber}</h3>
        <p>
          Current Player: <strong>{currentPlayer.name}</strong>
        </p>
      </div>

      <div className="movement-controls">
        <h4>Movement</h4>
        <div className="direction-pad">
          <button className="dir-button north" onClick={() => onMove('north')}>
            ⬆️
          </button>
          <div className="dir-row">
            <button className="dir-button west" onClick={() => onMove('west')}>
              ⬅️
            </button>
            <button className="dir-button east" onClick={() => onMove('east')}>
              ➡️
            </button>
          </div>
          <button className="dir-button south" onClick={() => onMove('south')}>
            ⬇️
          </button>
        </div>
      </div>

      {hasEnemy && (
        <div className="combat-controls">
          <h4>Combat</h4>
          <button className="combat-button attack" onClick={onAttack}>
            ⚔️ Attack {tile?.enemy?.name}
          </button>

          <div className="ability-buttons">
            {currentPlayer.abilities.map((ability, index) => (
              <button
                key={ability.id}
                className={`ability-button ${ability.currentCooldown > 0 ? 'disabled' : ''}`}
                onClick={() => onUseAbility(index)}
                disabled={ability.currentCooldown > 0}
              >
                {ability.name}
                {ability.currentCooldown > 0 && ` (${ability.currentCooldown})`}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="enemy-info">
        {hasEnemy && tile?.enemy ? (
          <>
            <h4>Enemy Info</h4>
            <div className="enemy-details">
              <p>
                <strong>{tile.enemy.name}</strong> (Level {tile.enemy.level})
              </p>
              <div className="enemy-health">
                HP: {tile.enemy.stats.currentHealth}/{tile.enemy.stats.maxHealth}
              </div>
              <div className="enemy-stats">
                <span>⚔️ {tile.enemy.stats.attack}</span>
                <span>🛡️ {tile.enemy.stats.defense}</span>
              </div>
            </div>
          </>
        ) : (
          <p className="no-enemy">No enemies nearby</p>
        )}
      </div>

      <div className="game-log">
        <h4>Game Log</h4>
        <div className="log-content">
          {gameLog.slice(-10).map((log, index) => (
            <div key={index} className="log-entry">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
