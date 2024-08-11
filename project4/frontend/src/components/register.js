import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function Register() {

    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: ''
    });

    const navigate = useNavigate();

    function updateForm(jsonObj) {
        return setForm((prevJsonObj) => {
            return { ...prevJsonObj, ...jsonObj }
        });
    }

    async function onSubmit(e) {
        e.preventDefault();

        const newPerson = { ...form };
        //Call to create the new account
        try {
            const response = await fetch(`http://localhost:5000/record/add`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPerson),
            });

            const responseData = await response.json();

            //Show error window if there's a problem 
            if (response.status !== 200) {
                window.alert(responseData.message || "There was an error creating the account.");
                return;
            }

            //Login with the new account. 
            try {
                const loginResponse = await fetch(`http://localhost:5000/login/${form.email}`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newPerson),
                });

                const loginResponseData = await loginResponse.json();

                //Couln't login with new account. 
                if (loginResponse.status !== 200) {
                    window.alert(loginResponseData.message || "There was an error creating the account.");
                    return;
                }
            } catch (error) {
                window.alert("There was an error connecting to the server. Please try again later.");
                console.error("Error creating account:", error);
            }

            setForm({ first_name: '', last_name: '', email: '', phone: '', password: '' });
            //Go to account summary page. 
            navigate(`/summary`);
        } catch (error) {
            window.alert("There was an error connecting to the server. Please try again later.");
            console.error("Error creating account:", error);
        }

    }

    return (
        <div>
            <h3>Create Account</h3>
            <form onSubmit={onSubmit}>
                <div>
                    <label>First Name: </label>
                    <input
                        type='text'
                        id='first_name'
                        value={form.first_name}
                        onChange={(e) => updateForm({ first_name: e.target.value })}
                    />
                </div>

                <div>
                    <label>Last Name: </label>
                    <input
                        type='text'
                        id='last_name'
                        value={form.last_name}
                        onChange={(e) => updateForm({ last_name: e.target.value })}
                    />
                </div>

                <div>
                    <label>Email: </label>
                    <input
                        type='text'
                        id='email'
                        value={form.email}
                        onChange={(e) => updateForm({ email: e.target.value })}
                    />
                </div>

                <div>
                    <label>Phone: </label>
                    <input
                        type='text'
                        id='phone'
                        value={form.phone}
                        onChange={(e) => updateForm({ phone: e.target.value })}
                    />
                </div>

                <div>
                    <label>Password: </label>
                    <input
                        type='text'
                        id='password'
                        value={form.password}
                        onChange={(e) => updateForm({ password: e.target.value })}
                    />
                </div>
                <br />
                <div>
                    <input
                        type='submit'
                        value='Create Record'
                    />
                </div>
            </form>
        </div>
    );
}