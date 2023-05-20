import React, { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { MDBInput, MDBBtn } from "mdb-react-ui-kit";
import { ToastContainer } from "react-toastify";
import { useRecoilValue } from "recoil";
import { AuthState } from "../../../state/AuthState";
import { useAuthAction } from "../../../action/useAuthAction";

export default function Login() {
  const navigate = useNavigate();
  const auth = useRecoilValue(AuthState.auth);
  const { login } = useAuthAction();
  const userRef = useRef<any>(null);

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");

  const handleSubmit = useCallback(
    async (e: any) => {
      e.preventDefault();
      login(user, pwd);
      setUser("");
      setPwd("");
    },
    [login, user, pwd, setUser, setPwd]
  );

  useEffect(() => {
    if (auth) {
      navigate("/", { replace: true });
    }
  }, [auth]);

  return (
    <div className="LoginWrap">
      <ToastContainer />
      {auth ? (
        <section>
          <h1>You are logged in!</h1>
          <br />
          <p>
            <a href="#">Go to Home</a>
          </p>
        </section>
      ) : (
        <form className="Login mt-3" onSubmit={handleSubmit}>
          <div className="Title">
            <h1>LOGIN</h1>
          </div>
          <div className="LoginForm">
            <MDBInput
              label="Username"
              type="text"
              inputRef={userRef}
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              value={user}
              required
              contrast
            />
            <MDBInput
              label="Password"
              type="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
              className="mt-3"
              contrast
            />
            <MDBBtn
              className="LoginBtn text-dark mt-4"
              color="light"
              disabled={!user || !pwd ? true : false}
            >
              Login
            </MDBBtn>
          </div>
        </form>
      )}
    </div>
  );
}
