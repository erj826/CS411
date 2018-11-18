// modules =================================================
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var cors           = require('cors');
var querystring    = require('querystring');
var cookieParser   = require('cookie-parser');
var request = require('request');
var client_id = "9847de7e050444c6a47dc18881b7af45";
var client_secret = "33ee9b8881be482d8a1c97f68c5f2088";
let access_token;

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
        resp.json({ token: body.access_token });
    }
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
    var searchMusixmatch = {
        url: 'http://api.musixmatch.com/ws/1.1/matcher.lyrics.get?' + querystring.stringify(req.query),
        json: true
    };
    request.get(searchMusixmatch, function (error, response, body) {
        if (!error) {
            res.json(response);
        }
    });
});

// frontend routes         =========================================================
// route to handle all angular requests
app.get('*', function(req, res) {
    res.sendfile('./public/index.html');
});

// start app ===============================================
app.listen(port);	

console.log('Running on port ' + port); 			// shoutout to the user

exports = module.exports = app; 						// expose app