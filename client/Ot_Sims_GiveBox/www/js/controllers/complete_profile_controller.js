angular.module('starter.controllers.CompleteProfile', [])

.controller('CompleteProfileCtrl', function($scope, $ionicModal, authService, $ionicPopup) {

  $scope.registration = {};

  $scope.createProfile = function() {
    authService.saveRegistration($scope.registration).then(function (response) {
      //TODO
      $ionicModal.fromTemplateUrl('templates/profile.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modal = modal;
      });
      $scope.openProfile();
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
