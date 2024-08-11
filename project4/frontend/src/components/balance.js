import { useEffect, useState } from 'react';
import { useNavigate } from "react-router";

export default function Balance() {
    const [record, setRecord] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function getRecord() {
            try {
                const response = await fetch(`http://localhost:5000/balance`, {
                    method: 'GET',
                    credentials: 'include'
                });
                //If the user isn't logged in then send them back to the login page. 
                if (!response.ok) {
                    navigate(`/login`);
                    return;
                }
                const responseRecords = await response.json();
                setRecord(responseRecords);
            } catch (error) {
                console.error("Error fetching record:", error);
            }
        }
        getRecord();
    }, []);

    return (
        <div>
            <h3>Account Balances</h3>
            <table style={{ marginTop: 20 }}>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Checking</th>
                        <th>Savings</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{record.first_name}</td>
                        <td>{record.last_name}</td>
                        <td>${(record.checking / 100).toFixed(2)}</td>
                        <td>${(record.savings / 100).toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}