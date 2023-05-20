import React, { useContext, useCallback } from "react";
import { Nav, Navbar, Container } from "react-bootstrap";
import "./NavBar.css";
// import "../../../styles/fonts/font.css";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  AuthContext,
  tryLoadAuthContextFromLocalStorage,
  removeAuthContextFromLocalStorage,
} from "../../../context/AuthProvider";

export default function NavBar() {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);

  const handleLogout = useCallback(
    async (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();
      removeAuthContextFromLocalStorage();
      setAuth(null);
      navigate("/");
    },
    []
  );

  return (
    <div className="MainNavBar">
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand className="MainTitle" onClick={() => navigate("/")}>
            SWcon
          </Navbar.Brand>
          <Navbar.Collapse id="responsive-navbar-nav" className="MenuList">
            <Nav className="me-auto">
              <Nav.Link onClick={() => navigate("/users")}>Users</Nav.Link>
              <Nav.Link onClick={() => navigate("/ranking")}>
                Scoreboard
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/challenge")}>
                Challenge
              </Nav.Link>
              <Nav.Link
                onClick={() => navigate("/discord")}
                href="https://discord.gg/MqkHmwz5"
              >
                Discord
              </Nav.Link>
            </Nav>
            <Nav>
              {auth ? (
                ""
              ) : (
                <Nav.Link onClick={() => navigate("/register")}>
                  <FaUserPlus className="faIcon" />
                  Register
                </Nav.Link>
              )}
              {auth ? (
                <Nav.Link onClick={handleLogout}>
                  <FaSignInAlt className="faIcon" />
                  Logout
                </Nav.Link>
              ) : (
                <Nav.Link onClick={() => navigate("/login")}>
                  <FaSignInAlt className="faIcon" />
                  Login
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}
