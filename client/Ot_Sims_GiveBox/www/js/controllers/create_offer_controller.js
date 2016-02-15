angular.module('starter.controllers.CreateOffer', [
])

.controller('CreateOfferCtrl', function($scope, $http, $ionicModal, $cordovaCamera, $cordovaCapture, $cordovaGeolocation) {

	$scope.allImages = [
	];

	$scope.showImages = function(index) {
		$scope.activeSlide = index;
		$scope.showModal('templates/image-popover.html');
	}

	$scope.showModal = function(templateUrl) {
		$ionicModal.fromTemplateUrl(templateUrl, {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal;
			$scope.modal.show();
		});
	}

	// Close the modal
	$scope.closeModal = function() {
		$scope.modal.hide();
		$scope.modal.remove()
	};


	// Create and send a request to create an offer
  $scope.sendNewOfferRequest = function(offer) {
		var imagesContainer = document.getElementById('offerImages');
		var images = imagesContainer.getElementsByTagName("img");

		$scope.test = {premier : 'permier'};
		scope.test.push(second : 'second');

		/*
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
			"Titre": offer.title,
			"Description": offer.description,
			"Latitude": 1,
			"Longitude": 1
		};


		var req = {
			 method: 'POST',
			 url: 'http://yoda.rispal.info/givebox/api/offres',
			 headers: {
			   'content-type': 'multipart/form-data',
			   'accept': 'multipart/form-data'
			 },
			 data: newOffer
		}


		$http(req).then(function(data){
			console.log("Succès de l'envoi : " + data);
			$scope.message = data;
		}, function(data){
			console.log("Problème d'envoi de la requête.");
			alert( "Problème d'envoi au serveur: " + JSON.stringify({data: data}));
		});

		*/
  };


	$scope.takeAPhoto = function() {
		/*
		var options = {
			quality: 100,
			destinationType: Camera.DestinationType.FILE_URI,
			sourceType: Camera.PictureSourceType.CAMERA,
			allowEdit: true,
			encodingType: Camera.EncodingType.JPEG,
			mediaType: Camera.MediaType.VIDEO,
			popoverOptions: CameraPopoverOptions,
			saveToPhotoAlbum: false,
			correctOrientation:true
		};
		*/
		var options = {
			mediaType: Camera.MediaType.VIDEO,
		};

		$cordovaCamera.getPicture(options).then(function(imageURI) {
			/*
			var imagesContainer = document.getElementById('offerImages');
			imagesContainer.innerHTML += "<img src=" + imageURI + "> </img>";
			*/
			console.log(imageURI);
			$scope.allImages.push({'src' : imageURI});

		}, function(err) {
			// error
		});
	};

	$scope.recordAVideo = function() {
		var options = {	}


		var captureSuccess = function(mediaFile) {
			console.log(mediaFile[0].fullPath)
		}

		// capture error callback
		var captureError = function(error) {
			navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
		};

		navigator.device.capture.captureVideo(captureSuccess, captureError, options);

	};

	$scope.updatePosition = function() {
		// onSuccess Callback
		// This method accepts a Position object, which contains the
		// current GPS coordinates
		//
		var onSuccess = function(position) {
			/*
			alert('Latitude: '          + position.coords.latitude          + '\n' +
				  'Longitude: '         + position.coords.longitude         + '\n' +
				  'Altitude: '          + position.coords.altitude          + '\n' +
				  'Accuracy: '          + position.coords.accuracy          + '\n' +
				  'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
				  'Heading: '           + position.coords.heading           + '\n' +
				  'Speed: '             + position.coords.speed             + '\n' +
				  'Timestamp: '         + position.timestamp                + '\n');
			*/
			document.getElementById("latitude").innerHTML = "latitude" + position.coords.latitude;
			document.getElementById("longitude").innerHTML = "longitude" + position.coords.longitude;
		};



		// onError Callback receives a PositionError object
		//
		function onError(error) {
			alert('code: '    + error.code    + '\n' +
				  'message: ' + error.message + '\n');
		}

		navigator.geolocation.getCurrentPosition(onSuccess, onError);
	}


});
