function createErrorPlaceholder(id) {
  $("#" + id).addClass("errorPlaceholder");
  $("#" + id).html("<p>Ошибка!</p>");
}

var wigetsViewModels = {
  noAjax: true,

  wigets: {},

  add: function(name, viewModel) {
    try {
      this.wigets[name] = viewModel;
    } catch (ex) {
      console.log(
        "При добавлении виджета в коллекцию виджетов произошла ошибка! \nТип ошибки:" +
          ex.name +
          "\nСообщение ошибки: " +
          ex.message +
          "\nСтек вызовов: " +
          ex.stack
      );
    }
  },

  createWigets: function(date) {
    var templateElementsOnPage = $(".dashboard");

    for (var i = 0; i < templateElementsOnPage.length; i++) {
      try {
        var id = $(templateElementsOnPage[i]).attr("id");

        this.wigets[id].init(id, date);
      }
        catch (ex) 
        {
        console.log(
          "При инициализации виджета " +
            id +
            " произошла ошибка! \nТип ошибки:" +
            ex.name +
            "\nСообщение ошибки: " +
            ex.message +
            "\nСтек вызовов: " +
            ex.stack
        );

        createErrorPlaceholder(id);
      }
    }
  },

  dayDataIsLoaded: function(date) {
    try {
      var result = false;

        var reportDaysDataProduction = window.faceData.reportDaysDataProduction;
        if (reportDaysDataProduction !== undefined) {
            for (var i = 0; i < reportDaysDataProduction.length; i++) {
                var currentValue = reportDaysDataProduction[i];
                var currentDate = parseDateFromString(currentValue["period"]);

                if (date > currentDate) {
                    continue;
                }
                if (date < currentDate) {
                    break;
                }
                result = true;
            }
        }
      return result;
    } catch (ex) {
      console.log(
        "При проверке, загружены ли данные по текущему дню, произошла ошибка! \nТип ошибки:" +
          ex.name +
          "\nСообщение ошибки: " +
          ex.message +
          "\nСтек вызовов: " +
          ex.stack
      );
    }
  },

  updateAllWidgets: function(date,callback) {
      if (callback) 
      {
          callback();
      }

    for (var wiget in this.wigets) {
        try {
        if (this.wigets.hasOwnProperty(wiget)) {
          this.wigets[wiget].update(date);
        }
      } catch (ex) {
        console.log(
          "При обновлении виджета " +
            wiget +
            " произошла ошибка! \nТип ошибки:" +
            ex.name +
            "\nСообщение ошибки: " +
            ex.message +
            "\nСтек вызовов: " +
            ex.stack
        );

        createErrorPlaceholder(wiget);
      }
    }
  },

  updateDataAndWigets: function(date) {

      
    try {
      if (!this.dayDataIsLoaded(date)) {
        loadDataFromServer(date, updateWidgetsFunc);
      } else {
        updateWidgetsFunc(date);
      }
    } catch (ex) {
      console.log(
        "При обновлении информации и виджетов произошла ошибка! \nТип ошибки:" +
          ex.name +
          "\nСообщение ошибки: " +
          ex.message +
          "\nСтек вызовов: " +
          ex.stack
      );
    }
  },
  afterUpdateCallback: null,

  updateWidgetsWithData: function(date, postData, beforeLoadFunc,afterLoadFunc) {

      this.afterUpdateCallback = afterLoadFunc;

    if (!this.dayDataIsLoaded(date)) {
      if (beforeLoadFunc) {
        beforeLoadFunc();
      }

      loadFaceDataWithCustomData(date, postData, updateWidgetsFunc);
    } else {
      updateWidgetsFunc(date);
    }
  },

  clearCache: function() {
    for (var property in window.faceData) {
      if (!window.faceData.hasOwnProperty(property)) {
        continue;
      }

      window.faceData[property] = [];
    }
  }
};

function updateWidgetsFunc(date) {
    wigetsViewModels.updateAllWidgets(date);
    wigetsViewModels.afterUpdateCallback();
}

