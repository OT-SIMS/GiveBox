angular.module('starter.controllers.Login', [])

.controller('LoginCtrl', function($scope, $ionicModal, authService, $ionicPopup, $http, CONFIG) {

  $scope.loginData = {};

  $scope.closeProfile = function() {
    $scope.modal.hide();
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

  $scope.getMoreUserInfos = function() {
    console.log('getMoreUserInfos');
    var req = {
			 method: 'GET',
			 url: CONFIG.serverUrl + 'api/Utilisateur',
		}

    $http(req).then(function(response){
      if(response.status == '204'){
        console.log('complete infos needed');
        $scope.completeProfile();
      }
      else {
        console.log(response.data);
        authService.authentication.userLastName = response.data.Nom;
        authService.authentication.userFirstName = response.data.Prenom;

      }
    }, function(response){
			console.log("Problème d'envoi de la requête.");
			alert( "Problème d'envoi au serveur: " + JSON.stringify({response: response}));
		});
  }

  $scope.doLogin = function() {
    authService.login($scope.loginData).then(function (response) {

      //Once we get the user email, we need to get more informations from him or from the server
      $scope.getMoreUserInfos();
      $scope.modal.hide();
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
