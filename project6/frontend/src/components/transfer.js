import React, { useState } from "react";
import Balance from "./balance";

export default function TransactionForm({ id }) {
    const [accountFrom, setAccountFrom] = useState('checking'); // Account to transfer from
    const [externalAccountId, setExternalAccountId] = useState(''); // External account ID
    const [externalToAccount, setExternalToAccount] = useState('checking'); // Account to transfer to at the external bank
    const [amount, setAmount] = useState(0.00); // Amount to transfer
    const [transactionOccured, setTransactionOccured] = useState(false); // Used to make sure the balance component renders again after a transaction.

    async function handleSubmit(e) {
        e.preventDefault();

        // Error checking
        if (amount <= 0) {
            alert("Amount must be greater than 0");
            return;
        }

        if (!externalAccountId) {
            
            alert("External account ID is required");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/transfer`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    account_from: accountFrom,
                    amount: parseFloat(amount) * 100,
                    from_account_id: id, // Use actual source account ID
                    accountid_to: externalAccountId, // External account ID
                    account_to: externalToAccount, // The account type at the external bank
                })
            });

            const statusResponse = await response.json();
            console.log(statusResponse);

            if (response.status === 200) {
                alert('Transfer successful!');
                setTransactionOccured(prev => !prev);
            } else {
                alert('Transfer failed: ' + statusResponse.message);
            }
        } catch (error) {
            console.error("Transaction error:", error);
            alert("An error occurred while processing the transfer.");
        }
    }

    return (
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <div className='card' style={{ flexBasis: '30%' }}>
                <h3>Make an External Transfer</h3>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label className="form-label">From Account: </label>
                        <select
                            value={accountFrom}
                            className="form-select"
                            onChange={(e) => setAccountFrom(e.target.value)}
                        >
                            <option value="checking">Checking</option>
                            <option value="savings">Savings</option>
                            <option value="investment">Investment</option>
                        </select>
                    </div>
                    <div>
                        <label className="form-label">External Account ID: </label>
                        <input
                            type="text"
                            className="form-control"
                            value={externalAccountId}
                            onChange={(e) => setExternalAccountId(e.target.value)}
                            placeholder="Enter external account ID"
                        />
                    </div>
                    <div>
                        <label className="form-label">To Account: </label>
                        <select
                            value={externalToAccount}
                            className="form-select"
                            onChange={(e) => setExternalToAccount(e.target.value)}
                        >
                            <option value="checking">Checking</option>
                            <option value="savings">Savings</option>
                            <option value="investment">Investment</option>
                        </select>
                    </div>
                    <div>
                        <label className="form-label">Amount: </label>
                        <input
                            type="number"
                            className="form-control"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                    <br />
                    <div>
                        <input
                            className="btn-submit"
                            type='submit'
                            value='Submit'
                        />
                    </div>
                </form>
            </div>
            <div style={{ flexBasis: '70%' }}>
                <Balance transactionOccured={transactionOccured} id={id} />
            </div>
        </div>
    );
}