function bindCardClickHandler(element, redirect, dateGetter) {
  try {
    element.css("cursor", "pointer");

    element.click(function() {
      var url = redirect.getUrl(dateGetter());

      window.open(url);
    });
  } catch (ex) {
    console.log(
      "Во время привязки обработчика к клику по карте произошла ошибка! \nТип ошибки:" +
        ex.name +
        "\nСообщение ошибки: " +
        ex.message +
        "\nСтек вызовов: " +
        ex.stack
    );
  }
}



function speedometerViewModel(initOptions) {
  try {
    var resultObj = {
      indicatorName: initOptions.indicatorName,
      footer: initOptions.footer,
      calculateData: function(date) {
        if (date) {
          this.data.currentDate = date;

          this.data.currentValue = initOptions.currentValueField.getValue(date);

          this.data.footerValue = initOptions.footerField
            ? initOptions.footerField.getValue(date)
            : "";

          this.data.observable.footerValue = this.data.footerValue;
        } else {
          this.data.currentValue = 0;
          this.data.footerValue = "";
          this.data.observable.footerValue = this.data.footerValue;
        }
      },
      init: function(id, date) {
        this.canvasId = id + "Canvas";

        bindViewModelWithData(date, this);

        ko.cleanNode(document.getElementById(id));
        ko.applyBindings(this, document.getElementById(id));

        var width = $("#" + id).width();
        $("#" + id + " .speedometer").width(width);
        $("#" + this.canvasId).attr("width", width);

        this.draw();

        bindCardClickHandler(
          $("#" + this.canvasId),
          initOptions.redirect,
          function() {
            return resultObj.data.currentDate;
          }
        );
      },
      draw: function() {
        speedometer.create(
          this.canvasId,
          initOptions.colorOpt,
          this.data.currentValue,
          initOptions.measure
        );
      },
      update: function(date) {
        this.dataBind(date);
        this.draw(); //TODO: Переделать на обновление спидометра
      }
    };

    return resultObj;
  } catch (ex) {
    console.log(
      "При создании объекта speedometerViewModel произошла ошибка! \nТип ошибки:" +
        ex.name +
        "\nСообщение ошибки: " +
        ex.message +
        "\nСтек вызовов: " +
        ex.stack
    );
  }
}



function getColor(priceTypes, price, priceType, date) {
    var color = "";
    if (price) {
        var applyDate = Date.parse(price.applyDate);
        var ticks = date.getTime() - applyDate;
        var countDays = ticks / 86400000;

        color = priceTypes[priceType];

        var red = "#FF0000";

        switch (priceType) {
        case "ПЦ":
        {
            if (countDays >= 93) {
                color = red;
            } 
            break;
        }
        case "ФЦ":
        {
            if (countDays >= 10) {
                color = red;
            } 
            break;
        }
        case "ЦС":
        {
            if (countDays >= 31) {
                color = red;
            } 
            break;
        }
        }
    }

    return color;
}

