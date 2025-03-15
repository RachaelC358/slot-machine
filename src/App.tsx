import React from "react";
import BonusWheel from "./BonusWheel.tsx";

const App = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Spin the Bonus Wheel!</h1>
      <BonusWheel />
    </div>
  );
};

export default App;
