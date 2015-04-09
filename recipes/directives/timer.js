var app = angular.module("recipeApp");

app.directive("timer", ['$interval', function($interval) {
  function link(scope, element, attrs) {
    var timeoutId, offset, baseTime = attrs.seconds;
    scope.seconds = attrs.seconds;
    scope.reset = reset;
    scope.start = start;
    scope.stop  = stop;
    scope.stopped = true;

    function reset() {
      offset = Date.now();
      baseTime = attrs.seconds
      scope.seconds = baseTime;
    };

    function start() {
      scope.stopped = false;
      offset = Date.now();
      console.log(baseTime);
      timeoutId = $interval(updateTime, baseTime);
    };

    function stop() {
      scope.stopped = true;
      baseTime = scope.seconds;
      $interval.cancel(timeoutId);
    };

    function updateTime() {
      if (scope.seconds > 0) {
        scope.seconds = baseTime - parseInt((Date.now() - offset)/1000);
        document.getElementById("timer").innerHTML = "";

      }
      document.getElementById("timer").innerHTML = "<p>Timer: " +scope.seconds + "</p>";
    };

    element.on('$destroy', function() {
      $interval.cancel(timeoutId);
    });
  }

  return {
    restrict: 'E',
    link: link,
    templateUrl: "partials/timer.html"
  };
}]);
