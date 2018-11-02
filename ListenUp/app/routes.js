module.exports = function(app) {

	// server routes ===========================================================
	// handle things like api calls
	// authentication routes
    var request = require('request');

    app.post('/auth/spotify', function(req, resp) {
      resp.header('Access-Control-Allow-Origin', '*');
      resp.header('Access-Control-Allow-Headers', 'X-Requested-With');

      var client_id = "9847de7e050444c6a47dc18881b7af45";
      var client_secret = "33ee9b8881be482d8a1c97f68c5f2088";

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
          resp.json({ token: body.access_token });
        }
      });
    });

	// frontend routes =========================================================
	// route to handle all angular requests
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html');
	});

};