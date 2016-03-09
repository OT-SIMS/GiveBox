// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
  'ionic',
  'ngCordova',
  'underscore',
  'LocalStorageModule',

  'starter.controllers.CreateOffer',
  'starter.controllers.Home',
  'starter.controllers.Login',
  'starter.controllers.Main',
  'starter.controllers.Menu',
  'starter.controllers.Offer',
  'starter.controllers.Profile',
  'starter.controllers.CreateProfile',
  'starter.controllers.CompleteProfile',
  'starter.services.Auth',

  'starter.services.AuthInterceptor'
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

/*
.service('loginService', ['$modal',
        function($modal) {
          this.LoggedIn = true;
          this.Login = function() {
            console.log('Login');
            var instance = $modal.open({
              template: 'Login screen <alert type="warning">some message</alert>',
            });
            return instance.result;
          }
        }
      ])
*/

.service('loginService', [ function($ionicModal) {
          this.LoggedIn = true;
          this.Login = function($ionicModal) {
            console.log('Login');
            $ionicModal.fromTemplateUrl('templates/login.html', {
                scope: $rootScope,
                animation: 'slide-in-up'
              }).then(function(modal) {
                $rootScope.modal = modal;
                $rootScope.modal.show();
              });
          }
        }
      ])

/*
.service('loginService', ['$ionicModal', '$rootScope',
        function($ionicModal, $rootScope) {
          console.log('Appel du service');
          this.LoggedIn = true;
          this.Login = function() {
            console.log('Login');
            $ionicModal.fromTemplateUrl('templates/login.html', {
                scope: $rootScope,
                animation: 'slide-in-up'
              }).then(function(modal) {
                $rootScope.modal = modal;
                $rootScope.modal.show();
              });

          }
        }
      ])
*/



.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
})

.constant('CONFIG', {
    //serverUrl: "http://localhost/givebox/"
    serverUrl: "http://yoda.rispal.info/givebox/",
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

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
