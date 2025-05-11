import React from 'react';

type Props = {
  count: number;
};

const Counter: React.FC<Props> = ({ count }) => {
  return (
    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
      Currency: {count}
    </div>
  );
};

export default Counter;