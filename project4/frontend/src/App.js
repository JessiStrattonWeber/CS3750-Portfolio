import './App.css';
import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./components/home.js";
import Records from "./components/records.js";
import Register from "./components/register.js";
import Login from "./components/login.js";
import Logout from "./components/logout.js";
import Summary from "./components/summary.js";
import Balance from "./components/balance.js";
import Transaction from "./components/transaction.js";

const App = () => {
  return (
    <div>
      <Home />
      <Routes>
        <Route path='/' element={<p>Welcome!</p>} />
        <Route path="/record" element={<Records />} />
        <Route path="/record/add" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/balance" element={<div><Balance /> <Transaction /></div>} />
      </Routes>
    </div>
  );
};

export default App;