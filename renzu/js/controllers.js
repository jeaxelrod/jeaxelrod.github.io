var renzuControllers = angular.module('renzuControllers', []);

renzuControllers.controller('AppIndexCtrl', ['$scope', '$http', '$compile', 'graphServices',
  function($scope, $http, $compile, graphServices) {
    $http.get('data/apps.json').success(function(data) {
      $scope.apps = data;
      for (var i=0; i < $scope.apps.length; i++) {
        var app = $scope.apps[i];
        if (app.name == "CandyBash" || app.name == "Words With Enemies") {
          app.active = true;
        } else {
          app = false;
        }
      }
    });

    $http.get('data/all-data.json').success(function(data) {
      $scope.allData = data;
      $scope.updateGraphs = updateGraphs;
      $scope.updateGraphs();

      var template = '<nvd3 class="graph" options="options" data="data" ></nvd3>'
      var container = document.getElementsByClassName("chart")[0];
      angular.element(container).append($compile(template)($scope));
    });
    
    //Graph Filters
    $scope.metric = "DAU";
    $scope.iOS = true;
    $scope.Android = false;
    $scope.platforms = false;
    $scope.categories = false;

    $scope.$watch("metric", function(newValue, oldValue) {
      if (newValue === oldValue) { return; }
      updateGraphs();
    });
    
    var updateGraphs = function() {
      var graphContainer = document.getElementsByClassName("graph")[0];
      var activeApps = [];
      var dauMax = 0;
      for (var i=0; i < $scope.apps.length; i++) {
        var app = $scope.apps[i];
        if (app.active) {
          activeApps.push(app.name);
          if ($scope.platforms || $scope.categories) {
            dauMax += app.dauMax;
          } else {
            if (app.dauMax > dauMax) {
              dauMax = app.dauMax;
            }
          }
        }
      }
      $scope.data = [];
      $scope.options = {};
      if ($scope.metric === "DAU") {
        $scope.options = graphServices.createDAUOptions({dauMax: dauMax});
      } else if ($scope.metric === "D1 Retention") {
        $scope.options = graphServices.createD1Options();

      }
      if ($scope.platforms) {
        $scope.options.title = {
          enable: true,
          text: $scope.metric + " of Platforms"
        };
        $scope.data = $scope.data.concat(graphServices.filterAndFormatDataByPlatforms({
          data:   $scope.allData,
          metric: $scope.metric,
          apps:   activeApps
        }));
      } else if ($scope.categories) {
        $scope.options.title = {
          enable: true,
          text: $scope.metric + " of Categories"
        }
        if ($scope.iOS) {
          $scope.data = $scope.data.concat(graphServices.filterAndFormatDataByCategories({
            data:   $scope.allData,
            metric: $scope.metric,
            apps:   activeApps,
            platform: "iOS",
          }));
        }
        if ($scope.Android) {
          $scope.data = $scope.data.concat(graphServices.filterAndFormatDataByCategories({
            data:   $scope.allData,
            metric: $scope.metric,
            apps:   activeApps,
            platform: "Android",
          }));
        }
      } else {
        $scope.options.title = {
          enable: true,
          text: $scope.metric + " of Apps"
        };
        if ($scope.iOS) {
          $scope.data = $scope.data.concat(graphServices.filterAndFormatData({
            data:     $scope.allData,
            metric:   $scope.metric,
            apps:     activeApps,
            platform: "iOS"
          }));
        }
        if ($scope.Android) {
          $scope.data = $scope.data.concat(graphServices.filterAndFormatData({
            data:     $scope.allData,
            metric:   $scope.metric,
            apps:     activeApps,
            platform: "Android"
          }));
        }
      }
    }
  }
]);

renzuControllers.controller('AppShowCtrl', ['$scope', '$http', '$routeParams', '$compile', 'graphServices',
  function($scope, $http, $routeParams, $compile, graphServices) {
    var allData, dauIOSData, d1IOSData, dauAndroidData, d1AndroidData;
    $http.get('data/apps.json').success(function(data) {
      $scope.apps = data;
      data.forEach(function(app) {
        if (app.id === $routeParams.appId) {
          $scope.app = app;
        }
      });
    });
    $http.get('data/all-data.json').success(function(data) {
      $scope.allData = data;
      allData = data;
      //TODO set options
      $scope.dauOptions = graphServices.createDAUOptions({
        dauMax:  $scope.app.dauMax,
      });

      $scope.dauOptions.title = {
        enable: true,
        text: "DAU"
      }

      $scope.d1Options = graphServices.createD1Options();
      $scope.d1Options.title = {
        enable: true,
        text: "D1 Retention"
      }
      
      //TODO automate filtering data better
      $scope.dauData = graphServices.filterAndFormatData({
        data:    allData,
        metric:  "DAU",
        apps:    [$scope.app.name],
        plaform: "iOS"
      });
      $scope.dauData = $scope.dauData.concat(graphServices.filterAndFormatData({
        data:     allData,
        metric:   "DAU",
        apps:     [$scope.app.name],
        platform: "Android"
      }));

      $scope.d1Data = graphServices.filterAndFormatData({
        data:     allData,
        metric:   "D1 Retention",
        apps:     [$scope.app.name],
        platform: "iOS"
      });
      $scope.d1Data = $scope.d1Data.concat(graphServices.filterAndFormatData({
        data:     allData,
        metric:   "D1 Retention",
        apps:     [$scope.app.name],
        platform: "Android"
      }));
      
      //Controller is probably going to be the one that adds the chart to the view
      var dauTemplate = '<nvd3 options="dauOptions" data="dauData" config="{refreshDataOnly: true}"></nvd3>'
      var d1Template = '<nvd3 options="d1Options" data="d1Data" config="{refreshDataOnly: true}"></nvd3>'
      var dauContainer = document.getElementsByClassName("dau-chart")[0];
      var d1Container = document.getElementsByClassName("d1-chart")[0];
      angular.element(dauContainer).append($compile(dauTemplate)($scope));
      angular.element(d1Container).append($compile(d1Template)($scope));
    }); 
  }
]);

renzuControllers.controller('NavbarCtrl', ['$scope', '$http', '$location',
  function($scope, $http, $location) {
    $http.get('data/apps.json').success(function(data) {
      $scope.apps = data;
    });
    $scope.isActive = function(app) {
      return app.id === $location.path().replace("/apps/", "");
    }
  }
]);
