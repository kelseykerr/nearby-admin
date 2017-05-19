'use strict';

angular.module('nearbyAdminApp')
  .directive('flagTable', function(adminService) {
    return {
      scope: {
        flags: '=',
        type: '=', //can be user, request, or response
        filter: '&'
      },

      link: function($scope) {

        $scope.flagsTable = {

          statusOptions: ['PENDING', 'INAPPROPRIATE', 'DISMISSED'],

          showTable: true,

          userFlagDetail: {},

          requestFlagDetail: {},

          responseFlagDetail: {},

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

          getUserFlagDetail: function(userFlag) {
            $scope.flagsTable.showTable = false;
            adminService.getUserFlag(userFlag._id).then(function(response) {
              if (response.data.reviewerNotes === undefined) {
                response.data.reviewerNotes = "";
              }
              $scope.flagsTable.userFlagDetail = response.data;
            }, function(error) {
              console.log(error);
            })
          },

          getRequestFlagDetail: function(requestFlag) {
            $scope.flagsTable.showTable = false;
            adminService.getRequestFlag(requestFlag._id).then(function(response) {
              if (response.data.reviewerNotes === undefined) {
                response.data.reviewerNotes = "";
              }
              $scope.flagsTable.requestFlagDetail = response.data;
            }, function(error) {
              console.log(error);
            })
          },

          getResponseFlagDetail: function(responseFlag) {
            $scope.flagsTable.showTable = false;
            adminService.getResponseFlag(responseFlag._id).then(function(response) {
              if (response.data.reviewerNotes === undefined) {
                response.data.reviewerNotes = "";
              }
              $scope.flagsTable.responseFlagDetail = response.data;
            }, function(error) {
              console.log(error);
            })
          },

          getDetail: function(flag) {
            if ($scope.type === 'user') {
              $scope.flagsTable.getUserFlagDetail(flag);
            } else if ($scope.type === 'request') {
              $scope.flagsTable.getRequestFlagDetail(flag);
            } else if ($scope.type === 'response') {
              $scope.flagsTable.getResponseFlagDetail(flag);
            }
          },

          saveFlag: function() {
            if ($scope.type === 'user') {
              adminService.saveUserFlag($scope.flagsTable.userFlagDetail).then(function(response) {
                $scope.filter();
                $scope.flagsTable.showTable = true;
              }, function(error) {
                console.log(error);
              })
            } else if ($scope.type === 'request') {
              adminService.saveRequestFlag($scope.flagsTable.requestFlagDetail).then(function(response) {
                $scope.filter();
                $scope.flagsTable.showTable = true;
              }, function(error) {
                console.log(error);
              })
            } else if ($scope.type === 'response') {
              adminService.saveResponseFlag($scope.flagsTable.responseFlagDetail).then(function(response) {
                $scope.filter();
                $scope.flagsTable.showTable = true;
              }, function(error) {
                console.log(error);
              })
            }
          }
        }
      },
      templateUrl: '../../views/flag-table.html'

    };
  })
