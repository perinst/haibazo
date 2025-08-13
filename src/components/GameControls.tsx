import { Fragment, type FC } from "react";

interface GameControlsProps {
  isPlaying: boolean;
  points: number | null;
  totalGameTime: number;
  nextNodeIndex: number;
  isAutoPlay: boolean;
  onPointsChange: (points: number) => void;
  onStartRestart: () => void;
  onToggleAutoPlay: () => void;
}

export const GameControls: FC<GameControlsProps> = ({
  isPlaying,
  points,
  totalGameTime,
  nextNodeIndex,
  isAutoPlay,
  onPointsChange,
  onStartRestart,
  onToggleAutoPlay,
}) => {
  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!isNaN(value)) {
      onPointsChange(value);
    }
  };

  return (
    <Fragment>
      <div className="points-wrapper">
        <div className="points-label">Points: </div>
        <input
          className="input-points"
          type="number"
          value={points || ""}
          placeholder="Type your point want display"
          onChange={handlePointsChange}
        />
      </div>

      <div className="timer-wrapper">
        <div className="timer-label">Times: </div>
        <div className="timer-value">{totalGameTime.toFixed(1)} s</div>
      </div>

      <div className="wrapper-buttons">
        <button onClick={onStartRestart}>
          {isPlaying ? "Restart" : "Start"}
        </button>
        {isPlaying && (
          <button onClick={onToggleAutoPlay}>
            {isAutoPlay ? "Auto Play OFF" : "Auto Play ON"}
          </button>
        )}
      </div>

      {isPlaying && nextNodeIndex + 1 <= (points || 0) && (
        <div>Next: {nextNodeIndex + 1}</div>
      )}
    </Fragment>
  );
};
