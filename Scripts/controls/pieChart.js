var pieChart = (function () {
    function toFixedRound(number) {
        return number.toFixed(2);
    }

    var privateRedirectUrlProvider;
    var privateCurrentDateGetter;

    function goToUrlWithId(id) {
        var url = privateRedirectUrlProvider.getUrl(privateCurrentDateGetter(), id);

        window.open(url);
    }

  function bindLegendHandlers() {
        $('.pieCharClickableLegend').parents('tr').click(function (event) {
            event.stopPropagation();

            var reasonId = $($(this).find('.pieCharClickableLegend')[0]).data('reasonId');

            goToUrlWithId(reasonId);
        });
    }

    return {
        create: function (pieChartId, dataSet, redirectUrlProvider, currentDateGetter) {
            privateRedirectUrlProvider = redirectUrlProvider;
            privateCurrentDateGetter = currentDateGetter;

            if (dataSet.length == 0) {
                //flot понимает только [[]] за пустой массив
                dataSet = [[]];
            }
            
            var plot = $.plot('#' + pieChartId, dataSet, {
                series: {
                    pie: {
                        show: true
                    }
                },
                legend: {
                    labelFormatter: function(label, series) {
                        return '<div class="pieCharClickableLegend" data-reason-id="' + series.id + '" > ' + label + " " + toFixedRound(series.percent) + '%</div>';
                    }
                },
                grid: {
                    hoverable: true,
                    clickable: true
                }
            });

            $("#" + pieChartId).bind("plothover", function (event, pos, item) {
                if (item != null) {
                    $('#hoverable').html('<div style="color:' + item.series.color + '"> ' + item.series.label + " " + toFixedRound(item.series.percent) + '%</div>');
                }
            });

            var isSectorClick = false;

            $("#" + pieChartId).bind("plotclick", function (event, pos, item) {
                if (item != null) {
                    isSectorClick = true;

                    var id = plot.getData()[item.seriesIndex].id;

                    goToUrlWithId(id);
                }
            });

            $("#" + pieChartId + " canvas").click(function (event) {
                //Перехват события здесь нужен чтобы оно не всплывало дальше канваса
                //если сделать event.stopPropagation() в предыдущей функции, то почему-то не работает
                if (isSectorClick) {
                    event.stopPropagation();
                    isSectorClick = false;
                }
            });

            bindLegendHandlers();

            return plot;
        },

        update: function(plot, newDataSet, showTitle, title) {
            plot.setData(newDataSet);
            plot.setupGrid();
            plot.draw();

            bindLegendHandlers();

            this.title = title;

            showTitle(newDataSet.length > 0);
        }
    }
})();