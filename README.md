# A wrapper around the Spotify API

This API supports a `/artist/:name/top-tracks` request to abstract away the API-specific complexities of fetching this data from the API. A request like this involves a few aspects:
* Grabbing a valid token to access the API
* Fetching the artist information (artist ID in particular)
* Using that id to fetch `artist/:id/top-tracks`

But this API conveniently takes care of all this!

This API was built specifically to support the development of the React project: MusicMaster 2.0

## Hit the API!
`curl https://spotify-api-wrapper.herokuapp.com/artist/bruno/top-tracks`

Or substitute `bruno` with whatever artist name you want!
