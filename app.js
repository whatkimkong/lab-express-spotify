require('dotenv').config();


const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));



// Our routes go here:

app.get('/', (req,res) => {
    res.render('home');
});

// Iteration 3 - create a homepage 

app.get('/artist-search', (req,res) => {
    console.log(req.query);
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
        console.log('The received data from the API: ', data.body);
        console.log('Artist Structure', data.body.artists.items[0])
        res.render('artist-search-result', {artists: data.body.artists.items})
  })
  .catch(err => console.log('An error while searching artists occurred: ', err));
    res.render('home');
});


app.get('/albums/:artist_id', (req, res) => {
    spotifyApi
        .getArtistAlbums(req.params.artist_id)
        .then((data) => {
            console.log('The received data from the API: ', data.body);
            res.render('albums', {artists: data.body.items})
        })
        .catch(err => console.log('An error while searching artists occurred: ', err));
        res.render('home');
});

app.get('/tracks/:album_id', (req, res) => {
    spotifyApi
        .getArtistAlbums(req.params.album_id)
        .then((data) => {
            // console.log('The received data from the API: ', data.body);
            res.render('tracks', {tracks: data.body.items})
        })
        .catch(err => console.log('An error while searching artists occurred: ', err));
        res.render('home');
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));