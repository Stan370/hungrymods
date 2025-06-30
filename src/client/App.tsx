import { useGameLogic } from '../hooks/useGameLogic';
import StartScreen from './components/StartScreen';
import GameArea from './components/GameArea';
import GameResults from './components/GameResults';

function App() {
  const { gameState, startGame, catchObject, shareScore } = useGameLogic();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-white to-purple-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Game Content */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-red-500">
          {gameState.gameStatus === 'waiting' && (
            <StartScreen 
              onStart={startGame} 
              highScore={gameState.highScore}
            />
          )}
          {gameState.gameStatus === 'playing' && (
            <GameArea
              gameObjects={gameState.gameObjects}
              onCatch={catchObject}
              timeLeft={gameState.timeLeft}
              score={gameState.score}
              combo={gameState.combo}
              powerUps={gameState.powerUps}
              postKarma={gameState.postKarma}
            />
          )}

          {gameState.gameStatus === 'ended' && (
            <GameResults
              score={gameState.score}
              highScore={gameState.highScore}
              combo={gameState.combo}
              postKarma={gameState.postKarma}
              onRestart={startGame}
              onShare={shareScore}
            />
          )}
        </div>
        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>With great power comes great responsibility... or absolute corruption • Share your purge count!</p>
          <p className="mt-2">
            ⚡ How many will you banish today?
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;