angular.module('starter.controllers.Profile', [])

.controller('ProfileCtrl', function($scope, $ionicModal, $ionicSlideBoxDelegate, authService, $http, CONFIG, localStorageService) {

  $scope.$myIndex = 0;

  $scope.closeProfile = function() {
    $scope.modal.hide();
  };

  $scope.slideHasChanged = function($index){
    $scope.$myIndex=$index;
  };

  $scope.changeIndex = function(to){
    $ionicSlideBoxDelegate.slide(to);
  }

  $scope.updateProfile = function(){
    $scope.modal.hide();
    $ionicModal.fromTemplateUrl('templates/updateProfile.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.modal.show();
    });
  }

  $scope.myOffers={};
  $scope.getMyOffers = function(){
    var req = {
      method: 'GET',
      url: CONFIG.serverUrl + 'api/utilisateur/offres',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      }
    }
    $http(req)
      .then(function(response){
        $scope.myOffers=response.data;
      }, function(response){
        alert( "Problème d'envoi au serveur: " + JSON.stringify({response: response}));
      });
  }

  $scope.openOffer = function(offer){
    var markerOptions = {
      latitude : offer.Latitude,
      longitude : offer.LOngitude
    };
    $scope.modalData  = offer;
    $scope.modalData.marker = markerOptions;
    $scope.modal.hide();
    $ionicModal.fromTemplateUrl('templates/offer.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.modal.show();
    });
  }

  $scope.closeOffer = function() {
    $scope.modal.hide();
    $ionicModal.fromTemplateUrl('templates/Profile.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.modal.show();
    });
  };

  $scope.getMyOffers();



});
