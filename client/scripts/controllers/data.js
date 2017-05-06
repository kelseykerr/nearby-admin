'use strict';

angular.module('nearbyAdminApp')
  .controller('dataCtrl', function($scope, adminService, $state, $q) {
    $scope.data = {
      users: [],

      requests: [],

      showFilters: false,

      filtersText: 'show filters',

      defaultLatLng: {
        latitude: 38.917196,
        longitude: -77.0736607
      },

      latitude: 38.917196,

      longitude: -77.0736607,

      searchObject: "users",

      searchObjects: ["users", "requests"],

      loading: false,

      requestStatus: ['ALL', 'OPEN', 'CLOSED', 'TRANSACTION_PENDING', 'PROCESSING_PAYMENT', 'FULFILLED'],

      selectedRequestStatus: 'ALL',

      radiusOptions: [{
        name: "none - don't limit results by location",
        radius: 0
      }, {
        name: "0.5 miles",
        radius: 0.5
      }, {
        name: "1 mile",
        radius: 1
      }, {
        name: "5 miles",
        radius: 5
      }, {
        name: "10 miles",
        radius: 10
      }, {
        name: "20 miles",
        radius: 20
      }],

      selectedRadius: {},

      filters: {
        'createdStart': moment("01-01-2017 00:00").format('MM/DD/YYYY HH:MM'),
        'createdEnd': moment().format('MM/DD/YYYY HH:MM')
      },

      map: {},

      mapLoaded: false,

      showMap: false,

      showLeft: true,

      showPagination: false,

      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        offset: 0
      },

      getUsers: function(queryParams) {
        $scope.data.loading = true;
        adminService.fetchUsers(queryParams)
          .then(function(response) {
            $scope.data.users = response.data;
            $scope.data.pagination.total = response.headers('X-Total-Count');
            if (!$scope.data.showPagination) {
              $scope.data.showPagination = true;
            }
            $scope.data.loading = false;
          }, function(error) {
            $scope.data.loading = false;
            //if unauthorized, go to login page
            if (error.status === 401) {
              $state.go('login');
            }
          })
      },

      getRequests: function(queryParams) {
        $scope.data.loading = true;
        adminService.fetchRequests(queryParams)
          .then(function(response) {
            $scope.data.requests = response.data;
            $scope.data.pagination.total = response.headers('X-Total-Count');
            if (!$scope.data.showPagination) {
              $scope.data.showPagination = true;
            }
            $scope.data.loading = false;
          }, function(error) {
            $scope.data.loading = false;
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

      filterObjects: function() {
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
        queryParams.push('limit=' + $scope.data.pagination.limit);
        queryParams.push('offset=' + $scope.data.pagination.offset);
        if (queryParams.length > 0) {
          query = '?' + queryParams.join('&');
        }
        if ($scope.data.selectedRadius.radius != 0 &&
          $scope.data.latitude != undefined && $scope.data.longitude != undefined) {
          var locationQuery = "&radius=" + $scope.data.selectedRadius.radius + "&longitude=" + $scope.data.longitude + "&latitude=" + $scope.data.latitude;
          query += locationQuery;
        }
        if ($scope.data.searchObject === 'users') {
          $scope.data.getUsers(query);
        } else if ($scope.data.searchObject === 'requests') {
          if ($scope.data.selectedRequestStatus !== undefined && $scope.data.selectedRequestStatus !== 'ALL') {
            var statusQuery = "&status=" + $scope.data.selectedRequestStatus;
            query += statusQuery;
          }
          $scope.data.getRequests(query);
        }
      },

      expandObject: function(obj) {
        if (obj.expand === undefined) {
          obj.expand = false;
        }
        obj.expand = !obj.expand;
      },

      pageChanged: function() {
        $scope.data.pagination.offset = ($scope.data.pagination.page - 1) * $scope.data.pagination.limit;
        $scope.data.filterObjects();
      },

      fetchObject: function() {
        $scope.data.loading = true;
        $scope.data.pagination.offset = 0;
        $scope.data.selectedRadius = $scope.data.radiusOptions[0];
        $scope.data.filters.createdStart = moment("01-01-2017 00:00").format('MM/DD/YYYY HH:MM');
        $scope.data.filters.createdEnd = moment().format('MM/DD/YYYY HH:MM');
        $scope.data.filterObjects();
      },

      init: function() {
        $scope.data.getUsers("?limit=" + $scope.data.pagination.limit + "&offset=" + $scope.data.pagination.offset);
        $scope.data.selectedRadius = $scope.data.radiusOptions[0];
        if ($scope.data.showLeft && !$scope.data.showMap) {
          window.setTimeout(function() {
            $scope.data.getFilterMap().then(function(map) {
              $scope.data.map = map;
              $scope.data.mapLoaded = true;
              $scope.data.showMap = true;
              //$scope.$apply();
            });
          }, 500);
        }
      }

      //$scope.data.getFilterMap();

    };

    $scope.data.init();
  });
