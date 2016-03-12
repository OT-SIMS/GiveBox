angular.module('starter.controllers.Offer', [])

.controller('OfferCtrl', function($scope, $ionicModal, $ionicLoading, $log, $timeout) {
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
      options: { draggable: true },
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
});
