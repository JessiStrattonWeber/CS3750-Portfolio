import React, { useEffect, useState } from "react";

export default function Logout() {

    const [status, setStatus] = useState('');

    useEffect(() => {
        async function run() {
            const response = await fetch(`http://localhost:5000/logout`,
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
            <h3>Logout</h3>
            <p>{status}</p>
        </div>
    );
}