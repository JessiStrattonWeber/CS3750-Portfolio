const express = require("express");

const hangmanRoutes = express.Router();

const dbo = require("../db/conn");


// You get 6 incorect guesses before you lose...
//  ______
//  |    |
//  |    O   1
//  |   /|\  2,3,4
//  |   / \  5,6
// ------------
const YOUDIED = 6


/*********************************************************************
 *                              GET WORDS
**********************************************************************/
// Returns all the data in the words table as a json object for testing purposes 
hangmanRoutes.route("/words").get(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        const result = await db_connect.collection("words").find({}).toArray();
        res.json(result);
    } catch (err) {
        throw err;
    }
});

/*********************************************************************
 *                              GET SCORES 
**********************************************************************/
// Returns all the data in the scores table as a json object for testing purposes 
hangmanRoutes.route("/scores").get(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        const result = await db_connect.collection("scores").find({}).toArray();
        res.json(result);
    } catch (err) {
        throw err;
    }
});


/*********************************************************************
 *                            START THE GAME
**********************************************************************/
// Accepts the user's name and stores it to the session
// Initialized the core game variables and stores to session 
hangmanRoutes.route("/start-game").post(async (req, res) => {
    try {
        //Pass the name in the body of the request 
        let name = req.body.name;
        let db_connect = dbo.getDb();

        // Get a random record from database using the 'sample of 1' functionality 
        const wordRecord = await db_connect.collection("words").aggregate([{ $sample: { size: 1 } }]).toArray();
        //Get the word part of that record 
        const word = wordRecord[0].word;
        //Make an array of underscores that is the same length as the secret word. 
        const partialWord = new Array(word.length).fill('_');
        req.session.partialWord = partialWord;

        // Store needed  data in session
        req.session.name = name;            //User's name
        req.session.word = word;            //Word for the current game
        req.session.incorrectGuesses = 0;   //Number of times they have guessed incorrectly 
        req.session.correctGuesses = 0;     //Number of times they have guessed correctly 
        req.session.guessedLetters = [];    //List of letters that have already been guessed
        req.session.partialWord

        console.log(word)
        console.log('Session Data:', JSON.stringify(req.session, null, 2));

        res.status(200).json({
            message: `Hangman game for ${name} has begun.`,
            wordLength: word.length
        });
    } catch (err) {
        res.status(500).json({ message: 'Error starting game' });
    }
});

/*********************************************************************
 *                            GAME STATUS
**********************************************************************/
// Returns key values from the session so that the games state is preserved even on a refresh.
hangmanRoutes.route("/game-status").get(async (req, res) => {
    try {
        res.status(200).json({
            message: `Hangman game for ${req.session.name}.`,
            incorrectGuesses: req.session.incorrectGuesses,
            correctGuesses: req.session.correctGuesses,
            wordLength: req.session.word.length,
            guessedLetters: req.session.guessedLetters,
            partialWord: req.session.partialWord,
            name: req.session.name
        });
    } catch (err) {
        res.status(500).json({ message: 'Error starting game' });
    }
});


