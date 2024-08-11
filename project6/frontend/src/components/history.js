import React, { useState, useEffect } from 'react';

export default function History({ id }) {

    const [accountHistory, setAccountHistory] = useState([]);
    const [error, setError] = useState(' ');
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        async function fetchHistory() {
            try {
                const response = await fetch('http://localhost:5000/account-history', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id }) // Include the account ID if it is an employee request (Otherwise it will be null)
                });

                const data = await response.json();

                if (response.ok) {
                    setAccountHistory(data);
                    setIsError(false);
                } else {
                    setError(data.message);
                    setIsError(true);
                }
            } catch (error) {
                setError('An error occurred while fetching account history.');
                console.error('Error fetching history:', error);
            }
        }
        fetchHistory();
    }, [id]);

    return (
        <div className='card'>
            <h3>Account History</h3>
            {!isError && (
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
                    {accountHistory.map(data => (
                        <tr key={data._id}>
                            <td>{data._id}</td>
                            <td>{data.from_account_id === 0 ? 'Cash' : data.from_account_id}</td>
                            <td>{data.to_account_id === 0 ? 'Cash' : data.to_account_id}</td>
                            <td>{data.from_account_type}</td>
                            <td>{data.to_account_type}</td>
                            <td>${(data.amount / 100).toFixed(2)}</td>
                            <td>{data.date + ", " + data.time}</td>
                            <td>{data.transaction_type}</td>
                        </tr>
                    ))}
                </tbody>
            </table>)}
            {isError && (
                <p>{error}</p>
            )}
        </div>
    );
}