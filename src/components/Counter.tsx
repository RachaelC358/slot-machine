import React, { useEffect, useState } from "react";

const MAX_COUNT = 100_000;
const START_TIME_KEY = "currencyCounterStartTime";

const getStartTime = (): number => {

  const saved = localStorage.getItem(START_TIME_KEY);
  if (saved) return parseInt(saved, 10);
  const now = Date.now();
  localStorage.setItem(START_TIME_KEY, now.toString());
  return now;
};

const Counter: React.FC = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const startTime = getStartTime();

    const updateCounter = () => {
      const secondsElapsed = Math.floor((Date.now() - startTime) / 1000);
      const newCount = Math.min(secondsElapsed, MAX_COUNT);
      setCount(newCount);
    };

    updateCounter(); // update immediately
    const interval = setInterval(updateCounter, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
      Currency: {count}
    </div>
  );
};

export default Counter;
