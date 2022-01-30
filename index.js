const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

// imports express module locally so it can be used within file
const express = require('express'),
// Morgan middleware function to console log the URL of every request that comes into server
    morgan = require('morgan');
// declares a variable that encapsulates Express's functionality to configure your web server, variable used to route your HTTP requests and responses
const app = express ();
app.use(morgan('common'));

// body-parser middleware module
const bodyParser = require('body-parser');
const { cloneDeep } = require('lodash');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

// imports auth.js
let auth = require('./auth')(app);
// requires Passport module and imports passport.js
const passport = require('passport');
require('./passport');

let movies = [
    {
        title: 'Pulp Fiction',
        director: 'Quentin Tarantino',
        genre: 'Comedy Drama'
    },
    {
        title: 'The Grand Budapest Hotel',
        director: 'Wes Anderson',
        genre: 'Comedy Drama'
    },
    {
        title: 'The Lord of the Rings: The Return of the King',
        director: 'Peter Jackson',
        genre: 'Fantasy Adventure'
    },
    {
        title: 'Inception',
        director: 'Christopher Nolan',
        genre: 'Sci-fi'
    },
    {
        title: 'Eternal Sunshine of the Spotless Mind',
        director: 'Michel Gondry',
        genre: 'Romantic Sci-fi'
    },
    {
        title: 'The Shining',
        director: 'Stanley Kubrick',
        genre: 'Horror'
    },
    {
        title: 'Toy Story',
        director: 'John Lasseter',
        genre: 'Comedy'
    },
    {
        title: 'Mean Girls',
        director: 'Mark Waters',
        genre: 'Comedy'
    },
    {
        title: 'Harry Potter and the Prisoner of Azkaban',
        director: 'Alfonso Cuaron',
        genre: 'Fantasy Adventure'
    },
    {
        title: 'Inglourious Basterds',
        director: 'Quentin Tarantino',
        genre: 'Comedy Drama'
    }
];

// get request
app.get('/', (req, res) => {
    res.send('Welcome to my myFlix!');
});

// get all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find()
    .then((movies) => {
        res.status(201).json(movies);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// get movie data by title
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ Title: req.params.title })
      .then((movie) => {
        res.json(movie);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// get genre data by name/title
app.get('/genres/:genre', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ 'Genre.Name': req.params.genre })
      .then((movie) => {
        res.json(movie.Genre);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// get director data by name
app.get('/directors/:directorName', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.directorName })
      .then((movie) => {
        res.json(movie.Director);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});


// add a user
/* expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOne({ Username: req.body.Username })
    .then((user) => {
        if (user) {
            return res.status(400).send(req.body.Username + 'already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: req.body.Password,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) =>{res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
           })
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});

// get all users
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.find()
    .then((users) => {
        res.status(201).json(users);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// get a user by username
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// update a user's info, by username
/* expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
        {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        }
    },
    { new: true }, // this line makes sure that the updated document is returned
    (err, updatedUser) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        }
    });
});

// add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
      $push: { FavoriteMovies: req.params.MovieID }
  },
  { new: true }, // this line makes sure that the updated document is returned
  (err, updatedUser) => {
      if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
      } else {
          res.json(updatedUser);
      }
   });
});

// delete a user by username
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
            res.status(400).send(req.params.Username + ' was not found');
        } else {
            res.status(200).send(req.params.Username + ' was deleted.');
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// delete movie from list of user's favorites
app.delete('/users/:Username/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $pull: {FavoriteMovies: req.params.title}
    },
    { new: true }, 
    ).then((updatedUser) => {
        // makes sure updated document is returned
        if (updatedUser === null) {
            res.status(404).send("No user found")
        } else {
            res.json(updatedUser);
        }}).catch((err) => {
            console.error(err);
            res.status(500).send('Error' + err);
        })
});

// serves documentation file from public folder
app.use(express.static('public'));

// error-handler - middleware function that will log all application-level errors to the terminal
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// listener for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});