import React, { useState, useEffect } from "react";
import "../assets/styles/Counter.css";

function Counter() {
  const [counter, changeCounter] = useState(() => {
    const savedCounter = localStorage.getItem('counterValue');
    return savedCounter ? JSON.parse(savedCounter) : 1;
  });

  useEffect(() => {
    localStorage.setItem('counterValue', JSON.stringify(counter));
  }, [counter]);

  const handleIncrement = () => {
    changeCounter(counter + 1);
  };

  const handleDecrement = () => {
    changeCounter(counter - 1);
  };

  return (
    <div className="App">
      <div className="counter-container">
        <h1 className="header">The Current Number is</h1>
        <h2 className="header">{counter}</h2>
        <button className="button-increment" onClick={handleIncrement}>
          +1
        </button>
        <button
          className="button-decrement"
          onClick={handleDecrement}
          disabled={counter <= 0}
        >
          -1
        </button>
      </div>
    </div>
  );
}

export default Counter;
