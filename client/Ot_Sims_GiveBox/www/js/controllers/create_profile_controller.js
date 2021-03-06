angular.module('starter.controllers.CreateProfile', [])

.controller('CreateProfileCtrl', function($scope, $ionicModal, authService, $ionicPopup) {

  $scope.registration = {};

  $scope.createProfileOnServer = function() {
    authService.saveRegistration($scope.registration).then(function (response) {
      //TODO
      $ionicModal.fromTemplateUrl('templates/profile.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modal = modal;
      });
      $scope.modal.hide();
      $scope.openProfile();
    },
    function (err) {
      //$scope.message = err.error_description;
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'We do not know why!'
      });
    });

  };

});
