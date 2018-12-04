angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'MainController'
		})
        
        // game
        .when('/play', {
            templateUrl: 'views/play.html',
            controller: 'PlayController'
        })
    

	$locationProvider.html5Mode(true);

}]);