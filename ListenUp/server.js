// modules =================================================
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var cors           = require('cors');
var querystring    = require('querystring');
var cookieParser   = require('cookie-parser');
var request = require('request');
let access_token;
let sensitive = require("./passwords.json");
var client_id = sensitive.client_id;
var client_secret = sensitive.client_secret;
var database_password = sensitive.database_password;

var mongoose = require('mongoose');
var mongooseIncrement = require('mongoose-increment');
var db = mongoose.connect('mongodb://tallulahkay:' + database_password + '@listenup-shard-00-00-cqpm8.mongodb.net:27017,listenup-shard-00-01-cqpm8.mongodb.net:27017,listenup-shard-00-02-cqpm8.mongodb.net:27017/test?ssl=true&replicaSet=ListenUp-shard-0&authSource=admin&retryWrites=true', function(err, response) {
    if (err){
        console.log(err);
    }
    else {
        console.log("we're connected to" + db, '+', response);
    }
});

var songSchema = new mongoose.Schema({
    track: String,
    artist: String,
    lyrics: JSON
})
    
var Song = mongoose.model('Song', songSchema);

// configuration ===========================================

var port = process.env.PORT || 8080; // set our port

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

// server routes ===========================================================
// handle things like api calls
// authentication routes

app.post('/auth/spotify', function(req, resp) {
  resp.header('Access-Control-Allow-Origin', '*');
  resp.header('Access-Control-Allow-Headers', 'X-Requested-With');

  // your application requests authorization
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
          Authorization:
            'Basic ' +
            new Buffer(client_id + ':' + client_secret).toString('base64')
        },
        form: {
            grant_type: 'client_credentials'
        },
        json: true
    };

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            access_token = body.access_token;
            resp.json({ token: access_token });
        };
    });
});

app.get('/searchSpotify', function (req, res) {
    if (!access_token) {
        res.json({
            error: "no-access-token"
        })
    } else {
        var searchSpotify = {
            url: 'https://api.spotify.com/v1/search?' +  querystring.stringify(req.query),   
            headers: {
                Authorization: 
                    'Bearer ' + access_token
            },
            json: true
        };
        request.get(searchSpotify, function (error, response, body) {
            if (!error) {
                res.json(response);
            }
        });
    }
});

app.get('/searchMusixmatch', function (req, res) {
    let track = req.query.q_track;
    let artist = req.query.q_artist;
    var searchMusixmatch = {
        url: 'http://api.musixmatch.com/ws/1.1/matcher.lyrics.get?' + querystring.stringify(req.query),
        json: true
    };
    Song.find({track: track}, function(err, songs) {
        if (songs[0] === undefined) {
            request.get(searchMusixmatch, function (error, response, body) {
                if (!error) {
                    res.send(body);
                    if (body.message.header.status_code == "404") {
                        console.log("Couldn't find the song.");
                    } else {
                        Song.create({
                            track: track,
                            artist: artist,
                            lyrics: body
                        }, function(err, track) {
                            if (err) return console.error(err);
                            console.log("saved!");
                        });
                    }
                }
            });
        } else {
            res.send(songs[0].lyrics);
        }
    });
});

app.get('/randomSong', function (req, res) {
    Song.count().exec(function (err, count) {
        var random = Math.floor(Math.random()*count)
        Song.findOne().skip(random).exec(function (err, result) {
            res.send(result);
        })
    }
)});

// frontend routes         =========================================================
// route to handle all angular requests
app.get('*', function(req, res) {
    res.sendfile('./public/index.html');
});

// start app ===============================================
app.listen(port);	

console.log('Running on port ' + port); 			// shoutout to the user

exports = module.exports = app; 						// expose app