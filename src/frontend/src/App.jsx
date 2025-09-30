import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Booker</h1>
        <p>Your new React application is ready.</p>
        <button onClick={() => alert('Button clicked!')}>Click me</button>
      </header>
    </div>
  );
}

export default App;
