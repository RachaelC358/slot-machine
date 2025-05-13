// src/pages/HomePage.tsx
import { useState, useEffect } from 'react';
import Counter from '../components/Counter';

export default function HomePage() {
  const [displayCount, setDisplayCount] = useState(0);

  // Example of fetching or calculating the count on page load
  useEffect(() => {
    // Replace this with actual logic to load user currency
    const initialCount = 100; // mock value
    setDisplayCount(initialCount);
  }, []);

  return (
    <div>
      <h1>Home</h1>
      <Counter count={displayCount} />
    </div>
  );
}
