/*global define*/
'use strict';

define(
    [
        'angular',
        'hierarchyMenu.controllers',
        'hierarchyMenu.directives',
        'hierarchyMenu.services'
    ], function (angular) {

        return angular.module(
            'HierarchyMenu',
            [
                'HierarchyMenu.controllers',
                'HierarchyMenu.directives',
                'HierarchyMenu.services'
            ]);
});