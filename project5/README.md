# Project 5: Hangman Game

## Goal:

Work as a group to write your first group project.

## Overall assignment:

Write a Hangman game with two parts: 1. game logic, and 2. high scores

# Game play from the user's perspective:

* The user arrives at a website. The game asks the user for a name. After entering a name, the game starts.

* A traditional hangman game is shown with slots indicating the number of letters. The user makes a choice. If the letter exists, all those letters are shown. If the letter doesn't exist, the hangman progresses and the word is added to a visible list of incorrect letters. if the letter was previously chosen, inform the user of this and let the user try again.

* Upon fully guessing the word, that name is then stored into a scores table. Then a top 10 high scores table is displayed for all successful games with words of similar length. The high scores shows the name, the number of guesses, and the word length.

* If the word was not succesfully guessed with all allowed moves, then inform the user of the correct word. Then allow the user to go to the top 10 high scores table as previously described.

* After the high scores table is displayed, the game then asks if the user wishes to play again.

## Game logic:

A session must be used to store the user's name at the end of a successful game. Do not ask for the username at the end of the game.

Words must be randomly chosen from a list of words. Store all potential words in an existing database table or a file of numerous dictionary words.  The word itself should never be sent to the client except at the end of the game (we don't want a smart user inspecting DOM and finding the solution early.) The scores table should store the person's name, number of guesses, and number of letters in the word.

## High scores:

Show the top 10 scores for the amount of letters in this word.  For example, if the word had 8 letters, then show the 8 letter high scores table.  Show how many guesses (either total or missed guesses), and report the best top 10 results. 

## Other details:

* The layout should be similar to past assignments with a React frontend, an Express backend, and a Mongo DB data store.

* The server should store at least 1000 words and must randomly choose from these.

* The site shouldn't be deployed.

* All code must be stored in a Git repository. Each person should commit, push, and pull, rather than copy and paste files.

* The game must successfully run on all developers machines.