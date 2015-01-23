'use strict';
  
// App module

var renzuApp = angular.module('renzuApp', [
  'ngRoute',
  'renzuControllers',
  'renzuServices',
  'renzuFilters',
  'nvd3'
]);

renzuApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/apps', {
        templateUrl: 'partials/app-index.html',
        controller: 'AppIndexCtrl'
      }).
      when('/apps/:appId', {
        templateUrl: 'partials/app-show.html',
        controller: 'AppShowCtrl'
      }).
      otherwise({
        redirectTo: '/apps'
      });
  }
]);
