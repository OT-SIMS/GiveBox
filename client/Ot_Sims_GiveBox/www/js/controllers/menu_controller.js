angular.module('starter.controllers.Menu', [])

.controller('MenuCtrl', function($scope, $state, $http, $ionicModal, $cordovaCamera, $cordovaCapture, $cordovaGeolocation, $location, authService){

  $scope.$state = $state;

  $scope.vmCategories = {
    myValue: false,
    toggle: function() {
        this.myValue = !this.myValue;
    }
  };

  $scope.vm = {
    myValue: false,
    toggle: function() {
        this.myValue = !this.myValue;
    }
  };

  $scope.openLogin = function(){
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.modal.show();
    });
  };

  $scope.openProfile = function(){
    $ionicModal.fromTemplateUrl('templates/profile.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.modal.show();
    });
  };

  authService.fillUserData();
});
