angular.module('starter.controllers.UpdateProfile', [])

.controller('UpdateProfileCtrl', function($scope, $ionicModal, $ionicSlideBoxDelegate, authService) {

  $scope.updateValue=0;

  $scope.updateElement = function(to){
    if($scope.updateValue==to){
      $scope.updateValue=0;
    }
    else{
      $scope.updateValue=to;
    }
  };

  $scope.closeUpdateProfile = function() {
    $scope.modal.hide();
    $ionicModal.fromTemplateUrl('templates/profile.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.modal.show();
    });
  };

  $scope.userData = null;
  $scope.validateUpdate = function() {
    if (!$scope.userData){
      $scope.closeUpdateProfile();
    }
    else{
      console.log($scope.userData);
    }
  };

  $scope.logOutFromProfile = function(){
    $scope.modal.remove()
    .then(function() {
      $scope.modal = null;
    });

    authService.logOut();
  };

});
