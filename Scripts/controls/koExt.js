ko.bindingHandlers.numericText = {
    update: function (element, valueAccessor, allBindingsAccessor) {
        numericValueFormat(element, valueAccessor, allBindingsAccessor, formatNumber);
    }
};

ko.bindingHandlers.percentage = {
    update: function (element, valueAccessor, allBindingsAccessor) {
        numericValueFormat(element, valueAccessor, allBindingsAccessor, formatPercentageValue);
    }
};

ko.bindingHandlers.customFormatText = {
    update: function (element, valueAccessor, allBindingsAccessor) {
        var value = getValueFromValueAccessor(valueAccessor);
        var format = $(element).data('format');
        var precision = $(element).data('precision');

        if (format === 'numericText') {
            updateText(element, formatNumber(value, precision));
        } else if (format === 'percentage') {
            updateText(element, formatPercentageValue(value, precision));
        } else if (format === 'percentageDiv100') {
            updateText(element, formatPercentageValueDiv100(value, precision));
        } else {
            console.log('Непредвиденный формат для customFormat. ' + format);
        }
    }
};

function formatPercentageValue(value, precision) {
    if (value) {
        return (value * 100).toFixed(precision).toString().replace(".", ",") + "%";
    } else {
        if (value === 0) {
            return '0';
        } else {
            return '';
        }
        
    }
}

function formatPercentageValueDiv100(value, precision) {
    if (value) {
        return value.toFixed(precision).toString().replace(".", ",") + "%";
    } else {
        if (value === 0) {
            return '0';
        } else {
            return '';
        }
    }
}

function formatNumber(value, precision) {
    if (value) {
        return value.toFixed(precision).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ").replace(".", ",");
    } else {
        if (value === 0) {
            return '0';
        } else {
            return '';
        }
    }
}

function numericValueFormat(element, valueAccessor, allBindingsAccessor, formatFunction) {
    var defaultPrecision = 0;

    var value = getValueFromValueAccessor(valueAccessor),
        precision = ko.utils.unwrapObservable(allBindingsAccessor().precision)
            || defaultPrecision;

    updateText(element, formatFunction(value, precision));
}

function updateText(element, text) {
    ko.bindingHandlers.text.update(element, function () { return text; });
}

function getValueFromValueAccessor(valueAccessor) {
    return ko.utils.unwrapObservable(valueAccessor());
}