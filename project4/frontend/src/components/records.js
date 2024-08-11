import React, { useEffect, useState } from "react";

const Record = (props) => (
    <tr>
        <td>{props.record.first_name}</td>
        <td>{props.record.last_name}</td>
        <td>{props.record.email}</td>
        <td>{props.record.phone}</td>
        <td>{props.record.role}</td>
        <td>{props.record.checking}</td>
        <td>{props.record.savings}</td>
    </tr>
)

export default function Records() {
    const [records, setRecords] = useState([]);

    useEffect(() => {
        async function getRecords() {
            const response = await fetch(`http://localhost:5000/record`);
            if (!response.ok) {
                const message = `An error has occured ${response.statusText}`
                window.alert(message);
                return;
            }
            const responseRecords = await response.json();
            setRecords(responseRecords)
        }
        getRecords();
        return;
    },
        [records.length]);

    function recordList() {
        return records.map((record) => {
            return (
                <Record
                    record={record}
                    key={record._id}
                />
            );
        });
    }
    return (
        <div>
            <h3>Record List</h3>
            <table style={{ marginTop: 20 }}>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Checking</th>
                        <th>Savings</th>
                    </tr>
                </thead>
                <tbody>
                    {recordList()}
                </tbody>
            </table>
        </div>
    );
}