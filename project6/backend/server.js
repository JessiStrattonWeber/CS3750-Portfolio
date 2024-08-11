const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config({ path: './config.env' });

const port = process.env.PORT;

app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
    allowedHeaders: ['Content-type', 'Authorization'],
}));

app.use(session({
    secret: 'keyboard cat',
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({
        mongoUrl: process.env.ATLAS_URI
    })
}));

const dbo = require('./db/conn');

app.use(express.json());

app.use(require("./routes/record"));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Export the app instance for testing
module.exports = app;

// Start the server only if the file is not being required for tests
if (require.main === module) {
    app.listen(port, () => {
        dbo.connectToServer(function (err) {
            if (err) {
                console.error(err);
            }
        });
        console.log(`Server is running on port ${port}`);
    });
}