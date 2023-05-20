import * as React from "react";
import { useNavigate } from "react-router-dom";
import createChallenge from "../../../../assets/images/createChallenge.png";
import updateChallenge from "../../../../assets/images/updateChallenge.png";
import { Nav } from "react-bootstrap";

export default function Challenge() {
  const navigate = useNavigate();

  return (
    <div className="container-lg contain">
      <div className="cardItem">
        <div className="card bg-light mb-3">
          <Nav.Link onClick={() => navigate("create")}>
            <img src={createChallenge} />
          </Nav.Link>
          <div className="card-body">
            <Nav.Link onClick={() => navigate("create")}>
              <h5 className="card-title" style={{ color: "#111" }}>
                Create
              </h5>
            </Nav.Link>
          </div>
        </div>
      </div>
      <div className="cardItem">
        <div className="card bg-light mb-3">
          <Nav.Link onClick={() => navigate("update")}>
            <img src={updateChallenge} />
          </Nav.Link>
          <div className="card-body">
            <Nav.Link onClick={() => navigate("update")}>
              <h5 className="card-title" style={{ color: "#111" }}>
                Update
              </h5>
            </Nav.Link>
          </div>
        </div>
      </div>
    </div>
  );
}
