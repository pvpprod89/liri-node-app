require("dotenv").config();

var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
// var Spotify = require("spotify");
var request = require("request");
var keys = require("./keys.js");
var fs = require("fs");

// user argument - which will be my-tweets, spotify-this-song etc
var action = process.argv[2];

// now we also need third argument which can be optional in this case as my-tweets doent require, but other inputs do.
var argument = "";

// controlling action and argument
selectArgument(action, argument);

function selectArgument(action, argument) {
  argument = getLastArgument();

  switch (action) {
    case "my-tweets":
      getMyTweets();
      break;

    case "spotify-this-song":
      // now this will have last argument
      var songTitle = argument;

      // If no song title provided, defaults to specific song.
      if (songTitle === "") {
        // lookupSpecificSong();
        lookupSpecificSong("abc");

        // Else looks up song based on song title.
      } else {
        // Get song information from Spotify.
        getSongInfo(songTitle);
      }
      break;

    // Gets movie information.
    case "movie-this":
      // now this will have last argument
      var movieTitle = argument;

      // If no movie title provided, defaults to specific movie.
      if (movieTitle === "") {
        getMovieInfo("Mr. Nobody");

        // Else looks up song based on movie title.
      } else {
        getMovieInfo(movieTitle);
      }
      break;

    // Gets text inside file, and uses it to do something.
    case "do-what-it-says":
      doWhatItSays();
      break;
  }
}

// ------------------------------------------------------------

function getLastArgument() {
  // Stores all possible arguments in array.
  argumentArray = process.argv;

  // Loops through words in node argument.
  for (var i = 3; i < argumentArray.length; i++) {
    argument += argumentArray[i];
  }
  return argument;
}
// ------------------------------------------------------------

// Function to show my latest 20 tweets.
function getMyTweets() {
  // Passing Twitter keys to call Twitter API.
  var client = new Twitter(keys.twitter);

  // Search parameters with my twitter username and count of last 20 tweets;
  // var params = { q: "@pvpwebdev", count: 20 };

  var params = {
    screen_name: "pvpwebdev",
    count: 20
  };
  // Shows up to last 20 tweets and when created in terminal.
  client.get("statuses/user_timeline", params, function(
    error,
    tweets,
    response
  ) {
    if (!error) {
      //   console.log(tweets);
      // }
      for (var i = 0; i < tweets.length; i++) {
        console.log(" Tweet: " + tweets[i].text);
        console.log(" Created_at: " + tweets[i].created_at);
      }
    }
  });
}

// ------------------------------------------------------------

// Function to Call Spotify API to get song information from song title.
// https://www.npmjs.com/package/spotify
function getSongInfo(songTitle) {
  // Calls Spotify API to retrieve a track.
  var spotify = new Spotify(keys.spotify);
  spotify.search({ type: "track", query: songTitle }, function(err, data) {
    if (err) {
      console.log.error("Error occurred: " + err);
      return;
    }

    var artistsArray = data.tracks.items[0].album.artists;

    // Array to hold artist names, when more than one artist exists for a song.
    var artistsNames = [];

    // Pushes artists for track to array.
    for (var i = 0; i < artistsArray.length; i++) {
      artistsNames.push(artistsArray[i].name);
    }

    // Converts artists array to string, and makes it pretty.
    var artists = artistsNames.join(", ");

    // Prints the Album name, Song name, Artist name, and Preview Url.
    console.log("Album: " + data.tracks.items[0].album.name);
    console.log("Song: " + data.tracks.items[0].name);
    console.log("Artist: " + artists);
    console.log("Spotify Preview URL: " + data.tracks.items[0].preview_url);
  });
}

// If user doesnt provide any song title then defaults to specific song.
function lookupSpecificSong() {
  // Calls Spotify API to retrieve a specific track.
  var spotify = new Spotify(keys.spotify);
  // spotify.lookup({ type: "track", id: process.env.SPOTIFY_ID }, function(
  spotify.search({ type: "track", query: "abc" }, function(err, data) {
    if (err) {
      console.log.error("Error occurred: " + err);
      return;
    }

    // Prints the Album name, Song name, Artist name, and Preview Url.
    console.log("Album: " + data.album.name);
    console.log("Song: " + data.name);
    console.log("Artist: " + data.artists[0].name);
    console.log("Spotify Preview URL: " + data.preview_url);
  });
}

// ------------------------------------------------------------

// Passing query URL to OMDB to get movie information from movie title.
// If user dont enter any movie title, then it defaults to the movie, Mr. Nobody.
function getMovieInfo(movieTitle) {
  var movieTitle = process.argv[3];
  if (movieTitle === undefined) {
    movieTitle = "Mr.+Nobody";
  } else {
    movieTitle = movieTitle.split(" ").join("+");
  }

  var queryUrl =
    "http://www.omdbapi.com/?t=" +
    movieTitle +
    "&y=&plot=short&apikey=" +
    process.env.OMDB_API_KEY;

  request(queryUrl, function(error, response, body) {
    // If the request is successful...
    if (!error && response.statusCode === 200) {
      // Parses the body of the site and gets movie information.
      var movie = JSON.parse(body);

      // Prints out movie information.
      console.log("Movie Title: " + movie.Title);
      console.log("Release Year: " + movie.Year);
      console.log("IMDB Rating: " + movie.imdbRating);
      console.log("Rotten Tomatoes Rating: " + movie.Ratings[2].Value);
      console.log("Country Produced In: " + movie.Country);
      console.log("Language: " + movie.Language);
      console.log("Plot: " + movie.Plot);
      console.log("Actors: " + movie.Actors);
    }
  });
}

// ------------------------------------------------------------

// Uses fs node package to take the text inside random.txt,
// and do something with it.
function doWhatItSays() {
  fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) {
      console.log.error("Error occurred: " + err);
    } else {
      // Creates array with data.
      var randomArray = data.split(",");

      // Sets action to first item in array.
      action = randomArray[0];

      // Sets optional third argument to second item in array.
      argument = randomArray[1];

      // Calls main controller to do something based on action and argument.
      selectArgument(action, argument);
    }
  });
}
