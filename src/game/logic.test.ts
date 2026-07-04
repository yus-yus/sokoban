import { describe, expect, test } from "vitest";
import { createInitialGameState, movePlayer } from "./logic";
import { parseStage } from "./stageParser";
import type { Stage } from "./types";

function createTestStage(map: string[]): Stage {
  return parseStage({
    id: "test-stage",
    name: "Test Stage",
    map,
  });
}

describe("createInitialGameState", () => {
  test("creates an initial game state from a stage", () => {
    const stage = createTestStage([
      "#####",
      "#@$.#",
      "#####",
    ]);

    const state = createInitialGameState(stage);

    expect(state.player).toEqual({ row: 1, col: 1 });
    expect(state.boxes).toEqual([{ row: 1, col: 2 }]);
    expect(state.moves).toBe(0);
    expect(state.cleared).toBe(false);
  });
});

describe("movePlayer", () => {
  test("does not move into a wall", () => {
    const stage = createTestStage([
      "#####",
      "#@  #",
      "#####",
    ]);
    const state = createInitialGameState(stage);

    const nextState = movePlayer(state, "left");

    expect(nextState).toBe(state);
    expect(nextState.player).toEqual({ row: 1, col: 1 });
    expect(nextState.moves).toBe(0);
  });

  test("moves to an empty floor tile", () => {
    const stage = createTestStage([
      "#####",
      "#@  #",
      "#####",
    ]);
    const state = createInitialGameState(stage);

    const nextState = movePlayer(state, "right");

    expect(nextState).not.toBe(state);
    expect(nextState.player).toEqual({ row: 1, col: 2 });
    expect(nextState.boxes).toEqual([]);
    expect(nextState.moves).toBe(1);
    expect(nextState.cleared).toBe(false);
  });

  test("pushes a box when the tile behind the box is empty", () => {
    const stage = createTestStage([
      "######",
      "#@$ .#",
      "######",
    ]);
    const state = createInitialGameState(stage);

    const nextState = movePlayer(state, "right");

    expect(nextState.player).toEqual({ row: 1, col: 2 });
    expect(nextState.boxes).toEqual([{ row: 1, col: 3 }]);
    expect(nextState.moves).toBe(1);
    expect(nextState.cleared).toBe(false);
  });

  test("does not push a box into a wall", () => {
    const stage = createTestStage([
      "#####",
      "#@$##",
      "#####",
    ]);
    const state = createInitialGameState(stage);

    const nextState = movePlayer(state, "right");

    expect(nextState).toBe(state);
    expect(nextState.player).toEqual({ row: 1, col: 1 });
    expect(nextState.boxes).toEqual([{ row: 1, col: 2 }]);
    expect(nextState.moves).toBe(0);
  });

  test("does not push a box into another box", () => {
    const stage = createTestStage([
      "######",
      "#@$$ #",
      "######",
    ]);
    const state = createInitialGameState(stage);

    const nextState = movePlayer(state, "right");

    expect(nextState).toBe(state);
    expect(nextState.player).toEqual({ row: 1, col: 1 });
    expect(nextState.boxes).toEqual([
      { row: 1, col: 2 },
      { row: 1, col: 3 },
    ]);
    expect(nextState.moves).toBe(0);
  });

  test("clears the stage when all boxes are on goals", () => {
    const stage = createTestStage([
      "#####",
      "#@$.#",
      "#####",
    ]);
    const state = createInitialGameState(stage);

    const nextState = movePlayer(state, "right");

    expect(nextState.player).toEqual({ row: 1, col: 2 });
    expect(nextState.boxes).toEqual([{ row: 1, col: 3 }]);
    expect(nextState.moves).toBe(1);
    expect(nextState.cleared).toBe(true);
  });

  test("does not move after the stage is cleared", () => {
    const stage = createTestStage([
      "#####",
      "#@$.#",
      "#####",
    ]);
    const state = createInitialGameState(stage);

    const clearedState = movePlayer(state, "right");
    const nextState = movePlayer(clearedState, "left");

    expect(clearedState.cleared).toBe(true);
    expect(nextState).toBe(clearedState);
    expect(nextState.player).toEqual({ row: 1, col: 2 });
    expect(nextState.moves).toBe(1);
  });
});