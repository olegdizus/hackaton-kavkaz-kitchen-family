ko.observableArray.fn.addMatrixItem = function(item) {
    this.push({
        brand: item.Brand,
        IndicatorValue: item.IndicatorValue
    });
}

var bcgMatrixViewModel = new (function () {
    function calculateSumInArray(array) {
        var sum = 0;

        for (var i = 0; i < array.length; i++) {
            sum += array[i].IndicatorValue;
        }

        return sum;
    }

    var that = this;

    this.difficultChildren = ko.observableArray();
    this.difficultChildrenTotal = ko.computed(function () {
        return calculateSumInArray(that.difficultChildren());
    });

    this.starts = ko.observableArray();
    this.startsTotal = ko.computed(function () {
        return calculateSumInArray(that.starts());
    });

    this.dogs = ko.observableArray();
    this.dogsTotal = ko.computed(function () {
        return calculateSumInArray(that.dogs());
    });

    this.cows = ko.observableArray();
    this.cowsTotal = ko.computed(function () {
        return calculateSumInArray(that.cows());
    });

    this.clearAllValues = function() {
        this.difficultChildren.removeAll();
        this.starts.removeAll();
        this.dogs.removeAll();
        this.cows.removeAll();
    }
})();

function recalculateBcgMatrix(data) {
    bcgMatrixViewModel.clearAllValues();

    for (var i = 0; i < data.length; i++) {
        var item = data[i];

        if (!item.Checked)
            continue;

        if (item.GrowthForMatrix && item.PartForMatrix) {
            if (item.GrowthForMatrix == GrowthForMatrix.hight && item.PartForMatrix == PartForMatrix.hight) {
                bcgMatrixViewModel.starts.addMatrixItem(item);
            }

            if (item.GrowthForMatrix == GrowthForMatrix.hight && item.PartForMatrix == PartForMatrix.low) {
                bcgMatrixViewModel.difficultChildren.addMatrixItem(item);
            }

            if (item.GrowthForMatrix == GrowthForMatrix.low && item.PartForMatrix == PartForMatrix.low) {
                bcgMatrixViewModel.dogs.addMatrixItem(item);
            }

            if (item.GrowthForMatrix == GrowthForMatrix.low && item.PartForMatrix == PartForMatrix.hight) {
                bcgMatrixViewModel.cows.addMatrixItem(item);
            }
        }
    }
}

$(function () {
    ko.applyBindings(bcgMatrixViewModel, $('#bcgMatrix')[0]);
})