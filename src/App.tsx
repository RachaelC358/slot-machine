import './App.css';
import { useEffect, useState, useRef, useCallback } from 'react';
import { getOrCreateUserId } from '../utils/user';
import Counter from '../src/components/Counter';
import Wheel from '../src/components/Wheel';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '../src/components/Layout';
import HomePage from '../src/pages/HomePage';
import BonusSpin from '../src/pages/BonusSpin';
import Navigation from '../src/components/Navigation';


const MAX_COUNT = 100_000;
const START_TIME_KEY = 'currencyCounterStartTime';

const userId = getOrCreateUserId();

const getStartTime = (): number => {
  const saved = localStorage.getItem(START_TIME_KEY);
  if (saved) return parseInt(saved, 10);
  const now = Date.now();
  localStorage.setItem(START_TIME_KEY, now.toString());
  return now;
};

function App() {
  const [displayCount, setDisplayCount] = useState(0);
  const [_, forceRerender] = useState(0); // Used to trigger rerender
  const pausedRef = useRef(false);
  const startTimeRef = useRef<number>(getStartTime());

  useEffect(() => {
    console.log('User ID:', userId);

    const updateCounter = () => {
      if (pausedRef.current) return;
      const secondsElapsed = Math.floor((Date.now() - startTimeRef.current) / 5000);
      const newCount = Math.min(secondsElapsed, MAX_COUNT);
      setDisplayCount(prev => Math.max(prev, newCount));
    };

    updateCounter();
    const interval = setInterval(updateCounter, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSpinStart = useCallback(() => {
    console.log('Spin started');
    setDisplayCount(c => Math.max(0, c - 3));

    pausedRef.current = true;

    setTimeout(() => {
      forceRerender(n => n + 1); // Trigger rerender after 1 second
    }, 1000); // 1000 ms = 1 second
  }, []);

  const handleSpinEnd = useCallback(() => {
    pausedRef.current = false;
  }, []);

  return (
    <div>
      <Counter count={displayCount} />
      <Wheel
        onSpinStart={handleSpinStart}
        onSpinEnd={handleSpinEnd}
      />
      <Router>
        <Layout>
      <div style={{ paddingBottom: '60px' }}> {/* reserve space for nav */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/settings" element={<BonusSpin />} />
        </Routes>
      </div>
      <Navigation />
      <Layout />
    </Router>
    </div>
    
  );
}

export default App;
