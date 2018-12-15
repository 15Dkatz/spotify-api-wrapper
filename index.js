const express = require('express');
const request = require('request');
const base64 = require('base-64');
const { id, secret } = require('./secrets/spotify-credentials');

const AUTHORIZATION_HEADER = base64.encode(`${id}:${secret}`);
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const BASE_SPOTIFY_URL = 'https://api.spotify.com/v1/search?';
const SECONDS = 1000;
// refresh every 59m, since the tokens last an hour (3600 seconds)
const REFRESH_RATE = 59 * SECONDS;

const app = express();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

let globalAccessToken = '';

const requestNewToken = () => {
  request({
    url: TOKEN_ENDPOINT,
    method: 'POST',
    headers: { 'Authorization': `Basic ${AUTHORIZATION_HEADER}` },
    form: { grant_type: 'client_credentials' }
  }, (error, response, body) => {
    const parsedBody = JSON.parse(body);
    console.log('token parsedBody', parsedBody);
    globalAccessToken = parsedBody.access_token;
  });
};

requestNewToken();
setInterval(() => requestNewToken(), REFRESH_RATE);

// example:
setTimeout(() => {
  const artist = 'bruno';
  const ARTIST_URL = `${BASE_SPOTIFY_URL}q=${artist}&type=artist&limit=1`;
  console.log('globalAccessToken', globalAccessToken, 'ARTIST_URL', ARTIST_URL);
  request({
    url: ARTIST_URL,
    headers: {
      Authorization: `Bearer ${globalAccessToken}`
    }
  }, (error, response, body) => {
    console.log('body', body);
  });
}, 3000);

// console.log('spotifyCredentials', spotifyCredentials);
// console.log('header', header);
// This is the authorization flow that I need to follow: https://developer.spotify.com/documentation/general/guides/authorization-guide/#client-credentials-flow

// Grab a token on the hour that anyone through these requests can use

// curl -X "POST" -H "Authorization: Basic ZjM4ZjAw...WY0MzE=" -d grant_type=client_credentials https://accounts.spotify.com/api/token

// const BASE_URL = 'https://api.spotify.com/v1/search?';
// let FETCH_URL = `${BASE_URL}q=${this.state.query}&type=artist&limit=1`;
// const ALBUM_URL = 'https://api.spotify.com/v1/artists/';

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`listening for requests on ${PORT}`));
