angular.module('MainCtrl', []).controller('MainController', function($scope, $auth, $http) {

	$scope.tagline = 'Play the game here';
	$scope.token = $auth.getToken();
    

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
        console.log("demosongtitle", $scope.demosongtitle, demosongtitle);
        $http({
            method: 'GET',
            url: "https://api.spotify.com/v1/search",
            params: {
                q: demosongtitle, 
                type: "track"
            },
            headers: {
                'Authorization': 'Bearer ' + $scope.token
            }
        }).then(
            function (response) {
                $scope.items = response.data.tracks.items;
                console.log("Success!", $scope.items);
            },
            function (response) {
                console.log("Didn't work!", response.data.error.message);
            }
        );
    }   
});