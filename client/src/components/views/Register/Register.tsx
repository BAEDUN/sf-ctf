import React from 'react';
import { MDBInput, MDBBtn } from 'mdb-react-ui-kit';
import "./Register.css";

export default function Register() {
    return (
        <div className='Register mt-5'>
            <div className="Title">
                REGISTER
            </div>
            <div className="RegForm">
                <MDBInput label='ID' type='text' id='formWhite' contrast />
                <MDBInput label='E-Mail' type='email' id='formWhite' className='mt-3' contrast />
                <MDBInput label='Password' type='password' id='formWhite' className='mt-3' contrast />
                <MDBInput label='Username' type='text' id='formWhite' className='mt-3' contrast />
                <select className="select-label mt-3">
                    <option value="#">소속 선택</option>
                    <option value="1">정보보호학과</option>
                    <option value="2">컴퓨터소프트웨어학과</option>
                    <option value="3">SecurityFirst</option>
                </select>
                <MDBBtn className='RegBtn text-dark mt-4' color='light'>
                    Register
                </MDBBtn>
            </div>
        </div>
    );
}