export type Position = {
  row: number;
  col: number;
};

export type Direction = "up" | "down" | "left" | "right";

export type Tile = "floor" | "wall";

export type Stage = {
  id: string;
  name: string;
  width: number;
  height: number;
  tiles: Tile[][];
  goals: Position[];
  initialPlayer: Position;
  initialBoxes: Position[];
};

export type GameState = {
  stage: Stage;
  player: Position;
  boxes: Position[];
  moves: number;
  cleared: boolean;
};