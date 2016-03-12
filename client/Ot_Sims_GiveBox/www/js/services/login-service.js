'use strict';
angular.module('starter.services.Login', [])

.service('loginService', function($ionicModal, $rootScope) {
  var init = function(tpl, $scope) {
	  console.log("init");

    var promise;
    $scope = $rootScope.$new();
	
    promise = $ionicModal.fromTemplateUrl(tpl, {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      modal.show();
      return modal;
    });

    $scope.openModal = function() {
       $scope.modal.show();
     };
     $scope.closeModal = function() {
       $scope.modal.hide();
     };
     $scope.$on('$destroy', function() {
       $scope.modal.remove();
     });
	
    return promise;
  }

  return {
    init: init
  }
})