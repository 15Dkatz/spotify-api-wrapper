const express = require('express');
const request = require('request');
const base64 = require('base-64');

let ID;
let SECRET;

try {
  const { id, secret } = require('./secrets/spotify-credentials');

  ID = id;
  SECRET = secret;
} catch (error) {
  ID = process.env.SPOTIFY_CLIENT_ID;
  SECRET = process.env.SPOTIFY_CLIENT_SECRET;
}

const AUTHORIZATION_HEADER = base64.encode(`${ID}:${SECRET}`);
const BASE_SPOTIFY_ADDRESS = 'https://api.spotify.com/v1';
const MINUTES = 1000 * 60;
const REFRESH_RATE = 59 * MINUTES; // refresh every 59 minutes, since the tokens last an hour (3600 seconds)

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

let globalAccessToken = '';

const requestNewToken = () => {
  request({
    url: 'https://accounts.spotify.com/api/token',
    method: 'POST',
    headers: { 'Authorization': `Basic ${AUTHORIZATION_HEADER}` },
    form: { grant_type: 'client_credentials' }
  }, (error, response, body) => {
    globalAccessToken = JSON.parse(body).access_token;
  });
};

requestNewToken();
setInterval(() => requestNewToken(), REFRESH_RATE);

app.get('/', (req, res) => {
  res.send('API up. Try `/artist/:name/top-tracks`');
});

app.get('/artist/:name', (req, res) => {
  const { name } = req.params;

  request({
    url: `${BASE_SPOTIFY_ADDRESS}/search?q=${name}&type=artist&limit=1`,
    headers: { Authorization: `Bearer ${globalAccessToken}` }
  }, (error, response, body) => {
    if (error) return next(error);

    res.json(JSON.parse(body));
  });
});

app.get('/artist/:id/top-tracks', (req, res) => {
  const { id } = req.params;

  request({
    url: `${BASE_SPOTIFY_ADDRESS}/artists/${id}/top-tracks?country=US`,
    headers: { Authorization: `Bearer ${globalAccessToken}` }
  }, (error, response, body) => {
    if (error) return next(error);

    res.json(JSON.parse(body));
  });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    type: 'error', message: err.message
  })
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`listening for requests on ${PORT}`));
