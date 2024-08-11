import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function TransactionHistory() {
    const [history, setHistory] = useState([]); //The history data from the DB
    const [error, setError] = useState(null); //Error handling 

    useEffect(() => {
        async function fetchHistory() {
            try {
                const response = await fetch('http://localhost:5000/full-history', {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();

                //Get full history from DB
                if (response.ok) {
                    setHistory(data);
                } else {
                    setError(data.message);
                }
            } catch (error) {
                setError('An error occurred while fetching transaction history.');
                console.error('Error fetching history:', error);
            }
        }

        fetchHistory();
    }, []);

    //If they did a cash transaciton there is no account # and so we can't link to it.
    const disableLinkForCash = (accountId) => {
        if (accountId === 0) {
            return 'Cash';
        }
        return <Link to={`/employee-summary/${accountId}`} className='link'>{accountId}</Link>;
    };

    //Error 
    if (error) {
        return <div>{error}</div>;
    }

    //Display it all to a table. 
    return (
        <div className='card'>
            <h3>Transaction History</h3>
            <table>
                <thead>
                    <tr>
                        <th>Transaction ID</th>
                        <th>From Account</th>
                        <th>To Account</th>
                        <th>From Account Type</th>
                        <th>To Account Type</th>
                        <th>Amount</th>
                        <th>Timestamp</th>
                        <th>Transaction Type</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map(record => (
                        <tr key={record._id}>
                            <td>{record._id}</td>
                            <td>{disableLinkForCash(record.from_account_id)}</td>
                            <td>{disableLinkForCash(record.to_account_id)}</td>
                            <td>{record.from_account_type}</td>
                            <td>{record.to_account_type}</td>
                            <td>${(record.amount / 100).toFixed(2)}</td>
                            <td>{record.date + ", " + record.time}</td>
                            <td>{record.transaction_type}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}