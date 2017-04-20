'use strict';

angular.module('nearbyAdminApp')
  .factory('adminService', ['$http', function($http) {
    //var baseApi = photoUtils.baseApi();
    return {
      fetchUsers: function(queryParams) {
        return $http({
          method: 'GET',
          url: '/api/users' + (queryParams !== undefined ? queryParams : '')
        });
      },

      signIn: function(email, password) {
        return $http({
          method: 'POST',
          url: '/auth/local',
          data: {
            email: email,
            password: password
          }
        });
      },

      getUser: function(id) {
        return $http({
          method: 'GET',
          url: '/api/admin/users/' + id
        });
      },
    };
  }]);
