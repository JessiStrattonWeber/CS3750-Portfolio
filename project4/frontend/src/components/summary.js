import { useEffect, useState } from 'react';
import { useNavigate } from "react-router";

export default function Summary() {
    const [record, setRecord] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function getRecord() {
            try {
                const response = await fetch(`http://localhost:5000/summary`, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (!response.ok) {
                    navigate(`/login`);
                    return;
                }
                const responseRecords = await response.json();
                setRecord(responseRecords);
            } catch (error) {
                console.error("Error fetching record:", error);
            }
        }
        getRecord();
    }, []);

    return (
        <div>
            <h3>Account Summary</h3>
            <table style={{ marginTop: 20 }}>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{record.first_name}</td>
                        <td>{record.last_name}</td>
                        <td>{record.email}</td>
                        <td>{record.phone}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}