angular.module('starter.controllers.Home', [
])

.controller('HomeCtrl', function($scope, $http, $ionicModal, $cordovaCamera, $cordovaCapture, $cordovaGeolocation){
  $scope.getAllOffers = function(){
      var req = {
       method: 'GET',
       url: 'http://yoda.rispal.info/givebox/api/offres',
       headers: {
         'Content-Type': 'application/json',
         'accept': 'application/json'
       }
    }

    $http(req)
      .then(function(response){
        $scope.items=response.data;
        console.log(response.data);
      }, function(response){
        alert( "Problème d'envoi au serveur: " + JSON.stringify({response: response}));
      });

  }

  $scope.keyWordsResearch = function(keyword){
    if(keyword!=undefined){
      var req = {
         method: 'GET',
         url: 'http://yoda.rispal.info/givebox/api/offres/'+keyword,
         headers: {
           'Content-Type': 'application/json',
           'accept': 'application/json'
         }
      }

      $http(req)
        .then(function(response){
          $scope.items=response.data;
        }, function(response){
          alert( "Problème d'envoi au serveur: " + JSON.stringify({response: response}));
        });
    } else{
      $scope.getAllOffers();
    }
  }

  $scope.getAllOffers();

  $ionicModal.fromTemplateUrl('templates/offer.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openOffer = function(offer){
    $scope.modalData  = offer;
    $scope.modal.show();
  }

  $scope.closeOffer = function() {
    $scope.modal.hide();
  };


  /*$scope.items = [
    {img: 'img/pokemon_tshirt.jpg'},
    {img: 'img/pokemon_socks.jpg'},
    {img: 'img/pokemon_cards.jpg'},
    {img: 'img/pokemon_cap.jpg'},
    {img: 'img/pokemon_socks.jpg'},
    {img: 'img/pokemon_tshirt.jpg'},
    {img: 'img/pokemon_cap.jpg'},
    {img: 'img/pokemon_cards.jpg'},
    {img: 'img/pokemon_tshirt.jpg'},
    {img: 'img/pokemon_socks.jpg'},
    {img: 'img/pokemon_cards.jpg'},
    {img: 'img/pokemon_cap.jpg'},
    {img: 'img/pokemon_socks.jpg'},
    {img: 'img/pokemon_tshirt.jpg'},
    {img: 'img/pokemon_cap.jpg'},
    {img: 'img/pokemon_cards.jpg'}
  ]*/
});
