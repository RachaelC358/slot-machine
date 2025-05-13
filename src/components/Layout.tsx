// src/components/Layout.tsx
import React from 'react';
import Navigation from '../components/Navigation';

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div
      style={{
        maxWidth: '500px',
        maxHeight: '800px',
        margin: '0 auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100vh',
        border: '1px solid #ccc',
        boxSizing: 'border-box',
        backgroundColor: '#fff'
      }}
    >
      <div style={{ flexGrow: 1 }}>{children}</div>
      <Navigation />
    </div>
  );
}
