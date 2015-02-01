'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.LoginController
 * @description Controlador para el Login de la app
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('HomeController', [
        '$scope',
        'localStorageService',
        function($scope, localStorageService) {

            console.log('Home Controller');

            if (localStorageService.isSupported) {
                console.log('Local Storage is supported on ' + device.platform);
            } else {
                console.log('Local Storage is NOT supported on ' + device.platform + '!!!');
            }

            // Dump PUSH info
            console.log('Stored DeviceToken: ' + localStorageService.get('pushToken'));
            console.log('Stored RegistrationID: ' + localStorageService.get('registrationId'));

            
            // TODO: Eliminar estas lineas, es una demo de como mostrar mensajes de log.
            $scope.$log.error('MENSAJE ERROR');
            $scope.$log.warn('MENSAJE WARNING');
            $scope.$log.info('MENSAJE INFO');
            $scope.$log.debug('MENSAJE DEBUG');
            $scope.$log.log('MENSAJE LOG');

            $scope.message = 'Hello Word !!';
        }
    ]);
