import React from "react";
import { useNavigate } from "react-router-dom";
import { useLocation} from 'react-router-dom';

export default function GameOver() {
    const navigate = useNavigate();
    const location = useLocation();
    const { word } = location.state || {};

    const handleHighScores = () => {
        navigate('/high-scores');
        
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="card text-center win-lose-card">
            <div className="card-body">
            <div className="mb-4">
                    <img src={`/hangman-6.png`} alt={`You died!`} className="img-fluid" />
                </div>
                <h2 className="card-title">Game Over!</h2>
                {word && <p>The word was: <strong>{word}</strong></p>}
                <button className="btn btn-primary" onClick={handleHighScores}>
                    View Highscores
                </button>
            </div>
        </div>
    </div>
);
}
