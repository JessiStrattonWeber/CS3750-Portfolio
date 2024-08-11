import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function Register() {

    const [message, setMessage] = useState("");
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        role: 'customer'
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

            //Show error if there's a problem 
            if (response.status !== 200) {
                setMessage("There was an error creating the account.");
                return;
            }

            setForm({ first_name: '', last_name: '', email: '', phone: '', password: '' });

            navigate(`/employee-summary/${responseData.id}`);
        } catch (error) {
            setMessage("There was an error connecting to the server. Please try again later.");
            console.error("Error creating account:", error);
        }
    }

    //Display registration form 
    return (
        <div className="text-center d-flex flex-column align-items-center">
            <div className='card'>
                <h3>Create New Account</h3>
                <form onSubmit={onSubmit}>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label" style={{ whiteSpace: 'nowrap' }}>First Name</label>
                        <div className="col-sm-9">
                            <input
                                type='text'
                                className="form-control"
                                id='first_name'
                                value={form.first_name}
                                onChange={(e) => updateForm({ first_name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label" style={{ whiteSpace: 'nowrap' }}>Last Name</label>
                        <div className="col-sm-9">
                            <input
                                type='text'
                                className="form-control"
                                id='last_name'
                                value={form.last_name}
                                onChange={(e) => updateForm({ last_name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Email</label>
                        <div className="col-sm-9">
                            <input
                                type='email'
                                className="form-control"
                                id='email'
                                value={form.email}
                                onChange={(e) => updateForm({ email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Phone</label>
                        <div className="col-sm-9">
                            <input
                                type='text'
                                className="form-control"
                                id='phone'
                                value={form.phone}
                                onChange={(e) => updateForm({ phone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Password</label>
                        <div className="col-sm-9">
                            <input
                                type='password'
                                className="form-control"
                                id='password'
                                value={form.password}
                                onChange={(e) => updateForm({ password: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Role</label>
                        <div className="col-sm-9">
                            <div className="form-check">
                                <input
                                    type='radio'
                                    className="form-check-input"
                                    id='customer'
                                    value='customer'
                                    checked={form.role === 'customer'}
                                    onChange={(e) => updateForm({ role: e.target.value })}
                                />
                                <label className="form-check-label" htmlFor="customer">Customer</label>
                            </div>
                            <div className="form-check">
                                <input
                                    type='radio'
                                    className="form-check-input"
                                    id='employee'
                                    value='employee'
                                    checked={form.role === 'employee'}
                                    onChange={(e) => updateForm({ role: e.target.value })}
                                />
                                <label className="form-check-label" htmlFor="employee">Employee</label>
                            </div>
                            <div className="form-check">
                                <input
                                    type='radio'
                                    className="form-check-input"
                                    id='admin'
                                    value='admin'
                                    checked={form.role === 'admin'}
                                    onChange={(e) => updateForm({ role: e.target.value })}
                                />
                                <label className="form-check-label" htmlFor="admin">Admin</label>
                            </div>
                        </div>
                    </div>
                    <div>
                        <input className="btn-submit" type='submit' value='Create Account' />
                    </div>
                </form>
                <p className="error-message">{message}</p>
            </div>
        </div>
    );
}