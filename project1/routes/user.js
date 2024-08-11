const express = require('express');
const fs = require('node:fs');

const router = express.Router();

router.get('/', (req, res) => {
    const firstname = req.query.firstname;
    const lastname = req.query.lastname;
    const favfood = req.query.favfood;
    const content = firstname + ', ' + lastname + ', ' + favfood + '\n';

    fs.appendFile('food-data.txt', content, err => {
        if (err) {
            console.error(err);
        }
        else{
            console.log("Data stored: OK");
        }
    });

    res.send(
        `<html>
            <head>
                <title>Food Was Entered</title>
            </head>
            <body>
                <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/userinput.html">Enter a Food</a></li>
                        <li><a href="/user_routes/loadData">View Food Data</a></li>
                        <li><a href="/user_routes/searchFood">Food Search</a></li>
                </ul>
                <h3>${firstname} ${lastname} loves ${favfood}!</h3>
            </body>
        </html>`
    );
});

router.get('/loadData', (req, res) => {
    fs.readFile('food-data.txt', 'utf8', (err, data) => {
        if (err){
            console.error(err);
        }
        const lines = data.split('\n').filter(line => line.trim() !== '');

        const entrys = lines.map(line => {
            const [firstname, lastname, favfood] = line.split(', ');
            return `<tr><td>${firstname}</td><td>${lastname}</td><td>${favfood}</td></tr>`;
        }).join('');

        res.send(
            `<html>
                <head>
                    <title>Favorite Foods Data</title>
                </head>
                <body>
                    <ul>
                            <li><a href="/">Home</a></li>
                            <li><a href="/userinput.html">Enter a Food</a></li>
                            <li><a href="/user_routes/loadData">View Food Data</a></li>
                            <li><a href="/user_routes/searchFood">Food Search</a></li>
                    </ul>

                    <h1>Favorite Food Data Table</h1>

                    <table border="1">
                        <tr>
                            <th>First Name</th> 
                            <th>Last Name</th> 
                            <th>Favorite Food</th>
                        </tr>
                        ${entrys}  
                    </table>
                </body>
            </html>`
        );
    });
});

router.get('/searchFood', (req, res) =>{
    res.send(
        `<html>
            <head><title>Favorite Food Search</title></head>
            <body> 
                <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/userinput.html">Enter a Food</a></li>
                        <li><a href="/user_routes/loadData">View Food Data</a></li>
                        <li><a href="/user_routes/searchFood">Food Search</a></li>
                </ul>

                <h1>Favorite Food Database Search</h1>
                <p>Enter a food to search the favorite foods database.</p>

                <form action='/user_routes/foodShow' method='get'>
                    <label for="searchFood">Food: </label><br>
                    <input type="text" id="searchFood" name="searchFood"><br>
                    <input type='submit' value='Search' style='margin-top: 10px;'>
                </form>
            </body>
        </html>`
    );
});

router.get('/foodShow', (req, res) =>{
    
    const searchFood = req.query.searchFood;

    fs.readFile('food-data.txt', 'utf8', (err, data) => {
        if(err){
            console.error(err);
        }

        const lines = data.split('\n');

        const matches = lines.filter(line => {
            const [firstname, lastname, favfood] = line.split(', ');
            return favfood === searchFood;
        }).map(line => {
            const [firstname, lastname, favfood] = line.split(', ');
            return `<tr><td>${firstname}</td><td>${lastname}</td><td>${favfood}</td></tr>`;
        }).join('');

        res.send(
            `<html>
                <head><title>Food Search Results</title></head>
                <body> 
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/userinput.html">Enter a Food</a></li>
                        <li><a href="/user_routes/loadData">View Food Data</a></li>
                        <li><a href="/user_routes/searchFood">Food Search</a></li>
                    </ul>
                    <h1>Your Search of Food: ${searchFood}</h1>
                    <table border="1">
                        <tr>
                        <th>First Name</th> 
                        <th>Last Name</th> 
                        <th>Favorite Food</th>
                        </tr>
                        ${matches}
                    </table>
                </body>
            </html>`
        );
    });
});

module.exports = router;