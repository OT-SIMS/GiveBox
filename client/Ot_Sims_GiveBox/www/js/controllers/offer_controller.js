angular.module('starter.controllers.Offer', [])

.controller('OfferCtrl', function($scope, $ionicModal, $ionicLoading, $log, $http, $ionicSlideBoxDelegate, CONFIG) {
	$scope.data = {};
	$scope.$watch('data.slider', function(nv, ov) {
		$scope.slider = $scope.data.slider;
	})
	
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
		console.log("sendNewComment :" + $scope.offerData.newComment);
		
		var req = {
			method: 'POST',
			url: CONFIG.serverUrl + 'api/offres/discussion/' + $scope.modalData.Id,
			headers: {
			'content-type': 'application/json',
			'accept': 'application/json'
			},
			data: $scope.offerData.newComment
		}
		
		$http(req).then(function(dataServer){
			$scope.offerData.newComment = '';
		}, function(data){
			console.log("Problème d'envoi de la requête.");
			//alert( "Problème d'envoi au serveur: " + JSON.stringify({data: data}));
		});
		
		
	}
	
	$scope.next = function() {
		$ionicSlideBoxDelegate.next();
	};
	
	$scope.previous = function() {
		$ionicSlideBoxDelegate.previous();
	};
});