function basicMaterialViewModel(initOptions) {
  try {
    var resultObj = {
      label: initOptions.labelTable,
      dataSource: {},
      calculateData: function(date) {
          if (date && window.faceData.basicMaterialPrices   ) {
            var pricesFaceDate = window.faceData.basicMaterialPrices;

            var prices = pricesFaceDate.filter(el => Date.parse(el.applyDate) <= date);

              prices.sort(function(a, b) {
                  return (b.applyDate < a.applyDate) - (a.applyDate < b.applyDate) ||
                      (b.indexNumber > a.indexNumber) - (a.indexNumber > b.indexNumber)
              });

            var dicPriceTypes = {};

            for (var i = prices.length - 1; i >= 0; i--) {
                var price = prices[i];
                var goodName = price.goodName;
                var priceName = price.priceName;

                if (!dicPriceTypes[goodName]) {
                    dicPriceTypes[goodName] = {};
                }

                var pricesRow = dicPriceTypes[goodName];
                if (!pricesRow[priceName]) {
                    pricesRow[priceName] = prices[i];
                }
            }

            this.data.observable.dataSource = dicPriceTypes;
        } else {
          this.data.observable.dataSource = {};
        }
      },
        init: function (id, date) {

            var elem = $("#basicMaterialTable");

            if (elem[0]) {
                bindViewModelWithData(date, this);
                ko.cleanNode(document.getElementById(id));
                ko.applyBindings(this, document.getElementById(id));
            }
      },
      draw: function(date) {
          var elem = $("#basicMaterialTable");

          elem.empty();

          var priceTypes = { ПЦ: "#008000", ФЦ: "#4682B4", ЦС: "#000000" };

          var priceToolTips = { ПЦ: "Плановая цена устанавливается раз в квартал", ФЦ: "Фактическая цена устанавливается раз в декаду", ЦС: "Цена списания устанавливается раз в месяц" };

          var pricesArray = this.data.observable.dataSource;

          var table = "<div style='margin-bottom:5px;'>Цены на основное сырьё</div><div style='position: absolute;'><table class='table table-bordered'><thead><tr><th style='width: 80px;' scope='col'><span>Сырьё</span></th>";

          for (var type in priceTypes) {
              var color = priceTypes[type];

              var toolTip = priceToolTips[type];

              table += "<th  scope='col' style='padding:8px 0px;'><span class='tooltip'  style='width: 65px;color: " + color + ";' title='" + toolTip +"'>" + type + "</span></th>";
          }

          table += "</tr></thead><tbody>";

          var i = 0;

          for (var rowInPrices in pricesArray) {
              var key = Object.keys(pricesArray)[i];

              var row = "<tr><td style='width: 65px;' scope='col'>" + key + "</td>";

              for (var type in priceTypes) {
                  var price = pricesArray[rowInPrices][type];

                  var color = getColor(priceTypes, price, type, date);

                  if (!price) {
                      row += "<td style='width: 65px;'><span class='tooltip' title='Не установлено'></span>";
                  } else {
                      row += "<td style='width: 65px;'><span style='color: " +
                          color +
                          "' class='tooltip' title='" + price.toolTip + "'>" +price.price +"</span>";
                  }
                  row += "</td>";
              }

              table += row;
              i++;
          }

          table += "</tbody></table></div>";
          elem.append(table);
      },
        update: function (date) {
            var elem = $("#basicMaterialTable");

            if (elem[0]) {
                this.dataBind(date);
                this.draw(date);

                $(document).ready(function () {
                    $('.tooltip').tooltipster();
                });
            }

        }
    };

    return resultObj;
  } catch (ex) {
    console.log(
      "При создании объекта salesCardViewModel произошла ошибка! \nТип ошибки:" +
        ex.name +
        "\nСообщение ошибки: " +
        ex.message +
        "\nСтек вызовов: " +
        ex.stack
    );
  }
}

function waffleChartViewModel(initOptions) {
  try {
    var resultObj = {
      planLabel: initOptions.planLabel,
      factLabel: initOptions.factLabel,
      currentLabel: initOptions.currentLabel,
      indicatorName: initOptions.indicatorName,
      calculateData: function(date) {
        if (date) {
          this.data.currentDate = date;

          this.data.observable.fact = initOptions.factField.getValue(date);
          this.data.observable.plan = initOptions.planField.getValue(
            date,
            initOptions.isCalendarMonthUse
          );

          this.data.observable.current = initOptions.currentField.getValue(
            date,
            initOptions.isCalendarMonthUse
          );
        } else {
          this.data.observable.fact = 0;
          this.data.observable.plan = 0;

          this.data.observable.current = 0;
        }
      },
      init: function(id, date) {
        this.canvasId = id + "Canvas";

        bindViewModelWithData(date, this);

        ko.cleanNode(document.getElementById(id));
        ko.applyBindings(this, document.getElementById(id));

        this.draw();

        bindCardClickHandler(
          $("#" + this.canvasId),
          initOptions.redirect,
          function() {
            return resultObj.data.currentDate;
          }
        );
      },
      draw: function() {
        waffleChart.create(
          this.canvasId,
          this.data.observable.plan,
          this.data.observable.fact,
          this.data.observable.current,
          initOptions.fillRectColor
        );
      },
      update: function(date) {
        this.dataBind(date);
        this.draw(); //TODO: Переделать на обновление waffleChart
      }
    };

    return resultObj;
  } catch (ex) {
    console.log(
      "При создании объекта waffleChartViewModel произошла ошибка! \nТип ошибки:" +
        ex.name +
        "\nСообщение ошибки: " +
        ex.message +
        "\nСтек вызовов: " +
        ex.stack
    );
  }
}

