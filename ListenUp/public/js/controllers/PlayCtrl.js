angular.module('PlayCtrl', []).controller('PlayController', function($scope, $auth, $http) {

    $scope.token = $auth.getToken();
    
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
        $scope.checkLines = {};
        // var lyricsObject = {};

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
            $scope.checkLines[index] = lyrics[index]
            lyrics[index] = "BLANKLINE"
        }

        lyrics.push("...");

        // for (i = 0; i < lyrics.length; i++) {
        //     lyricsObject[i] = lyrics[i];
        // }

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


    $scope.guess = ""
    $scope.check = function (guess) {
        console.log(guess);
    };




    $scope.listen = function () {
        $http({
            method: 'GET',
            url: "/searchSpotify",
            params: {
                q: $scope.track, 
                type: "track"
            },
            headers: {
                'Authorization': 'Bearer ' + $scope.token
            }
        }).then(
            function (response) {
                //console.log(response.data.body.tracks.items[0]);
                $scope.trackuri = response.data.body.tracks.items[0].uri.split(":")[2];
                console.log("Success!", "Song id is: " + $scope.trackuri);
            },
            function (response) {
                console.log("Didn't work!", response.data.error.message);
            }
        );
    }


    $scope.hint = function () {
    var x = document.getElementById("hintHidden");
    if (x.style.display === "none") {
        x.style.display = "block";
        $scope.listen();
    } else {
        x.style.display = "none";
    }
    }













    





});