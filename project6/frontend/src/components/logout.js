import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from './authentication';

export default function Logout() {
    const [status, setStatus] = useState('');
    const [loggedOut, setLoggedOut] = useState(false);
    const [logoutClicked, setLogoutClicked] = useState(false);
    const { setIsLoggedIn } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        try {
            const response = await fetch(`http://localhost:5000/logout`, {
                method: 'GET',
                credentials: 'include'
            });

            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }

            const statusResponse = await response.json();
            setStatus(statusResponse.message);
            setLoggedOut(true);
            console.log("User has successfully logged out.");

            if (response.ok) {
                setIsLoggedIn(false);
                navigate('/');
            }
        } catch (error) {
            window.alert(`An error occurred: ${error.message}`);
        }
    }

    useEffect(() => {
        if (logoutClicked) {
            handleLogout();
        }
    }, [logoutClicked, navigate, setIsLoggedIn]);

    return (
        <div className="text-center d-flex flex-column align-items-center">
            <div className="card">
                <h4>Are You Sure You Want to Logout?</h4>
                {!loggedOut && (
                    <div>
                        <br />
                        <button className="btn-submit" onClick={() => setLogoutClicked(true)}>Logout</button>
                    </div>
                )}
                <p>{status}</p>
            </div>
        </div>
    );
}