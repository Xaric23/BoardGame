import type { CharacterCreation } from './types/game';
import { useAuth } from './contexts/AuthContext';
import { LoginScreen } from './components/LoginScreen';
import { CharacterCreationScreen } from './components/CharacterCreationScreen';
import { GameScreen } from './components/GameScreen';
import { useGameState } from './hooks/useGameState';
import './App.css';

function App() {
  const { user, logout, isLoading } = useAuth();
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

  const handleResetGame = () => {
    resetGame();
  };

  if (isLoading) {
    return (
      <div className="app loading">
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="app">
      {!gameState ? (
        <CharacterCreationScreen onStartGame={handleStartGame} user={user} onLogout={logout} />
      ) : (
        <GameScreen
          gameState={gameState}
          gameLog={gameLog}
          onMove={movePlayer}
          onAttack={attackEnemy}
          onUseAbility={usePlayerAbility}
          onReset={handleResetGame}
          user={user}
          onLogout={logout}
        />
      )}
    </div>
  );
}

export default App;
