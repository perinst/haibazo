import { useMemo, type FC } from "react";
import { GameState } from "../types";

interface GameStatusProps {
  gameState: GameState;
}

export const GameStatus: FC<GameStatusProps> = ({ gameState }) => {
  const displayTitle = useMemo(() => {
    const getColorAndText = () => {
      switch (gameState) {
        case GameState.WON:
          return { color: "green", text: "ALL CLEARED!" };
        case GameState.LOST:
          return { color: "red", text: "GAME OVER" };
        default:
          return { color: "", text: "LET'S PLAY" };
      }
    };

    const { color, text } = getColorAndText();
    return <h2 style={{ color }}>{text}</h2>;
  }, [gameState]);

  return displayTitle;
};
