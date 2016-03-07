angular.module('starter.controllers.Menu', [])

.controller('MenuCtrl', function($scope, $state, $http, $ionicModal, $cordovaCamera, $cordovaCapture, $cordovaGeolocation, $location, authService){

  $scope.$state = $state;

  $scope.vm = {
    myValue: false,
    toggle: function() {
        this.myValue = !this.myValue;
    }
  };

    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });
    /*
    $ionicModal.fromTemplateUrl('templates/profile.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });
    */

  $scope.openProfile = function(){
    //$scope.modalData  = offer;
    $scope.modal.show();
  };

  $scope.closeProfile = function() {
    $scope.modal.hide();
  };

});
