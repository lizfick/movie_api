// imports express module locally so it can be used within file
const express = require('express'),
// Morgan middleware function to console log the URL of every request that comes into server
    morgan = require('morgan');
// declares a variable that encapsulates Express's functionality to configure your web server, variable used to route your HTTP requests and responses
const app = express ();

app.use(morgan('common'));

let movies = [
    {
        title: 'The Lord of the Rings: The Fellowship of the Ring',
        director: 'Peter Jackson',
        genre: 'Fantasy Adventure'
    },
    {
        title: 'The Lord of the Rings: The Two Towers',
        director: 'Peter Jackson',
        genre: 'Fantasy Adventure'
    },
    {
        title: 'The Lord of the Rings: The Return of the King',
        director: 'Peter Jackson',
        genre: 'Fantasy Adventure'
    },
    {
        title: 'The Hobbit: An Unexpected Journey',
        director: 'Peter Jackson',
        genre: 'Fantasy Adventure'
    },
    {
        title: 'The Hobbit: The Desolation of Smaug',
        director: 'Peter Jackson',
        genre: 'Fantasy Adventure'
    },
    {
        title: 'The Hobbit: The Battle of the Five Armies',
        director: 'Peter Jackson',
        genre: 'Fantasy Adventure'
    },
    {
        title: 'Harry Potter and the Sorcerers Stone',
        director: 'Chris Columbus',
        genre: 'Fantasy Adventure'
    },
    {
        title: 'Harry Potter and the Chamber of Secrets',
        director: 'Chris Columbus',
        genre: 'Fantasy Adventure'
    },
    {
        title: 'Harry Potter and the Prisoner of Azkaban',
        director: 'Alfonso Cuaron',
        genre: 'Fantasy Adventure'
    },
    {
        title: 'Harry Potter and the Goblet of Fire',
        director: 'Mike Newell',
        genre: 'Fantasy Adventure'
    }
];

// GET requests of all movies
app.get('/movies', (req, res) => {
    res.json(movies);
});

app.get('/', (req, res) => {
    res.send('Welcome to my myFlix!');
});

// serves documentation file from public folder
app.use(express.static('public'));

app.get('/movies/:title', (req, res) => {
    res.json(movies.find((movie) => movie.title === req.params.title));
});

app.get('/genres/:genre', (req, res) => {
    res.json(movies.filter((movie) => movie.genre === req.params.genre));
});

app.get('/directors/:name', (req, res) => {
    res.json(movies.filter((movie) => movie.director === req.params.name));
});

app.post('/users', (req, res) => {
    res.send('Registration complete');
});

app.put('/users/:username', (req, res) => {
    res.send('Information updated');
});

app.post('/users/:username/movies/:movieID', (req, res) => {
    res.send('Movie added to favorites');
});

app.delete('/users/:username/movies/:movieID', (req, res) => {
    res.send('Movie removed from favorites');
});

app.delete('/users/:username', (req, res) => {
    res.send('Your account has been deleted');
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