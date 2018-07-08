/*global define*/
'use strict';

define(
    [
        'angular',
        'kendoGrid.controllers',
        'kendoGrid.directives',
        'kendoGrid.services'
    ], function (angular) {

        return angular.module(
            'KendoGrid',
            [
                'KendoGrid.controllers',
                'KendoGrid.directives',
                'KendoGrid.services'
            ]);
});