import type { CharacterCreation } from './types/game';
import { CharacterCreationScreen } from './components/CharacterCreationScreen';
import { GameScreen } from './components/GameScreen';
import { useGameState } from './hooks/useGameState';
import './App.css';

function App() {
  const {
    gameState,
    gameLog,
    startNewGame,
    movePlayer,
    attackEnemy,
    usePlayerAbility,
    resetGame,
  } = useGameState();

  const handleStartGame = (characters: CharacterCreation[], numPlayers: number) => {
    startNewGame(characters, numPlayers);
  };

  return (
    <div className="app">
      {!gameState ? (
        <CharacterCreationScreen onStartGame={handleStartGame} />
      ) : (
        <GameScreen
          gameState={gameState}
          gameLog={gameLog}
          onMove={movePlayer}
          onAttack={attackEnemy}
          onUseAbility={usePlayerAbility}
          onReset={resetGame}
        />
      )}
    </div>
  );
}

export default App;
