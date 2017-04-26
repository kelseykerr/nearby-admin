'use strict';

angular.module('nearbyAdminApp')
  .controller('dataCtrl', function($scope, adminService, $state, $q) {
    $scope.data = {
      users: [],

      showFilters: false,

      filtersText: 'show filters',

      defaultLatLng: {
        latitude: 38.917196,
        longitude: -77.0736607
      },

      latitude: 38.917196,

      longitude: -77.0736607,

      filters: {
        'createdStart': moment("01-01-2017 00:00").format('MM/DD/YYYY HH:MM'),
        'createdEnd': moment().format('MM/DD/YYYY HH:MM')
      },

      map: {},

      mapLoaded: false,

      showMap: false,

      showLeft: true,

      getUsers: function(queryParams) {
        adminService.fetchUsers(queryParams)
          .then(function(response) {
            $scope.data.users = response.data;
          }, function(error) {
            //if unauthorized, go to login page
            if (error.status === 401) {
              $state.go('login');
            }
          })
      },

      getFilterMap: function() {
        var deferred = $q.defer();
        var loc = $scope.data.defaultLatLng;
        var map = {
          center: {
            latitude: loc.latitude,
            longitude: loc.longitude
          },
          zoom: 12,
          options: {
            scrollwheel: false
          },
          marker: {
            id: 1,
            coords: {
              latitude: loc.latitude,
              longitude: loc.longitude
            }
          },
          events: {
            click: function(map, eventName, args) {
              $scope.$apply(function() {
                var lat = args[0].latLng.lat();
                var lng = args[0].latLng.lng();
                $scope.data.map.marker.coords.latitude = lat;
                $scope.data.map.marker.coords.longitude = lng;
                $scope.data.latitude = lat;
                $scope.data.longitude = lng;
              });
            }
          }
        };
        deferred.resolve(map);
        return deferred.promise;
      },

      toggleLeft: function() {
        $scope.data.showLeft = !$scope.data.showLeft;
        if (!$scope.data.showMap) {
          window.setTimeout(function() {
            $scope.data.getFilterMap().then(function(map) {
              $scope.data.map = map;
              console.log('here1*');
              $scope.data.mapLoaded = true;
              $scope.data.showMap = true;
              //$scope.$apply();
            });
          }, 500);
        }
        if ($scope.data.showFilters) {
          $scope.data.filtersText = 'hide filters';
        } else {
          $scope.data.filtersText = 'show filters';
        }
      },

      filterUsers: function() {
        var startDate = moment($scope.data.filters.createdStart).toDate();
        var endDate = moment($scope.data.filters.createdEnd).toDate();
        var queryParams = [];
        if (startDate !== undefined) {
          queryParams.push('createdStart=' + startDate);
        }
        if (endDate !== undefined) {
          queryParams.push('createdEnd=' + endDate);
        }
        var query = '';
        if (queryParams.length > 0) {
          query = '?' + queryParams.join('&');
        }
        $scope.data.getUsers(query);
      },

      expandUser: function(user) {
        if (user.expand === undefined) {
          user.expand = false;
        }
        user.expand = !user.expand;
      },

      init: function() {
        $scope.data.getUsers("");
      }

      //$scope.data.getFilterMap();

    };

    $scope.data.init();
  });
