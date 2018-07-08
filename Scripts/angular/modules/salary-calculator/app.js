/*global define*/
'use strict';

define(
    [
        'angular',
        'salaryCalculator.directives',
        'salaryCalculator.controllers',
        'salaryCalculator.services'
    ], function (angular) {

        return angular.module(
            'SalaryCalculator',
            [
                'SalaryCalculator.directives',
                'SalaryCalculator.controllers',
                'SalaryCalculator.services'
            ]);
});