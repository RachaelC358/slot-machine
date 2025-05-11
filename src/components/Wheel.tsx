import React, { useState, useRef } from 'react';
import { Wheel } from 'react-custom-roulette';

const data = [
  { option: '0' },
  { option: '1' },
  { option: '2' },
];

type WheelProps = {
  count: number;
  onSpin: () => void;
  onSpinStart: () => void;
  onSpinEnd: () => void;
};

const SpinWheel: React.FC<WheelProps> = ({ count, onSpin, onSpinStart, onSpinEnd }) => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const spinningRef = useRef(false);

  const SPIN_COST = 20;

  const handleSpinClick = () => {
    if (count < SPIN_COST || spinningRef.current) return;

    onSpinStart(); // Pause counter
    onSpin();      // Deduct or process spin

    const newPrizeNumber = Math.floor(Math.random() * data.length);
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
    spinningRef.current = true;
  };

  return (
    <>
      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={data}
        onStopSpinning={() => {
          setMustSpin(false);
          spinningRef.current = false;
          onSpinEnd(); // Resume counter
        }}
      />
      <button onClick={handleSpinClick}>SPIN</button>
    </>
  );
};

export default React.memo(SpinWheel, (prevProps, nextProps) => {
  return prevProps.count === nextProps.count;
});
