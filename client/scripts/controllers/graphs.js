'use strict';

angular.module('nearbyAdminApp')
  .controller('graphsCtrl', function($scope, adminService, $state, $q) {
    $scope.graphs = {

      loading: false,

      getUsersGraph: function(queryParams) {
        $scope.graphs.loading = true;
        adminService.fetchUsersGraph(queryParams)
          .then(function(response) {
            $scope.graphs.loading = false;
          }, function(error) {
            $scope.graphs.loading = false;
            //if unauthorized, go to login page
            if (error.status === 401) {
              $state.go('login');
            }
          })
      },

      init: function() {
        $scope.graphs.getUsersGraph("");
        /*$scope.data.selectedRadius = $scope.data.radiusOptions[0];
        if ($scope.graphs.showLeft && !$scope.graphs.showMap) {
          window.setTimeout(function() {
            $scope.graphs.getFilterMap().then(function(map) {
              $scope.graphs.map = map;
              $scope.graphs.mapLoaded = true;
              $scope.graphs.showMap = true;
            });
          }, 500);*/
      }
    }
    $scope.graphs.init();

  });
