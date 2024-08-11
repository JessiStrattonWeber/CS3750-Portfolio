import { useEffect } from 'react';
import { useNavigate, useParams } from "react-router";

import Balance from "./balance.js";
import Transfer from "./transfer.js";
import Transaction from "./transaction.js";
import Summary from "./summary.js";
import History from './history.js';

export default function EmployeeSummary() {
    const navigate = useNavigate();
    const { id } = useParams();
    return (
        <div>
            <button
                className="btn btn-primary"
                onClick={() => navigate('/employee-dash', { state: { tab: 'full-history' } })}
            >Go Back</button>
            <Summary id={id} />
            <Balance id={id}/>
            <History id={id}/>
            <Transaction id={id}/>
            <Transfer id={id}/>
            <button
                className="btn btn-primary"
                onClick={() => navigate('/employee-dash', { state: { tab: 'full-history' } })}
            >Go Back</button>
        </div>
    );
}
