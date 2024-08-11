import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ShowScores() {
    const [scores, setScores] = useState([]);
    const [length, setLength] = useState([]);
    const navigate = useNavigate();

    const playAgain = () => {
        navigate('/');
    };

    useEffect(() => {
        async function fetchScores() {
            const response = await fetch(`http://localhost:5000/get-scores`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setLength(data.length);
            setScores(data.highScores);
        }
        fetchScores();
    }, []);

    return (
        <div className="container mt-5">
            <div className="card text-center score-board">
            <h1 className="text-center" style={{ fontSize: '6rem',color :'midnightblue', backgroundColor: 'cornflowerblue', padding: '20px', borderRadius: '5px' }}>High Scores:</h1>
            <h1 className="text-center">Length {length}</h1>
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {scores.map((score, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{score.name}</td>
                            <td>{score.score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="btn btn-primary" onClick={playAgain}>
                Play Again
            </button>
            </div>
        </div>
    );
}