import React from 'react';
import { Nav, Navbar, Container } from 'react-bootstrap';
import "./NavBar.css";
import "../../../styles/fonts/font.css";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";

export default function NavBar() {
    return (
        <div className='MainNavBar'>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand className='MainTitle' href="/">SWcon</Navbar.Brand>
                    <Navbar.Collapse id="responsive-navbar-nav" className=' MenuList'>
                        <Nav className="me-auto">
                            <Nav.Link className='' href="/users">Users</Nav.Link>
                            <Nav.Link href="/ranking">Scoreboard</Nav.Link>
                            <Nav.Link href="/chall">Challenge</Nav.Link>
                            <Nav.Link href="/discord">Discord</Nav.Link>
                        </Nav>
                        <Nav>
                            <Nav.Link href="/register">
                                <FaUserPlus className='faIcon'/>Register
                                </Nav.Link>
                            <Nav.Link href="/login">
                                    <FaSignInAlt className='faIcon' />Login
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
}
