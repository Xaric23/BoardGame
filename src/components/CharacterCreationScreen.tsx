import { useState } from 'react';
import type { CharacterCreation, PlayerClass, PlayerRace } from '../types/game';
import {
  CLASS_DESCRIPTIONS,
  RACE_DESCRIPTIONS,
  getAbilitiesForClass,
  getBaseStats,
} from '../models/characterData';
import './CharacterCreationScreen.css';

interface Props {
  onStartGame: (characters: CharacterCreation[], numPlayers: number) => void;
}

export const CharacterCreationScreen = ({ onStartGame }: Props) => {
  const [numPlayers, setNumPlayers] = useState(1);
  const [currentStep, setCurrentStep] = useState(0);
  const [characters, setCharacters] = useState<CharacterCreation[]>([
    { name: '', class: 'Warrior', race: 'Human', selectedAbilities: [] },
  ]);

  const classes: PlayerClass[] = ['Warrior', 'Mage', 'Rogue', 'Cleric'];
  const races: PlayerRace[] = ['Human', 'Elf', 'Dwarf', 'Orc'];

  const handleNumPlayersChange = (num: number) => {
    setNumPlayers(num);
    const newChars: CharacterCreation[] = [];
    for (let i = 0; i < num; i++) {
      newChars.push(
        characters[i] || { name: '', class: 'Warrior', race: 'Human', selectedAbilities: [] }
      );
    }
    setCharacters(newChars);
  };

  const handleClassChange = (playerClass: PlayerClass) => {
    const newChars = [...characters];
    newChars[currentStep] = { ...newChars[currentStep], class: playerClass };
    setCharacters(newChars);
  };

  const handleRaceChange = (race: PlayerRace) => {
    const newChars = [...characters];
    newChars[currentStep] = { ...newChars[currentStep], race };
    setCharacters(newChars);
  };

  const handleNameChange = (name: string) => {
    const newChars = [...characters];
    newChars[currentStep] = { ...newChars[currentStep], name };
    setCharacters(newChars);
  };

  const handleNext = () => {
    if (currentStep < numPlayers - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onStartGame(characters, numPlayers);
    }
  };

  const canProceed = characters[currentStep].name.trim().length > 0;

  const currentChar = characters[currentStep];
  const abilities = getAbilitiesForClass(currentChar.class);
  const stats = getBaseStats(currentChar.class, currentChar.race);

  return (
    <div className="character-creation">
      <h1>⚔️ Dungeon Delvers ⚔️</h1>
      <div className="creation-container">
        {currentStep === 0 && (
          <div className="player-count-section">
            <h2>How many players?</h2>
            <div className="player-buttons">
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  className={numPlayers === num ? 'selected' : ''}
                  onClick={() => handleNumPlayersChange(num)}
                >
                  {num} Player{num > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="character-form">
          <h2>
            Player {currentStep + 1} of {numPlayers}
          </h2>

          <div className="form-group">
            <label>Character Name:</label>
            <input
              type="text"
              value={currentChar.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Enter your hero's name"
            />
          </div>

          <div className="form-group">
            <label>Choose Your Class:</label>
            <div className="selection-grid">
              {classes.map((cls) => (
                <div
                  key={cls}
                  className={`selection-card ${currentChar.class === cls ? 'selected' : ''}`}
                  onClick={() => handleClassChange(cls)}
                >
                  <h3>{cls}</h3>
                  <p>{CLASS_DESCRIPTIONS[cls]}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Choose Your Race:</label>
            <div className="selection-grid">
              {races.map((race) => (
                <div
                  key={race}
                  className={`selection-card ${currentChar.race === race ? 'selected' : ''}`}
                  onClick={() => handleRaceChange(race)}
                >
                  <h3>{race}</h3>
                  <p>{RACE_DESCRIPTIONS[race]}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="stats-preview">
            <h3>Character Stats:</h3>
            <div className="stats-grid">
              <div className="stat">
                <span className="stat-label">Health:</span>
                <span className="stat-value">{stats.maxHealth}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Attack:</span>
                <span className="stat-value">{stats.attack}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Defense:</span>
                <span className="stat-value">{stats.defense}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Speed:</span>
                <span className="stat-value">{stats.speed}</span>
              </div>
            </div>
          </div>

          <div className="abilities-preview">
            <h3>Starting Abilities:</h3>
            <div className="abilities-list">
              {abilities.slice(0, 3).map((ability) => (
                <div key={ability.id} className="ability-card">
                  <h4>{ability.name}</h4>
                  <p>{ability.description}</p>
                  <small>Cooldown: {ability.cooldown} turns</small>
                </div>
              ))}
            </div>
          </div>

          <button className="start-button" onClick={handleNext} disabled={!canProceed}>
            {currentStep < numPlayers - 1 ? 'Next Player' : 'Start Adventure!'}
          </button>
        </div>
      </div>
    </div>
  );
};
