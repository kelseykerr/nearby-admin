'use strict';

angular.module('nearbyAdminApp')
  .controller('dataCtrl', function($scope, adminService, $state, NgMap) {
    $scope.data = {
      users: [],

      showFilters: false,

      filtersText: 'show filters',

      filters: {
        'createdStart': moment("01-01-2017 00:00").format('MM/DD/YYYY HH:MM'),
        'createdEnd': moment().format('MM/DD/YYYY HH:MM')
      },

      filterMap: {},

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

      },

      toggleFilters: function() {
        $scope.data.showFilters = !$scope.data.showFilters;
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
        $scope.data.getFilterMap();
      }
    };

    $scope.data.init();
  });
