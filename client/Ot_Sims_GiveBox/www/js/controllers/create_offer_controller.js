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

	searchCategorie = function(){
		var req = {
			 method: 'GET',
			 url: 'http://yoda.rispal.info/givebox/api/categories'
		}
			$http(req).then(function(dataServer){
				$scope.message = dataServer;

				var elementSelect = document.getElementById("selectCategories");

				console.log(dataServer.data.length);
				for(var i = 0; i< dataServer.data.length; i++){
					var elementCat = dataServer.data[i];
					console.log(elementCat.Id + " ; " + elementCat.ParentId);

					if(elementCat.ParentId == null){
							elementSelect += "<option style=\"background-color:#dcdcc3;\" value=" + elementCat.Id + ">  "+ "-- VEHICULES --    </option>"
					}

				}

			}, function(data){
					console.log("Problème de réception de la requête.");
					$scope.message = data;
			});
	}

	//searchCategorie();


	// Create and send a request to create an offer
  $scope.sendNewOfferRequest = function(offer) {

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
			 },
			 data: newOffer
		}

		$http(reqJson).then(function(dataServer){
				$scope.message = dataServer;
				//todo : .../apt/offres/id
				console.log(dataServer.data.Id);

				var win = function (r) {
				    console.log("Code = " + r.responseCode);
				    console.log("Response = " + r.response);
				    console.log("Sent = " + r.bytesSent);
				}

				var fail = function (error) {
				    console.log("An error has occurred: Code = " + error.code);
				    console.log("upload error source " + error.source);
				    console.log("upload error target " + error.target);
						console.log(error);
				}

				//Send each images to the server.
				for(var i = 0; i< $scope.allImages.length; i++){
						var imagePath = $scope.allImages[i];

						var options = new FileUploadOptions();
						options.fileKey = "1_" + i;
						options.name = "1_" + i;
						options.mimeType = "image/jpeg";
						options.httpMethod = "POST";

						var params = {};
						params.value1 = 1;

						options.params = params;

						var headers={
	 			   		'accept': 'application/json'
						};

						options.headers = headers;

						var ft = new FileTransfer();
						//dataServer.data.Id
						ft.upload($scope.allImages[i].src, encodeURI("http://yoda.rispal.info/givebox/api/fichiers/" + dataServer.data.Id), win, fail, options);
				}


		}, function(data){
			console.log("Problème d'envoi de la requête.");
			alert( "Problème d'envoi au serveur: " + JSON.stringify({data: data}));
		});

  };

	$scope.importAPhoto = function() {
		var options = {
			allowEdit: true,
			sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
			encodingType: Camera.EncodingType.JPEG,
			saveToPhotoAlbum: false
		};

		$cordovaCamera.getPicture(options).then(function(imageURI) {
			console.log(imageURI);
			$scope.allImages.push({'src' : imageURI});
		}, function(err) {
			console.log("Erreur pour importer une photo : " + err);
		});
	};

	$scope.takeAPhoto = function() {
		var options = {
			allowEdit: true,
			sourceType: Camera.PictureSourceType.CAMERA,
			encodingType: Camera.EncodingType.JPEG,
			saveToPhotoAlbum: true
		};

		$cordovaCamera.getPicture(options).then(function(imageURI) {
			console.log(imageURI);
			$scope.allImages.push({'src' : imageURI});
		}, function(err) {
			console.log("Erreur pour prendre une photo : " + err);
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
