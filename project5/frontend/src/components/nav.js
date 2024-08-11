import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className="the-navbar" >
      <div className="container d-flex justify-content-between align-items-center">
        <div className="d-flex  align-items-center" style={{ backgroundColor: 'cadetblue', padding: '20px', borderRadius: '5px' }}>
          <img src={`/hangman-6.png`} alt={`You died!`}  />
          <h1 className="display-4 mb-0">Hangman Game</h1>
        </div>
        <nav>
          <Link to="/" className="nav-button">Restart Game</Link> 
        </nav>
      </div>
    </header>
  );
};

export default Navbar;