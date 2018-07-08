/*global define*/
'use strict';

define(['angular', 'settings.app'], function (angular) {

    var app = angular.module('SalaryCalculator.services', ['Settings']);

    app.factory('salaryCalculatorService', function ($http, settingsService) {

        var salaryCalculatorService = {};

        salaryCalculatorService.getSalaryInfo = function(employeeId, month, recalculate) {

            var data = {
                employee_id: employeeId,
                month: month,
                recalculate: recalculate
            };

            return $http.post(settingsService.siteRoot() + 'SalesSalary/GetSalary', data);
        }

        salaryCalculatorService.indicatorReportUrl = function(indicatorId, displayIndex, employeeId, dateStrDMY, isLastMonth) {

            var date = Date.StrDMYtoDate(dateStrDMY);

            // TODO: переход на план-фактный анализ. Заменить, когда починим его
            var url = settingsService.siteRoot()
                + 'PlanFactReport'
                + '?indicator=' + indicatorId
                + '&displayIndex=' + displayIndex
                + '&date=' + date.toServerFormat()
                + '&employee=' + employeeId
                + '&periodType=3';

            if (isLastMonth) {
                url += '&lastMonth=true';
            }


            //var url = settingsService.siteRoot()
            //    + 'SalesIndicatorReportOLAP/Contact'
            //    + '?indicator=' + indicatorId
            //    + '&date=' + date.toServerFormat()
            //    + '&periodType=3';

            //if (isLastMonth) {
            //    url += '&lastMonth=true';
            //}

            return url;
        }

        salaryCalculatorService.saveBonusPayedMaxPercent = function (data) {

            return $http.post(settingsService.siteRoot() + 'SalesSalary/SetPayedMaxPercent', data);
        }

        salaryCalculatorService.saveSalaryParts = function (data) {

            return $http.post(settingsService.siteRoot() + 'SalesSalary/SaveSalaryParts', data);
        }

        salaryCalculatorService.copySalaryPartsByPrevMonths = function(data) {

            return $http.post(settingsService.siteRoot() + 'SalesSalary/CopySalaryPartsByPrevMonths', data);
        }

        salaryCalculatorService.addSalaryFine = function (data) {

            return $http.post(settingsService.siteRoot() + 'SalesSalary/AddSalaryFine', data);
        }

        salaryCalculatorService.saveSalaryFine = function (data) {

            return $http.post(settingsService.siteRoot() + 'SalesSalary/EditSalaryFine', data);
        }

        salaryCalculatorService.deleteSalaryFine = function (data) {

            return $http.post(settingsService.siteRoot() + 'SalesSalary/DeleteSalaryFine', data);
        }

        salaryCalculatorService.SetToLower = function (data) {

            return $http.post(settingsService.siteRoot() + 'SalesSalary/SetToLower', data);
        }
        
        return salaryCalculatorService;
    });

    return app;
});