'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
    // Init module configuration options
    var applicationModuleName = 'CustomerCareApp';
    var applicationModuleVendorDependencies = ['ngAria', 'base64', 'gettext', 'LocalStorageModule', 'ngMessages', 'ngTouch', 'ui.router', 'angular-data.DSCacheFactory', 'ngRetina'];

    // Add a new vertical module
    var registerModule = function(moduleName) {
        console.log('Register Module: ' + moduleName);
        // Create angular module
        angular
            .module(moduleName, []);

        // Add the module to the AngularJS configuration file
        angular
            .module(applicationModuleName)
            .requires
            .push(moduleName);
    };

    return {
        applicationModuleName: applicationModuleName,
        applicationModuleVendorDependencies: applicationModuleVendorDependencies,
        registerModule: registerModule
    };
})();
