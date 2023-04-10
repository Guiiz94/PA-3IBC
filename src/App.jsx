import './App.css'
import React from 'react';
import HomePage from './HomePage';
import Navbar from './Navbar';
import MarketPlace from './MarketPlace';

function App() {
  return (
    <div className="App">
      <div className="background" />
      <Navbar />
      <div className="content">
        <HomePage />
        {/* <MarketPlace /> */}
      </div>
    </div>
  );
}


export default App;