'use strict';

define(['angular', 'settings.app', 'hierarchyMenu.controllers'], function (angular) {

    var app = angular.module('HierarchyMenu.directives', ['Settings', 'HierarchyMenu.controllers']);

    var moduleName = 'hierarchy-menu';

    app.directive('hierarchyMenu', function (settingsService) {
        return {
            templateUrl: settingsService.sharedFolder() + moduleName + '/templates/main.html'
        };
    });

    return app;
});