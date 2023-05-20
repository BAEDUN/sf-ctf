import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Main from "./views/Main/Main";
import NavBar from "./views/NavBar/NavBar";
import Login from "./views/Login/Login";
import Footer from "./views/Footer/Footer";
import Register from "./views/Register/Register";
import Challenges from "./views/Challenge/Challenges";
import ScoreBoard from "./views/ScoreBoard/ScoreBoard";
import Admin from "./views/Admin/Admin";
import Log from "./views/Admin/ViewLog/ViewLog";
import AdminUser from "./views/Admin/User/User";
import AdminChallenge from "./views/Admin/Challenge/Challenge";
import {
  tryLoadAuthContextFromLocalStorage,
  useAuthContext,
} from "../context/AuthProvider";
import User from "./views/User/User";
import CreateChallenge from "./views/Admin/Challenge/CreateChallenge/CreateChallenge";
import { UpdateChallenge } from "./views/Admin/Challenge/UpdateChallenge/UpdateChallenge";
import UpdateAction from "./views/Admin/Challenge/UpdateChallenge/UpdateAction";

export default function App() {
  const { auth, setAuth } = useAuthContext();
  const adminChallenge = "/admin/challenge";
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
          <Route path="/challenge" element={<Challenges />} />
          <Route path="/ranking" element={<ScoreBoard />} />
          <Route path="/users" element={<User />} />
          <Route path="/admin" element={<Admin />} />
          <Route path={adminChallenge} element={<AdminChallenge />} />
          <Route
            path={`${adminChallenge}/create`}
            element={<CreateChallenge />}
          />
          <Route
            path={`${adminChallenge}/update`}
            element={<UpdateChallenge />}
          />
          <Route
            path={`${adminChallenge}/update/:title`}
            element={<UpdateAction />}
          />
          <Route path="/admin/user" element={<AdminUser />} />
          <Route path="/admin/log" element={<Log />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}
