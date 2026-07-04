import styles from "./StatusPanel.module.css";

type StatusPanelProps = {
  moves: number;
  cleared: boolean;
  onRestart: () => void;
  onUndo: () => void;
  canUndo: boolean;
  onNextStage: () => void;
  hasNextStage: boolean;
};

export function StatusPanel({
  moves,
  cleared,
  onRestart,
  onUndo,
  canUndo,
  onNextStage,
  hasNextStage,
}: StatusPanelProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.status}>
        <p className={styles.moves}>Moves: {moves}</p>
        {cleared && <p className={styles.cleared}>Clear!</p>}
      </div>

      <div className={styles.actions}>
        <button
          className={styles.button}
          onClick={onUndo}
          disabled={!canUndo}
        >
          Undo
        </button>

        <button className={styles.button} onClick={onRestart}>
          Restart
        </button>

        {cleared && hasNextStage && (
          <button className={styles.primaryButton} onClick={onNextStage}>
            Next Stage
          </button>
        )}
      </div>
    </div>
  );
}