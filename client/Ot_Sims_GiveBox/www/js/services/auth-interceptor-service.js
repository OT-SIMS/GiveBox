'use strict';
angular.module('starter.services.AuthInterceptor', [])

.factory('authInterceptorService', ['$q', '$location','$injector', 'localStorageService', 'CONFIG', function ($q, $location, $injector, localStorageService, CONFIG) {
    var authInterceptorServiceFactory = {};
    var _request = function (config) {
        if(config.url.search(CONFIG.googleapis) == 0){
          //Do not change the request when reaching googleapi
          return config;
        }
        if(config.url.search('token')!=-1){
          //Do not change the request in case of login
          return config;
        }

        config.headers = config.headers || {};

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            config.headers.Authorization = 'Bearer ' + authData.token;
        }

        return config;
    }

    var _responseError = function (rejection) {
        if (rejection.status === 401) {
          //console.log($rootScope);
            //$location.path('/login');
            var auth = $injector.get('loginService');
                  return auth.Login();
                  if (!auth.LoggedIn) {
                    return auth.Login();
                  }
        }
        return $q.reject(rejection);
    }

    authInterceptorServiceFactory.request = _request;
    authInterceptorServiceFactory.responseError = _responseError;

    return authInterceptorServiceFactory;
}]);
