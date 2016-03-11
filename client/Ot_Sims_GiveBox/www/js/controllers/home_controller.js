angular.module('starter.controllers.Home', [])

.controller('HomeCtrl', function($scope, $http, $ionicModal, $cordovaGeolocation, $location){
  $scope.coordonnees = {};
  $scope.coordonnees.latitude = '';
  $scope.coordonnees.longitude = '';

  $scope.getAllOffers = function(){
      var req = {
       method: 'GET',
       url: 'http://yoda.rispal.info/givebox/api/offres',
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

    $http(req)
      .then(function(response){
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
         url: 'http://yoda.rispal.info/givebox/api/offres/',
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

      $http(req)
        .then(function(response){
          $scope.items=response.data;
        }, function(response){
          alert( "Problème d'envoi au serveur: " + JSON.stringify({response: response}));
        });
    } else{
      $scope.getAllOffers();
    }
  }

  $scope.getAllOffers();

  $ionicModal.fromTemplateUrl('templates/offer.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openOffer = function(offer){
    $scope.modalData  = offer;
    var markerOptions = {
      latitude : offer.Latitude,
      longitude : offer.LOngitude
    };
    $scope.modalData.marker = markerOptions;
    $scope.modal.show();
  }

  $scope.closeOffer = function() {
    $scope.modal.hide();
  };

});
