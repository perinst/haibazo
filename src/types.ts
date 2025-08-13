// Game constants
export const GAME_CONFIG = {
  DEFAULT_POINTS: 5,
  DEFAULT_COUNTDOWN_TIME_FOR_NODE: 3, // seconds
  DEFAULT_AUTO_PLAY_INTERVAL: 1000, // milliseconds
  COUNTDOWN_UPDATE_INTERVAL: 100, // milliseconds
  GAME_TIME_UPDATE_INTERVAL: 100, // milliseconds
} as const;

// Game state constants
export const GameState = {
  IDLE: "idle",
  PLAYING: "playing",
  WON: "won",
  LOST: "lost",
} as const;

export type GameState = (typeof GameState)[keyof typeof GameState];

// Type definitions
export interface INodeItem {
  index: number;
  isActive: boolean;
  position: { x: number; y: number };
  countdown: number;
  isClicked: boolean;
}

export interface IGameState {
  totalGameTime: number;
  gameState: GameState;
  points: number | null;
  nodes: INodeItem[];
  nextNodeIndex: number;
  isAutoPlay: boolean;
}
