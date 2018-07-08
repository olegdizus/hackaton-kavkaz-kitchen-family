'use strict';

define(['angular', 'hierarchyMenu.services'], function (angular) {

    var app = angular.module('HierarchyMenu.controllers', ['HierarchyMenu.services']);

    app.controller('hierarchyMenuController', function ($scope, $rootScope, hierarchyMenuService) {

        $scope.menuItems = [];
        $scope.selectedItemId = 0;

        $scope.getItemStyle = function (item) {
            return { "padding-left": item.padding };
        }

        $scope.updateMenuItems = function() {

            $scope.menuItems = hierarchyMenuService.getElements()
                .then(function (response) {

                    $scope.menuItems = response.data;
                })
                .catch(function (error) {

                    console.log(error);
                });
        }

        $scope.selectMenuItem = function(item) {
            $scope.selectedItemId = item.id;

            $rootScope.$broadcast('hierarchyMenu.itemChange', item);
        }

        $scope.updateMenuItems();
    });

    return app;
});