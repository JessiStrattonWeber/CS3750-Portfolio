import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
//This is Wendel just learning how to push, pull, and merge! :)
//Anotha comment
//Howdy guys! This is Sam, I am also practicing how to do a push/pull/merge.
//Table cell for each letter in the secret word 
const WordLetter = (props) => (
    <td>{props.letter}</td>
);

//Button for each letter guess 
const LetterButton = (props) => (
    <button class='letter-button' onClick={() => props.submitGuess(props.letter)} disabled={props.guessedAlready}>
        {props.letter}
    </button>
);


export default function PlayGame() {
    // Key data and their setter functions
    const [partialWord, setPartialWord] = useState([]);
    const [guessedLetters, setGuessedLetters] = useState([]);
    const [incorrectGuesses, setIncorrectGuesses] = useState(0);
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        async function getGameDetails() {
            //Backend route that returns the key data stored in the session
            const response = await fetch('http://localhost:5000/game-status', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            //Save all the data 
            const data = await response.json();
            setPartialWord(data.partialWord);
            setGuessedLetters(data.guessedLetters);
            setIncorrectGuesses(data.incorrectGuesses);
            setMessage(data.message);
        }
        getGameDetails();
    }, []);

    async function guessALetter(letter) {
        //Backend route for submitting a letter guess 
        const response = await fetch('http://localhost:5000/guess', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ letter }),
        });
        //Get data again
        //We have to get it in both function incase the user refreshes the page. 
        const data = await response.json();
        setPartialWord(data.partialWord);
        setGuessedLetters(data.guessedLetters);
        setIncorrectGuesses(data.incorrectGuesses);
        setMessage(data.message);

        // Redirect when game is won. 
        if (data.youWon) {
            navigate('/game-won');
        }

        // Redirect if the game is over
        if (data.gameOver) {
            navigate('/game-over', { state: { word: data.word } });
        }
    }

    function displayWord() {
        return partialWord.map((letter, index) => (
            <WordLetter key={index} letter={letter} />
        ));
    }

    //For each letter in the alphabet string, make a button
    function displayButtons() {
        const rows = [
            'qwertyuiop'.split(''),
            'asdfghjkl'.split(''),
            'zxcvbnm'.split(''),
        ];
        return rows.map((row, rowIndex) => (
            <div className="d-flex justify-content-center mb-2" key={rowIndex}>
                {row.map((letter) => (
                    <LetterButton
                        key={letter}
                        letter={letter}
                        submitGuess={guessALetter}
                        guessedAlready={guessedLetters.includes(letter)}
                    />
                ))}
            </div>
        ));
    }
    const hangmanImage = `/hangman-${incorrectGuesses}.png`;
    return (
        <div className="container text-center mt-5 d-flex flex-column align-items-center">
            <div className="p-4">
                <h1 className="mb-4">Hangman Game</h1>
                <div className="mb-4">
                    <img src={hangmanImage} alt={`Hangman stage ${incorrectGuesses}`} className="img-fluid" />
                </div>
            </div>
            <div className="mb-4 secret-word">
                <table className="mx-auto">
                    <tbody>
                        <tr>{displayWord()}</tr>
                    </tbody>
                </table>
            </div>
            <div className="mb-4 card " style={{ width: '600px', padding: '20px'}}>
                <h2>Letter Selection:</h2>
                <div className="d-flex flex-column align-items-center">
                    {displayButtons()}
                </div>
            </div>
            <div className="mb-4">
                <p>Number of Incorrect guesses: {incorrectGuesses} / 6</p>
            </div>

        </div>
    );
}