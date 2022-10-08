import React from 'react';
import "../../../styles/fonts/font.css";
import { MDBFooter } from 'mdb-react-ui-kit';

export default function Footer() {
    return (
        <MDBFooter id='Footer' bgColor='light' className='text-center text-lg-left'>
            <div className='text-center p-3 fixed-bottom' style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                &copy; {new Date().getFullYear()} Copyright:{' '}
                <a className='text-dark' href='https://securityfirst.co.kr/'>
                    securityfirst.co.kr
                </a>
            </div>
        </MDBFooter>
    );
}
