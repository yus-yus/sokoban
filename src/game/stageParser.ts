import type { Position, Stage, Tile } from "./types";

type RawLevel = {
  id: string;
  name: string;
  map: string[];
};

export function parseStage(rawLevel: RawLevel): Stage {
  const height = rawLevel.map.length;
  const width = Math.max(...rawLevel.map.map((row) => row.length));

  const tiles: Tile[][] = [];
  const goals: Position[] = [];
  const initialBoxes: Position[] = [];
  let initialPlayer: Position | null = null;

  for (let row = 0; row < height; row++) {
    const tileRow: Tile[] = [];

    for (let col = 0; col < width; col++) {
      const char = rawLevel.map[row][col] ?? " ";

      if (char === "#") {
        tileRow.push("wall");
        continue;
      }

      tileRow.push("floor");

      if (char === ".") {
        goals.push({ row, col });
      }

      if (char === "$") {
        initialBoxes.push({ row, col });
      }

      if (char === "@") {
        initialPlayer = { row, col };
      }
    }

    tiles.push(tileRow);
  }

  if (initialPlayer === null) {
    throw new Error("Stage must have a player.");
  }

  return {
    id: rawLevel.id,
    name: rawLevel.name,
    width,
    height,
    tiles,
    goals,
    initialPlayer,
    initialBoxes,
  };
}