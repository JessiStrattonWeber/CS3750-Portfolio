import React, { useState } from 'react';

// Import smaller components that make up this page 
import Balance from "./balance.js";
import Transfer from "./transfer.js";
import Transaction from "./transaction.js";
import Summary from "./summary.js";
import History from './history.js';

export default function MyAccount() {
    const [whichTab, setWhichTab] = useState('summary'); // Which tab is currently selected 

    // Function to render the active tab content
    const showThatTab = () => {
        switch (whichTab) {
            case 'summary': return <Summary />;
            case 'balance': return <Balance />;
            case 'transaction': return <Transaction />;
            case 'transfer': return <Transfer />;
            case 'history': return <History />;
            default: return <Summary />; // Default is the summary tab 
        }
    };

    return (
        <div>
            <div className='top-bar'>
                <h3 className='heading'>My Account</h3>
                <div className="tabs">
                    <ul className="tab-list">
                        <li className={`tab ${whichTab === 'summary' ? 'active' : ''}`} onClick={() => setWhichTab('summary')}>Summary</li>
                        <li className={`tab ${whichTab === 'balance' ? 'active' : ''}`} onClick={() => setWhichTab('balance')}>Balance</li>
                        <li className={`tab ${whichTab === 'transaction' ? 'active' : ''}`} onClick={() => setWhichTab('transaction')}>Transaction</li>
                        <li className={`tab ${whichTab === 'transfer' ? 'active' : ''}`} onClick={() => setWhichTab('transfer')}>Transfer</li>
                        <li className={`tab ${whichTab === 'history' ? 'active' : ''}`} onClick={() => setWhichTab('history')}>History</li>
                    </ul>
                </div>
            </div>
            <div className="tab-content">
                {showThatTab()}
            </div>
        </div>
    );
}