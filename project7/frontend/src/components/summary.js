import { useEffect, useState } from 'react';
import { useNavigate } from "react-router";

export default function Summary({ id }) {
    const [record, setRecord] = useState({}); // Initialize as an empty object
    const navigate = useNavigate();

    useEffect(() => {
        async function getRecord() {
            try {
                const response = await fetch(`http://localhost:5000/summary`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id }) //Account id will be passed if it is an employee component 
                });

                if (!response.ok) {
                    navigate(`/`);
                    return;
                }

                // Get account info 
                const responseRecords = await response.json();
                setRecord(responseRecords);
            } catch (error) {
                console.error("Error fetching record:", error);
            }
        }
        getRecord();
    }, [id]);

    // Function to format phone number
    const formatPhoneNumber = (phone) => {
        if (!phone) return '';
        const cleaned = phone.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
        return phone;
    };

    return (
        <div className='card'>
            <h3>Account Summary</h3>
            <table style={{ marginTop: 20 }}>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Account Number</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{record.first_name}</td>
                        <td>{record.last_name}</td>
                        <td>{record.email}</td>
                        <td>{formatPhoneNumber(record.phone)}</td>
                        <td>{record.id}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
