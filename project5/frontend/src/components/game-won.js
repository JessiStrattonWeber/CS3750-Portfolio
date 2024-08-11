import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GameWon() {
    const navigate = useNavigate();

    useEffect(() => {
        const storeScore = async () => {
            try {
                const response = await fetch('http://localhost:5000/store-game', {
                    method: 'PUT',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                console.log('Score stored successfully:', data.message);
            } catch (error) {
                console.error('Error storing score:', error);
            }
        };

        storeScore();
    }, []); 

    const handleHighScores = () => {
        navigate('/high-scores');
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="card text-center win-lose-card">
            <div className="card-body">
                <h2 className="card-title">You Won!</h2>
                <button className="btn btn-primary" onClick={handleHighScores}>
                    View Highscores
                </button>
            </div>
        </div>
    </div>
);
}