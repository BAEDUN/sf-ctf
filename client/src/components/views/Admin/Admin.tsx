import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";
import { Nav, Navbar, Container } from "react-bootstrap";
import challenge from "../../../assets/images/challenge.png";
import log from "../../../assets/images/log.png";
import user from "../../../assets/images/user.png";

enum Tab {
  CreateChallenge = "CreateChallenge",
  ViewLog = "ViewLog",
  User = "User",
}

export default function Admin() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>(Tab.CreateChallenge);

  return (
    <div className="container-lg contain">
      <div className="cardItem">
        <div className="card bg-light mb-3">
          <Nav.Link onClick={() => navigate("challenge")}>
            <img src={challenge} />
          </Nav.Link>
          <div className="card-body">
            <Nav.Link onClick={() => navigate("challenge")}>
              <h5 className="card-title" style={{ color: "#111" }}>
                Challenge
              </h5>
            </Nav.Link>
          </div>
        </div>
      </div>
      <div className="cardItem">
        <div className="card bg-light mb-3">
          <Nav.Link onClick={() => navigate("user")}>
            <img src={user} />
          </Nav.Link>
          <div className="card-body">
            <Nav.Link onClick={() => navigate("user")}>
              <h5 className="card-title" style={{ color: "#111" }}>
                User
              </h5>
            </Nav.Link>
          </div>
        </div>
      </div>
      <div className="cardItem">
        <div className="card bg-light mb-3">
          <Nav.Link onClick={() => navigate("log")}>
            <img src={log} />
          </Nav.Link>
          <div className="card-body">
            <Nav.Link onClick={() => navigate("log")}>
              <h5 className="card-title" style={{ color: "#111" }}>
                Log
              </h5>
            </Nav.Link>
          </div>
        </div>
      </div>
    </div>
  );
}
