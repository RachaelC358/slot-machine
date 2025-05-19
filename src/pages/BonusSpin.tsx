// src/pages/BonusSpinPage.tsx
import Wheel from '../components/Wheel';
import { useState } from 'react';
import styles from './BonusSpin.module.css';

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

  const size: number = 40;

  return (
    <div>
      <h2>Bonus Spin</h2>
      <div className={styles.SpinWheel_Container}>
      {spinning && <p>Spinning...</p>}
      <Wheel 
        onSpinStart={handleSpinStart} 
        onSpinEnd={handleSpinEnd}
      />
      </div>
    </div>
  );
}