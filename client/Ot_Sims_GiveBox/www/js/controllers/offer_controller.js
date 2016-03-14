angular.module('starter.controllers.Offer', [])

.controller('OfferCtrl', function($scope, $ionicModal, $ionicLoading, $log, $ionicSlideBoxDelegate) {
	$scope.slideIndex = 0;
	
	var SLIDES = {
		description : 0,
		map : 1
	}
	
	$scope.optionsSlides = {
		loop: false,
		//effect: fade,
		speed: 500,
	}
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
	
	$scope.slideChanged = function(index) {
		$scope.slideIndex = index;
		
		if(index==SLIDES.map){
			//Update map content : center and marker
			$scope.map.center.latitude = $scope.modalData.Latitude;
			$scope.map.center.longitude = $scope.modalData.Longitude;
			
			$scope.marker.coords.latitude = $scope.modalData.Latitude;
			$scope.marker.coords.longitude = $scope.modalData.Longitude;
			
			$scope.marker.options.labelContent = $scope.modalData.Titre;
		}
	};
	
	$scope.next = function() {
		$ionicSlideBoxDelegate.next();
	};
	
	$scope.previous = function() {
		$ionicSlideBoxDelegate.previous();
	};
});
