'use strict';
angular.module('starter.services.AuthInterceptor', [])

.factory('authInterceptorService', ['$q', '$location', 'localStorageService', 'CONFIG', function ($q, $location, localStorageService, CONFIG) {
    var authInterceptorServiceFactory = {};
    var _request = function (config) {
        if(config.url.search(CONFIG.googleapis) == 0){
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
            $location.path('/login');
        }
        return $q.reject(rejection);
    }

    authInterceptorServiceFactory.request = _request;
    authInterceptorServiceFactory.responseError = _responseError;

    return authInterceptorServiceFactory;
}]);
