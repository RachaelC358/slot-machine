// src/components/Layout.tsx
import React from 'react';
import Navigation from './Navigation';

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div
      style={{
        maxWidth: '500px',
        margin: '0 auto',
        height: '100vh',
        border: '1px solid #ccc',
        boxSizing: 'border-box',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Scrollable content area */}
      <div
        style={{
          flexGrow: 1,
          overflowY: 'auto',
        }}
      >
        {children}
      </div>

      {/* Sticky nav inside layout */}
      <div style={{ position: 'sticky', bottom: 0 }}>
        <Navigation />
      </div>
    </div>
  );
}
