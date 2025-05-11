import './App.css';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { getOrCreateUserId } from '../utils/user';
import Counter from '../src/components/Counter'; 
import Wheel from '../src/components/Wheel';

const MAX_COUNT = 100_000;
const START_TIME_KEY = "currencyCounterStartTime";

const getStartTime = (): number => {
  const saved = localStorage.getItem(START_TIME_KEY);
  if (saved) return parseInt(saved, 10);
  const now = Date.now();
  localStorage.setItem(START_TIME_KEY, now.toString());
  return now;
};

function App() {
  const [displayCount, setDisplayCount] = useState(0);
  const [currencyCount, setCurrencyCount] = useState(0);
  const [paused, setPaused] = useState(false); // ✅ Paused state

  useEffect(() => {
    const id = getOrCreateUserId();
    console.log('User ID:', id);

    const startTime = getStartTime();

    const updateCounter = () => {
      if (paused) return; // ✅ Skip update if paused

      const secondsElapsed = Math.floor((Date.now() - startTime) / 1000);
      const newCount = Math.min(secondsElapsed, MAX_COUNT);
      setDisplayCount(newCount);
      setCurrencyCount(prev => {
        const updatedCount = Math.max(prev, newCount);
        return isNaN(updatedCount) ? 0 : updatedCount;
      });
    };

    updateCounter();
    const interval = setInterval(updateCounter, 1000);
    return () => clearInterval(interval);
  }, [paused]); // ✅ Include paused in deps

  const frozenCount = useMemo(() => currencyCount, [currencyCount]);
  const frozenSetCount = useCallback((val: number) => {
    setCurrencyCount(val);
  }, []);

  const handleSpinStart = () => setPaused(true);  // ✅ Pause counting
  const handleSpinEnd = () => setPaused(false);   // ✅ Resume counting

  return (
    <div>
      <Counter count={displayCount} />
      <Wheel
        count={frozenCount}
        onSpin={() => frozenSetCount(frozenCount - 20)}
        onSpinStart={handleSpinStart}
        onSpinEnd={handleSpinEnd}
      />
    </div>
  );
}


export default App;
