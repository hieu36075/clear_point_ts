import { useEffect, useRef, useState } from "react";

interface ButtonProps {
  id: number;
  left: string;
  top: string;
  removing: boolean;
}

interface StatusProps {
  title: string;
  color: string;
}

interface CursorProps {
  x: number;
  y: number;
}

function App() {
  const [count, setCount] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const [buttons, setButtons] = useState<ButtonProps[]>([]);
  const [currentCount, setCurrentCount] = useState<number>(0);
  const [isPlay, setIsPlay] = useState<boolean>(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [status, setStatus] = useState<StatusProps>({ title: "Let's Play", color: "text-black" });
  const [cursor, setCursor] = useState<CursorProps>({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState<boolean>(false);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      setCursor({ x: e.clientX, y: e.clientY });
      setShowCursor(true);

      setTimeout(() => setShowCursor(false), 200);
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const playGame = () => {
    if (count <= 0) return;
    clearValues();
    setStatus({ title: "Let's Play", color: "text-black" });
    setIsPlay(true);
    generateButtons(count);
    startTime();
  };

  const generateButtons = (numButtons: number) => {
    const newButtons = Array.from({ length: numButtons }, (_, i) => ({
      id: i,
      left: `${(Math.random() * 90).toFixed(2)}%`,
      top: `${(Math.random() * 90).toFixed(2)}%`,
      removing: false,
    }));
    setButtons(newButtons);
  };

  const startTime = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setTime(0);
    intervalRef.current = setInterval(() => setTime((timer) => timer + 10), 10);
  };

  const handleClickPoint = (id: number) => {
    if (id !== currentCount) {
      setStatus({ title: "GAME OVER", color: "text-red-500" });
      clearValues();
      return;
    }

    setCurrentCount(currentCount + 1);
    setButtons((prevButtons) =>
      prevButtons.map((button) =>
        button.id === id ? { ...button, removing: true } : button
      )
    );

    setTimeout(() => {
      setButtons((prevButtons) => prevButtons.filter((button) => button.id !== id));
      if (buttons.length === 1) {
        setStatus({ title: "ALL CLEARED", color: "text-green-500" });
        clearValues();
      }
    }, 500);
  };

  const clearValues = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setCurrentCount(0);
  };

  const formatTime = (timer: number) => {
    const milliseconds = Math.floor((timer % 1000) / 100);
    const seconds = Math.floor(timer / 1000).toString().slice(-2);
    return `${seconds}:${milliseconds}`;
  };

  return (
    <div className="container flex flex-col mx-auto py-6 gap-4 z-1">
      <h1 className={`font-bold text-2xl ${status.color}`}>{status.title}</h1>
      <div className="flex flex-row gap-4 -z-11">
        <h3>Points:</h3>
        <input
          className="border border-black rounded-md px-2 z-1"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
        />
      </div>
      <div className="flex flex-row gap-4">
        <h3>Time:</h3>
        <p>{formatTime(time)}s</p>
      </div>
      <button className="border w-1/4" onClick={playGame}>
        {!isPlay ? "Play" : "Reset"}
      </button>
      <div className="relative w-full border border-black h-[70vh]">
        {buttons.map((button) => (
          <button
            key={button.id}
            className={`border w-10 h-10 rounded-full absolute transition-all duration-500 ease-in-out ${button.removing ? "focus:bg-red-400 focus:duration-1000" : ""}`}
            style={{ left: button.left, top: button.top }}
            onClick={() => handleClickPoint(button.id)}
          >
            {button.id + 1}
          </button>
        ))}
      </div>
      {showCursor && (
        <div
          className="bg-white w-12 h-12 rounded-full absolute border border-black -translate-x-1/2 -translate-y-1/2  -z-10"
          style={{ left: cursor.x, top: cursor.y }}
        />
      )}
    </div>
  );
}

export default App;
