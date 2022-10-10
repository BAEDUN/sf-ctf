import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./views/Main/Main";
import NavBar from "./views/NavBar/NavBar";
import Login from "./views/Login/Login";
import Footer from "./views/Footer/Footer";
import Register from "./views/Register/Register";
import Challenge from "./views/Challenge/Challenge";

export default function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/challenge" element={<Challenge />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}
