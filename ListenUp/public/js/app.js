var app = angular.module('sampleApp', ['ngRoute', 'appRoutes', 'MainCtrl', 'ProfileCtrl', 'ProfileService', 'LoginCtrl', 'satellizer']);

app.config(['$authProvider', function($authProvider) {
    $authProvider.spotify({
      clientId: "9847de7e050444c6a47dc18881b7af45",
      redirectUri: "http://localhost:8080/callback",
      url: "http://localhost:8080/auth/spotify",
    });
    $authProvider.httpInterceptor = true;
}]);