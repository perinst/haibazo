import { Fragment } from "react";
import { GameStatus, GameControls, GameBoard } from "./components";
import { GameState } from "./types";
import { useGameState } from "./hooks/useGameState";
import "./App.css";

function App() {
  const {
    gameState,
    containerRef,
    startGame,
    restartGame,
    handleNodeClick,
    removeNode,
    toggleAutoPlay,
    updatePoints,
  } = useGameState();

  const handleStartRestart = () => {
    if (gameState.gameState === GameState.PLAYING) {
      restartGame();
    } else {
      startGame();
    }
  };

  const isPlaying = gameState.gameState === GameState.PLAYING;

  return (
    <Fragment>
      <GameStatus gameState={gameState.gameState} />

      <GameControls
        isPlaying={isPlaying}
        points={gameState.points}
        totalGameTime={gameState.totalGameTime}
        nextNodeIndex={gameState.nextNodeIndex}
        isAutoPlay={gameState.isAutoPlay}
        onPointsChange={updatePoints}
        onStartRestart={handleStartRestart}
        onToggleAutoPlay={toggleAutoPlay}
      />

      <GameBoard
        ref={containerRef}
        nodes={gameState.nodes}
        onNodeClick={handleNodeClick}
        onRemoveNode={removeNode}
      />
    </Fragment>
  );
}

export default App;