function graphicViewModel(initOptions) {
  try {
    if (initOptions.showLegend == undefined) {
      initOptions.showLegend = true;
    }

    if (initOptions.addHeight == undefined) {
      initOptions.addHeight = 0;
    }

    var resultObj = {
      calculateData: function(date) {
        for (var i = 0; i < initOptions.dataSet.length; i++) {
          var currentDataSet = initOptions.dataSet[i];

          if (!currentDataSet.trendline) {
            if (date) {
              currentDataSet.data = currentDataSet.dataProvider.getGraphicData(
                date,
                initOptions.dateOffset
              );
            } else {
              currentDataSet.data = [];
            }
          }
        }
      },
      init: function(id, date) {
        initOptions.graphicId = id + "_graphic";
        initOptions.legendContainerId = id + "_legendContainer";
        initOptions.rotateClassName = initOptions.rotateXaxesLabels
          ? "rotate-xtick"
          : "";

        bindViewModelWithData(date, this);

        ko.cleanNode(document.getElementById(id));
        ko.applyBindings(initOptions, document.getElementById(id));

        this.draw();
        graphics.bindPlotClick(initOptions.graphicId, initOptions.dataSet);
      },
      draw: function() {
        graphics.create(initOptions);
      },
      update: function(date) {
        this.dataBind(date);
        this.draw(); //TODO: Переделать на обновление графика
      }
    };

    return resultObj;
  } catch (ex) {
    console.log(
      "При создании объекта graphicViewModel произошла ошибка! \nТип ошибки:" +
        ex.name +
        "\nСообщение ошибки: " +
        ex.message +
        "\nСтек вызовов: " +
        ex.stack
    );
  }
}

function graphicByWeekViewModel(initOptions) {
  try {
    if (initOptions.showLegend == undefined) {
      initOptions.showLegend = true;
    }

    if (initOptions.addHeight == undefined) {
      initOptions.addHeight = 0;
    }

    var resultObj = {
      calculateData: function(date) {
        for (var i = 0; i < initOptions.dataSet.length; i++) {
          var currentDataSet = initOptions.dataSet[i];

          if (!currentDataSet.trendline) {
            if (date) {
              currentDataSet.data = currentDataSet.dataProvider.parseArrayToWeekGraphic(
                date,
                initOptions.dateOffset
              );
            } else {
              currentDataSet.data = [];
            }
          }
        }
      },
      init: function(id, date) {
        initOptions.graphicId = id + "_graphic";
        initOptions.legendContainerId = id + "_legendContainer";
        initOptions.rotateClassName = initOptions.rotateXaxesLabels
          ? "rotate-xtick"
          : "";

        bindViewModelWithData(date, this);

        ko.cleanNode(document.getElementById(id));
        ko.applyBindings(initOptions, document.getElementById(id));

        this.draw();
        graphics.bindPlotClick(initOptions.graphicId, initOptions.dataSet);
      },
      draw: function() {
        graphics.create(initOptions);
      },
      update: function(date) {
        this.dataBind(date);
        this.draw(); //TODO: Переделать на обновление графика
      }
    };

    return resultObj;
  } catch (ex) {
    console.log(
      "При создании объекта graphicByWeekViewModel произошла ошибка! \nТип ошибки:" +
        ex.name +
        "\nСообщение ошибки: " +
        ex.message +
        "\nСтек вызовов: " +
        ex.stack
    );
  }
}

