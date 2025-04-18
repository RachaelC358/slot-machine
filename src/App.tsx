import './App.css'
import { useEffect } from 'react';
import { getOrCreateUserId } from '../utils/user';

function App() {
  useEffect(() => {
    const id = getOrCreateUserId();
    console.log('User ID:', id);
    // Optionally: send to analytics or backend later
  } , []);
  return (
    0
  )
}

export default App
