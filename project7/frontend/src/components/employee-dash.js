import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import Register from "./register.js";
import Records from "./records.js";
import Lookup from "./account-lookup.js";
import EditRecords from "./edit.js";
import FullHistory from "./full-history.js";

export default function EmployeeDashboard() {
    const location = useLocation();
    const initialTab = location.state?.tab || 'lookup'; //Used to pass what tab to return to from other pages. Default tab is Account Lookup 
    const [userRole, setUserRole] = useState(null); // Used to check if the current user is an admin/employee
    const [errorMessage, setErrorMessage] = useState(null); // Error handling 
    const [whichTab, setWhichTab] = useState(initialTab); // Used to show the correct tab the user has selected 

    useEffect(() => {
        async function fetchUserRole() {
            try {
                const response = await fetch('http://localhost:5000/summary', {
                    method: 'POST',
                    credentials: 'include',
                });

                const data = await response.json();
                setUserRole(data.role);
            } catch (error) {
                setErrorMessage('There was an unexpected error.');
            }
        }
        // Find out who they are
        fetchUserRole();
    }, []);

    // Something went wrong. 
    if (errorMessage) {
        return <div>{errorMessage}</div>;
    }

    //read more about tabs in bootstrap here :)
    //https://getbootstrap.com/docs/5.0/components/navs-tabs/
    //Case statement to display only the comonent that is the currently selected tab
    const showThatTab = () => {
        switch (whichTab) {
            case 'lookup': return <Lookup />;
            case 'register': return <Register />;
            case 'records': return <Records />;
            case 'edit-records': return <EditRecords />;
            case 'full-history': return <FullHistory />;
            default: return <Lookup />;
        }
    }

    // Customers can't use this page. Boohoo
    if (userRole === 'customer') {
        return (
            <div className=" card text-center d-flex flex-column align-items-center">
                <p className="error-message">Sorry but you don't have permission to view this page</p>
            </div>
        );
    }

    // Render tabs for employees, and extra 'edit' tab for admins
    return (
        <div>
            <div className="top-bar">
                <h3 className='heading' >Employee Dashboard</h3>
                <div className="tabs">
                    <ul className="tab-list">
                        <li className={`tab ${whichTab === 'lookup' ? 'active' : ''}`} onClick={() => setWhichTab('lookup')}>Account Lookup</li>
                        <li className={`tab ${whichTab === 'register' ? 'active' : ''}`} onClick={() => setWhichTab('register')}>Register New Account</li>
                        <li className={`tab ${whichTab === 'records' ? 'active' : ''}`} onClick={() => setWhichTab('records')}>Account List</li>
                        {userRole === 'admin' && (
                            <li className={`tab ${whichTab === 'edit-records' ? 'active' : ''}`} onClick={() => setWhichTab('edit-records')}>Edit Accounts</li>
                        )}
                        <li className={`tab ${whichTab === 'full-history' ? 'active' : ''}`} onClick={() => setWhichTab('full-history')}>Full History</li>
                    </ul>
                </div>
            </div>
            <div className="tab-content">
                {showThatTab()}
            </div>
        </div>
    );
}