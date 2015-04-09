'use strict';

// Declare app level module which depends on views, and components
var recipeApp = angular.module('recipeApp', [
  'ui.router', 
  'restangular', 
  'ui.bootstrap', 
  'ngTouch'
]);

recipeApp.config(['$stateProvider', '$urlRouterProvider', 
  function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('index', {
        url: '/',
        templateUrl: "partials/index.html",
        controller:  "IndexController"
      })
      .state('recipe', {
        url: '/recipe/:id',
        templateUrl: "partials/recipe.html",
        controller:  "RecipeController"
      })
      .state('recipe-steps', {
        url: '/recipe/:id/steps',
        templateUrl: "partials/steps.html",
        controller:  "RecipeStepsController"
      });
    $urlRouterProvider.otherwise('/');
  }
]);

recipeApp.config(function(RestangularProvider) {
  RestangularProvider.setDefaultRequestParams('jsonp', {callback: 'JSON_CALLBACK'});
});
