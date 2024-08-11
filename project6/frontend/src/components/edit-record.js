import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditRecord() {
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        role: '',
    });
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`http://localhost:5000/record/${id}`);
                if (!response.ok) {
                    throw new Error("Record not found");
                }
                const record = await response.json();
                setForm(record);
            } catch (error) {
                console.error("Error fetching record:", error);
            }
        }
        fetchData();
    }, [id]);

    async function onSubmit(e) {
        e.preventDefault();

        const updatedRecord = { ...form };

        try {
            await fetch(`http://localhost:5000/record/update/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedRecord),
            });

            navigate(`/employee-summary/${id}`);
        } catch (error) {
            console.error("Error updating record:", error);
        }
    }

    function updateForm(value) {
        setForm((prev) => ({ ...prev, ...value }));
    }

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-header text-center">
                    <h3>Edit Record</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={onSubmit}>
                        <div className="mb-3">
                            <label className="form-label">First Name:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={form.first_name}
                                onChange={(e) => updateForm({ first_name: e.target.value })}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Last Name:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={form.last_name}
                                onChange={(e) => updateForm({ last_name: e.target.value })}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email:</label>
                            <input
                                type="email"
                                className="form-control"
                                value={form.email}
                                onChange={(e) => updateForm({ email: e.target.value })}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Phone:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={form.phone}
                                onChange={(e) => updateForm({ phone: e.target.value })}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Role:</label>
                            <select
                                className="form-select"
                                value={form.role}
                                onChange={(e) => updateForm({ role: e.target.value })}
                            >
                                <option value="customer">Customer</option>
                                <option value="employee">Employee</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                            Update Record
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
