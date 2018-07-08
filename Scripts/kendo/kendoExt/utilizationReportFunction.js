

function showOnlyNotEmplyColumn(countClassName, emptyProp) {

    function setDisplayRows(i, div) {
        var count = $(div).data('value');
        if (count == emptyProp) {
            $(div).closest('tr').css('display', 'none');
        }
    }

    var countDivs = $(countClassName);
    $.each(countDivs, setDisplayRows);
}

function dynamicValue(diff, val) {
   
    if (diff == 0 || diff == undefined || val == undefined) {
        return 0;
    }

    diff = round(diff);
    var perc = getPercentage(val, diff);

    var res = diff + ' (' + round(perc) + '%)';
  
    return res;
}

function getPercentage(val, diff) {
    return val == null ? 0 : (100 / val) * diff;
}

function getGrowth(numerator, denominator) {
    if (!(numerator && denominator)) {
        return 0;
    }
    return (numerator - denominator) * 100 / denominator;
}

function getAver(numerator, denominator) {
    if (!(numerator && denominator)) {
        return 0;
    }
    return numerator / denominator;
}

function getPrirostPlana(data) {

    var plan = data.plan['sum'];
    var fact = data.fact['sum'];

    if (plan == 0
        || fact == 0
        || plan == null
        || fact == null) {
        return '';
    }

    var delta = plan - fact;
    var result = delta / fact * 100;
   
    return "<div class = 'raz'>"+kendo.toString(result, 'n2')+"</div>";
}

function getPercent(plan, fakt) {
    if (!(plan && fakt)) {
        return 0;
    }
    var number = fakt / plan;

    return number;
}

function getPercent100(plan, fakt) {
    if (!(plan && fakt)) {
        return 0;
    }
    var number = plan / fakt;

    return kendo.toString(number * 100, 'n2');
}


function utilTimeFormat(decTime) {
    function getDecimal(num) {
        return num > 0 ? num - Math.floor(num) : Math.ceil(num) - num;
    }

    function decToMinutes(decHour) {
        return Math.round(getDecimal(decHour) / 10 * 600);
    }

    return (decTime | 0) + ' ч. ' + decToMinutes(decTime) + ' мин.';
}

function round(num) {

    var number = num == 0 ? 0 :
        Math.round(num * 100) / 100;
   
    return kendo.toString(number, "n0");
}

function percentRound(num) {
    var number = num == 0 ? 0 :
       Math.round(num * 100) / 100;

    return kendo.toString(number, "n");
}

function getProfitSumStr(sum, planSum) {
    return kendo.toString(getProfitSum(sum, planSum), "n2");
}

function getProfitSum(sum, planSum) {
    if (planSum == 0
        || sum == 0
        || planSum == null
        || sum == null) {
        return '';
    }

    var delta = planSum - sum;

    var result = (delta / planSum) * 100;

    return result;
}


function getPrirostSumWithPercente(parentPlan, childPlan) {
    if (childPlan == 0
        || parentPlan == 0
        || childPlan == null
        || parentPlan == null) {
        return '';
        //return kendo.toString(parentPlan - childPlan, "n0");
    }

    var result = kendo.toString(childPlan - parentPlan, "n0") + ' (' + kendo.toString((childPlan / parentPlan - 1) * 100, "n2") + '%)';

    return result;
}

function getProfitDebSum(data) {

   if (data.PlanSum.sum == 0 || data.Sum.sum == 0) {
        return 0;
    }
    return round(data.Sum.sum / data.PlanSum.sum - 1);
}




