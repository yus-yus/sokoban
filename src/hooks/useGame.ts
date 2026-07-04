import { useCallback, useState } from "react";
import { rawLevels } from "../game/levels";
import { createInitialGameState, movePlayer } from "../game/logic";
import { parseStage } from "../game/stageParser";
import type { Direction, GameState } from "../game/types";

const stages = rawLevels.map(parseStage);

type GameSessionState = {
  gameState: GameState;
  history: GameState[];
};

function createGameSession(stageIndex: number): GameSessionState {
  return {
    gameState: createInitialGameState(stages[stageIndex]),
    history: [],
  };
}

function undoSession(currentSession: GameSessionState): GameSessionState {
  if (currentSession.history.length === 0) {
    return currentSession;
  }

  const previousGameState =
    currentSession.history[currentSession.history.length - 1];

  return {
    gameState: previousGameState,
    history: currentSession.history.slice(0, -1),
  };
}

export function useGame() {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [session, setSession] = useState<GameSessionState>(() =>
    createGameSession(0)
  );

  const { gameState, history } = session;

  const hasNextStage = currentStageIndex < stages.length - 1;
  const canUndo = history.length > 0;

  const selectStage = useCallback((stageIndex: number) => {
    setCurrentStageIndex(stageIndex);
    setSession(createGameSession(stageIndex));
  }, []);

  const restart = useCallback(() => {
    setSession(createGameSession(currentStageIndex));
  }, [currentStageIndex]);

  const move = useCallback((direction: Direction) => {
    setSession((currentSession) => {
      const nextGameState = movePlayer(
        currentSession.gameState,
        direction
      );

      if (nextGameState === currentSession.gameState) {
        return currentSession;
      }

      return {
        gameState: nextGameState,
        history: [
          ...currentSession.history,
          currentSession.gameState,
        ],
      };
    });
  }, []);

  const undo = useCallback(() => {
    setSession((currentSession) => undoSession(currentSession));
  }, []);

  const nextStage = useCallback(() => {
    if (currentStageIndex >= stages.length - 1) {
      return;
    }

    const nextStageIndex = currentStageIndex + 1;

    setCurrentStageIndex(nextStageIndex);
    setSession(createGameSession(nextStageIndex));
  }, [currentStageIndex]);

  return {
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
  };
}