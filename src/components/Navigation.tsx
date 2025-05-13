import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      width: '100%',
      display: 'flex',
      justifyContent: 'space-around',
      backgroundColor: '#fff',
      borderTop: '1px solid #ccc',
      padding: '10px 0'
    }}>
      <Link to="/" style={{ color: isActive('/') ? 'blue' : 'black' }}>Home</Link>
      <Link to="/settings" style={{ color: isActive('/settings') ? 'blue' : 'black' }}>Settings</Link>
      <Link to="/about" style={{ color: isActive('/about') ? 'blue' : 'black' }}>About</Link>
    </nav>
  );
}