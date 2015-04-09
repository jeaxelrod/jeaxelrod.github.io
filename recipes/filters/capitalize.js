"use strict";

var app = angular.module("recipeApp");

app.filter('capitalize', function() {
  return function(input) {
    var words = input.split(" ");
    for (var i=0, ii = words.length; i<ii; i++) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
    return words.join(" ");
  }
});
