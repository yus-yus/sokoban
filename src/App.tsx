import { useEffect } from "react";
import { Board } from "./components/Board";
import { DirectionControls } from "./components/DirectionControls";
import { StageSelector } from "./components/StageSelector";
import { StatusPanel } from "./components/StatusPanel";
import { useGame } from "./hooks/useGame";
import type { Direction } from "./game/types";

function App() {
  const {
    stages,
    currentStageIndex,
    gameState,
    hasNextStage,
    canUndo,
    move,
    undo,
    restart,
    selectStage,
    nextStage,
  } = useGame();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "z"
      ) {
        event.preventDefault();
        undo();
        return;
      }

      const direction = keyToDirection(event.key);

      if (direction === null) {
        return;
      }

      event.preventDefault();
      move(direction);
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [move, undo]);

  return (
    <main className="app">
      <section className="game-card">
        <header className="game-header">
          <div>
            <h1>Sokoban Puzzle</h1>
            <p className="subtitle">
              Push all boxes onto the goals.
            </p>
          </div>

          <StageSelector
            stages={stages}
            currentStageIndex={currentStageIndex}
            onSelectStage={selectStage}
          />
        </header>

        <StatusPanel
          moves={gameState.moves}
          cleared={gameState.cleared}
          onRestart={restart}
          onUndo={undo}
          canUndo={canUndo}
          onNextStage={nextStage}
          hasNextStage={hasNextStage}
        />

        <Board
          stage={gameState.stage}
          player={gameState.player}
          boxes={gameState.boxes}
        />

        <DirectionControls onMove={move} />

        <div className="help">
          <p>Use arrow keys or direction buttons to move.</p>
          <p>Use Ctrl + Z or the Undo button to undo.</p>
          <p>Boxes can only be pushed, not pulled.</p>
        </div>
      </section>
    </main>
  );
}

function keyToDirection(key: string): Direction | null {
  switch (key) {
    case "ArrowUp":
      return "up";
    case "ArrowDown":
      return "down";
    case "ArrowLeft":
      return "left";
    case "ArrowRight":
      return "right";
    default:
      return null;
  }
}

export default App;