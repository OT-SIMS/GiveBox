angular.module('starter.controllers.UpdateProfile', [])

.controller('UpdateProfileCtrl', function($scope, $ionicModal, $ionicSlideBoxDelegate, authService, CONFIG, $http, localStorageService, $cordovaCamera, $cordovaCapture) {

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

  $scope.importAPhoto = function() {
    var options = {
      allowEdit: false,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: Camera.EncodingType.JPEG,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function(imageURI) {
      console.log(imageURI);
      $scope.avatarURL= imageURI;
    }, function(err) {
      console.log("Erreur pour importer une photo : " + err);
    });
  };

  $scope.takeAPhoto = function() {
    var options = {
      allowEdit: true,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.JPEG,
      saveToPhotoAlbum: true
    };

    $cordovaCamera.getPicture(options).then(function(imageURI) {
      console.log(imageURI);
      $scope.avatarURL= imageURI;
    }, function(err) {
      console.log("Erreur pour prendre une photo : " + err);
    });
  };

  $scope.sendAvatar = function(){
    var options = new FileUploadOptions();
    options.fileKey = "1_0";
    options.name = "1_0";
    options.httpMethod = "POST";

    var headers={
      'accept': 'application/json'
    };

    options.headers = headers;

    var ft = new FileTransfer();

    var authData = localStorageService.get('authorizationData');
    if (authData) {
      options.headers.Authorization = 'Bearer ' + authData.token;
    }

    ft.upload($scope.avatarURL, encodeURI(CONFIG.serverUrl + "api/fichiers/"), null, null, options);

    localStorageService.set('userData', { firstName: authService.authentication.userFirstName, lastName: authService.authentication.userLastName, birthDate: authService.authentication.userBirthDate, telephone: authService.authentication.userTelephone, avatar: $scope.avatarURL });
    authService.authentication.userAvatar = $scope.avatarURL;
  };

  $scope.userData = {};
  $scope.validateUserNames = function() {
    var req = {
      method: 'POST',
      url: CONFIG.serverUrl + 'api/utilisateur',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      data: {"nom": $scope.userData.Nom,
             "prenom": $scope.userData.Prenom,
             "telephone": authService.authentication.userTelephone,
             "dateNaissance": authService.authentication.userBirthDate
            }
    }
    $http(req)
      .then(function(response){
        console.log("Name updated");
        localStorageService.set('userData', { firstName: $scope.userData.Prenom, lastName: $scope.userData.Nom, birthDate: authService.authentication.userBirthDate, telephone: authService.authentication.userTelephone, avatar: authService.authentication.userAvatar });
        authService.authentication.userLastName = $scope.userData.Nom;
        authService.authentication.userFirstName = $scope.userData.Prenom;
        $scope.closeUpdateProfile();
      }, function(response){
        alert( "Problème d'envoi au serveur: " + JSON.stringify({response: response}));
      });
  };

  $scope.validateUserPasswords = function() {
    authService.changePassword($scope.userData.password)
      .then(function(response){
        console.log("Password updated");
        $scope.closeUpdateProfile();
      }, function(response){
        alert( "Problème d'envoi au serveur: " + JSON.stringify({response: response}));
      });
  };

  $scope.logOutFromProfile = function(){
    $scope.modal.remove()
    .then(function() {
      $scope.modal = null;
    });

    authService.logOut();
  };

});
