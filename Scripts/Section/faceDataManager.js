function loadDataFromServer(date, callback, urlPart) {
    var data = getFiltersAsString();

    loadFaceDataWithCustomData(date, data, callback, urlPart);
}


function loadFaceDataWithCustomData(date, postData, callback, urlPart) {

    if (urlPart == undefined) {
        urlPart = 'Data/Face';
    }

    var data = {
        date: date.toServerFormat(),
        dataPart: 1
    };

    if (postData) {
        data.data = postData;
    }

    $.ajax({
        url: basePath + urlPart,

        type: 'post',
        dataType: "json",
        data: data,
        async: true,   // true - параллельная загрузка частей данных
        success: function (response) {

            if (response.success === false) {
                console.log(arguments);
                alert(response.message ? response.message : 'Ошибка загрузки данных');
            } else {
                var json = JSON.parse(response.data);

                loadFromJsonToCache(json);

                if (callback) {
                    callback(date);
                }
            }
        },
        error: function (e) {
            console.log(arguments);
            if (e.status != 0) {
                alert('Ошибка загрузки данных');
            }
        }
    });



    //data.dataPart = 2;

    //$.ajax({
    //    url: basePath + urlPart,

    //    type: 'post',
    //    dataType: "json",
    //    data: data,
    //    success: function (response) {

    //        if (response.success === false) {
    //            console.log(arguments);
    //            alert(response.message ? response.message : 'Ошибка загрузки данных');
    //        } else {
    //            var json = JSON.parse(response.data);

    //            loadFromJsonToCache(json);

    //            if (callback) {
    //                callback(date);
    //            }
    //        }
    //    },
    //    error: function (e) {
    //        console.log(arguments);
    //        if (e.status != 0) {
    //            alert('Ошибка загрузки данных');
    //        }
    //    }
    //});


}

function loadFromJsonToCache(data) {
    var newData = data[0];

    if (window.faceData == undefined) {
        window.faceData = {};
    }

    for (var key in newData) {
        var faceSubArray = window.faceData[key];
        var newSubArray = newData[key];

        var concatArray = newSubArray.concat(faceSubArray || []);

        concatArray.sort(comparePeriodRow);

        if (key !== "basicMaterialPrices") {
            DistinctByPeriod(concatArray);
        } 

        window.faceData[key] = concatArray;
    }
}

function comparePeriodRow(a, b) {

    if (!a.period
        || !b.period) {
        return 0;
    }
    var aValue = getDateFromPeriod(a.period);
    var bValue = getDateFromPeriod(b.period);

    if (aValue < bValue) {
        return -1;
    }

    if (aValue > bValue) {
        return 1;
    }

    return 0;
}

function DistinctByPeriod(periodArray) {
    var last;
    for (var i = 0; i < periodArray.length - 1;) {
        var currentPeriod = periodArray[i].period;

        if (currentPeriod == last) {
            periodArray.splice(i, 1);
        } else {
            last = currentPeriod;
            i++;
        }
    }
}

function getDateFromPeriod(period) {
    return new Date(period.replace(/(\d+)-(\d+)-(\d+)/, '$1/$2/$3'));
}


var dataLoader = (function () {
    //todo: Переделать на накопленные вызовы
    var ajaxAllreadyOn = false;

    return {
        checkDataAndLoad: function (dateOffsetDate, date) {
            if (!wigetsViewModels.dayDataIsLoaded(dateOffsetDate) && !ajaxAllreadyOn) {
                ajaxAllreadyOn = true;

                loadDataFromServer(dateOffsetDate, function () {
                    ajaxAllreadyOn = false;


                    // после получения данных 
                    if (date != null) {
                        wigetsViewModels.updateAllWidgets(date);
                    }

                });



            } else if (ajaxAllreadyOn) {
                setTimeout(function () {
                    dataLoader.checkDataAndLoad(dateOffsetDate);
                }, 1000);
            }
        }
    }
})();