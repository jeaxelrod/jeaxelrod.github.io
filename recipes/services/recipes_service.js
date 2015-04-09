"use strict";

var app = angular.module("recipeApp");

app.factory("RecipesService", ['$q', 'Restangular',
  function($q, Restangular) {
    Restangular.setJsonp(true);
    var ids = [109121, 109131, 109141, 108241, 108781, 108651];
    function getRecipe(id) {
      return Restangular.oneUrl('recipes', 'https://api.forage.co/v1/recipe/view?recipe_id=' + id).get();
    };

    return {
      getRecipe: getRecipe,
      getRecipes: function() {
        var data =     [],
            promises = [],
            deferred = $q.defer();
        for (var i=0; i<ids.length; i++) {
          var id = ids[i];
          var promises = getRecipe(id).then(function(response) {
            data.push(response);
          });
        }
        $q.all(promises).then(function() {
          deferred.resolve(data);
        }, function() {
          deferred.reject("Unable to get all recipes");
        });
        return deferred.promise;
      },
      getIds: function() {
        return ids
      }
    };
  }
]);
