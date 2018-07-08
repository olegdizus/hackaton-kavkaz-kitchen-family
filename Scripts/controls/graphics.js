var graphics = (function () {

    function calculateYAsixLabel(dataSet) {
        var yaxes = [];

        for (var i = 0; i < dataSet.length; i++) {
            var currentDataSet = dataSet[i];

            var position = currentDataSet.yaxis === 1 ? "left" : "right";

            yaxes.push({
                position: position,
                axisLabel: currentDataSet.label,
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 11,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 3
            });
        }

        return yaxes;
    }

    return {
        create: function (initOptions) {

            var dataSetForGraphic = initOptions.dataSet.slice();

            if (initOptions.showTrendline) {
                var dataTrend = dataSetForGraphic[0].data;

                var trendlineDataSet = {
                    trendline: true,
                    label: "Тенденция",
                    data: dataTrend.length == 0 ? [] : lineFit(dataTrend),
                    color: "#D93755"
                };

                dataSetForGraphic.push(trendlineDataSet);
            }

            var options = {
                legend: {
                    show: initOptions.showLegend,
                    container: $("#" + initOptions.legendContainerId),
                    noColumns: 0
                },
                grid: {
                    hoverable: true,
                    clickable: true,
                    addHeight: initOptions.addHeight
                },
            };

            options.yaxes = [];

            if (initOptions.displayYAsixLabel) {
                options.yaxes = calculateYAsixLabel(dataSetForGraphic);
            }

            if (initOptions.yaxesFormat === '%') {
                options.yaxes.push({
                    tickFormatter: function (val, axis) {
                        var persent = (val * 100).toFixed(0) + "%";
                        return persent;
                    }
                });
            }

            options.xaxis = {
                mode: "time",
                timeformat: initOptions.dateTimeFormat,
                tickSize: initOptions.dateTickSize,
                labelWidth: 40,
                monthNames: [
                    "Янв", "Фев", "Мар", "Апр",
                    "Май", "Июн", "Июл", "Авг",
                    "Сен", "Окт", "Ноя", "Дек"
                ],
            };

            //options.yaxis = data.yaxis;
            //options.yaxes = data.yaxes;

            $.plot("#" + initOptions.graphicId, dataSetForGraphic, options);
        },

        bindPlotClick: function (graphicId, dataSet) {
            $("#" + graphicId).bind("plotclick", function(event, pos, item) {
                if (item) {
                    var date = new Date(item.datapoint[0]);
                    
                    var url = dataSet[item.seriesIndex].redirect.getUrl(date);

                    window.open(url);
                }
            });
        }
    }
})();