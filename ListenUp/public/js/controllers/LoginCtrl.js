angular.module('LoginCtrl', []).controller('LoginController', function($scope, $auth, $location) {

	$scope.authenticate = function() {
        $auth.authenticate('spotify')
            .then(function(response) {
            	console.log("Login successful");
                $location.path('/play');
            })
            .catch(function(response) {
            	console.log("Login failed");
            	$location.path('/login');
            });
    };
});