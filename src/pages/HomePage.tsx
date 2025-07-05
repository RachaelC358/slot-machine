// src/pages/HomePage.tsx
import { useState, useEffect } from 'react';
import Counter from '../components/Counter';
import ColorPicker from 'react-pick-color';

export default function HomePage() {
  const [displayCount, setDisplayCount] = useState(0);
  const [color, setColor] = useState('#646cff'); 

  useEffect(() => {
    const storedColor = localStorage.getItem('userColor');
    if (storedColor) {
      setColor(storedColor);
      applyColorScheme(storedColor);
    }

    const initialCount = 100; 
    setDisplayCount(initialCount);
  }, []);

  function applyColorScheme(newColor: string) {
    document.documentElement.style.setProperty('--primary-color', newColor);
  }

  function handleColorChange(newHex: string) {
    setColor(newHex);
    localStorage.setItem('userColor', newHex);
    applyColorScheme(newHex);
  }

  return (
      <div className="container">
      <div className="content">
      <h1>Home</h1>
      <Counter count={displayCount} />
      <ColorPicker color={color} onChange={(color) => handleColorChange(color.hex)} />
    </div>
    </div>
  );
}
