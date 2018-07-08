'use strict';

define(['angular', 'settings.app', 'hierarchyMenu.directives'], function (angular) {

    var app = angular.module('SalaryCalculator.directives', ['Settings', 'HierarchyMenu.directives']);

    var moduleName = 'salary-calculator';

    app.directive('salaryCalculatorMain', function ($timeout, settingsService) {
        return {
            templateUrl: settingsService.modulesFolder() + moduleName + '/templates/main.html',
            link: function (scope, element, attrs) {

                $timeout(function () {
                    whenAngularLoaded();
                });
            }
        };
    });

    return app;
});