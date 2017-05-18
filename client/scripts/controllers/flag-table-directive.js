'use strict';

angular.module('nearbyAdminApp')
  .directive('flagTable', function(adminService) {
    return {
      scope: {
        flags: '=',
        type: '@' //can be user, request, or response
      },

      link: function($scope) {

        $scope.flagsTable = {

          showTable: true,

          userFlagDetail: {},

          formatDate: function(dateString) {
            if (dateString === undefined || dateString === '') {
              return;
            }
            var date = new Date(dateString);
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0' + minutes : minutes;
            var strTime = hours + ':' + minutes + ' ' + ampm;
            return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
          },

          getUserDetail: function(userFlag) {
            $scope.flagsTable.showTable = false;
            adminService.getUserFlag(userFlag._id).then(function(response) {
              $scope.flagsTable.userFlagDetail = response.data;
            }, function(error) {
              cosole.log(error);
            })
          },

          getDetail: function(flag) {
            console.log($scope.type);
            if ($scope.type === 'user') {
              $scope.flagsTable.getUserDetail(flag);
            }

          }
        }

        $scope.$watchCollection('messages', function() {
          if (!$scope.messages) {
            return;
          }
        });

        $scope.type = function(type) {
          switch (type) {
            case 'danger':
            case 'error':
              return 'danger';
            case 'success':
              return 'success';
            case 'info':
              return 'info';
            case 'warning':
              return 'warning';
            case 'lock':
            case 'unlock':
              return 'warning';
            default:
              return '';
          }
        };

        $scope.remove = function(index) {
          $scope.messages.splice(index, 1);
        };
      },
      templateUrl: '../../views/flag-table.html'

    };
  })
