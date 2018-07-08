'use strict';

define(['angular', 'kendoGrid.services'], function (angular) {

    var app = angular.module('KendoGrid.controllers', ['KendoGrid.services']);

    app.controller('kendoGridController', function ($scope, $timeout, kendoGridService) {

        // Массивы столбцов и строк данных
        $scope.gridColumns = new kendo.data.ObservableArray([]);
        $scope.gridItems = new kendo.data.ObservableArray([]);

        // Настройки кендо грида
        $timeout(function() {
            $scope.gridOptions = {
                sortable: true,
                selectable: true,
                columns: $scope.gridColumns,
                dataSource: new kendo.data.DataSource({
                    data: $scope.gridItems
                })
            };
        }, 500);

        $scope.updateDataArray = function(url, scopeProperty, afterLoadCallback) {

            var data = $scope.postData;

            kendoGridService
                .getGridDataArray(url, data)
                .then(
                    function (response) {

                        $scope[scopeProperty].empty();
                        $scope[scopeProperty].push.apply($scope[scopeProperty], response.data);

                        if (afterLoadCallback != null) {
                            afterLoadCallback();
                        }
                    })
                .catch(function (response) {
                        console.log('ошибка: ' + response);
                    }
                );
        }

        $scope.setEditableColumn = function() {
            
            if (typeof $scope.urlDataWrite != 'undefined'
                && $scope.urlDataWrite.length > 0) {

                var commandColumn = {
                    command: {
                        field: "command",
                        title: "&nbsp;",
                        name: "&nbsp;",
                        text: {
                            edit: "",
                            update: "",
                            cancel: ""
                        }
                    }
                };

                // TODO: разобраться и доделать
//                $scope.gridColumns.push(commandColumn);
            }
        }

        $scope.$watch('postData', function (newVal, oldVal) {

            if (newVal !== oldVal) {
                $scope.updateDataArray($scope.urlDataRows, 'gridItems');
            }
        }, true);

        $scope.init = function() {
            
            $scope.updateDataArray($scope.urlGridColumns, 'gridColumns', $scope.setEditableColumn);

            if ($scope.loadOnShow) {
                $scope.updateDataArray($scope.urlDataRows, 'gridItems');
            }
        }

        $scope.init();
    });

    return app;
});