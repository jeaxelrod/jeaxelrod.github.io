"use strict";

var app = angular.module("recipeApp");

app.controller("IndexController", ['$scope', 'RecipesService',
  function($scope, RecipesService) {
    RecipesService.getRecipes().then(function(response) {
      $scope.recipes = response; 
    });
  }
]);
