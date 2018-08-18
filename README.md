# liri-node-app

UTM-Homework-10-liri-node-app

LIRI is like iPhone's SIRI. However, while SIRI is a Speech Interpretation and Recognition Interface, LIRI is a Language Interpretation and Recognition Interface. Use LIRI to get your latest tweets, find out about a song, movie, or just choose some random action from the random file.

#NPM Installs

- Twitter
  npm install twitter

- Spotify
  npm install --save node-spotify-api

- Request
  npm install request

- FS
  npm install fs

- DotEnv
  npm install dotenv

#Get Started
You can use below commands to perform certain actions respectively

1. Get Tweets
   Retrieves my latest tweets (20Max).
   Example: node liri.js my-tweets

2. Get Song Info
   Retrieves song information for a particular track.
   Example: node liri.js spotify-this-song abc

3. Get Movie Info
   Retrieves movie information for a movie.
   Example: node liri.js movie-this deadpool

4. Get Random Info
   Gets random text inside a file and does what it says:
   Example: node liri.js do-what-it-says
