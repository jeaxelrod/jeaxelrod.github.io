"use strict";

var app = angular.module("recipeApp");

app.controller("RecipeStepsController", ['$scope', 'RecipesService', '$stateParams',
  function($scope, RecipesService, $stateParams) {
    $scope.id = $stateParams.id;
    $scope.interval = 0;
    RecipesService.getRecipe($scope.id).then(function(response) {
      $scope.recipe = response.data.recipe;
      var meta = $scope.recipe.meta;
      var steps = $scope.recipe.steps =  [];
      for (var i=0; i<meta.length; i++) {
        var item = meta[i];
        if (item.meta === "prep_step") {
          item.img = "http://placehold.it/1000x612";
          if (item.value.match(/\d+ minute/)) {
            item.seconds = [];
            var matches = item.value.match(/\d+ minute/g);
            for (var y=0; y<matches.length; y++) {
              var second = matches[y].match(/\d+/)[0] * 60;
              item.seconds.push(second);
            }
          }
          steps[item.sequence - 1] = item;
        }
      }
      var lastStep = { value: "You're all finished!",
                       img:   $scope.recipe.img };
      steps.push(lastStep);
    });
  }
]);

