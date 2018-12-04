# Listen Up!
By: Eric Jacobson,    Tallulah Kay,    Lauren Ball,    Dexin Zhou


## Description
Listen Up is a project for CS411 (Software Engineering) at Boston University. This MEAN stack web application makes use of the
Musixmatch API to obtain song lyrics, as well as the Spotify API for both oauth authentication and song playback.

## How to play:
Once logging in, a user will be redirected to the 'play' page. Here, a user will have the opportunity to enter a song title and 
artist, or choose a random song from our database. After selecting a song, a user will choose the level at which they would
like to play: easy, medium, or hard. The game works by omitting some number of lines from an excerpt of the songs lyrics. The 
user will guess the words by typing them into the appropriate boxes. A user will verify their guess with the 'Check!' button.


## Deploying the server and playing the game:

*Before running the code for the first time make sure to have installed:*
- *Bower*
- *Node.js*

Prior to the first time you are using the code run the following commands (for dependency resolution):
```
bower install
npm install
```

To start up the app server type:

```
node server.js
```

You may now access the app via your browser at **localhost:8080/**



***
