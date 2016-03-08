angular.module('starter.controllers.Login', [])

.controller('LoginCtrl', function($scope, $ionicModal, authService, $ionicPopup, $http, CONFIG) {

  $scope.loginData = {};

  $scope.getMoreUserInfos = function() {
    console.log('getMoreUserInfos');
    var req = {
			 method: 'GET',
			 url: CONFIG.serverUrl + 'api/Utilisateur',
		}

    $http(req).then(function(response){
      if(response.status == '204'){
        console.log('complete infos needed');
      }
      else {
        console.log('infos ok');
      }
    }, function(response){
			console.log("Problème d'envoi de la requête.");
			alert( "Problème d'envoi au serveur: " + JSON.stringify({response: response}));
		});
  }

  $scope.doLogin = function() {
    authService.login($scope.loginData).then(function (response) {
      $scope.closeProfile();

      //Once we get the user email, we need to get more informations from him or from the server
      $scope.getMoreUserInfos();

      //$scope.userConnected.userName = response.userName;
    },
    function (err) {
      //$scope.message = err.error_description;
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'We do not know why!'
      });
      return;
    });
  };

});
