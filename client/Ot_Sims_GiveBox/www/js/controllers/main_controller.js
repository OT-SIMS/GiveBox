angular.module('starter.controllers.Main', [])

.controller('MainCtrl', function($scope, $state, $http, $ionicModal, $cordovaCamera, $cordovaCapture, $cordovaGeolocation, $location, authService){

  $scope.logOut = function () {
    authService.logOut();
  }

  $scope.authentication = authService.authentication;

});
