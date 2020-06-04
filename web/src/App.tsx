import React, { useState } from 'react';
import Header from './components/Header';

function App() {
  const [counter, setCounter] = useState(0);

  function handleButtonClick() {
    setCounter(counter + 1);
  }

  return (
    <>
      <Header title="Hello World" />
      <Header title="Hello nlw" />
      <h1>Hello nlw {counter}</h1>

      <button type="button" onClick={handleButtonClick}>
        Aumentar
      </button>
    </>
  );
}

export default App;
