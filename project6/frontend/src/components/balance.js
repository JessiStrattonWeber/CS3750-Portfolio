import { useEffect, useState } from 'react';
import { useNavigate } from "react-router";

export default function Balance({ transactionOccured, id }) {
    const [record, setRecord] = useState([]); //Current account that is being displayed
    const navigate = useNavigate();

    useEffect(() => {
        async function getRecord() {
            try {
                const response = await fetch(`http://localhost:5000/balance`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id }) // Include the account ID if it is an employee request (Otherwise it will be null)
                });

                // If the user isn't logged in then send them back to the login page. 
                if (!response.ok) {
                    navigate(`/`);
                    return;
                }
                const responseRecords = await response.json();
                setRecord(responseRecords);
            } catch (error) {
                console.error("Error fetching record:", error);
            }
        }
        getRecord();
    }, [transactionOccured, id]);

    //Show account balances 
    return (
        <div className='card'> 
            <h3>Account Balances</h3>
            <table style={{ marginTop: 20 }}>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Checking</th>
                        <th>Savings</th>
                        <th>Investment</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{record.first_name}</td>
                        <td>{record.last_name}</td>
                        <td>${(record.checking / 100).toFixed(2)}</td>
                        <td>${(record.savings / 100).toFixed(2)}</td>
                        <td>${(record.investment / 100).toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}