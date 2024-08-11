import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AccountLookup() {
    const [form, setForm] = useState({
        lookupID: '',
    });
    const [found, setFound] = useState(''); //Boolean for account with given ID was found
    const [accountInfo, setAccountInfo] = useState(null); //Information in that account
    const navigate = useNavigate();

    //Straight from tutorial
    function updateForm(jsonObj) {
        return setForm((prevJsonObj) => {
            return { ...prevJsonObj, ...jsonObj };
        });
    }

    async function onSubmit(e) {
        e.preventDefault();
        setFound('');
        setAccountInfo(null);

        try {
            const response = await fetch('http://localhost:5000/lookup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: form.lookupID }),
                credentials: 'include'
            });

            const statusResponse = await response.json();
            console.log(statusResponse);

            //The account was found
            if (response.status === 200) {
                setAccountInfo(statusResponse);
                setFound("Account was found!");
            } else {
                //Account not found
                setFound(statusResponse.message);
            }
        } catch (error) {
            setFound("An error occurred while looking up the account. Please try again later.");
            console.error("Lookup error:", error);
        }
    }
    // If account is found then display a table of info
    return (
        <div className="text-center d-flex flex-column align-items-center">
            <div className='card'>
                <h3>Account Lookup</h3>
                <form onSubmit={onSubmit}>
                    <div>
                        <label className="form-label">Account ID: </label>
                        <input
                            type="text"
                            className="form-control"
                            value={form.lookupID}
                            onChange={(e) => updateForm({ lookupID: e.target.value })}
                        />
                    </div>
                    <br />
                    <div>
                        <input className='btn-submit'
                            type='submit'
                            value='Lookup'
                        />
                    </div>
                </form>
                <p className='error-message'>{found}</p>
                {accountInfo && (
                    <div>
                        <h4>Account Details: </h4>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Role</th>
                                    <th>Checking</th>
                                    <th>Investment</th>
                                    <th>Savings</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{accountInfo.id}</td>
                                    <td>{accountInfo.first_name}</td>
                                    <td>{accountInfo.last_name}</td>
                                    <td>{accountInfo.email}</td>
                                    <td>{accountInfo.phone}</td>
                                    <td>{accountInfo.role}</td>
                                    <td>${(accountInfo.checking / 100).toFixed(2)}</td>
                                    <td>${(accountInfo.savings / 100).toFixed(2)}</td>
                                    <td>${(accountInfo.investment / 100).toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                        <button
                            className="btn btn-primary mt-3"
                            onClick={() => navigate(`/employee-summary/${accountInfo.id}`)}>
                            Go to Account Summary
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
