angular.module('starter.controllers.CompleteProfile', [])

.controller('CompleteProfileCtrl', function($scope, $ionicModal, authService, $ionicPopup, $http, CONFIG) {

  $scope.completion = {};

  $scope.completeProfileOnServer = function() {
      var profileData = {
        "nom": $scope.completion.lastName,
        "prenom" : $scope.completion.firstName,
        "datenaissance" : $scope.completion.birthDate,
        "telephone" : $scope.completion.phoneNumber
      }

      var req = {
         method: 'POST',
         url: CONFIG.serverUrl + 'api/Utilisateur',
         headers: {
           'content-type': 'application/json',
           'accept': 'application/json'
         },
         data: profileData
      }

    $http(req).then(function (response) {
      //TODO
      alert("Infos completed with success !")
    },
    function (err) {
      //$scope.message = err.error_description;
      var alertPopup = $ionicPopup.alert({
        title: 'Problème lors de la saisie des informations!',
        template: 'Veuillez réessayer !'
      });
    });

  };

});