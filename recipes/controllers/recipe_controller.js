"use strict";

var app = angular.module("recipeApp");

app.controller("RecipeController", ['$scope', 'RecipesService', '$stateParams',
  function($scope, RecipesService, $stateParams) {
    $scope.id = $stateParams.id;
    RecipesService.getRecipe($scope.id).then(function(response) {
      $scope.recipe = response.data.recipe;
      var diets = $scope.recipe.diets = [];
      var meta = $scope.recipe.meta;
      for (var i=0; i<meta.length; i++) {
        var item = meta[i];
        console.log(item);
        if (item.meta === "diet") {
          var value = item.value.split("_").join("-");
          console.log(value);
          diets.push({value: value});
        }
      }
      console.log($scope.recipe.diets);
    });
  }
]);
