// src/components/Layout.tsx
import React from 'react';

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div
      style={{
        maxWidth: '500px',           // or any width you want
        maxHeight: '800px',          // optional height limit
        margin: '0 auto',            // horizontal center
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100vh',             // take full screen height
        border: '1px solid #ccc',    // just for visibility
        boxSizing: 'border-box',
        backgroundColor: '#fff'
      }}
    >
      {children}
    </div>
  );
}
