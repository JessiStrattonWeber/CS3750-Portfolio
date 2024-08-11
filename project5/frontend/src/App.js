import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./components/home";
import Game from "./components/play-game";
import ScoreBoard from "./components/high-scores";
import GameOver from "./components/game-over";
import GameWon from "./components/game-won";
import Navbar from "./components/nav";
import Footer from "./components/footer";



const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/play-game" element={<Game />} />
        <Route exact path="/high-scores" element={<ScoreBoard />} />
        <Route exact path="/game-over" element={<GameOver />} />
        <Route exact path="/game-won" element={<GameWon />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