function salesCardViewModel(initOptions) {
  try {
    var resultObj = {
      mainIndicatorName: initOptions.mainIndicatorName,
        averIndicatorName: initOptions.averIndicatorName,
        color: initOptions.colorIndicator,
      indicatorTableNameUnitOfMeasurement:
        initOptions.indicatorTableNameUnitOfMeasurement,
      secondIndicatorsNames: [],
      calculateData: function(date) {
        this.data.currentDate = date;

        if (date) {
          this.data.mainIndicatorValue = initOptions.dataProvider.getValue(
            date
          );

          if (initOptions.averDataProvider) {
            this.data.averIndicatorValue = initOptions.averDataProvider.getValue(
              date
            );
          }
        } else {
          this.data.mainIndicatorValue = 0;
          this.data.averIndicatorValue = 0;
        }

        this.data.secondIndicators = [];

        if (date) {
          for (var i = 0; i < initOptions.secondIndicators.length; i++) {
            var secondMainIndicator;

            if (initOptions.secondIndicators[i].dateOffsetFunc) {
              secondMainIndicator = initOptions.secondIndicators[
                i
              ].dateOffsetFunc.getOffset(date);
            } else {
              secondMainIndicator = initOptions.dataProvider.getSecondValue(
                date,
                initOptions.secondIndicators[i].fieldName
              );
            }

            var indicatorPersendage =
              this.data.mainIndicatorValue / Math.abs(secondMainIndicator) - 1;

            var indicator = {
              indicatorValue:
                this.data.mainIndicatorValue - secondMainIndicator,
              indicatorPersendage: isFinite(indicatorPersendage)
                ? indicatorPersendage
                : 1
            };

            this.data.secondIndicators.push(indicator);
          }
        }

        this.data.observable.mainIndicatorValue = this.data.mainIndicatorValue;
        this.data.observable.averIndicatorValue = this.data.averIndicatorValue;
        this.data.observable.secondIndicators = this.data.secondIndicators;
      },
      init: function(id, date) {
        this.indicatorCardId = id + "_indicator";
        bindViewModelWithData(date, this);

        ko.cleanNode(document.getElementById(id));
        ko.applyBindings(this, document.getElementById(id));

        bindMainIndicatorOnClickRedirect();
        bindSecondIndicatorsOnClickRedirect();
      },
      draw: function() {},
      update: function(date) {
        this.dataBind(date);
        bindSecondIndicatorsOnClickRedirect();
      }
    };

    function dateGetterFunction() {
      return resultObj.data.currentDate;
    }

    function bindMainIndicatorOnClickRedirect() {
      bindCardClickHandler(
        $(".main-indicator-name", $("#" + resultObj.indicatorCardId)),
        initOptions.redirect,
        dateGetterFunction
      );
    }

    function bindSecondIndicatorsOnClickRedirect() {
      var secondIndicators = initOptions.secondIndicators;

      for (var i = 0; i < secondIndicators.length; i++) {
        if (secondIndicators[i].redirect) {
          var nthChildNumber = i + 1;

          var tr = $(
            "#" +
              resultObj.indicatorCardId +
              " .secondIndicators tr:nth-child(" +
              nthChildNumber +
              ")"
          );
          var element = $("td.second-indicator-name", tr);

          bindCardClickHandler(
            element,
            secondIndicators[i].redirect,
            dateGetterFunction
          );
        }
      }
    }

    for (var i = 0; i < initOptions.secondIndicators.length; i++) {
      resultObj.secondIndicatorsNames.push(
        initOptions.secondIndicators[i].indicatorName
      );
    }

    return resultObj;
  } catch (ex) {
    console.log(
      "При создании объекта salesCardViewModel произошла ошибка! \nТип ошибки:" +
        ex.name +
        "\nСообщение ошибки: " +
        ex.message +
        "\nСтек вызовов: " +
        ex.stack
    );
  }
}

