import type { Player } from '../types/game';
import './PlayerPanel.tsx.css';

interface Props {
  player: Player;
  isCurrentPlayer: boolean;
}

export const PlayerPanel = ({ player, isCurrentPlayer }: Props) => {
  const healthPercentage = (player.stats.currentHealth / player.stats.maxHealth) * 100;

  return (
    <div className={`player-panel ${isCurrentPlayer ? 'current' : ''} ${!player.isAlive ? 'dead' : ''}`}>
      <div className="player-header">
        <h3>{player.name}</h3>
        {isCurrentPlayer && <span className="current-badge">Current Turn</span>}
        {!player.isAlive && <span className="dead-badge">💀 Defeated</span>}
      </div>

      <div className="player-info">
        <div className="class-race">
          <span className="class">{player.class}</span>
          <span className="race">{player.race}</span>
        </div>

        <div className="health-bar">
          <div className="health-label">
            HP: {player.stats.currentHealth}/{player.stats.maxHealth}
          </div>
          <div className="health-bar-bg">
            <div
              className="health-bar-fill"
              style={{ width: `${healthPercentage}%` }}
            />
          </div>
        </div>

        <div className="stats">
          <div className="stat">⚔️ ATK: {player.stats.attack}</div>
          <div className="stat">🛡️ DEF: {player.stats.defense}</div>
          <div className="stat">⚡ SPD: {player.stats.speed}</div>
          <div className="stat">💰 Gold: {player.gold}</div>
        </div>

        <div className="abilities">
          <h4>Abilities:</h4>
          {player.abilities.map((ability) => (
            <div
              key={ability.id}
              className={`ability ${ability.currentCooldown > 0 ? 'cooldown' : ''}`}
            >
              <span className="ability-name">{ability.name}</span>
              {ability.currentCooldown > 0 && (
                <span className="cooldown-badge">{ability.currentCooldown}</span>
              )}
            </div>
          ))}
        </div>

        <div className="racial-passive">
          <h4>🌟 Racial Passive:</h4>
          <div className="passive-item">
            <span className="passive-name">{player.racialPassive.name}</span>
          </div>
        </div>

        {player.inventory.length > 0 && (
          <div className="inventory">
            <h4>Inventory:</h4>
            <div className="items">
              {player.inventory.map((item) => (
                <span key={item.id} className="item">
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
