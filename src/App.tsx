import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC,
} from "react";
import "./App.css";

const DEFAULT_POINTS = 5; //5 points

const DEFAULT_COUNTDOWN_TIME_FOR_NODE = 3; //3 seconds

const DEFAULT_AUTO_PLAY_INTERVAL = 1 * 1000; //1 second

interface INodeItem {
  index: number;
  isActive: boolean;
  position: { x: number; y: number };
  countdown: number;
  isClicked: boolean;
}

interface INodeItemProps extends INodeItem {
  onRemoveNode: (index: number) => void;
  handleClickNodeItem: (index: number) => void;
}

const NodeItem: FC<INodeItemProps> = ({
  index,
  isActive,
  position,
  isClicked,
  countdown,
  onRemoveNode,
  handleClickNodeItem,
}) => {
  const [countdownTimeNode, setCountdownTimeNode] = useState<number>(countdown);
  const intervalIdRef = useRef<number | undefined>(null);

  const handleCountdown = () => {
    setCountdownTimeNode((prev) => {
      if (prev <= 0) {
        onRemoveNode(index);
        if (intervalIdRef.current) {
          clearInterval(intervalIdRef.current);
        }
      }
      return prev - 0.1;
    });
  };

  useEffect(() => {
    if (!isClicked || !isActive) return;

    intervalIdRef.current = setInterval(() => {
      handleCountdown();
    }, 100);

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [index, isClicked]);

  if (!isActive) return null;

  return (
    <div
      className={isClicked ? "node-item-clicked" : "node-item"}
      onClick={() => handleClickNodeItem(index)}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
      }}
    >
      <div>
        {index + 1}
        {isClicked && (
          <div className="countdown-node">{countdownTimeNode.toFixed(1)}</div>
        )}
      </div>
    </div>
  );
};

function App() {
  const [totalGameTime, setTotalGameTime] = useState<number>(0);
  const [isPlayingGame, setIsPlayingGame] = useState<boolean>(false);
  const [point, setPoint] = useState<number | null>(DEFAULT_POINTS);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [listNode, setListNode] = useState<INodeItem[]>([]);
  const [nextNodeIndex, setNextNodeIndex] = useState<number>(0);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(false);
  const [isWin, setIsWin] = useState<boolean>(false);

  const containerDisplayNode = useRef<HTMLDivElement>(null);
  const intervalTotalGameTime = useRef<number | undefined>(undefined);
  const intervalAutoPlayMode = useRef<number | undefined>(undefined);

  const onChangePointInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!isNaN(value)) {
      setPoint(value);
    }
  };

  const handleClickPlayingGame = useCallback(() => {
    if (isPlayingGame) {
      handleRestartGame();
    } else {
      handleStartGame();
    }
  }, [point, isPlayingGame]);

  const handleStartGame = () => {
    if (!point || point < 1) {
      alert("Please enter a valid point value.");
      return;
    }

    setIsGameOver(false);
    setIsPlayingGame(true);
    setNextNodeIndex(0);

    generateListNodeItem();
  };

  const generateListNodeItem = () => {
    const heightContainer = containerDisplayNode.current?.clientHeight || 0;
    const widthContainer = containerDisplayNode.current?.clientWidth || 0;

    const newListNode: INodeItem[] = Array.from(
      { length: point || 0 },
      (_, index) => {
        const x = Math.random() * (widthContainer - 50);
        const y = Math.random() * (heightContainer - 50);
        return {
          index,
          isActive: true,
          position: { x, y },
          isClicked: false,
          countdown: DEFAULT_COUNTDOWN_TIME_FOR_NODE,
        };
      }
    );

    setListNode(newListNode);
  };

  const handleRestartGame = () => {
    setIsGameOver(false);
    setTotalGameTime(0);
    setPoint(DEFAULT_POINTS);
    setIsPlayingGame(false);
    setListNode([]);
    setIsAutoPlay(false);
  };

  const handleAutoPlay = () => {
    setIsAutoPlay((prev) => !prev);
  };

  const onRemoveNode = (index: number) => {
    setListNode((prev) =>
      prev.map((node, i) => (i === index ? { ...node, isActive: false } : node))
    );
  };

  const onClickNodeItem = (index: number) => {
    // Check if the clicked node is the next expected node
    if (index !== nextNodeIndex) {
      setIsGameOver(true);
      clearInterval(intervalTotalGameTime.current);
      setIsPlayingGame(false);
      setListNode([]);
      return;
    }

    // Mark the node as clicked
    setListNode((prev) =>
      prev.map((item, i) => (i === index ? { ...item, isClicked: true } : item))
    );

    increasingNextNode();
  };

  const increasingNextNode = () => {
    setNextNodeIndex((prev) => prev + 1);
  };

  const handleAutoPlayMode = () => {
    onClickNodeItem(nextNodeIndex);
  };

  const handleWinGame = () => {
    setIsWin(true);
    setIsPlayingGame(false);
    setListNode([]);
    setIsAutoPlay(false);
    clearInterval(intervalTotalGameTime.current);
  };

  /**
   * Display the title based on the game state.
   */
  const displayTitle = useMemo(() => {
    const colorTitle = isWin ? "green" : isGameOver ? "red" : "";

    if (isGameOver) return <h2 style={{ color: colorTitle }}>GAME OVER</h2>;
    if (isWin) return <h2 style={{ color: colorTitle }}>ALL CLEARED! </h2>;
    return <h2 style={{ color: colorTitle }}>LET'S PLAY</h2>;
  }, [isGameOver, isWin]);

  useEffect(() => {
    if (!isPlayingGame) return;

    intervalTotalGameTime.current = setInterval(() => {
      setTotalGameTime((prev) => prev + 0.1);
    }, 100);

    return () => clearInterval(intervalTotalGameTime.current);
  }, [isPlayingGame]);

  useEffect(() => {
    if (isAutoPlay && isPlayingGame) {
      intervalAutoPlayMode.current = setInterval(() => {
        handleAutoPlayMode();
      }, DEFAULT_AUTO_PLAY_INTERVAL);
    }

    return () => clearInterval(intervalAutoPlayMode.current);
  }, [isAutoPlay, isPlayingGame]);

  useEffect(() => {
    if (!isPlayingGame) return;

    const allCleared = listNode.every(
      (node) => node.isClicked && !node.isActive
    );

    if (allCleared) {
      handleWinGame();
    }
  }, [listNode, isPlayingGame]);

  return (
    <Fragment>
      {displayTitle}
      <div className="points-wrapper">
        <div>Points</div>
        <input
          className="input-points"
          type="number"
          value={point || ""}
          placeholder="Type your point want display"
          onChange={onChangePointInput}
        />
      </div>

      <div className="points-input">
        <div>Times</div>
        <div>{totalGameTime.toFixed(1)} s</div>
      </div>

      <div className="wrapper-buttons">
        <button onClick={handleClickPlayingGame}>
          {isPlayingGame ? "Restart" : "Start"}
        </button>
        {isPlayingGame && (
          <button onClick={handleAutoPlay}>
            {isAutoPlay ? "Auto Play OFF" : "Auto Play ON"}
          </button>
        )}
      </div>

      <div>
        <div className="container-display-node-item" ref={containerDisplayNode}>
          {listNode &&
            listNode?.map((node, index) => (
              <NodeItem
                key={index}
                {...node}
                onRemoveNode={onRemoveNode}
                handleClickNodeItem={onClickNodeItem}
              />
            ))}
        </div>
      </div>

      <div>{isPlayingGame && <div>Next: {nextNodeIndex + 1}</div>}</div>
    </Fragment>
  );
}

export default App;
