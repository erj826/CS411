angular.module('PlayCtrl', []).controller('PlayController', function($scope, $auth, $http) {

    $scope.tagline = 'This is where you will play the game';
    
    // shuffle function
    dummy_songs = ['a', 'b', 'c', 'd', 'e'];
    
    // word delete function
    $scope.track = "All I Want for Christmas is You"
    $scope.artist = "Mariah Carey"
    
    $scope.lyrics = function (track, artist) {
        //console.log("lyrics is connected");
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
                console.log("Found lyrics successfully!");
                //console.log(response);
                $scope.wordsWithBlanks = showTextWithBlanks(response.data.body.message.body.lyrics.lyrics_body);
            },
            function (response) {
                console.log("Didn't work!")
            }
        );
    }


    function showTextWithBlanks(lyrics) {
        //Replaces numBlanks words with underscores
        var numBlanks = 1;
        $scope.checkLine = {};

        //sanitize lyrics
        lyrics = lyrics.replace(/\n/g, "NEWLINE").split("NEWLINE");

        for (j=0; j<lyrics.length;j++) {
            if (lyrics[j] == "") {
                lyrics.splice(j, 1);
            }
        }

        lyrics = lyrics.slice(0,lyrics.length-3)

        var removeWordsAt = getRandomNumbers(numBlanks, lyrics.length);

        for (i=0; i < removeWordsAt.length; i++){
            index = removeWordsAt[i];
            $scope.checkLine[index] = lyrics[index]
            lyrics[index] = "_".repeat(lyrics[index].length + 1)
        }

        lyrics.push("...");
        return lyrics;
    }  

    function getRandomNumbers(n, l) {
        //Returns n unique random numbers within the range [0,l)
        var indexesToDelete = [];
        var num;
        
        if (n > l) {
            n = l;
        }

        for (i = 0; i < n; i++){
            do {
                num = Math.floor(Math.random() * l);
            } while (indexesToDelete.indexOf(num) >= 0 );
            
            indexesToDelete.push(num);
        }

        return indexesToDelete;
    }
    
});