import React from 'react';
import "./Login.css";
import { MDBInput, MDBBtn } from 'mdb-react-ui-kit';


export default function Login() {
    return (
        <div className='Login mt-5'>
            <div className="Title">
                LOGIN
            </div>
            <div className="LoginForm">
                <MDBInput label='Username' type='text' id='formWhite' contrast />
                <MDBInput label='Password' type='password' id='formWhite' className='mt-3' contrast />
                <MDBBtn className='LoginBtn text-dark mt-4' color='light'>
                    Login
                </MDBBtn>
            </div>
        </div>
    );
}