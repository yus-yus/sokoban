import type { Direction } from "../game/types";
import styles from "./DirectionControls.module.css";

type DirectionControlsProps = {
  onMove: (direction: Direction) => void;
};

export function DirectionControls({ onMove }: DirectionControlsProps) {
  return (
    <div className={styles.controls} aria-label="Direction controls">
      <button
        className={`${styles.button} ${styles.up}`}
        onClick={() => onMove("up")}
        aria-label="Move up"
      >
        ↑
      </button>

      <button
        className={`${styles.button} ${styles.left}`}
        onClick={() => onMove("left")}
        aria-label="Move left"
      >
        ←
      </button>

      <button
        className={`${styles.button} ${styles.down}`}
        onClick={() => onMove("down")}
        aria-label="Move down"
      >
        ↓
      </button>

      <button
        className={`${styles.button} ${styles.right}`}
        onClick={() => onMove("right")}
        aria-label="Move right"
      >
        →
      </button>
    </div>
  );
}