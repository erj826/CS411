angular.module('PlayCtrl', []).controller('PlayController', function($scope, $auth, $http) {

    $scope.tagline = 'This is where you will play the game';
    
    

    // shuffle function
    dummy_songs = ['a', 'b', 'c', 'd', 'e'];
    // return a random order
    $scope.shuffle = function () {
        console.log("shuffle is connected");
        //put function here
    }
    
    // word delete function
    $scope.track = "all I want for christmas is you"
    $scope.artist = "mariah carey"
    
    $scope.lyrics = function (track, artist) {
        console.log("lyrics is connected");
        $http({
            method: 'GET',
            url: "/searchMusixmatch",
            params: {
                q_track: track,
                q_artist: artist,
                apikey: '74267314149a0851260eb83eafbf8f18'
            }
        }).then(
            function (response) {
                console.log("Success!");
                console.log(response);
                $scope.x = response.data.body.message.body.lyrics.lyrics_body
            },
            function (response) {
                console.log("Didn't work!")
            }
        );
    }
    
    // compare function
    
});