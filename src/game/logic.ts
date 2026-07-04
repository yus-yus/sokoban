import type { Direction, GameState, Position, Stage } from "./types";

const directionDelta: Record<Direction, Position> = {
  up: { row: -1, col: 0 },
  down: { row: 1, col: 0 },
  left: { row: 0, col: -1 },
  right: { row: 0, col: 1 },
};

export function createInitialGameState(stage: Stage): GameState {
  const initialState: GameState = {
    stage,
    player: { ...stage.initialPlayer },
    boxes: stage.initialBoxes.map((box) => ({ ...box })),
    moves: 0,
    cleared: false,
  };

  return {
    ...initialState,
    cleared: isCleared(initialState),
  };
}

export function movePlayer(
  state: GameState,
  direction: Direction
): GameState {
  if (state.cleared) {
    return state;
  }

  const delta = directionDelta[direction];
  const nextPlayer = addPosition(state.player, delta);

  if (isWall(state.stage, nextPlayer)) {
    return state;
  }

  const boxIndex = findBoxIndex(state.boxes, nextPlayer);

  if (boxIndex === -1) {
    return createNextState(state, nextPlayer, state.boxes);
  }

  const nextBox = addPosition(nextPlayer, delta);

  if (isWall(state.stage, nextBox)) {
    return state;
  }

  if (hasBox(state.boxes, nextBox)) {
    return state;
  }

  const nextBoxes = state.boxes.map((box, index) => {
    if (index === boxIndex) {
      return nextBox;
    }

    return box;
  });

  return createNextState(state, nextPlayer, nextBoxes);
}

function createNextState(
  state: GameState,
  player: Position,
  boxes: Position[]
): GameState {
  const nextState: GameState = {
    ...state,
    player,
    boxes,
    moves: state.moves + 1,
    cleared: false,
  };

  return {
    ...nextState,
    cleared: isCleared(nextState),
  };
}

export function isCleared(state: GameState): boolean {
  if (state.boxes.length === 0) {
    return false;
  }

  return state.boxes.every((box) =>
    state.stage.goals.some((goal) => isSamePosition(box, goal))
  );
}

export function isWall(stage: Stage, position: Position): boolean {
  if (
    position.row < 0 ||
    position.row >= stage.height ||
    position.col < 0 ||
    position.col >= stage.width
  ) {
    return true;
  }

  return stage.tiles[position.row][position.col] === "wall";
}

export function hasBox(boxes: Position[], position: Position): boolean {
  return boxes.some((box) => isSamePosition(box, position));
}

export function findBoxIndex(
  boxes: Position[],
  position: Position
): number {
  return boxes.findIndex((box) => isSamePosition(box, position));
}

export function isSamePosition(a: Position, b: Position): boolean {
  return a.row === b.row && a.col === b.col;
}

function addPosition(a: Position, b: Position): Position {
  return {
    row: a.row + b.row,
    col: a.col + b.col,
  };
}