import { useState, useEffect, useCallback, useRef, type FC } from "react";
import type { INodeItem } from "../types";
import { GAME_CONFIG } from "../types";

interface NodeItemProps extends INodeItem {
  onRemoveNode: (index: number) => void;
  onNodeClick: (index: number) => void;
}

export const NodeItem: FC<NodeItemProps> = ({
  index,
  isActive,
  position,
  isClicked,
  countdown,
  onRemoveNode,
  onNodeClick,
}) => {
  const [countdownTime, setCountdownTime] = useState<number>(countdown);
  const intervalRef = useRef<number | undefined>(undefined);

  const handleCountdown = useCallback(() => {
    setCountdownTime((prev) => {
      if (prev <= 0) {
        onRemoveNode(index);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        return 0;
      }
      return prev - 0.1;
    });
  }, [index, onRemoveNode]);

  useEffect(() => {
    if (!isClicked || !isActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
      return;
    }

    intervalRef.current = setInterval(
      handleCountdown,
      GAME_CONFIG.COUNTDOWN_UPDATE_INTERVAL
    );

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    };
  }, [isClicked, isActive, handleCountdown]);

  const handleClick = useCallback(() => {
    onNodeClick(index);
  }, [index, onNodeClick]);

  if (!isActive) return null;

  return (
    <div
      className={isClicked ? "node-item-clicked" : "node-item"}
      onClick={handleClick}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
      }}
    >
      <div>
        {index + 1}
        {isClicked && (
          <div className="countdown-node">
            {countdownTime < 0 ? 0 : countdownTime.toFixed(1)}s
          </div>
        )}
      </div>
    </div>
  );
};
