import './App.css'
import { useEffect } from 'react';
import { getOrCreateUserId } from '../utils/user';
import Counter from '../src/components/Counter'; 

function App() {
  useEffect(() => {
    const id = getOrCreateUserId();
    console.log('User ID:', id);
    // Optionally: send to analytics or backend later
    
  } , []);
  return (
    <Counter/>
  )
}

export default App
