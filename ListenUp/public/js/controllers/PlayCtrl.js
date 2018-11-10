angular.module('PlayCtrl', []).controller('PlayController', function($scope, $auth) {

    $scope.tagline = 'This is where you will play the game';
    
    

    // shuffle function
    dummy_songs = ['a', 'b', 'c', 'd', 'e'];
    // return a random order
    $scope.shuffle = function () {
        console.log("shuffle is connected");
        //put function here
    }
    
    // word delete function
    $scope.song = "I just can't wait I don't want a lot for Christmas \n There is just one thing I need\n And I don't care about the presents Underneath the Christmas tree I don't need to hang my stocking There upon the fireplace Santa Claus won't make me happy With a toy on Christmas Day"
    
    $scope.lyrics = function (song) {
        console.log("lyrics is connected");
    }
    
    // compare function
    

});