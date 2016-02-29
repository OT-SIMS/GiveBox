angular.module('starter.controllers.CreateOffer', [
])

.controller('CreateOfferCtrl', function($scope, $http, $ionicModal, $cordovaCamera, $cordovaCapture, $cordovaGeolocation, $ionicLoading, $ionicPopup, $location) {

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

	$scope.showSpinner = function() {
    $ionicLoading.show({
      templateUrl:"templates/loading.html"
    });
  };
  $scope.hideSpinner = function(){
    $ionicLoading.hide();
  };

	// An alert dialog
 $scope.showAlert = function(title, message) {
   var alertPopup = $ionicPopup.alert({
     title: title,
     template: message,
		 cssClass: 'offerAlert'
   });

   alertPopup.then(function(res) {
   });
 };

	/**
	 * Fills the categories selection from the result from the server.
	 */
	searchCategorie = function(){
		var req = {
			 method: 'GET',
			 url: 'http://yoda.rispal.info/givebox/api/categories'
		}

		$http(req).then(function(dataServer){
			$scope.categories = [];

			for(var i = 0; i< dataServer.data.length; i++){
				var elementCat = dataServer.data[i];

				if(elementCat.ParentId != null){
					var parentCategorie = _.findWhere(dataServer.data, {Id: elementCat.ParentId});
					$scope.categories.push({name: elementCat.Nom, Id: elementCat.Id, parent: parentCategorie.Nom});
				}

			}

		}, function(data){
				console.log("Problème de réception de la requête.");
				$scope.message = data;
		});
	}

	searchCategorie();

	/*
	 * Configure the form to its normal state (with no error messages).
	 */
	stateForm = function(normal){
		if(normal) {
			document.getElementById("titleLabel").className = document.getElementById("titleLabel").className.replace( /(?:^|\s)toFill(?!\S)/g , '' );
			document.getElementById("descriptionLabel").className = document.getElementById("descriptionLabel").className.replace( /(?:^|\s)toFill(?!\S)/g , '' );
			document.getElementById("categorieLabel").className = document.getElementById("descriptionLabel").className.replace( /(?:^|\s)toFill(?!\S)/g , '' );
		}else{
			document.getElementById("titleLabel").className += " toFill";
			document.getElementById("descriptionLabel").className += " toFill";
			document.getElementById("categorieLabel").className += " toFill";
		}

	}

	sleep = function(timeInMillis) {
	  //do some things
	  setTimeout(continueExecution, timeInMillis) //wait timeInMillis milliseconds before continuing
	}

	continueExecution = function () {
	}

	$scope.clearOfferScope = function() {
		$scope.title = undefined;
		$scope.description = undefined;
		$scope.categorie = undefined;
	};

	// Create and send a request to create an offer
  $scope.sendNewOfferRequest = function(offer) {
		var sendingOk = true;
		var  nbSentPictures = 0;
		var nbFailedSentPictures = 0;



		if(offer == undefined){
			stateForm(false);
			sendingOk = false;
		}else {
			stateForm(true);

			if(offer.title == undefined || offer.title == ''){
				document.getElementById("titleLabel").className += " toFill";
				sendingOk = false;
			}

			if (offer.description == undefined || offer.description == '') {
				document.getElementById("descriptionLabel").className += " toFill";
				sendingOk = false;
			}

			if (offer.categorie == undefined) {
				console.log("categorie pas bon");
				document.getElementById("categorieLabel").className += " toFill";
				sendingOk = false;
			}

		}

		if(!sendingOk){
			$scope.showAlert('Offre incomplète !', 'Il manque des informations dans votre offre.');
			return;
		}

		$scope.showSpinner();


		var newOffer = {
			"UtilisateurId": 1,
			"CategorieId":offer.categorie.Id,
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
				console.log(dataServer.data.Id);

				/*
				 * Function called when the image has just been successfully uploaded.
				 */
				var win = function (r) {
				    console.log("Code = " + r.responseCode);
				    console.log("Response = " + r.response);
				    console.log("Sent = " + r.bytesSent);
						nbSentPictures = nbSentPictures + 1;

						if(nbSentPictures != $scope.allImages.length){
							if(nbFailedSentPictures != 0){
								$scope.hideSpinner();
								$scope.showAlert('Offre non créée !', 'Il y a eu un problème avec le serveur, veuillez réessayer ultérieurement.');
							}
							//else : do nothing and wait for another picture to be done.
						}else{
							$scope.hideSpinner();
							$scope.clearOfferScope();
							$scope.showAlert('Offre créée !', 'Votre offre a été créée avec succès.');
							$location.path("/home");
						}
				}

				var fail = function (error) {
				    console.log("An error has occurred: Code = " + error.code);
				    console.log("upload error source " + error.source);
				    console.log("upload error target " + error.target);
						console.log(error);
						nbFailedSentPictures = nbFailedSentPictures + 1;
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
						ft.onprogress = function(progressEvent) {
						    if (progressEvent.lengthComputable) {
									console.log(progressEvent.loaded / progressEvent.total);
						    } else {
						    }
						};
						ft.upload($scope.allImages[i].src, encodeURI("http://yoda.rispal.info/givebox/api/fichiers/" + dataServer.data.Id), win, fail, options);
				}
		}, function(data){
			console.log("Problème d'envoi de la requête.");
			alert( "Problème d'envoi au serveur: " + JSON.stringify({data: data}));
		});

		//Coming here : the spinner is still here while pictures are being uploaded.
  };

	$scope.importAPhoto = function() {
		var options = {
			allowEdit: false,
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
			$scope.latitude = position.coords.latitude;
			$scope.longitude = position.coords.longitude;
		};



		// onError Callback receives a PositionError object
		//
		function onError(error) {
			alert('code: '    + error.code    + '\n' +
				  'message: ' + error.message + '\n');
		}

		navigator.geolocation.getCurrentPosition(onSuccess, onError);
	};

	$scope.convertCoordinates = function() {
		console.log("convertCoordinates");


		var options = {
			 method: 'GET',
			 url: 'maps.googleapis.com'
		}

		var params = {};



		var latParam = 'params.1d' + $scope.latitude + '=\"\"';
		//var longParam = 'options.2d' + $scope.longitude + '=\"\"';
		console.log(latParam);

		eval(latParam);
		//eval(longParam);

		options.params = params;
		console.log(options);

	}
});