function receivableCardViewModel(initOptions) {
  try {
    var resultObj = {
      mainIndicatorName: initOptions.mainIndicatorName,
      secondIndicatorName: initOptions.secondInicatorName,
      format: initOptions.valuesFormat,
      precision:
        initOptions.formatPrecision === undefined
          ? 0
          : initOptions.formatPrecision,

      calculateData: function(date) {
        if (date) {
          this.data.currentDate = date;

          this.data.mainIndicatorValue = initOptions.dataProvider.getValue(
            date
          );

          this.data.secondIndicatorValue = initOptions.secondDataProvider.getValue(
            date
          );
        } else {
          this.data.mainIndicatorValue = 0;

          this.data.secondIndicatorValue = 0;
        }

        //this.data.secondIndicatorValue = initOptions.dataProvider.getSecondValue(date,
        //    initOptions.secondIndictorFieldName);

        this.data.observable.mainIndicatorValue = this.data.mainIndicatorValue;
        this.data.observable.secondIndicatorValue = this.data.secondIndicatorValue;
      },
      init: function(id, date) {
        this.indicatorCardId = id + "_receivableIndicator";
        bindViewModelWithData(date, this);

        ko.cleanNode(document.getElementById(id));
        ko.applyBindings(this, document.getElementById(id));

        bindCardClickHandler(
          $(".receivable-main-indicator-name", $("#" + this.indicatorCardId)),
          initOptions.mainIndicatorRedirect,
          function() {
            return resultObj.data.currentDate;
          }
        );

        bindCardClickHandler(
          $(".receivable-second-indicator-name", $("#" + this.indicatorCardId)),
          initOptions.secondIndicatorRedirect,
          function() {
            return resultObj.data.currentDate;
          }
        );
      },
      draw: function() {},
      update: function(date) {
        this.dataBind(date);
      }
    };

    return resultObj;
  } catch (ex) {
    console.log(
      "При создании объекта speedometerViewModel произошла ошибка! \nТип ошибки:" +
        ex.name +
        "\nСообщение ошибки: " +
        ex.message +
        "\nСтек вызовов: " +
        ex.stack
    );
  }
}

function pieChartViewModel(initOptions) {
  try {
    var resultObj = {
      calculateData: function(date) {
        this.data.currentDate = date;

        if (date) {
          this.data.dataSet = initOptions.dataProvider.getPieChartData(date);
        } else {
          this.data.dataSet = [];
        }
      },
      init: function(id, date) {
        this.title = initOptions.title;

        this.showTitle = ko.observable(false);

        this.pieChartId = id + "_pieChart";
        bindViewModelWithData(date, this);

        ko.cleanNode(document.getElementById(id));
        ko.applyBindings(this, document.getElementById(id));

        this.draw();

        bindCardClickHandler(
          $("#" + this.pieChartId).parent(),
          {
            getUrl: function(currentDate) {
              return initOptions.redirect.getUrl(currentDate, "-2");
            }
          },
          function() {
            return resultObj.data.currentDate;
          }
        );
      },
      draw: function() {
        this.plot = pieChart.create(
          this.pieChartId,
          this.data.dataSet,
          initOptions.redirect,
          function() {
            return resultObj.data.currentDate;
          }
        );
      },
      update: function(date) {
        this.dataBind(date);

        pieChart.update(
          this.plot,
          initOptions.dataProvider.getPieChartData(date),
          this.showTitle,
          this.title
        );
      }
    };

    return resultObj;
  } catch (ex) {
    console.log(
      "При создании объекта pieChartViewModel произошла ошибка! \nТип ошибки:" +
        ex.name +
        "\nСообщение ошибки: " +
        ex.message +
        "\nСтек вызовов: " +
        ex.stack
    );
  }
}

function bindViewModelWithData(date, viewModel) {
  try {
    var data = {
      observable: {}
    };

    viewModel.data = data;

    viewModel.calculateData(date);

    for (var prop in data.observable) {
      var propIsArray = data.observable[prop] instanceof Array;

      viewModel[prop] = propIsArray
        ? ko.observableArray(data.observable[prop])
        : ko.observable(data.observable[prop]);
    }

    viewModel.dataBind = function(curDate) {
      viewModel.calculateData(curDate);

      for (var property in data.observable) {
        viewModel[property](data.observable[property]);
      }
    };
  } catch (ex) {
    console.log(
      "При связывании виджета и данных произошла ошибка! \nТип ошибки:" +
        ex.name +
        "\nСообщение ошибки: " +
        ex.message +
        "\nСтек вызовов: " +
        ex.stack
    );
  }
}
