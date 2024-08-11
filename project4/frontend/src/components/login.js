import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function Login() {
    const [form, setForm] = useState({
        email: '',
        password: '',
    });
    const [loginStatus, setLoginStatus] = useState('');
    const navigate = useNavigate();

    function updateForm(jsonObj) {
        return setForm((prevJsonObj) => {
            return { ...prevJsonObj, ...jsonObj };
        });
    }

    async function onSubmit(e) {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:5000/login/${form.email}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password: form.password }),
                credentials: 'include'
            });

            const statusResponse = await response.json();
            console.log(statusResponse);

            if (response.status === 200) {
                setLoginStatus("Login successful!");
                navigate(`/summary`);
            } else {
                setLoginStatus(statusResponse.message);
            }
        } catch (error) {
            setLoginStatus("An error occurred while logging in. Please try again later.");
            console.error("Login error:", error);
        }
    }

    return (
        <div>
            <h3>Login</h3>
            <form onSubmit={onSubmit}>
                <div>
                    <label>Email: </label>
                    <input
                        type="email"
                        value={form.email}
                        onChange={(e) => updateForm({ email: e.target.value })}
                    />
                </div>

                <div>
                    <label>Password: </label>
                    <input
                        type="password"
                        value={form.password}
                        onChange={(e) => updateForm({ password: e.target.value })}
                    />
                </div>
                <br />
                <div>
                    <input
                        type='submit'
                        value='Login'
                    />
                </div>
            </form>
            <p>{loginStatus}</p>
        </div>
    );
}