// src/pages/BonusSpinPage.tsx
import Wheel from '../components/Wheel';
import { useState } from 'react';

export default function BonusSpinPage() {
  const [spinning, setSpinning] = useState(false);

  const handleSpinStart = () => {
    setSpinning(true);
    console.log('Spin started!');
  };

  const handleSpinEnd = () => {
    setSpinning(false);
    console.log('Spin ended!');
  };

  return (
    <div>
      <h2>Bonus Spin</h2>
      {spinning && <p>Spinning...</p>}
      <Wheel onSpinStart={handleSpinStart} onSpinEnd={handleSpinEnd} />
    </div>
  );
}