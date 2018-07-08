'use strict';

define(['angular', 'salaryCalculator.services'], function (angular) {

    var app = angular.module('SalaryCalculator.controllers', ['SalaryCalculator.services']);

    app.controller('salaryCalculatorController', function($scope, salaryCalculatorService) {

            $scope.postData = {};

            $scope.employee = {
                id: 0
            };

            $scope.month = {}

            $scope.salary = {
                id: 0,
                isNeedRecalculate: false,
                canEditSalary: false,
                bonusPartCalculates: 0,
                bonusDetails: [],
                finesDetails: [],
                toLower:false
            };

            $scope.showHierarchyMenu = true;

            //$scope.$on('hierarchyMenu.itemChange', hierarchyMenuitemChange(event, args));

            $scope.$on('hierarchyMenu.itemChange',
                function hierarchyMenuitemChange(event, args) {

                    //console.log("args");
                    //console.log(args);

                    $scope.employee = args;

                    $scope.postData = {
                        id: args.id
                    }

                    $scope.displayHierarchyMenu(false);

                    $scope.getBonusItems(args.id, $scope.month.value);
                }
    );
        $scope.range = function (min, max, step) {

            step = step || 1;
            var resultRange = [];

            for (var i = min; i <= max; i += step) {

                resultRange.push(i);
            }

            return resultRange;
        };

        $scope.displayHierarchyMenu = function(show) {
            $scope.showHierarchyMenu = show;

            if (show) {

                $(document.getElementById("showMenu")).show();
            } else {
                $(document.getElementById("showMenu")).hide();
            }
        }

        $scope.monthChanged = function (month, title, begin) {

            $scope.month.value = month;
            $scope.month.title = title;
            $scope.month.begin = begin;

            if ($scope.employee.id == 0) {
                return;
            }

            $scope.getBonusItems($scope.employee.id, month);
        }

        $scope.setRedStyle = function (isRed) {

            return isRed
                ? { color: '#c00000' }
                : {};
        }

        // Таблица расчетных данных
        $scope.calculationItems = [];
        $scope.calculationEditIndex = -1;
        $scope.calculationBackup = {};

        $scope.CalculationTableEdit = function (item, index) {

            angular.copy(item, $scope.calculationBackup);
            $scope.calculationEditIndex = index;
        }

        $scope.CalculationTableSave = function (item, index) {

            $scope.calculationEditIndex = -1;

            var data = {
                salary_id: $scope.salary.id,
                staticPart: $scope.calculationItems[0].value || 0,
                bonusPart: $scope.calculationItems[1].value || 0
            };

            salaryCalculatorService
                .saveSalaryParts(data)
                .then(
                    function(response) {
                        if (response.data.salary) {
                            $scope.fillPage(response);
                        }
                    })
                .catch(function(response) {
                        console.log('ошибка: ' + response);
                    }
                );
        }

        $scope.copyPrevMonthParam = function() {

            var data = {
                salary_id: $scope.salary.id
            };

            salaryCalculatorService
                .copySalaryPartsByPrevMonths(data)
                .then(
                    function(response) {
                        if (response.data.salary) {
                            $scope.fillPage(response);
                        }
                    })
                .catch(function(response) {
                        console.log('ошибка: ' + response);
                    }
                );
        }

        $scope.CalculationTableCancel = function (item, index) {

            $scope.calculationItems[index] = angular.copy($scope.calculationBackup);
            $scope.calculationEditIndex = -1;
        }

        // TODO: заглушки
        $scope.calculationItems = [
            {
                name: 'Постоянная часть',
                value: 0
            },
            {
                name: 'Бонусная часть',
                value: 0
            }
        ];

        // Таблица расчетных данных


        // Таблица Начислено

        $scope.chargeItems = [
            {
                name: 'Постоянная часть', 
                ktu: 0,
                charge: 0,
                hold: 0, 
                bonus: 0,
                total: 0,
                percent: 0
            },
            {
                name: 'Бонусная часть',
                ktu: 0,
                charge: 0,
                hold: 0,
                bonus: 0,
                total: 0,
                percent: 0
            }
        ];

        $scope.sumProperties = function(array, arrayProperty, method) {
            var total = 0;

            for (var i = 0; i < array.length; i++) {

                total += method == null
                    ? array[i][arrayProperty]
                    : method(array[i][arrayProperty]);
            }

            return $scope.roundNumber(total);
        }

        $scope.chargeTableChargeTotal = function() {

            return $scope.calculationItems[0].value + $scope.salary.bonusPartCalculates;
        }

        $scope.chargeTableHoldTotal = function () {

            return $scope.bonusDescentTotal(false, false);
        }

        $scope.chargeTableBonusTotal = function () {

            return $scope.bonusDescentTotal(true, false);
        }

        $scope.chargeTableTotal = function () {

            return $scope.chargeTableChargeTotal() + $scope.bonusDescentTotal(true, true);
        }

        $scope.chargeTablePercentTotal = function () {

            return $scope.sumProperties($scope.chargeItems, 'percent');
        }

        // Таблица Начислено


        // Таблица бонуса

        $scope.bonusEditIndex = -1;
        $scope.bonusBackup = {};

        $scope.bonusTableEdit = function (item, index) {

            angular.copy(item, $scope.bonusBackup);
            $scope.bonusEditIndex = index;
        }

        $scope.bonusTableSave = function (item, index) {
            $scope.bonusEditIndex = -1;

            var data = {
                salary_id: $scope.salary.id,
                indicator_id: item.indicator_id,
                value: item.payedMax
            };

            salaryCalculatorService
                .saveBonusPayedMaxPercent(data)
                .then(
                    function (response) {

                        $scope.getBonusItems($scope.employee.id, $scope.month.value);
                    })
                .catch(function (response) {
                    console.log('ошибка: ' + response);
                }
                );
        }

        $scope.bonusTableCancel = function (item, index) {

            $scope.salary.bonusDetails[index] = angular.copy($scope.bonusBackup);
            $scope.bonusEditIndex = -1;
        }

        $scope.bonusTableBonusTotal = function () {

            return $scope.sumProperties($scope.salary.bonusDetails, 'bonus');
        }

        $scope.bonusTableSumTotal = function () {

            return $scope.sumProperties($scope.salary.bonusDetails, 'bonus', $scope.getBonusSum);
        }

        $scope.indicatorReportUrl = function (indicatorId, displayIndex, isLastMonth) {

            var date = $scope.month.begin;
            
            var employee = $scope.employee.id;

            return salaryCalculatorService.indicatorReportUrl(indicatorId, displayIndex, employee, date, isLastMonth);
        }

        $scope.bonusTablePortionTotal = function () {

            return $scope.sumProperties($scope.salary.bonusDetails, 'totalBonus');
        }

        $scope.bonusTableGetChargeRow = function (bonus) {

            return $scope.roundNumber(bonus * $scope.bonusTableSumTotal()/100);
        }

        $scope.getBonusSum = function(bonusPortion) {

            var bonusTotal = $scope.calculationItems[1].value;

            return $scope.roundNumber(bonusTotal * bonusPortion/100);
        }

        $scope.showCompareValue = function (value, comparer, text) {

            var symbol = (value > comparer) ? '>=' : '<';

            return $scope.formattedNumber(value) + '% (' + symbol + ' ' + text + ')';
        }

        $scope.roundNumber = function(number) {

            return Math.round(number * 100) / 100;
        }

        $scope.getBonusItems = function(employeeId, date) {

            salaryCalculatorService
                .getSalaryInfo(employeeId, date, false)
                .then(
                    function(response) {

                        $scope.fillPage(response);
                    })
                .catch(function(response) {
                        console.log('ошибка: ' + response);
                    }
                );
        }

        $scope.recalculate = function () {

            salaryCalculatorService
                .getSalaryInfo($scope.employee.id, $scope.month.value, true)
                .then(
                    function(response) {

                        $scope.fillPage(response);
                    })
                .catch(function(response) {
                        console.log('ошибка: ' + response);
                    }
                );
        }

        $scope.fillPage = function (response) {

           // console.log(response.data);

            $scope.salary = response.data.salary;

            $scope.calculationItems[0].value = response.data.salary.staticPart;
            $scope.calculationItems[1].value = response.data.salary.bonusPart;
            $scope.salary.id = response.data.salary.id;

            $scope.salary.isNeedRecalculate = response.data.isNeedRecalculate;
            $scope.salary.canEditSalary = response.data.canEditSalary;
        }

        // Таблица бонуса

        // Показатели снижения бонуса

        $scope.bonusDescentEdit = {
            name: '',
            value: 0
        };

        $scope.bonusDescentEditIndex = -1;
        $scope.bonusDescentBackup = {};

        $scope.bonusDescentEditFunc = function (item, index) {
            clearValidBonusDescentError();

            angular.copy(item, $scope.bonusDescentBackup);
            $scope.bonusDescentEditIndex = index;
        }

       $scope.bonusDescentSave = function (item, index) {
            if (!checkEditBonusDescentValidate(item)) 
                return;

            $scope.bonusDescentEditIndex = -1;

            salaryCalculatorService
                .saveSalaryFine(item)
                .then(
                    function (response) {
                        $scope.fillPage(response);
                    })
                .catch(function(response) {
                        console.log('ошибка: ' + response);
                    }
                );
        }

        $scope.bonusDescentDelete = function (item, index) {

            // TODO: можно поменять на более симпатичные диалоги
            if (!confirm("Подтверждаете удаление записи на сумму " + item.value + "?")) {
                return;
            }

            $scope.bonusDescentEditIndex = -1;

            var data = {
                id: item.id
            };

            salaryCalculatorService
                .deleteSalaryFine(data)
                .then(
                    function (response) {
                        $scope.salary.finesDetails.splice(index, 1);
                        $scope.fillPage(response);
                        
                    })
                .catch(function(response) {
                        console.log('ошибка: ' + response);
                    }
                );
        }

        $scope.bonusDescentCancel = function (item, index) {
            $scope.salary.finesDetails[index] = angular.copy($scope.bonusDescentBackup);
            $scope.bonusDescentEditIndex = -1;
        }

        function checkEditBonusDescentValidate(item) {
            var isValid = true;

            item.isNotNameValid = false;
            item.isNotValueValid = false;

            if (item.name == '') {
                item.isNotNameValid = true;
                isValid = false;
            }

            if (item.value == 0 || !item.value) {
                item.isNotValueValid = true;
                isValid = false;
            }

            return isValid;
        }

        function clearValidBonusDescentError() {
            $("#errorBonusDescentValue").hide();
            $("#errorBonusDescentName").hide();
        }

        function checkAddBonusDescentValidate(name, value) {
            var isValid = true;

            clearValidBonusDescentError();

            if (name == '') {
                $("#errorBonusDescentName").show();

                isValid = false;
            }

            if (value == 0 || !value) {
                $("#errorBonusDescentValue").show();

                isValid = false;
            }

            return isValid;
        }

        $scope.addBonusDescentItem = function() {

            var name = $scope.bonusDescentEdit.name;
            var value = $scope.bonusDescentEdit.value;

            if (!checkAddBonusDescentValidate(name, value))
               return;
            
            var item = {};

            angular.copy($scope.bonusDescentEdit, item);

            var data = {
                salary_id: $scope.salary.id,
                name: $scope.bonusDescentEdit.name,
                value: $scope.bonusDescentEdit.value
            };

            salaryCalculatorService
                .addSalaryFine(data)
                .then(
                    function(response) {
                        $scope.fillPage(response);
                    })
                .catch(function(response) {
                        console.log('ошибка: ' + response);
                    }
                );

            $scope.bonusDescentEdit.name = '';
            $scope.bonusDescentEdit.value = 0;

            $scope.salary.finesDetails.push(item);
        }

        $scope.bonusDescentTotal = function(isPositive, sumAll) {

            if (sumAll) {
                return $scope.sumProperties($scope.salary.finesDetails, 'value');
            }

            return $scope.sumProperties($scope.salary.finesDetails, 'value', function (val) {

                if (isPositive) {
                    return val > 0 ? val : 0;
                } else {
                    return val > 0 ? 0 : val;
                }
            });
        }

        // Показатели снижения бонуса

        $scope.formattedNumber = function(number) {
            return $scope.numberFormat(number, 2, ',', ' ');
        }

        // TODO: вынести в хелперы и отрефакторить
        $scope.numberFormat = function (number, decimals, dec_point, thousands_sep) {
            number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
            var n = !isFinite(+number) ? 0 : +number,
              prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
              sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
              dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
              s = '',
              toFixedFix = function (n, prec) {
                  var k = Math.pow(10, prec);
                  return '' + (Math.round(n * k) / k)
                    .toFixed(prec);
              };
            // Fix for IE parseFloat(0.55).toFixed(0) = 0;
            s = (prec ? toFixedFix(n, prec) : '' + Math.round(n))
              .split('.');
            if (s[0].length > 3) {
                s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
            }
            if ((s[1] || '')
              .length < prec) {
                s[1] = s[1] || '';
                s[1] += new Array(prec - s[1].length + 1)
                  .join('0');
            }
            return s.join(dec);
        }

        $scope.changeToLower = function(item) {

            var data =
            {
                indicator_id: item.indicator_id,
                salary_id: $scope.salary.id,
                toLower: item.toLower
            }

            salaryCalculatorService
                .SetToLower(data)
                .then(
                    function(response) {
                        $scope.getBonusItems($scope.employee.id, $scope.month.value);

                    })
                .catch(function(response) {
                        console.log('ошибка: ' + response);
                    }
                );
        }

    });

    return app;
});