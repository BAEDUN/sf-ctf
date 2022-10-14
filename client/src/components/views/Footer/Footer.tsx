import React from "react";
import "./Footer.css";
import "../../../styles/fonts/font.css";
import { MDBFooter } from "mdb-react-ui-kit";

export default function Footer() {
  return (
    <MDBFooter className='text-center' color='white' bgColor='dark'>
      <div className='text-center p-3 fixed-bottom' style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
        © 2022 Copyright:
        <a className='text-white' href='https://securityfirst.co.kr/'>
            securityfirst.co.kr
        </a>
      </div>
    </MDBFooter>
  );
}
