angular.module('starter.controllers.CreateOffer', [])

.controller('CreateOfferCtrl', function($scope, $http, $ionicModal, $cordovaCamera, $cordovaCapture, $cordovaGeolocation, $ionicLoading, $ionicPopup, $location, CONFIG) {

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
			 url: CONFIG.serverUrl + 'api/categories'
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
	};

	initController = function(){
		$scope.offer = {};
		$scope.offer.title = '',
		$scope.offer.description = '',
		$scope.offer.postcode = "00000";
		$scope.offer.latitude = '';
		$scope.offer.longitude = '';
		$scope.offer.town = '';

		//$scope.regexPostalCode = new RegExp("[0-9]*");
		$scope.regexPostalCode = /[0-9]*/;
	}

	initController();
	searchCategorie();

	/*
	 * Configure the form to its normal state (with no error messages).
	 */
	stateForm = function(normal){
		if(normal) {
			document.getElementById("titleLabel").className = document.getElementById("titleLabel").className.replace( /(?:^|\s)toFill(?!\S)/g , '' );
			document.getElementById("descriptionLabel").className = document.getElementById("descriptionLabel").className.replace( /(?:^|\s)toFill(?!\S)/g , '' );
			document.getElementById("categorieLabel").className = document.getElementById("categorieLabel").className.replace( /(?:^|\s)toFill(?!\S)/g , '' );
			document.getElementById("picturesLabel").className = document.getElementById("picturesLabel").className.replace( /(?:^|\s)toFill(?!\S)/g , '' );
			document.getElementById("locLabel").className = document.getElementById("locLabel").className.replace( /(?:^|\s)toFill(?!\S)/g , '' );

		}else{
			document.getElementById("titleLabel").className += " toFill";
			document.getElementById("descriptionLabel").className += " toFill";
			document.getElementById("categorieLabel").className += " toFill";
			document.getElementById("picturesLabel").className += " toFill";
			document.getElementById("locLabel").className += " toFill";
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
  $scope.sendNewOfferRequest = function() {
		var sendingOk = true;
		var  nbSentPictures = 0;
		var nbFailedSentPictures = 0;



		/*
		if($scope.offer == ''){
			stateForm(false);
			sendingOk = false;
		}else {
		}
		*/

		stateForm(true);

		if($scope.offer.title == ''){
			document.getElementById("titleLabel").className += " toFill";
			sendingOk = false;
		}

		if ($scope.offer.description == '') {
			document.getElementById("descriptionLabel").className += " toFill";
			sendingOk = false;
		}

		if ($scope.offer.categorie == undefined) {
			document.getElementById("categorieLabel").className += " toFill";
			sendingOk = false;
		}

		if($scope.allImages.length == 0){
			document.getElementById("picturesLabel").className += " toFill";
			sendingOk = false;
		}

		if($scope.offer.postcode == "00000" || $scope.offer.town == '' || $scope.offer.town == null){
			document.getElementById("locLabel").className += " toFill";
			sendingOk = false;

		}

		if(!sendingOk){
			$scope.showAlert('Offre incomplète !', 'Il manque des informations dans votre offre.');
			return;
		}

		$scope.showSpinner();


		var newOffer = {
			"UtilisateurId": 1,
			"CategorieId":$scope.offer.categorie.Id,
			"Titre": $scope.offer.title,
			"Description": $scope.offer.description,
			"Latitude": $scope.offer.latitude,
			"Longitude": $scope.offer.longitude,
			"CodePostal": $scope.offer.postcode,
			"Ville": $scope.offer.town
		};

		var reqJson = {
			 method: 'POST',
			 url: CONFIG.serverUrl + 'api/offres',
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
						ft.upload($scope.allImages[i].src, encodeURI(CONFIG.serverUrl + "api/fichiers/" + dataServer.data.Id), win, fail, options);
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

			$scope.offer.latitude = position.coords.latitude;
			$scope.offer.longitude = position.coords.longitude;

			$scope.convertCoordinates();
		};



		// onError Callback receives a PositionError object
		//
		function onError(error) {
			console.log("error");
			alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
		}

		navigator.geolocation.getCurrentPosition(onSuccess, onError);


	};

	$scope.findLocalityFromPostcode = function() {
		//https://maps.googleapis.com/maps/api/geocode/json?components=postal_code:69100|country:France

		var options = {
			 method: 'GET',
			 //url: 'http://nominatim.openstreetmap.org/reverse'
			 url: 'https://maps.googleapis.com/maps/api/geocode/json'
		};

		var params = {};

		params.components = 'postal_code:' + $scope.offer.postcode + '|country:France';

		options.params = params;

		$http(options).then(function(dataServer){
				$scope.cities = [];

				var results = dataServer.data.results;
				_.each(results, function(result){

						var loc = _.property('postcode_localities')(result);
						if(loc == undefined) {
							var addressComponents = _.property('address_components')(result);

							if(addressComponents != undefined){
								_.each(addressComponents, function(element){
									if(_.contains(element.types, "locality")){
										$scope.town = element.long_name

										$scope.cities.push($scope.town);
									}
								});
							}

						}else{
							var localties = result.postcode_localities;
							_.each(localties, function(city) {
								$scope.cities.push(city);
							})

						}

				});

				/*
				if(_.contains(result0),"postcode_localities"){
					$scope.geolog = result0;
					console.log("postcode_localities");
					$scope.cities = result0.postcode_localities;
				}else{
					$scope.cities=[];
					$scope.cities.push(result0.long_name);
					console.log(result0.long_name);
				}
				*/

		}, function(data){
			console.log("Problème d'envoi de la requête.");
			alert( "Problème d'envoi au serveur: " + JSON.stringify({data: data}));
		});

	};

	$scope.convertCoordinates = function() {
		//TODO : https://maps.googleapis.com/maps/api/geocode/json?latlng=45.781822,4.873107

		var options = {
			 method: 'GET',
			 //url: 'http://nominatim.openstreetmap.org/reverse'
			 url: 'https://maps.googleapis.com/maps/api/geocode/json'
		}

		var params = {};


		params.format = 'json';
		params.latlng = $scope.offer.latitude + ',' + $scope.offer.longitude;

		options.params = params;


		$http(options).then(function(dataServer){
			//$scope.geolog = dataServer.data.results[0].address_components;


			var address_components = dataServer.data.results[0].address_components;

			_.each(address_components, function(element){
				if(_.contains(element.types, "postal_code")){
					console.log($scope.offer.postcode);
					$scope.offer.postcode = element.long_name;
					console.log($scope.offer.postcode);
				}
				else if(_.contains(element.types, "locality")){
					$scope.town = element.long_name
					$scope.cities = [];
					$scope.cities.push($scope.town);
				}
			});



			//$scope.postcode = dataServer.data.address.postcode;
			//$scope.town = dataServer.data.address.town;

		}, function(data){
			console.log("Problème d'envoi de la requête.");
			alert( "Problème d'envoi au serveur: " + JSON.stringify({data: data}));
		});
	}


});
