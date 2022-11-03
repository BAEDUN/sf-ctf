import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./views/Main/Main";
import NavBar from "./views/NavBar/NavBar";
import Login from "./views/Login/Login";
import Footer from "./views/Footer/Footer";
import Register from "./views/Register/Register";
import Challenge from "./views/Challenge/Challenge";
import ScoreBoard from "./views/ScoreBoard/ScoreBoard";
import Admin from "./views/Admin/Admin";
import {
  tryLoadAuthContextFromLocalStorage,
  useAuthContext,
} from "../context/AuthProvider";

export default function App() {
  const { auth, setAuth } = useAuthContext();
  useEffect(() => {
    if (auth) {
      return;
    }

    const authContext = tryLoadAuthContextFromLocalStorage();
    if (!authContext) {
      return;
    }

    setAuth(authContext);
  }, []);

  return (
    <div className="App">
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/challenge" element={<Challenge />} />
          <Route path="/ranking" element={<ScoreBoard />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}
