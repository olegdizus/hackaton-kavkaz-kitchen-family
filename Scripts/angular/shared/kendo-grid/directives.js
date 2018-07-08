'use strict';

define([
    'angular',
    'settings.app',
    'kendo',
    'kendoGrid.controllers'
    ], function (angular) {

    var app = angular.module(
            'KendoGrid.directives',
            [
                'Settings',
                'KendoGrid.controllers',
                'kendo.directives'
            ]);

    var moduleName = 'kendo-grid';

    app.directive('kendoGridTable', function (settingsService) {

        var pathToFolder = settingsService.sharedFolder() + moduleName;

        return {
            templateUrl: pathToFolder + '/templates/main.html',
            scope: {
                urlGridColumns: '@',    // односторонний биндинг
                urlDataRows: '@',
                urlDataWrite: '@',
                loadOnShow: '@',
                postData: '='           // двусторонний биндинг
            }
    };
    });

    return app;
});