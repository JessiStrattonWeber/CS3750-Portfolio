import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './authentication';

export default function Home() {
    const { isLoggedIn, userRole } = useAuth();

    return (
        <>
            <div className='the-header'>
                <div className="container">
                    <div className="header d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <img src='/townsville_logo.png' alt="Townsville Bank Logo" className='logo' />
                            <img src='/city_of_townsville_bank.png' alt="City of Townsville Bank" className='main-img' />
                        </div>
                        <div className="contact-info text-start">
                            <p><a href='/'><img src='/chat.svg' className='icon' alt='messaging icon'/>Live Chat</a></p>
                            <p><img src='/phone.svg' className='icon' alt='phone icon'/>Call Us: 123-456-7890</p>
                            <nobr><img src='/mail.svg' className='icon' alt='email icon'/>Email: contact@townsvillebank.com</nobr>
                        </div>
                    </div>
                </div>
            </div>
            <div className='the-navbar'>
                <nav className="link-menu">
                    {!isLoggedIn && <Link to='/' className="nav-button">Login</Link>}
                    {isLoggedIn && <Link to='/my-account' className="nav-button">My Account</Link>}
                    {isLoggedIn && (userRole === "admin" || userRole === "employee") && <Link to='/employee-dash' className="nav-button">Employee Dashboard</Link>}
                    {isLoggedIn && <Link to='/logout' className="nav-button">Logout</Link>}
                </nav>
            </div>
        </>
    );
}
