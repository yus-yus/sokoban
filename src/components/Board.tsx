import type { Position, Stage } from "../game/types";
import { Cell } from "./Cell";
import styles from "./Board.module.css";

type BoardProps = {
  stage: Stage;
  player: Position;
  boxes: Position[];
};

export function Board({ stage, player, boxes }: BoardProps) {
  return (
    <div
      className={styles.board}
      style={{
        gridTemplateColumns: `repeat(${stage.width}, var(--cell-size))`,
      }}
    >
      {stage.tiles.map((row, rowIndex) =>
        row.map((tile, colIndex) => {
          const position = { row: rowIndex, col: colIndex };

          const isPlayer = isSamePosition(player, position);
          const isBox = boxes.some((box) => isSamePosition(box, position));
          const isGoal = stage.goals.some((goal) =>
            isSamePosition(goal, position)
          );

          return (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              tile={tile}
              isPlayer={isPlayer}
              isBox={isBox}
              isGoal={isGoal}
            />
          );
        })
      )}
    </div>
  );
}

function isSamePosition(a: Position, b: Position): boolean {
  return a.row === b.row && a.col === b.col;
}