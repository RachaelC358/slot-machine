import { useEffect, useState } from 'react';

export default function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const handleReset = () => {
    setSeconds(0);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Timer: {seconds} seconds</h1>
      <button
        onClick={handleReset}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Reset Timer
      </button>
    </div>
  );
}
