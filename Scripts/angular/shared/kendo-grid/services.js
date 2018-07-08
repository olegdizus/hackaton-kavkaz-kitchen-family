/*global define*/
'use strict';

define(['angular', 'settings.app'], function (angular) {

    var app = angular.module('KendoGrid.services', ['Settings']);

    app.factory('kendoGridService', function ($http, settingsService) {

        var kendoGridService = {};

        kendoGridService.getGridDataArray = function (url, data) {

            return $http.post(settingsService.siteRoot() + url, data);
        }

        return kendoGridService;
    });

    return app;
});