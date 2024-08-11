const express = require('express');
const myCustomRoutes = require('./routes/user');

// Load express
const app = express();
const port = 3000;

// Routes in /routes/user
app.use('/user_routes', myCustomRoutes);

// Routes in this index.js 
app.get('/', (req, res) => {
    res.send(
    `<html>
        <head>
            <title>Favorite Foods App</title>
        </head>
        <body>
            <nav>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/userinput.html">Enter a Food</a></li>
                <li><a href="/user_routes/loadData">View Food Data</a></li>
                <li><a href="/user_routes/searchFood">Food Search</a></li>
            </ul>
            </nav>
            <h1>Favorite Food Application</h1>

            <h3>This Site Allows You To:</h3>
            <ul>
                <li>Enter foods into the database.</li>
                <li>Load the data that is currently in the database.</li>
                <li>Search the database for a certain food.</li>
            <ul>

            <br>
            <small>CS 3750 Software Engineering II  •  Jessi Smagghe</small>
        </body>
    </html>`);
});

app.use(express.static('public'));

app.listen(port, () => {
    console.log("Server started on port: " + port)
});