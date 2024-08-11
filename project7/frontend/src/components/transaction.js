import React, { useState } from "react";
import Balance from "./balance";

export default function TransactionForm({ id }) {
    const [accountType, setAccountType] = useState('checking'); //which account to use
    const [transactionType, setTransactionType] = useState('deposit'); //Which transaction type to use
    const [amount, setAmount] = useState(0.00); //Amount of money
    const [transactionOccured, setTransactionOccured] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();

        //Find the correct endpoint to hit based on if the user selected deposit or withdraw. 
        const endpoint = transactionType === 'deposit' ? 'deposit' : 'withdraw';

        try {
            const response = await fetch(`http://localhost:5000/${endpoint}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    account: accountType,
                    amount: parseFloat(amount) * 100,
                    id : id
                })
            });

            const statusResponse = await response.json();
            console.log(statusResponse);

            if (response.status === 200) {
                setErrorMessage('Transaction successful!');
                setTransactionOccured(prev => !prev);
            } else {
                setErrorMessage('Transaction failed: ' + statusResponse.message);
            }
        } catch (error) {
            console.error("Transaction error:", error);
            setErrorMessage("An error occurred while processing the transaction.");
        }
    }

    //Show transaction menu and Balance component below it. 
    return (
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <div className='card' style={{ flexBasis: '30%' }}>
                <h3>Make a Transaction</h3>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label className="form-label">Account Type: </label>
                        <select
                            value={accountType}
                            className="form-select"
                            onChange={(e) => setAccountType(e.target.value)}
                        >
                            <option value="checking">Checking</option>
                            <option value="savings">Savings</option>
                            <option value="investment">Investment</option>
                        </select>
                    </div>
                    <div>
                        <label className="form-label">Transaction Type: </label>
                        <select
                            value={transactionType}
                            className="form-select"
                            onChange={(e) => setTransactionType(e.target.value)}
                        >
                            <option value="deposit">Deposit</option>
                            <option value="withdraw">Withdraw</option>
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
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
            <div style={{ flexBasis: '70%' }}>
                <Balance transactionOccured={transactionOccured} id={id}/>
            </div>
        </div>
    );
};