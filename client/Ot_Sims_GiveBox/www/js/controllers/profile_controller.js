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
        console.log(response.data);
      }, function(response){
        console.log( "Problème d'envoi au serveur: " + JSON.stringify({response: response}));
      });
  }

  $scope.myFavorites={};
  $scope.getMyFavorites = function(){
    var req = {
      method: 'GET',
      url: CONFIG.serverUrl + 'api/utilisateur/favori',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      }
    }
    $http(req)
      .then(function(response){
        $scope.myFavorites=response.data;
      }, function(response){
        console.log( "Problème d'envoi au serveur: " + JSON.stringify({response: response}));
      });
  }

  $scope.removeOffer = function(offerID){
		var req = {
      method: 'DEL',
      url: CONFIG.serverUrl + 'api/offres/' + offerID,
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      }
    }
    $http(req)
      .then(function(response){
        console.log("Remove from offers");
      }, function(response){
        console.log( "Problème d'envoi au serveur: " + JSON.stringify({response: response}));
      });
	}

  $scope.removeFavorite = function(offerID){
		var req = {
      method: 'DEL',
      url: CONFIG.serverUrl + 'api/utilisateur/favori/' + offerID,
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      }
    }
    $http(req)
      .then(function(response){
        console.log("Remove from favorites");
      }, function(response){
        console.log( "Problème d'envoi au serveur: " + JSON.stringify({response: response}));
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
  $scope.getMyFavorites();
  authService.fillUserData();

});
