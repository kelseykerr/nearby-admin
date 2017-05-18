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

      fetchRequests: function(queryParams) {
        return $http({
          method: 'GET',
          url: '/api/requests' + (queryParams !== undefined ? queryParams : '')
        });
      },

      fetchUserFlags: function(queryParams) {
        return $http({
          method: 'GET',
          url: '/api/users/flags' + (queryParams !== undefined ? queryParams : '')
        });
      },

      saveUserFlag: function(userFlag) {
        return $http({
          method: 'PUT',
          url: '/api/users/flags/' + userFlag._id,
          data: userFlag
        });
      },

      getUserFlag: function(id) {
        return $http({
          method: 'GET',
          url: '/api/users/flags/' + id
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
