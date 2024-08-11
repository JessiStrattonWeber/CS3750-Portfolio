import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const [name, setName] = useState('');
    const navigate = useNavigate();

    async function destroyPreviousSession() {
        try {
            const response = await fetch('http://localhost:5000/destroy', {
                method: 'POST',
                credentials: 'include', 
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to destroy previous session');
            }
            
        } catch (error) {
            console.error('Error destroying previous session:', error);
            alert('An error occurred while clearing previous session.');
            throw error;
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {

            //Destroy the old session if one exsists before starting a new game. 
            await destroyPreviousSession();

            const response = await fetch('http://localhost:5000/start-game', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: name }),
            });

            if (response.ok) {
                navigate('/play-game');
            } else {
                const errorData = await response.json();
                alert('There was an error: ' + errorData.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while starting your game.');
        }
    }

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="card p-4 align-items-center" style={{ width: '500px' }}>
        <h1 className="text-center">Start</h1>
        <img src={`/hangman-6.png`} alt={`Hangman gallows`}  className='main-image '/>
            <h1 className="text-center">Game</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <br />
                <div className="text-center">
                    <input type="submit" value="Start Game" className="btn btn-primary" />
                </div>
            </form>
        </div>
    </div>
    );
}
