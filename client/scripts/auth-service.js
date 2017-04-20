'use strict';

angular.module('nearbyAdminApp')
  .factory('authService', ['$http', function($http) {
    //var baseApi = photoUtils.baseApi();
    var currentUser = undefined;
    return {
      currentUser: currentUser,

      setCurrentUser: function(user) {
        currentUser = user;
      }
    };
  }]);
