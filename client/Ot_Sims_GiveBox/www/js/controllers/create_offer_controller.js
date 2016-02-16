angular.module('starter.controllers.CreateOffer', [
])

.controller('CreateOfferCtrl', function($scope, $http, $ionicModal, $cordovaCamera, $cordovaCapture, $cordovaGeolocation) {

	$scope.allImages = [
	];
	$scope.allImagesObject = [
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
		for(var i = 0; i< 2; i++){
				//var imageName = '\'' + $scope.allImages[i].src + '\'' ;

				var imageName = 'file:///storage/emulated/0/Android/data/com.ionicframework.otsimsgivebox351025/cache/1455547352370.jpg' ;

				console.log(imageName.src);

				//$scope.test = imageName;

				action = 'imagesInRequest.image_' + i + ' = { value: fs.createReadStream( imageName ), options: { filename: imageName , contentType: null } }';
				eval(action)

				$scope.test = imagesInRequest;
		}


		var newOffer = {
			"UtilisateurId": 1,
			"CategorieId":1,
			"Titre": offer.title,
			"Description": offer.description,
			"Latitude": 1,
			"Longitude": 1
		};

		var reqJson = {
			 method: 'POST',
			 url: 'http://yoda.rispal.info/givebox/api/offres',
			 headers: {
			   'content-type': 'application/json',
			   'accept': 'application/json'
			 }
		}

		$http(reqJson).then(function(data){
				console.log("Succès de l'envoi du json : " + data);
				$scope.message = data;
				//todo : .../apt/offres/id

				var reqMultimedia = {
					 method: 'POST',
					 url: 'http://yoda.rispal.info/givebox/api/offres',
					 headers: {
					   'content-type': 'multipart/form-data',
					   'accept': 'multipart/form-data'
					 }
				}

				$http(reqMultimedia).then(function(data){
						console.log("Succès de l'envoi du contenu multimedia : " + data);
				},function(data){

				})
		}, function(data){
			console.log("Problème d'envoi de la requête.");
			alert( "Problème d'envoi au serveur: " + JSON.stringify({data: data}));
		});

  };

	$scope.importAPhoto = function() {
		var options = {
			allowEdit: true,
			sourceType: Camera.PictureSourceType.PHOTOLIBRARY
		};

		$cordovaCamera.getPicture(options).then(function(imageURI) {


			console.log(imageURI);
			$scope.allImages.push({'src' : imageURI});

		}, function(err) {
			// error
		});
	}

	$scope.takeAPhoto = function() {
		var options = { limit: 1	}

		var captureSuccess = function(mediaFiles) {
			console.log(name);
			$scope.allImages.push({'src' : name});

			/*
			for (i = 0, len = mediaFiles.length; i < len; i += 1) {

					//$scope.allImages.push({'src' : mediaFiles[i].fullPath});
					console.log('adding');
					$scope.allImages.push({'src' : 'file:///storage/emulated/0/Pictures/1455615517315.jpg'})
					//$scope.allImagesObject.push(mediaFiles[i]);
			    // do something interesting with the file
			}
			*/
		}

		// capture error callback
		var captureError = function(error) {
			navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
		};

		navigator.device.capture.captureImage(captureSuccess, captureError, options);

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
