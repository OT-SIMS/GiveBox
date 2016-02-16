angular.module('starter.controllers.Menu', [
])

.controller('MenuCtrl', function($scope, $http, $ionicModal, $cordovaCamera, $cordovaCapture, $cordovaGeolocation, $location){

  /*console.log($location.url());
  if($location.url()=='/app/home'){
    $scope.searchButton=true;
  }
  else{
    $scope.searchButton=false;
  }*/
  $scope.vm = {
    myValue: false,
    toggle: function() {
        this.myValue = !this.myValue;
    }
  };

  $scope.keyWordsResearch = function(){
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
    }
});
