.config(['$authProvider', function($authProvider) {
    $authProvider.spotify({
      clientId: "9847de7e050444c6a47dc18881b7af45",
      redirectUri: "http://localhost:8080/callback",
      url: "http://localhost:8080/login",
    });
    $authProvider.httpInterceptor = true;
}]);