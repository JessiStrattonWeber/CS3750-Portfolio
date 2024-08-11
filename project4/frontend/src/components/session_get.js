import React, { useEffect, useState } from "react";
//Not in use. Just used for testing. 

export default function SessionGet() {

    const [status, setStatus] = useState('');

    useEffect(() => {
        async function run() {
            const response = await fetch(`http://localhost:5000/session_get`,
                {
                    method: 'GET',
                    credentials: 'include'
                }
            );
            if (!response.ok) {
                const message = `An error occured: ${response.statusText}`;
                window.alert(message);
                return;
            }
            const statusResponse = await response.json();
            setStatus(statusResponse.message);
        }
        run();
        return;
    }, []);

    return (
        <div>
            <h3>Get Session</h3>
            <p>{status}</p>
        </div>
    );
}