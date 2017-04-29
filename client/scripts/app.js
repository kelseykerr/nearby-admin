'use strict';

angular
  .module('nearbyAdminApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'angularMoment',
    'moment-picker',
    'uiGmapgoogle-maps',
    'pageslide-directive',
    'ngAnimate',
    'ui.bootstrap'
  ])
  .config(function($stateProvider, $locationProvider) {
    $stateProvider
      .state('data', {
        url: '/',
        templateUrl: 'views/data.html',
        controller: 'dataCtrl'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'loginCtrl'
      });
    $locationProvider.html5Mode(true);
  })
  .run(function($rootScope, authService, $state) {
    $rootScope.$on('$stateChangeStart', function(event, next) {
      if (authService.currentUser === undefined && next.name !== 'login') {
        console.log('must authenticate!')
        $state.go('login');
      }
    });
  });
