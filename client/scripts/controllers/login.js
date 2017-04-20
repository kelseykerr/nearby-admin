'use strict';

angular.module('nearbyAdminApp')
  .controller('loginCtrl', function($scope, adminService, $cookies, authService, $state) {
    $scope.login = {
      email: '',

      password: '',

      submitted: false,

      error: false,

      errorMessage: '',

      login: function() {
        $scope.login.submitted = true;
        $scope.login.error = false;
        adminService.signIn($scope.login.email, $scope.login.password)
          .then(function(response) {
            $cookies.put('token', response.data.token);
            adminService.getUser('me').then(function(response) {
              authService.setCurrentUser(response.data);
              $state.go('data');
            })
          }, function(error) {
            $scope.login.error = true;
            $scope.login.errorMessage = 'Unable to sign in with these credentials'
          })
      }

    }
  })
