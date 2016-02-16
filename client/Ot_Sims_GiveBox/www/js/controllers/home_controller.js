angular.module('starter.controllers.Home', [
])

.controller('HomeCtrl', function($scope, $http, $ionicModal, $cordovaCamera, $cordovaCapture, $cordovaGeolocation){
  var req = {
     method: 'GET',
     url: 'http://yoda.rispal.info/givebox/api/offres',
     headers: {
       'Content-Type': 'application/json',
       'accept': 'application/json'
     }
  }

  /*$http(req)
    .then(function(response){
      $scope.items=response.data;
    }, function(response){
      alert( "Problème d'envoi au serveur: " + JSON.stringify({response: response}));
    });*/
  //id
  //objet utilistaur id nom
  //titre
  //description
  //objet categrorie nom parent
  //latitude
  //longitude
  //liste de fichiers

  $scope.items = [
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
  ]
});
