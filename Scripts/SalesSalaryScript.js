
function MenuItemClicked(menuId) {

    var scope = angular
        .element(document.getElementById("salaryCalculatorController"))
        .scope();

    var treeData = getTreeItemById(menuId);

    var args =
    {
        id: treeData.id,
        name: treeData.text,
        position: treeData.position
    }

    scope.$broadcast('hierarchyMenu.itemChange', args);
}

// TODO: убрать, когда плагин дат будет на ангуляре. Пока что вызываем извне
function MonthChanged(date) {
    var scope = angular
        .element(document.getElementById("salaryCalculatorController"))
        .scope();

    var title = $('#currDate').text();
    var begin = $('#currDate').data('begin');

    scope.$evalAsync(function () {
        scope.monthChanged(date, title, begin);
    });
}

function whenAngularLoaded() {

    var date = $('#currDate').data('date');

    MonthChanged(date);

    displayMotivationEmployee();
};