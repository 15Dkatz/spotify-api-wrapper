# A wrapper around the Spotify API

This API supports a couple requests to abstract away the API-specific complexities of fetching data from the Spotify API API. Particularly, the Spotify API requires access tokens to hit their API - an unnecessary level of abstraction while building an App for learning purposes.

But this API conveniently takes care of all this!

This API was built specifically to support the development of the React project: MusicMaster 2.0

## Hit the API!
#### Get Artist Information:
[https://spotify-api-wrapper.appspot.com/artist/bruno](https://spotify-api-wrapper.appspot.com/artist/bruno)

* Subsititue `bruno` with any artist name!
* Note that the underlying request returns an array of "artists". This wrapper limits the results to 1. So a response will look like:

```
{
  "artists": {
    ...
    "items": [],
    ...
    "total": 1
  }
}
```

#### Get an Artist's Top Tracks
Use an artist id returned from the above request.

[https://spotify-api-wrapper.appspot.com/artist/0du5cEVh5yTK9QJze8zA0C/top-tracks](https://spotify-api-wrapper.appspot.com/artist/0du5cEVh5yTK9QJze8zA0C/top-tracks)

