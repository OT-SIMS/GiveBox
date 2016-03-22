angular.module('starter.controllers.CompleteProfile', [])

.controller('CompleteProfileCtrl', function($scope, $ionicModal, authService, $ionicPopup, $http, CONFIG, authService, localStorageService) {

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
      console.log("Infos completed with success !");
      var myAvatar;
      if(response.data.Fichier==null){
        myAvatar= "img/no_avatar.jpg";
        authService.authentication.userAvatar = "img/no_avatar.jpg";
      }
      else{
        myAvatar = response.data.Fichier.url;
        authService.authentication.userAvatar = response.data.Fichier.url;
      }
      localStorageService.set('userData', { firstName: $scope.completion.firstName, lastName: $scope.completion.lastName, birthDate: $scope.completion.birthDate, telephone: $scope.completion.phoneNumber, avatar: myAvatar });

      authService.authentication.userLastName = $scope.completion.lastName;
      authService.authentication.userFirstName = $scope.completion.firstName;
      authService.authentication.userBirthDate = $scope.completion.birthDate;
      authService.authentication.userTelephone = $scope.completion.phoneNumber;
      $scope.modal.hide();
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
