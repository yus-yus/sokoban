import type { Tile } from "../game/types";
import styles from "./Board.module.css";

type CellProps = {
  tile: Tile;
  isGoal: boolean;
  isBox: boolean;
  isPlayer: boolean;
};

export function Cell({ tile, isGoal, isBox, isPlayer }: CellProps) {
  const classNames = [
    styles.cell,
    tile === "wall" ? styles.wall : styles.floor,
    isGoal ? styles.goal : "",
    isBox ? styles.box : "",
    isPlayer ? styles.player : "",
  ]
    .filter(Boolean)
    .join(" ");

  let content = "";

  if (isGoal) {
    content = "●";
  }

  if (isBox) {
    content = isGoal ? "■" : "□";
  }

  if (isPlayer) {
    content = "P";
  }

  return <div className={classNames}>{content}</div>;
}