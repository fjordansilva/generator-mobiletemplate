'use strict';

angular
    .module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

angular
    .module(ApplicationConfiguration.applicationModuleName)
    .config(['$locationProvider',
        function($locationProvider) {
            $locationProvider.hashPrefix('!');
        }
    ]);

var app = {
    // Application Constructor
    initialize: function() {
        console.log('Bootstrapping!!!');
        if (cordova !== undefined) {
            console.log('Cordova detected, waiting for cordova to start...');
            this.bindEvents();
        } else {
            console.log('Cordova NOT detected, manual bootstrap');
            this.receivedEvent('manual');
        }

    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id + '; App ID: ' + ApplicationConfiguration.applicationModuleName);

        // Start Angular !!
        console.log('Starting AngularJS bootstrap');
        angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
        console.log('Finished AngularJS bootstrap');
    }
};

app.initialize();
