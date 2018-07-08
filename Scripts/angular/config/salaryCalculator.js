'use strict';

requirejs.config({

    waitSeconds: 60,

    paths: {

//        "jquery": "../lib/jquery.min",
        "angular": "../lib/angular.min",

//        "kendo": "../lib/kendo.all.min",
//        "kendo.ru-RU": "../lib/kendo.ru-RU",
//        "angular.kendo": "../lib/angular.kendo",


        "settings.app": "../shared/settings/app",

        "salaryCalculator.app": "../modules/salary-calculator/app",
        "salaryCalculator.directives": "../modules/salary-calculator/directives",
        "salaryCalculator.controllers": "../modules/salary-calculator/controllers",
        "salaryCalculator.services": "../modules/salary-calculator/services",

//        "kendoGrid.app": "../shared/kendo-grid/app",
//        "kendoGrid.directives": "../shared/kendo-grid/directives",
//        "kendoGrid.controllers": "../shared/kendo-grid/controllers",
//        "kendoGrid.services": "../shared/kendo-grid/services",

        "hierarchyMenu.app": "../shared/hierarchy-menu/app",
        "hierarchyMenu.directives": "../shared/hierarchy-menu/directives",
        "hierarchyMenu.controllers": "../shared/hierarchy-menu/controllers",
        "hierarchyMenu.services": "../shared/hierarchy-menu/services",
    },

    shim: {
        "angular": {
            deps: [
                //"jquery"
            ],
            exports: "angular"
        },
//        "kendo": {
//            deps: [
//                "jquery"
//            ],
//            exports: "kendo"
//        },
//        "kendo.ru-RU": {
//            deps: [
//                "kendo"
//            ]
//        },
        "salaryCalculator.app": {
            deps: [
                "angular"
            ]
        }
    }
});

require(
    [
        'angular',
      //  'jquery',
//        'kendo',
//        'kendo.ru-RU',
//        'angular.kendo',

        'salaryCalculator.app',
        'salaryCalculator.directives',
        'salaryCalculator.controllers',
        'salaryCalculator.services',

//        'kendoGrid.app',
//        'kendoGrid.directives',
//        'kendoGrid.controllers',
//        'kendoGrid.services',

        'hierarchyMenu.app',
        'hierarchyMenu.directives',
        'hierarchyMenu.controllers',
        'hierarchyMenu.services',

        'settings.app'
    ], function (angular) {

    angular.bootstrap(document, ['SalaryCalculator']);
});