// src/components/BottomNav.tsx
import { Link, useLocation } from 'react-router-dom';

export default function Navigation() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        borderTop: '1px solid #ccc',
        padding: '10px 0',
      }}
    >
      <Link to="/" style={{ color: isActive('/') ? 'blue' : 'black' }}>Home</Link>
      <Link to="/settings" style={{ color: isActive('/settings') ? 'blue' : 'black' }}>Settings</Link>
      <Link to="/about" style={{ color: isActive('/about') ? 'blue' : 'black' }}>About</Link>
      <Link to="/coins" style={{ color: isActive('/coins') ? 'blue' : 'black' }}>Coins</Link>
    </nav>
  );
}
