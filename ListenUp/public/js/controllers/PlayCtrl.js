angular.module('PlayCtrl', []).controller('PlayController', function($scope, $auth, $http) {

    $scope.token = $auth.getToken();
    $scope.track = "All I Want for Christmas is You"
    $scope.artist = "Mariah Carey"
    $scope.trackid = ""
    $scope.guess = []
    
    $scope.lyrics = function (track, artist, numBlanks) {
        var x = document.getElementById("gameBox");
        x.style.backgroundColor = "#ECF4F9";
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
        $scope.gameOptionCheck();
        $scope.gameOptionHint();
        $scope.checkLines = {};

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

        return lyrics;
    }  

    function getRandomNumbers(n, l) {
        //Returns n unique random numbers within the range [0,l)
        var indexesToDelete = [];
        var num;
        
        if (n >= l) {
            n = l-1;
        }

        for (i = 0; i < n; i++){
            do {
                num = Math.floor(Math.random() * l);
            } while (indexesToDelete.indexOf(num) >= 0 );
            
            indexesToDelete.push(num);
        }

        return indexesToDelete;
    }

    $scope.validate = function (guess) {
        for (var key in $scope.checkLines){
            var cleanLowerLine = $scope.checkLines[key].toLowerCase().replace(/[^a-z0-9+]+/gi, '');
            var cleanLowerGuess = guess[key].toLowerCase().replace(/[^a-z0-9+]+/gi, '');
            if (levenshtein(cleanLowerGuess, cleanLowerLine) > 5) {
               return false;
            }
        }
        return true;
    };

    $scope.check = function (guess) {
        var score = $scope.validate(guess);
        var x = document.getElementById("gameBox");
        if (score == true) {
            x.style.backgroundColor = "#98f441";
        } else {
            x.style.backgroundColor = "#f45c42";
        }
        $scope.gameOptionCheck();
        $scope.gameOptionPlayAgain();
    }


    $scope.gameOptionPlayAgain = function () {
    var x = document.getElementById("gameOptionPlayAgain");
    if (x.style.display === "none") {
        x.style.display = "inline";
    }
    }

    $scope.listen = function () {
        var base_url = "https://open.spotify.com/embed/track/"

        $http({
            method: 'GET',
            url: "/searchSpotify",
            params: {
                q: $scope.track + " " + $scope.artist, 
                type: "track"
            },
            headers: {
                'Authorization': 'Bearer ' + $scope.token
            }
        }).then(
            function (response) {
                //console.log(response.data.body.tracks.items[0]);
                $scope.trackid = base_url + response.data.body.tracks.items[0].uri.split(":")[2];

                console.log("Success!", $scope.trackid);

                document.getElementById("playback").src = $scope.trackid;

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

    $scope.gameOptionCheck = function () {
    var x = document.getElementById("gameOptionCheck");
    if (x.style.display === "none") {
        x.style.display = "inline";
    } else {
        x.style.display = "none";
    }
    }

    $scope.gameOptionHint = function () {
    var x = document.getElementById("gameOptionHint");
    if (x.style.display === "none") {
        x.style.display = "inline";
    }
    }

    ///////////////////////////////////////////////////////////////////////
    //https://dzone.com/articles/javascript-implementation
    //based on: http://en.wikibooks.org/wiki/Algorithm_implementation/Strings/Levenshtein_distance
    //and:  http://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance
    function levenshtein( a, b )
    {
        var i;
        var j;
        var cost;
        var d = new Array();
        if ( a.length == 0 ) { return b.length;}
        if ( b.length == 0 ) { return a.length;}
        for ( i = 0; i <= a.length; i++ )
        {
            d[ i ] = new Array();
            d[ i ][ 0 ] = i;
        }
        for ( j = 0; j <= b.length; j++ ) {d[ 0 ][ j ] = j;}
        for ( i = 1; i <= a.length; i++ )
        {
            for ( j = 1; j <= b.length; j++ )
            {
                if ( a.charAt( i - 1 ) == b.charAt( j - 1 ) ) { cost = 0; }
                else { cost = 1; }
                d[ i ][ j ] = Math.min( d[ i - 1 ][ j ] + 1, d[ i ][ j - 1 ] + 1, d[ i - 1 ][ j - 1 ] + cost );      
                if(i > 1 && j > 1 &&  a.charAt(i - 1) == b.charAt(j-2) && a.charAt(i-2) == b.charAt(j-1)){
                    d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost)
                }
            }
        }  
        return d[ a.length ][ b.length ];
    }
    ///////////////////////////////////////////////////////////////////////

});