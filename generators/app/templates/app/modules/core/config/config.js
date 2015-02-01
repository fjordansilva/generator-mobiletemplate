'use strict';

angular
    .module('core')
    .run(function(gettextCatalog) {
  		gettextCatalog.currentLanguage = 'es_ES';
  		gettextCatalog.debug = true;
	});

// log system & debug info
angular
    .module('core')
    .run([
        '$rootScope',
        '$log',
        function($rootScope, $log) {
            $rootScope.$log = $log;
        }
    ]);

angular
    .module('core')
    .config([
        '$compileProvider',
        function($compileProvider) {
            // Remove debug info
            $compileProvider.debugInfoEnabled(false);
        }
    ]);


// Local Storage and cache configuration
angular
    .module('core')
    .config([
        'localStorageServiceProvider',
        'DSCacheFactoryProvider',
        function(localStorageServiceProvider, DSCacheFactoryProvider) {
            console.log("Configuring Local Storage...");
            localStorageServiceProvider
                .setPrefix('CustomerCare')
                .setStorageType('localStorage')
                .setStorageCookie(0, '/')
                .setNotify(false, false)
            ;

            console.log('Configuring Cache...');
            DSCacheFactoryProvider.setCacheDefaults({
                deleteOnExpire: 'aggressive',
                storagePrefix: 'cc.'
            });
        }
    ])
    .run([
        'DSCacheFactory',
        function(DSCacheFactory) {
            var info = DSCacheFactory.info();

            console.log(info.cacheDefaults); // output below

            // Cache configuration
            // TODO: Configuracion de la cache
        }
    ]);

// Error handling
angular
    .module('core')
    .factory('$exceptionHandler', [
        function() {
            return function(exception, cause) {
                console.log('---------------- EXCEPCION ----------------');
                console.log(exception, cause);
            }
        }
    ]);