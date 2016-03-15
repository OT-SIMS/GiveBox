// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
  'ionic',
  'ngCordova',
  'LocalStorageModule',
  'uiGmapgoogle-maps',
  'angular.filter',

  'starter.controllers.CreateOffer',
  'starter.controllers.Home',
  'starter.controllers.Login',
  'starter.controllers.Main',
  'starter.controllers.Menu',
  'starter.controllers.Offer',
  'starter.controllers.Profile',
  'starter.controllers.CreateProfile',
  'starter.controllers.CompleteProfile',
  'starter.controllers.UpdateProfile',

  'starter.services.Auth',
  'starter.services.AuthInterceptor',
  'starter.services.Video',
  'starter.services.Login'
])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function(){
    console.log(navigator.device.capture);
  });

  $ionicPlatform.ready(function() {
    $cordovaGeolocation.getCurrentPosition().then(success, error);
  });
})


.run(['authService', function (authService) {
    authService.fillAuthData();
}])

.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
})

.constant('CONFIG', {
    serverUrl: "http://192.168.0.5/givebox/",//"http://yoda.rispal.info/givebox/", 
    googleapis: "https://maps.googleapis.com/maps/api/"
})

.config(function($stateProvider, $urlRouterProvider, $compileProvider) {
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob|content):|data:image\//);

  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'MenuCtrl',
  })

  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
      }
    }
  })

  .state('app.createOffer', {
    url: '/createOffer',
    views: {
      'menuContent': {
        templateUrl: 'templates/createOffer.html',
		    controller: 'CreateOfferCtrl'
      }
    }
  })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
