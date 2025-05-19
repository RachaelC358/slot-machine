import React, { useState, useRef } from 'react';
import { Wheel } from 'react-custom-roulette';
import styles from './Wheel.module.css';


const data = [
  { option: '0' },
  { option: '1' },
  { option: '2' },
];

type WheelProps = {
  onSpinStart: () => void;
  onSpinEnd: () => void;
};

const SpinWheel: React.FC<WheelProps> = ({ onSpinStart, onSpinEnd }) => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const spinningRef = useRef(false);

  const handleSpinClick = () => {
    if ( spinningRef.current) return;

    onSpinStart();
    const newPrizeNumber = Math.floor(Math.random() * data.length);
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
    spinningRef.current = true;
  };

  return (
    <>
          <div className={styles.SpinWheel_Container}>
<div style={{ transform: 'scale(0.5)', transformOrigin: 'top left' }}>

      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={data}
        innerRadius={30}
        onStopSpinning={() => {
          setMustSpin(false);
          spinningRef.current = false;
          onSpinEnd(); // Resume counter
        }}
      />
      </div>
      </div>
      <button onClick={handleSpinClick}>SPIN</button>
    </>
  );
};

export default React.memo(SpinWheel, (prevProps, nextProps) => {
  return prevProps.count === nextProps.count;
});
