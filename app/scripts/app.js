'use strict';

angular.module('wwwApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'jsonFormatter',
  'dnord.gmapLocationsMap'
])
  .config(['$routeProvider', '$locationProvider',
          function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
