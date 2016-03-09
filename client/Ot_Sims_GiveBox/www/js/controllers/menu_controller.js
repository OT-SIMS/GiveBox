angular.module('starter.controllers.Menu', [])

.controller('MenuCtrl', function($scope, $state, $http, $ionicModal, $cordovaCamera, $cordovaCapture, $cordovaGeolocation, $location, authService){

  $scope.$state = $state;
  $scope.userConnected = {};
  $scope.userConnected.userName = 'Invité';

  $scope.vm = {
    myValue: false,
    toggle: function() {
        this.myValue = !this.myValue;
    }
  };



    /*
    $ionicModal.fromTemplateUrl('templates/profile.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });
    */

    $scope.setDefaultLoginTemplate = function() {
      $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modal = modal;
      });
    }

    $scope.setDefaultLoginTemplate();

  $scope.openProfile = function(){
    //$scope.modalData  = offer;
    $scope.modal.show();
  };

  $scope.closeProfile = function() {
    $scope.modal.hide();
    $scope.setDefaultLoginTemplate();
  };

  $scope.createProfile = function() {
    $scope.modal.hide();

    $ionicModal.fromTemplateUrl('templates/createProfile.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.modal.show();
    });
  };

  $scope.completeProfile = function() {
    $scope.modal.hide();

    $ionicModal.fromTemplateUrl('templates/completeProfile.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.modal.show();
    });
  };

});
