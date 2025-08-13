import { forwardRef } from "react";
import type { INodeItem } from "../types";
import { NodeItem } from "./NodeItem";

interface GameBoardProps {
  nodes: INodeItem[];
  onNodeClick: (index: number) => void;
  onRemoveNode: (index: number) => void;
}

export const GameBoard = forwardRef<HTMLDivElement, GameBoardProps>(
  ({ nodes, onNodeClick, onRemoveNode }, ref) => {
    return (
      <div className="container-display-node-item" ref={ref}>
        {nodes.map((node) => (
          <NodeItem
            key={node.index}
            {...node}
            onRemoveNode={onRemoveNode}
            onNodeClick={onNodeClick}
          />
        ))}
      </div>
    );
  }
);

GameBoard.displayName = "GameBoard";
