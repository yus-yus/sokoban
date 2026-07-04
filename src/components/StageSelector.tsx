import type { Stage } from "../game/types";
import styles from "./StageSelector.module.css";

type StageSelectorProps = {
  stages: Stage[];
  currentStageIndex: number;
  onSelectStage: (stageIndex: number) => void;
};

export function StageSelector({
  stages,
  currentStageIndex,
  onSelectStage,
}: StageSelectorProps) {
  return (
    <div className={styles.selector}>
      <label className={styles.label} htmlFor="stage-select">
        Stage
      </label>

      <select
        id="stage-select"
        className={styles.select}
        value={currentStageIndex}
        onChange={(event) => {
          onSelectStage(Number(event.target.value));
        }}
      >
        {stages.map((stage, index) => (
          <option key={stage.id} value={index}>
            {index + 1}. {stage.name}
          </option>
        ))}
      </select>
    </div>
  );
}