import { useState, useCallback, useRef, useEffect } from "react";
import type { IGameState } from "../types";
import { GameState, GAME_CONFIG } from "../types";
import { useInterval } from "./useInterval";

export const useGameState = () => {
  const [gameState, setGameState] = useState<IGameState>({
    totalGameTime: 0,
    gameState: GameState.IDLE,
    points: GAME_CONFIG.DEFAULT_POINTS,
    nodes: [],
    nextNodeIndex: 0,
    isAutoPlay: false,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const { startInterval, clearInterval: clearGameTimeInterval } = useInterval();

  const handleNodeClick = useCallback((nodeIndex: number) => {
    setGameState((prev) => {
      const node = prev.nodes[nodeIndex];

      if (!node || node.isClicked || nodeIndex !== prev.nextNodeIndex) {
        // Game over - wrong node clicked
        return {
          ...prev,
          gameState: GameState.LOST,
          nodes: [],
        };
      }

      // Mark node as clicked
      const updatedNodes = prev.nodes.map((node, index) =>
        index === nodeIndex ? { ...node, isClicked: true } : node
      );

      const newNextIndex = prev.nextNodeIndex + 1;

      // Check if game is won
      if (newNextIndex >= (prev.points || 0)) {
        return {
          ...prev,
          gameState: GameState.WON,
          nodes: [],
          nextNodeIndex: newNextIndex,
          isAutoPlay: false,
        };
      }

      return {
        ...prev,
        nodes: updatedNodes,
        nextNodeIndex: newNextIndex,
      };
    });
  }, []);

  // Game time tracking
  useEffect(() => {
    if (gameState.gameState === GameState.PLAYING) {
      startInterval(() => {
        setGameState((prev) => ({
          ...prev,
          totalGameTime: prev.totalGameTime + 0.1,
        }));
      }, GAME_CONFIG.GAME_TIME_UPDATE_INTERVAL);
    } else {
      clearGameTimeInterval();
    }

    return () => clearGameTimeInterval();
  }, [gameState.gameState, startInterval, clearGameTimeInterval]);

  // Auto play logic
  useEffect(() => {
    if (
      gameState.isAutoPlay &&
      gameState.gameState === GameState.PLAYING &&
      gameState.nextNodeIndex < (gameState.points || 0)
    ) {
      const interval = setInterval(() => {
        handleNodeClick(gameState.nextNodeIndex);
      }, GAME_CONFIG.DEFAULT_AUTO_PLAY_INTERVAL);

      return () => clearInterval(interval);
    }
  }, [
    gameState.isAutoPlay,
    gameState.gameState,
    gameState.nextNodeIndex,
    gameState.points,
    handleNodeClick,
  ]);

  const generateNodes = useCallback(() => {
    const container = containerRef.current;
    if (!container || !gameState.points) return [];

    const { clientHeight: height, clientWidth: width } = container;
    const nodeSize = 50;

    return Array.from({ length: gameState.points }, (_, index) => ({
      index,
      isActive: true,
      position: {
        x: Math.random() * (width - nodeSize),
        y: Math.random() * (height - nodeSize),
      },
      isClicked: false,
      countdown: GAME_CONFIG.DEFAULT_COUNTDOWN_TIME_FOR_NODE,
    }));
  }, [gameState.points]);

  const startGame = useCallback(() => {
    if (!gameState.points || gameState.points < 1) {
      alert("Please enter a valid point value.");
      return;
    }

    const newNodes = generateNodes();
    setGameState((prev) => ({
      ...prev,
      gameState: GameState.PLAYING,
      nodes: newNodes,
      nextNodeIndex: 0,
      totalGameTime: 0,
    }));
  }, [gameState.points, generateNodes]);

  const restartGame = useCallback(() => {
    setGameState({
      totalGameTime: 0,
      gameState: GameState.IDLE,
      points: GAME_CONFIG.DEFAULT_POINTS,
      nodes: [],
      nextNodeIndex: 0,
      isAutoPlay: false,
    });
  }, []);

  const removeNode = useCallback((nodeIndex: number) => {
    setGameState((prev) => ({
      ...prev,
      nodes: prev.nodes.map((node, i) =>
        i === nodeIndex ? { ...node, isActive: false } : node
      ),
    }));
  }, []);

  const toggleAutoPlay = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      isAutoPlay: !prev.isAutoPlay,
    }));
  }, []);

  const updatePoints = useCallback((points: number) => {
    setGameState((prev) => ({
      ...prev,
      points,
    }));
  }, []);

  return {
    gameState,
    containerRef,
    startGame,
    restartGame,
    handleNodeClick,
    removeNode,
    toggleAutoPlay,
    updatePoints,
  };
};
