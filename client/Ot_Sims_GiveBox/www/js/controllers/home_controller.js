angular.module('starter.controllers.Home', [])

.controller('HomeCtrl', function($scope, $http, $ionicModal, $cordovaGeolocation, $location, CONFIG, localStorageService){

	$scope.coordonnees = {};
	$scope.coordonnees.latitude = '';
	$scope.coordonnees.longitude = '';
	$scope.offerData = {
		newComment : '',
		allowMailComposing : false,
		mailContent: ''
	}

	$scope.map = { center: { latitude: 45.7818, longitude: 4.8731 }, zoom: 15, pan: 1 };
	//$scope.map = {center: {latitude: 45.7818, longitude: 4.8731 }, zoom: 4 };
	$scope.options = {scrollwheel: false};
	$scope.coordsUpdates = 0;
	$scope.dynamicMoveCtr = 0;

	$scope.marker = {
		id: 0,
		coords: {
			latitude: 45.7818,
			longitude: 4.8731
		},
		options: {
			draggable: false,
			labelContent: "Offre"
		},
		events: {
			dragend: function (marker, eventName, args) {
				$log.log('marker dragend');
				var lat = marker.getPosition().lat();
				var lon = marker.getPosition().lng();
				$log.log(lat);
				$log.log(lon);

				$scope.marker.options = {
					draggable: true,
					labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
					labelAnchor: "100 0",
					labelClass: "marker-labels"
				};
			}
		}
	};

	$scope.getAllOffers = function(){
		var req = {
			method: 'GET',
			url: CONFIG.serverUrl + 'api/offres',
			headers: {
				'Content-Type': 'application/json',
				'accept': 'application/json'
			}
		}

		console.log("ajout des params : " + $scope.coordonnees.latitude);
		if($scope.coordonnees.latitude != '' && $scope.coordonnees.longitude != ''){
			var params = {};
			params.latt = $scope.coordonnees.latitude
			params.lgt = $scope.coordonnees.longitude;

			req.params = params;
			console.log("params ok");
		}

		$http(req).then(function(response){
			$scope.items=response.data;
		}, function(response){
			alert( "Problème d'envoi au serveur: " + JSON.stringify({response: response}));
		});
	}

  $scope.updateLocalisation = function() {
		// onSuccess Callback
		// This method accepts a Position object, which contains the
		// current GPS coordinates
		//
		var onSuccess = function(position) {

			$scope.coordonnees.latitude = position.coords.latitude;
			$scope.coordonnees.longitude = position.coords.longitude;
		};

		// onError Callback receives a PositionError object
		//
		function onError(error) {
			console.log("error");
      if(error.code == 1){
		alert("Il y a eu problème pour utiliser la géolocalisation du téléphone. celle-ci est-elle activée ?");
	}
			//alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
		}
		navigator.geolocation.getCurrentPosition(onSuccess, onError);
	}

	$scope.keyWordsResearch = function(keyword){
		if(keyword!=undefined){
			var req = {
				method: 'GET',
				url: CONFIG.serverUrl + '/api/offres/',
				headers: {
					'Content-Type': 'application/json',
					'accept': 'application/json'
				}
			}

			var params = {};
			params.motcles = keyword;

			if($scope.coordonnees.latitude != '' && $scope.coordonnees.longitude != ''){

				params.latt = $scope.coordonnees.latitude;
				params.lgt = $scope.coordonnees.longitude;
				params.r = '1000';

				//params.latt = '100';
				//params.lgt = '100';
			}

			req.params = params;

			$http(req).then(function(response){
				$scope.items=response.data;
			}, function(response){
				alert( "Problème d'envoi au serveur: " + JSON.stringify({response: response}));
			});
		} else{
			$scope.getAllOffers();
		}
	}

	$scope.openModalOffer = function() {
		$ionicModal.fromTemplateUrl('templates/offer.html', {
			scope: $scope
		}).then(function(modal) {
			$scope.modal = modal;
			$scope.modal.show();
		});
	}

	$scope.openOffer = function(offer){
		$scope.modalData  = offer;
		var markerOptions = {
			latitude : offer.Latitude,
			longitude : offer.LOngitude
		};
		$scope.modalData.marker = markerOptions;

		$scope.updateMapCoordinates(offer);
	}

	/**
	 * Use the coordinates from the offer, or use the city coordinates from google maps
	 *
	 * */
	$scope.updateMapCoordinates = function (offer) {
		console.log("updateMapCoordinates ");

		console.log("offer.Latitude" + offer.Latitude);

		if(offer.Latitude == '' || offer.Longitude == ''|| offer.Longitude == null|| offer.Latitude == null){
			console.log("use gmaps");
			var options = {
				method: 'GET',
				//url: 'http://nominatim.openstreetmap.org/reverse'
				url: CONFIG.googleapis + 'geocode/json'
			};

			var params = {};

			params.components = 'country:' + 'France' + '|locality:' + offer.Ville;

			options.params = params;

			$http(options).then(function(dataServer){
				console.log("updating coords gmaps : " + dataServer);

				var lat = dataServer.data.results[0].geometry.location.lat;
				var lng = dataServer.data.results[0].geometry.location.lng;

				$scope.map.center.latitude = lat;
				$scope.map.center.longitude = lng;
				$scope.map.zoom = 5;

				$scope.marker.coords.latitude = lat;
				$scope.marker.coords.longitude = lng;

				$scope.openModalOffer();
			}, function(data){
				console.log("Problème d'envoi de la requête.");
				alert( "Problème d'envoi au serveur: " + JSON.stringify({data: data}));
			});

		}else{
			console.log("Update from offer");
			$scope.map.center.latitude = offer.Latitude;
			$scope.map.center.longitude = offer.Longitude;

			$scope.marker.coords.latitude = offer.Latitude;
			$scope.marker.coords.longitude = offer.Longitude;

			$scope.openModalOffer();
		}
	}

	$scope.closeOffer = function() {
		$scope.modal.hide();
	};

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
  				var parentCategorie = _.find(dataServer.data, {Id: elementCat.ParentId});
  				$scope.categories.push({name: elementCat.Nom, Id: elementCat.Id, parent: parentCategorie.Nom});
  			}

  		}

  	}, function(data){
  		console.log("Problème de réception de la requête.");
  		$scope.message = data;
		});
	};

	// Run when the app is opened
	$scope.getAllOffers();
	searchCategorie();

  $scope.getOffersByCategories = function(categorie){
    var req = {
       method: 'GET',
       url: CONFIG.serverUrl + '/api/offres/',
       headers: {
         'Content-Type': 'application/json',
         'accept': 'application/json'
       }
    }

    var params = {};
    params.categorie = categorie;

    if($scope.coordonnees.latitude != '' && $scope.coordonnees.longitude != ''){

      params.latt = $scope.coordonnees.latitude;
      params.lgt = $scope.coordonnees.longitude;
      params.r = '1000';

      //params.latt = '100';
      //params.lgt = '100';
    }

    req.params = params;

    $http(req)
      .then(function(response){
        $scope.items=response.data;
      }, function(response){
        alert( "Problème d'envoi au serveur: " + JSON.stringify({response: response}));
      });
  }

  $scope.canLeaveComment = function() {
		var authData = localStorageService.get('authorizationData');
		if (authData) {
			return true;
		}
		return false;
	}

});