/*********************************************************************
 *                            GUESS A LETTER 
**********************************************************************/
// Takes in a letter from the user
// Throws an error if it has already been guessed
// Returns a list of letter and underscores to represent the word so far
// keeps track of correct guesses, incorect guesses, and when the game is lost or won. 
hangmanRoutes.route("/guess").post(async (req, res) => {
    try {
        //Get guessed letter that was passed in the body 
        const guessedLetter = req.body.letter;
        //Get info from the session data 
        const word = req.session.word;
        let guessedLetters = req.session.guessedLetters;

        ///////////////////////////
        //Letter already guessed 
        ////////////////////////// 
        if (guessedLetters.includes(guessedLetter)) {
            res.json({
                message: 'Letter already guessed',
                guessedLetters,
                incorrectGuesses: req.session.incorrectGuesses,
                partialWord
            });
        } else {
            //Add the letter they guessed to the list of guessed letters and update the session 
            guessedLetters.push(guessedLetter);
            req.session.guessedLetters = guessedLetters;

            // Fancy way of making a list with _ for unguessed letters.
            partialWord = word.split('').map(letter => guessedLetters.includes(letter) ? letter : '_')
            //.split: separates the word into an array of characters and .map is just a foreach loop.
            // For each (letter in the word)...
            //    if the list of previously guessed letters contains that letter...
            //          then that spot in the array = that letter, if not then it is an underscore
            req.session.partialWord = partialWord //Store to session

            ///////////////////////////
            //Guessed a correct letter 
            //////////////////////////
            if (word.includes(guessedLetter)) {

                // Got to count how manuy times the guessedLetter is in the word 
                //Split it into an array => filter out all the letters that aren't in the guessed letters list => Count what you have leftover :) 
                const occurrences = word.split('').filter(letter => letter === guessedLetter).length;
                //Update correct guesses 
                req.session.correctGuesses += occurrences;

                ////////////////////
                //Game has been won!
                ////////////////////
                if (req.session.correctGuesses === word.length) {
                    res.json({
                        message: 'You won!',
                        partialWord,
                        youWon: true,
                        word: word
                    });
                } else {
                    res.json({
                        correct: true,
                        partialWord,
                        guessedLetters,
                        incorrectGuesses: req.session.incorrectGuesses
                    });
                }
            } else {
                /////////////////////////////
                //Guessed an incorrect letter 
                /////////////////////////////

                req.session.incorrectGuesses += 1;

                /////////////////////
                //Game has been lost!
                /////////////////////

                if (req.session.incorrectGuesses >= YOUDIED) {
                    res.json({
                        message: `You died! The word was: ${word}.`,
                        partialWord,
                        gameOver: true,
                        word: word
                    });
                } else {
                    res.json({
                        correct: false,
                        partialWord,
                        guessedLetters,
                        incorrectGuesses: req.session.incorrectGuesses
                    });
                }
            }
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to guess letter' });
    }
});
/*********************************************************************
 *                            GET HIGH SCORES 
**********************************************************************/
//  
hangmanRoutes.route("/get-scores").get(async (req, res) => {
    const length = req.session.word.length
    try {
        let db_connect = dbo.getDb();
        const highScores = await db_connect.collection('scores')
            .find({ length: length })
            .sort({ score: 1 })
            .limit(10)
            .toArray();

        console.log("Retrieved high scores:", highScores);

        res.json({length: length, highScores: highScores});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


/*********************************************************************
 *                           SAVE GAME SCORE
**********************************************************************/
//  
hangmanRoutes.route("/store-game").put(async (req, res) => {

    const name = req.session.name
    const score = req.session.incorrectGuesses
    const length = req.session.word.length

    let db_connect = dbo.getDb();

    try {
        await db_connect.collection('scores').insertOne({
            name: name,
            score: score,
            length: length
        });
        res.status(200).json({ message: 'High score added!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/*********************************************************************
 *                            GAME OVER 
**********************************************************************/
//  Return the word to the user if they lose. 
hangmanRoutes.route("/lose-game").post(async (req, res) => {
    try {
        const word = req.session.word;

        res.status(200).json({
            message: 'You lost',
            word
        });
    } catch (err) {
        res.status(500).json({ message: 'An error has occured' });
    }
});


/*********************************************************************
 *                            DESTROY SESSION 
**********************************************************************/
//  For now it just destroys the session. 
hangmanRoutes.route("/destroy").post(async (req, res) => {
    try {
    
        if(req.session){
            req.session.destroy();
            console.log('The session has been destroyed')
        }
        res.status(200).json({
            message: 'Previous session destroyed'
        });
    } catch (err) {
        res.status(500).json({ message: 'An error has occured' });
    }
});

/*********************************************************************
 *                            Store Word 
**********************************************************************/

// Route to add a new word
hangmanRoutes.route("/add").post(async (req, res) => {
    const { word } = req.body;
    if (!word) {
        return res.status(400).json({ message: 'Word is required' });
    }

    try {
        let db_connect = dbo.getDb();
        await db_connect.collection('words').insertOne({ word });
        res.status(201).json({ message: 'Word added successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
module.exports = hangmanRoutes;