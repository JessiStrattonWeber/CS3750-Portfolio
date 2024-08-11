import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function TransactionForm() {
    //Set default values
    const [accountType, setAccountType] = useState('checking');
    const [transactionType, setTransactionType] = useState('deposit');
    const [amount, setAmount] = useState(0.00);

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
                    amount: parseFloat(amount) * 100
                })
            });

            const statusResponse = await response.json();
            console.log(statusResponse);

            if (response.status === 200) {
                alert('Transaction successful!');
                //Refresh the page to relect transation
                window.location.reload();
            } else {
                alert('Transaction failed: ' + statusResponse.message);
            }
        } catch (error) {
            console.error("Transaction error:", error);
            alert("An error occurred while processing the transaction.");
        }
    }

    return (
        <div>
            <h3>Make a Transaction</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Account Type: </label>
                    <select
                        value={accountType}
                        onChange={(e) => setAccountType(e.target.value)}
                    >
                        <option value="checking">Checking</option>
                        <option value="savings">Savings</option>
                    </select>
                </div>
                <div>
                    <label>Transaction Type: </label>
                    <select
                        value={transactionType}
                        onChange={(e) => setTransactionType(e.target.value)}
                    >
                        <option value="deposit">Deposit</option>
                        <option value="withdraw">Withdraw</option>
                    </select>
                </div>
                <div>
                    <label>Amount: </label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>
                <br />
                <div>
                    <input
                        type='submit'
                        value='Submit'
                    />
                </div>
            </form>
        </div>
    );
}