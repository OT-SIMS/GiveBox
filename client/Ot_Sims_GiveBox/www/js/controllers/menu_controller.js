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

  }
);
