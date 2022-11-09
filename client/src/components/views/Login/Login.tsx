import React, { useRef, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { MDBInput, MDBBtn } from "mdb-react-ui-kit";
import { UserApi } from "../../../api";
import {
    AuthContext,
    IAuthContext,
    saveAuthContextFromLocalStorage,
} from "../../../context/AuthProvider";
import { toast, ToastContainer } from "react-toastify";

export default function Login() {
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);

    const userRef = useRef<any>(null);

    const [user, setUser] = useState("");
    const [pwd, setPwd] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!auth) {
            return;
        }
        navigate("/", { replace: true });
    }, [auth]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            const userApi = new UserApi(undefined, location.origin);
            const response = await userApi.usersControllerLogin({
                username: user,
                password: pwd,
            });
            console.log(JSON.stringify(response?.data));
            const accessToken = response?.data?.accessToken;
            const auth = {
                token: accessToken,
            } as IAuthContext;
            setAuth(auth);
            setUser("");
            setPwd("");
            setSuccess(true);
            saveAuthContextFromLocalStorage(auth);
        } catch (err: any) {
            if (!err?.response) {
                toast.error("No Server Response", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                })
            } else if (err.response?.status === 401) {
                toast.error("Invalid username or password", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            } else {
                toast.error("Login Failed", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            }
        }
    };

    return (
        <div className="LoginWrap">
            <ToastContainer />
            {success ? (
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
