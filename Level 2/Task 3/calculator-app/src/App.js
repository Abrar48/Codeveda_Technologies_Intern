import React, { useState } from 'react';
import './App.css';

const Button = ({ label, onClick, className }) => {
  return (
    <button className={`calc-btn ${className || ""}`} onClick={() => onClick(label)}>
      {label}
    </button>
  );
};

function App() {
  const [input, setInput] = useState("");

  const handleClick = (value) => {
    if (value === "=") {
      try {
        setInput(eval(input).toString());
      } catch {
        setInput("Error");
      }
    } else if (value === "C") {
      setInput("");
    } else {
      setInput(input + value);
    }
  };

  return (
    <div className="app-container">
      <div className="calculator">
        <div className="display">{input || "0"}</div>
        
        <div className="keypad">
          <Button label="C" onClick={handleClick} className="clear operator" />
          <Button label="/" onClick={handleClick} className="operator" />
          <Button label="*" onClick={handleClick} className="operator" />
          <Button label="-" onClick={handleClick} className="operator" />
          
          <Button label="7" onClick={handleClick} />
          <Button label="8" onClick={handleClick} />
          <Button label="9" onClick={handleClick} />
          <Button label="+" onClick={handleClick} className="operator tall" />
          
          <Button label="4" onClick={handleClick} />
          <Button label="5" onClick={handleClick} />
          <Button label="6" onClick={handleClick} />
          
          <Button label="1" onClick={handleClick} />
          <Button label="2" onClick={handleClick} />
          <Button label="3" onClick={handleClick} />
          <Button label="=" onClick={handleClick} className="equal" />
          
          <Button label="0" onClick={handleClick} className="zero" />
          <Button label="." onClick={handleClick} />
        </div>
      </div>
    </div>
  );
}

export default App;