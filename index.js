// imports express module locally so it can be used within file
const express = require('express');
// declares a variable that encapsulates Express's functionality to configure your web server, variable used to route your HTTP requests and responses
const app = express ();

let topMovies = [
    {
        title: 'The Lord of the Rings: The Fellowship of the Ring',
        year: '2001',
        genre: 'Fantasy Adventure'
    },
    {
        title: 'The Lord of the Rings: The Two Towers',
        year: '2002',
        genre: 'Fantasy Adventure'
    },
    {
        title: 'The Lord of the Rings: The Return of the King',
        year: '2003',
        genre: 'Fantasy Adventure'
    },
    {
        title: 'The Hobbit: An Unexpected Journey',
        year: '2012',
        genre: 'Fantasy Adventure'
    },
    {
        title: 'The Hobbit: The Desolation of Smaug',
        year: '2013',
        genre: 'Fantasy Adventure'
    },
    {
        title: 'The Hobbit: The Battle of the Five Armies',
        year: '2014',
        genre: 'Fantasy Adventure'
    },
    {
        title: 'Harry Potter and the Sorcerers Stone',
        year: '2001',
        genre: 'Fantasy Adventure'
    },
    {
        title: 'Harry Potter and the Chamber of Secrets',
        year: '2002',
        genre: 'Fantasy Adventure'
    },
    {
        title: 'Harry Potter and the Prisoner of Azkaban',
        year: '2004',
        genre: 'Fantasy Adventure'
    },
    {
        title: 'Harry Potter and the Goblet of Fire',
        year: '2005',
        genre: 'Fantasy Adventure'
    }
];

// GET requests of all movies
app.get('/', (req, res) => {
    res.send('Welcome to myFlix!');
});

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/movies', (req, res) => {
    res.json(topMovies);
});

app.use(express.static('public'));

// Morgan middleware library to console log the URL of every request that comes into server
let myLogger = (req, res, next) => {
    console.log(req.url);
    next();
};

app.use(myLogger);

app.get('/', (req, res) => {
    res.send('Welcome to my app!');
});

app.get('/secreturl', (req, res) => {
    res.send('This is a secret url with super top-secret content.');
});

// error-handler - middleware function that will log all application-level errors to the terminal
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// listener for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});