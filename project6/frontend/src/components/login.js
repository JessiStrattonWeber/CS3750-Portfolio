import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from './authentication';

export default function Login() {
    const [form, setForm] = useState({
        email: '',
        password: '',
    });
    const [loginStatus, setLoginStatus] = useState('');
    const [accountNotFound, setAccountNotFound] = useState(false);
    const navigate = useNavigate();
    const { setIsLoggedIn, setUserRole } = useAuth();

    function updateForm(jsonObj) {
        return setForm((prevJsonObj) => {
            return { ...prevJsonObj, ...jsonObj };
        });
    }

    async function onSubmit(e) {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:5000/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password: form.password,
                    email: form.email
                }),
                credentials: 'include'
            });

            const statusResponse = await response.json();
            console.log(statusResponse);

            if (response.status === 200) {
                setLoginStatus("Login successful!");
                setIsLoggedIn(true);
                setAccountNotFound(false);
                setUserRole(statusResponse.role); // Set the user's role
                navigate(`/my-account`);
            } else {
                setLoginStatus(statusResponse.message);
                setAccountNotFound(true);
            }
        } catch (error) {
            setLoginStatus("An error occurred while logging in. Please try again later.");
            console.error("Login error:", error);
        }
    }

    return (
        <div>
            {accountNotFound && (
                <div className="text-center d-flex flex-column align-items-center">
                    <div className="card">
                        <p className="error-message">{loginStatus}</p>
                    </div>
                </div>
            )}
            <div className="text-center d-flex flex-column align-items-center">
                <div className="card">
                    <h3>Login</h3>
                    <form onSubmit={onSubmit}>
                        <div>
                            <label className="form-label">Email: </label>
                            <input
                                type="email"
                                className="form-control"
                                value={form.email}
                                onChange={(e) => updateForm({ email: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="form-label">Password: </label>
                            <input
                                type="password"
                                className="form-control"
                                value={form.password}
                                onChange={(e) => updateForm({ password: e.target.value })}
                            />
                        </div>
                        <br />
                        <div>
                            <input className="btn-submit"
                                type='submit'
                                value='Login'
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
