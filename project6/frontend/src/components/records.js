import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

// Function to format phone number
const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
};

// Single record component 
const Record = (props) => {
    const navigate = useNavigate();
    //TODO: Link to the correct employee summary page and just generic. 
    const handleRowClick = () => {
        navigate(`/employee-summary/${props.record.id}`);
    };

    return (
        <tr onClick={handleRowClick} className="record-list">
            <td>{props.record.first_name}</td>
            <td>{props.record.last_name}</td>
            <td>{props.record.id}</td>
            <td>{props.record.email}</td>
            <td>{formatPhoneNumber(props.record.phone)}</td>
            <td>{props.record.role}</td>
            <td>${(props.record.checking / 100).toFixed(2)}</td>
            <td>${(props.record.savings / 100).toFixed(2)}</td>
            <td>${(props.record.investment / 100).toFixed(2)}</td>
        </tr>
    );
};


export default function Records() {
    const [records, setRecords] = useState([]); // All records in the DB
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        async function getRecords() {
            try {
                const response = await fetch(`http://localhost:5000/record`);
                if (!response.ok) {
                    setErrorMessage(`An error has occurred: ${response.statusText}`);
                    return;
                }
                const responseRecords = await response.json();
                setRecords(responseRecords);
                setErrorMessage("");
            } catch (error) {
                console.error("Error fetching records:", error);
            }
        }
        getRecords();
    }, []);

    // For each record in the DB, return a single Record component 
    function recordList() {
        return records.map((record) => (
            <Record
                record={record}
                key={record.id}
            />
        ));
    }

    // Render all record components in a table 
    return (
        <div className='card'>
            <h3>All Accounts</h3>
            <table>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Account Number</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Checking</th>
                        <th>Savings</th>
                        <th>Investment</th>
                    </tr>
                </thead>
                <tbody>
                    {recordList()}
                </tbody>
            </table>
            <p>{errorMessage}</p>
        </div>
    );
}
