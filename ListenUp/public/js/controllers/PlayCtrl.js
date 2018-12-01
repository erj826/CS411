angular.module('PlayCtrl', []).controller('PlayController', function($scope, $auth, $http) {

    $scope.tagline = 'This is where you will play the game';
    
    // shuffle function
    dummy_songs = ['a', 'b', 'c', 'd', 'e'];
    
    // word delete function
    $scope.track = "All I Want for Christmas is You"
    $scope.artist = "Mariah Carey"
    
    $scope.lyrics = function (track, artist, numBlanks) {
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
                cpright = response.data.body.message.body.lyrics.lyrics_copyright;
                
                if (cpright == "Unfortunately we're not authorized to show these lyrics.") {
                    $scope.wordsWithBlanks = ["Unable to show lyrics for this song."]
                } else {
                    console.log("Found lyrics successfully!");
                    $scope.wordsWithBlanks = showTextWithBlanks(response.data.body.message.body.lyrics.lyrics_body, numBlanks);
                }
            },
            function (response) {
                console.log("Didn't work!")
            }
        );
    }


    function showTextWithBlanks(lyrics, numBlanks) {
        //Replaces numBlanks words with underscores
        $scope.checkLine = {};

        //sanitize lyrics
        lyrics = lyrics.replace(/\n/g, "NEWLINE").split("NEWLINE");

        for (j=0; j<lyrics.length;j++) {
            if (lyrics[j] == "") {
                lyrics.splice(j, 1);
            }
        }

        lyrics = lyrics.slice(0,lyrics.length-3)

        $scope.removeWordsAt = getRandomNumbers(numBlanks, lyrics.length);

        for (i=0; i < $scope.removeWordsAt.length; i++){
            index = $scope.removeWordsAt[i];
            $scope.checkLine[index] = lyrics[index]
            //lyrics[index] = "_".repeat(lyrics[index].length + 1)
            lyrics[index] = "BLANKLINE"
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