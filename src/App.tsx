import React from "react";
import "./App.css";
import Home from "./components/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoom from "./components/PrivateRoom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/private/:id" element={<PrivateRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
