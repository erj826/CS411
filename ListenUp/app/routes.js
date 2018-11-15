module.exports = function(app) {

	// server routes ===========================================================
	// handle things like api calls
	// authentication routes
    var request = require('request');
    var client_id = "9847de7e050444c6a47dc18881b7af45";
    var client_secret = "33ee9b8881be482d8a1c97f68c5f2088";
    let access_token;
    const querystring = require('querystring');
    
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
    
    app.get('/search', function (req, res) {
//        res.json({
//            message: "hello, world"
//        });
        if (!access_token) {
            res.json({
                error: "no-access-token"
            })
        } else {
            var search = {
                url: 'https://api.spotify.com/v1/search?' +  querystring.stringify(req.query),   
                headers: {
                    Authorization: 
                        'Bearer ' + access_token
                },
                json: true
            };
            request.get(search, function (error, response, body) {
                if (!error) {
                    res.json(response);
                }
            });
        }
    });
    
	// frontend routes =========================================================
	// route to handle all angular requests
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html');
	});
};