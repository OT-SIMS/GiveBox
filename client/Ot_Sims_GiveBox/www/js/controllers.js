angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})	

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('CreateOffer', function($scope, $http, $cordovaCamera, $cordovaCapture) {
	
	
	// Create and send a request to create an offer
  $scope.sendNewOfferRequest = function(offer) {	    
		var imagesContainer = document.getElementById('offerImages');
		var images = imagesContainer.getElementsByTagName("img");
		
		console.log(images.length);
		
		var imagesArray = [];
		for(var i = 0; i< images.length; i++){
				var element = images[i];
				imagesArray.push(element.getAttribute("src"));
				console.log(element.getAttribute("src"));
		}
	  
				
		var newOffer = {
			"UtilisateurId": 1,
			"CategorieId":1,
			"Fichier": imagesArray,
			"Titre": offer.title,
			"Description": offer.description,
			"Latitude": 1,
			"Longitude": 1
		};
		
		
		var req = {
			 method: 'POST',
			 url: 'http://yoda.rispal.info/givebox/api/offres',
			 headers: {
			   'Content-Type': 'application/json',
			   'accept': 'application/json'
			 },
			 data: newOffer
		}
		
		/*
		$http(req).then(function(){
			$scope.message = data;
		}, function(){
			alert( "Problème d'envoi au serveur: " + JSON.stringify({data: data}));
		});
		*/
  };
  
	
	$scope.takeAPhoto = function() {
		var options = {
			quality: 100,
			destinationType: Camera.DestinationType.FILE_URI,
			sourceType: Camera.PictureSourceType.CAMERA,
			allowEdit: true,
			encodingType: Camera.EncodingType.JPEG,
			targetWidth: 100,
			targetHeight: 100,
			popoverOptions: CameraPopoverOptions,
			saveToPhotoAlbum: false,
			correctOrientation:true
		};
		
		$cordovaCamera.getPicture(options).then(function(imageURI) {
			var imagesContainer = document.getElementById('offerImages');
			imagesContainer.innerHTML += "<img src=" + imageURI + "> </img>";
			
			$scope.offer.photo = imageURI;
		}, function(err) {
			// error
		});
	};
	
	
	//Use of cordovaCapture instead of cordovaCamera.
	$scope.takeAnImage = function(offer) {
		var options = {
			quality: 100,
			destinationType: Camera.DestinationType.FILE_URI,
			sourceType: Camera.PictureSourceType.CAMERA,
			allowEdit: true,
			encodingType: Camera.EncodingType.JPEG,
			targetWidth: 100,
			targetHeight: 100,
			popoverOptions: CameraPopoverOptions,
			saveToPhotoAlbum: false,
			correctOrientation:true
		};
		
		$cordovaCapture.captureImage(options).then(function(imageURI) {
			var imagesContainer = document.getElementById('offerImages');
			imagesContainer.innerHTML += "<img src=" + imageURI + "> </img>";
			
		}, function(err) {
			// error
		});
	};
	
	$scope.recordAVideo = function() {
		 $cordovaCapture.captureVideo().then(function(videoData) {
      // Success! Video data is here
    }, function(err) {
      // An error occurred. Show a message to the user
    });
	};

});