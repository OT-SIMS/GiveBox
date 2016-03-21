angular.module('starter.controllers.Offer', [])

.controller('OfferCtrl', function($scope, $ionicModal, $ionicLoading, $log, $http, $ionicSlideBoxDelegate, $cordovaEmailComposer, CONFIG) {
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
		click: function() {
			$ionicSlideBoxDelegate.previous();
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

	$scope.sendNewComment = function() {
		var comment = $scope.offerData.newComment;

		var req = {
			method: 'POST',
			url: CONFIG.serverUrl + 'api/offres/discussion/' + $scope.modalData.Id,
			headers: {
			'content-type': 'application/json',
			'accept': 'application/json'
			},
			data: comment
		}

		$http(req).then(function(dataServer){
			$scope.offerData.newComment = '';
		}, function(data){
			console.log("Problème d'envoi de la requête.");
			//alert( "Problème d'envoi au serveur: " + JSON.stringify({data: data}));
		});


	}

	$scope.composeMail = function() {
		$scope.offerData.allowMailComposing = true;
	}

	$scope.sendMail = function() {
		$cordovaEmailComposer.isAvailable(
			function (isAvailable) {
				// alert('Service is not available') unless isAvailable;
				console.log("isAvailable : " + isAvailable);
			}
);

		var email = {
			to: 'jerome.guidon@insa-lyon.fr',
			//cc: 'erika@mustermann.de',
			//bcc: ['john@doe.com', 'jane@doe.com'],
			attachments: [],
			subject: '[Givebox] Votre offre \" ' + $scope.modalData.Titre + '\" ',
			body: $scope.offerData.mailContent,
			isHtml: true,
			app: 'mailto',
		};

		$cordovaEmailComposer.open(email).then(function() {
			console.log("success")
		}, function () {
			console.log("user cancelled email");
		});
	}

	$scope.deleteMail = function() {
		$scope.offerData.allowMailComposing = false;
		$scope.offerData.mailContent = '';
	}

	$scope.next = function() {
		$ionicSlideBoxDelegate.next();
	};

	$scope.formatDate = function(date) {
// 		var toReturn = '';
		///2016-03-17T18:01:42.663
		var months = [
			'Janvier',
			'Février',
			'Mars',
			'Avril',
			'Mai',
			'Juin',
			'Juillet',
			'Août',
			'Septembre',
			'Octobre',
			'Novembre',
			'Décembre'
		]

		var strMonth = date.substring(5,7);
		var month = months[_.parseInt(strMonth-1)];

		return "le " + date.substring(8,10) + " " + month + " " + date.substring(0,4) + " à " + date.substring(11,13) + "h" + date.substring(14,16);
	}

	$scope.previous = function() {
		$ionicSlideBoxDelegate.previous();
	};

	$scope.addFavorite = function(){
		var req = {
      method: 'POST',
      url: CONFIG.serverUrl + 'api/utilisateur/favori/' + $scope.modalData.Id,
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      }
    }
    $http(req)
      .then(function(response){
        console.log("Add to favorites");
      }, function(response){
        alert( "Problème d'envoi au serveur: " + JSON.stringify({response: response}));
      });
	}

	$scope.removeFavorite = function(){
		var req = {
      method: 'DEL',
      url: CONFIG.serverUrl + 'api/utilisateur/favori/' + $scope.modalData.Id,
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      }
    }
    $http(req)
      .then(function(response){
        console.log("Remove from favorites");
      }, function(response){
        alert( "Problème d'envoi au serveur: " + JSON.stringify({response: response}));
      });
	}

});
