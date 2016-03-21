'use strict';
angular.module('starter.services.Auth', [])

.factory('authService', ['$http', '$q', 'localStorageService', 'CONFIG', function ($http, $q, localStorageService, CONFIG) {

    var serviceBase = CONFIG.serverUrl ;
    var authServiceFactory = {};

    var _authentication = {
        isAuth: false,
        userName: "",
        userLastName: "",
        userFirstName: "",
        userAvatar: "",
        userBirthDate: "",
        userTelephone: ""
    };

    var _saveRegistration = function (registration) {

        _logOut();

        return $http.post(serviceBase + 'api/account/register', registration).then(function (response) {
            return response;
        });

    };

    var _changePassword = function (passwords) {
        return $http.post(serviceBase + 'api/account/ChangePassword', passwords).then(function (response) {
            return response;
        });
    }

    var _login = function (loginData) {

        var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;

        var deferred = $q.defer();

        $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

            localStorageService.set('authorizationData', { token: response.access_token, userName: loginData.userName });

            _authentication.isAuth = true;
            _authentication.userName = loginData.userName;
            console.log(response);

            deferred.resolve(response);

        }).error(function (err, status) {
            _logOut();
            deferred.reject(err);
        });

        return deferred.promise;

    };

    var _logOut = function () {

        localStorageService.remove('authorizationData');
        localStorageService.remove('userData');

        _authentication.isAuth = false;
        _authentication.userName = "";
        _authentication.userLastName = "";
        _authentication.userFirstName = "";
        _authentication.userAvatar = "";
        _authentication.userBirthDate = "";
        _authentication.userTelephone = "";


    };

    var _fillAuthData = function () {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            _authentication.isAuth = true;
            _authentication.userName = authData.userName;
        }
    }

    var _fillUserData = function (){

      var userData = localStorageService.get('userData');
      if(userData){
        _authentication.userFirstName = userData.firstName;
        _authentication.userLastName = userData.lastName;
        _authentication.userBirthDate = userData.birthDate;
        _authentication.userTelephone = userData.telephone;
        _authentication.userAvatar = userData.avatar;
      }
    }

    authServiceFactory.saveRegistration = _saveRegistration;
    authServiceFactory.login = _login;
    authServiceFactory.logOut = _logOut;
    authServiceFactory.fillAuthData = _fillAuthData;
    authServiceFactory.fillUserData = _fillUserData;
    authServiceFactory.authentication = _authentication;
    authServiceFactory.changePassword = _changePassword;


    return authServiceFactory;
}]);
