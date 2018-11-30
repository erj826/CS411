angular.module('MainCtrl', []).controller('MainController', function($scope, $auth, $http, $location) {

	$scope.tagline = 'Play the game here';
	$scope.token = $auth.getToken();
    
    $scope.authenticate = function() {
        $auth.authenticate('spotify')
            .then(function(response) {
                console.log("Login successful");
                $location.path('/play');
            })
            .catch(function(response) {
                console.log("Login failed");
                $location.path('/');
            });
    };


	///// DEMO

    $scope.demo = function() {
            $.ajax({
                url: 'https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF',
                headers: {
                  'Authorization': 'Bearer ' + $scope.token
                },
                success: function(response) {
                  for (var i=0; i<10; i++) {
                    document.getElementById("demo").innerHTML +=  "<br>" + (i+1) + ". " + response.tracks.items[i].track.name;
                  }
                }
            });
    }

	///// END DEMO
    
    $scope.demo2 = function (demosongtitle) {
//        console.log("demosongtitle", $scope.demosongtitle, demosongtitle);
        $http({
            method: 'GET',
            url: "/searchSpotify",
//            url: "https://api.spotify.com/v1/search",
            params: {
                q: demosongtitle, 
                type: "track"
            },
            headers: {
                'Authorization': 'Bearer ' + $scope.token
            }
        }).then(
            function (response) {
                console.log(response);
                $scope.items = response.data.body.tracks.items;
                console.log("Success!", $scope.items);
            },
            function (response) {
                console.log("Didn't work!", response.data.error.message);
            }
        );
    }   
});
















