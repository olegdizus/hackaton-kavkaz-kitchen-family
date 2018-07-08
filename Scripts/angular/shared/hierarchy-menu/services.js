/*global define*/
'use strict';

define(['angular', 'settings.app'], function (angular) {

    var app = angular.module('HierarchyMenu.services', ['Settings']);

    app.factory('hierarchyMenuService', function ($http, settingsService) {

        var hierarchyMenuService = {};

        hierarchyMenuService.getElements = function () {

            return $http.post(settingsService.siteRoot() + 'HierarchyMenu/GetHierarchyMenuItems');
        }

        return hierarchyMenuService;
    });

    return app;
});