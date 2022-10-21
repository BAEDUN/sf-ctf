import React, { useRef, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Login.css";
import { MDBInput, MDBBtn } from 'mdb-react-ui-kit';
import { UserApi } from "../../../api"
import { AuthContext } from '../../../context/AuthProvider';

export default function Login() {
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);
    setAuth(null)


    const userRef = useRef<any>(null);
    const errRef = useRef<any>(null);

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current?.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            const userApi = new UserApi();
            const response = await userApi.usersControllerLogin({
                username: user,
                password: pwd
            })
            console.log(JSON.stringify(response?.data));
            const accessToken = response?.data?.accessToken;
            setAuth({
                token: accessToken
            });
            setUser('');
            setPwd('');
            setSuccess(true);

            navigate("/", { replace: true })
        } catch (err: any) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 401) {
                setErrMsg('Invalid username or password');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    return (
        <>
            {success ? (
                <section>
                    <h1>You are logged in!</h1>
                    <br />
                    <p>
                        <a href="#">Go to Home</a>
                    </p>
                </section>
            ) : (
                <form className='Login mt-5' onSubmit={handleSubmit}>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <div className="Title">
                        <h1>LOGIN</h1>
                    </div>
                    <div className="LoginForm">
                        <MDBInput
                            label='Username'
                            type='text'
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            value={user}
                            required
                            contrast />
                        <MDBInput
                            label='Password'
                            type='password'
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                            className='mt-3'
                            contrast />
                        <MDBBtn className='LoginBtn text-dark mt-4' color='light' disabled={!user || !pwd ? true : false}>
                            Login
                        </MDBBtn>
                    </div>
                </form>
            )}
        </>
    );
}