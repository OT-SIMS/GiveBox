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


.service('loginService', function($ionicModal, $rootScope) {
  var init = function(tpl, $scope) {
	  console.log("init");

    var promise;
    $scope = $rootScope.$new();
	
    promise = $ionicModal.fromTemplateUrl(tpl, {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      modal.show();
      return modal;
    });

    $scope.openModal = function() {
       $scope.modal.show();
     };
     $scope.closeModal = function() {
       $scope.modal.hide();
     };
     $scope.$on('$destroy', function() {
       $scope.modal.remove();
     });
	
    return promise;
  }

  return {
    init: init
  }
})

.service('VideoService', function($q) {
	var deferred = $q.defer();
	var promise = deferred.promise;
	
	
	promise.success = function(fn) {
		console.log("success");
		promise.then(fn);
		return promise;
	}
	promise.error = function(fn) {
		console.log("error");
		promise.then(null, fn);
		return promise;
	}
	
	
	// Resolve the URL to the local file
	// Start the copy process
	function createFileEntry(fileURI, scope) {
		window.resolveLocalFileSystemURL(fileURI, function(entry) {
			return copyFile(entry, scope);
		}, fail);
	}
	
	// Create a unique name for the videofile
	// Copy the recorded video to the app dir
	function copyFile(fileEntry, scope) {
		var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
		var newName = makeid() + name;
	
		window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
				fileEntry.copyTo(fileSystem2, newName, function(succ) {
					return onCopySuccess(succ, scope);
				}, fail);
			},
			fail
		);
	}
	
	// Called on successful copy process
	// Creates a thumbnail from the movie
	// The name is the moviename but with .png instead of .mov
	function onCopySuccess(entry, scope) {
		var name = entry.nativeURL.slice(0, -4);
		console.log('onCopySuccessName : ' + name);
		window.PKVideoThumbnail.createThumbnail (entry.nativeURL, name + '.png', function(prevSucc) {
			return prevImageSuccess(prevSucc, scope);
		}, fail);
	}
	
	// Called on thumbnail creation success
	// Generates the currect URL to the local moviefile
	// Finally resolves the promies and returns the name
	function prevImageSuccess(succ, scope) {
		var correctUrl = succ.slice(0, -4);
		correctUrl += '.MOV';
		console.log("correctUrl before push : " + correctUrl);
		scope.allVideos.push({'src' : correctUrl});
		deferred.resolve(correctUrl);
	}
	
	// Called when anything fails
	// Rejects the promise with an Error
	function fail(error) {
		console.log('FAIL: ' + error.code);
		deferred.reject('ERROR');
	}
	
	// Function to make a unique filename
	function makeid() {
		var text = '';
		var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		for ( var i=0; i < 5; i++ ) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	}
	
	// The object and functions returned from the Service
	return {
		// This is the initial function we call from our controller
		// Gets the videoData and calls the first service function
		// with the local URL of the video and returns the promise
		saveVideo: function(data, scope) {
			console.log("Dans saveVideo");
			createFileEntry(data[0].localURL, scope);
			return promise;
		}
	}
})


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
