/* Graph Services */
angular.module('renzuServices', [])
  .factory("graphServices", function() {
    var formatElement = function(element, metric) {
      if (metric === "DAU") {
        return {
          x: new Date(element.Date),
          y: element.Value
        }
      } else if (metric === "D1 Retention") {
        return {
          x: new Date(element.Date),
          y: new Number(element.Value.slice(0, -1))
        }
      }
    };
    return {
      createDAUOptions: function(options) {
        var dauMax  = options.dauMax;
        var chart = {
          type: 'lineChart',
          height: 500,
          margin: {
            top: 20,
            right: 20,
            bottom: 60,
            left: 45,
          },
          clipEdge: true,
          staggerLabels: true,
          transitionDuration: 500,
          stacked: false,
          yDomain: [0, dauMax],
          useInteractiveGuideline: true,
          xAxis: {
            axisLabel: 'Date',
            tickFormat: function(d) {
              return d3.time.format('%m/%d/%y')(new Date(d))
            }
          },
          yAxis: {
            axisLabel: 'DAU',
            tickFormat: function(d) {
              return d3.format(',f')(d/1000) + "k";
            }
          }
        };
        return { chart: chart } 
      },
      createD1Options: function() {
        return {
          chart: {
            type: 'lineChart',
            height: 500,
            margin: {
              top: 20,
              right: 20,
              bottom: 40,
              left: 55
            },
            x: function(d) { return d.x; },
            y: function(d) { return d.y; },
            useInteractiveGuideline: true,
            transitionDuration: 500,
            xAxis: {
              axisLabel: 'Date',
              tickFormat: function(d) {
                return d3.time.format('%m/%d/%y')(new Date(d));
              }
            },
            yAxis: {
              axisLabel: 'D1 Retention',
              tickFormat: function(d) {
                return d3.format('.1%')(d/100);
              }
            },
            title: {
              enable: true,
              text: 'D1 Retention'
            }
          }
        }
      },
      graphTemplate: '<nvd3 options="options" data="data" config="{refreshDataOnly: true}"></nvd3>' ,
      filterAndFormatData: function(options) {
        var data     = options.data || [],
            metric   = options.metric || "DAU",
            apps     = options.apps || ["CandyBash"],
            platform = options.platform || "iOS",
            filteredData = [];
        for (var i=0; i < apps.length; i++) {
          var app = apps[i];
          var appData = data.filter(function(element) {
            return element.Metric   === metric &&
                   element.App      === app    &&
                   element.Platform === platform;
          }).map(function(element) {
            return formatElement(element, metric);
          });
          filteredData.push({
            values: appData,
            key: app + " " + platform
          });
        }
        return filteredData;
      },
      filterAndFormatDataByPlatforms: function(options) {
        var data         = options.data || [],
            metric       = options.metric || "DAU",
            apps         = options.apps || ["CandyBash"],
            platforms    = ["iOS", "Android"],
            filteredData = [];
        for (var i=0; i < platforms.length; i++) {
          var platform = platforms[i];
          var appData = data.filter(function(element) {
            return element.Metric   === metric   &&
                   element.Platform === platform &&
                   apps.indexOf(element.App) !== -1;
          })
          var formattedData = [];
          var datesList = [];
          var numElements = 0;
          appData.forEach(function(element) {
            var index = datesList.indexOf(element.Date);
            if (index > -1) {
              if (metric === "DAU") {
                var newValue = parseInt(element.Value) + parseInt(formattedData[index].y);
                formattedData[index].y = newValue.toString();
              } else {
                numElements ++;
                var newValue = parseFloat(element.Value.slice(0, -1))/numElements +
                               formattedData[index].y * (numElements - 1)/numElements;
                formattedData[index].y = newValue;
              }
            } else {
              datesList.push(element.Date);
              formattedData.push(formatElement(element, metric));
              numElements = 1;
            }
          });
          filteredData.push({
            values: formattedData,
            key: platform 
          });
        }
        return filteredData;
      },
      // TODO This shit aint working
      filterAndFormatDataByCategories: function(options) {
        var data         = options.data || [],
            metric       = options.metric || "DAU",
            apps         = options.apps || ["CandyBash"],
            platform     = options.platform || "iOS",
            categories   = ["Games", "Services"],
            filteredData = [];

        for (var i=0; i < categories.length; i++) {
          var category = categories[i];
          var appData = data.filter(function(element) {
            return element.Metric   === metric   &&
                   element.Platform === platform &&
                   element.Category === category &&
                   apps.indexOf(element.App) !== -1;
          });
          var formattedData = [];
          var datesList = [];
          var numElements = 0;
          appData.forEach(function(element) {
            var index = datesList.indexOf(element.Date);
            if (index > -1) {
              if (metric === "DAU") {
                var newValue = parseInt(element.Value) + parseInt(formattedData[index].y);
                formattedData[index].y = newValue.toString();
              } else {
                numElements += 1; 
                var newValue = parseFloat(element.Value.slice(0, -1))/numElements + 
                               formattedData[index].y * (numElements -1)/numElements;
                formattedData[index].y = newValue;
              }
            } else {
              datesList.push(element.Date);
              formattedData.push(formatElement(element, metric));
              numElements = 1;
            }
          });
          if (formattedData.length > 0) {
            filteredData.push({
              values: formattedData,
              key: category + " " + platform 
            });
          }
        }
        return filteredData;
      }
    }
  });
