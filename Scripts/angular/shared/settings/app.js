/*global define*/
'use strict';

define(['angular'], function (angular) {

    var app = angular.module('Settings', []);

    app.factory('settingsService', function () {

        var settingsService = {};

        settingsService.modulesFolder = function () {
            return window.basePath + 'Scripts/angular/modules/';
        }

        settingsService.sharedFolder = function () {
            return window.basePath + 'Scripts/angular/shared/';
        }

        settingsService.siteRoot = function () {
            return window.basePath;
        }

        return settingsService;
    });

    return app;
});