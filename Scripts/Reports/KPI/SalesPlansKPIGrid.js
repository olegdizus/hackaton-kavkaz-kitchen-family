function customEditor(container, options) {

    var input =
        $('<input type="text" name="plan" data-type="number" data-bind="value:plan" data-role="numerictextbox" role="spinbutton" class="k-input" aria-disabled="false" aria-readonly="false" style="display: none;">')
            .appendTo(container);

    input
        .keyup(function () {
            var self = $(this);
            var tr = self.closest('tr');

            var plan = self.val();
            var fact = $('.fact', tr).text();
            var childPlan = $('.childPlan', tr).text();

            var profitSumStr = getProfitSumStr(fact, plan);

            var prirostSumWithPercente = getPrirostSumWithPercente(plan, childPlan);

            $(".profitSumStr", tr).html(profitSumStr + ' %');
            $(".prirostSumWithPercente", tr).html(prirostSumWithPercente);
        });
}

var SalesPlansKPIGrid = function (gridId, filters) {

    if (!filters.Validate())
        return;

    $(gridId).empty();

    var dataSource = new kendo.data.DataSource({
        transport: {
            read: function (options) {
                $.ajax({
                    url: basePath + "SalesPlansKpi/GetSalesPlans",
                    data: filters,
                    type: 'post',
                    success: function (response) {
                        if (response.success === false) {
                            alert(response.message ? response.message : 'При записи данных произошла ошибка');
                        } else {

                            options.success(response.result);

                            updateApprovePlanControl(response.plan);

                            hideEditColumn();
                        }

                    },
                    error: function () {
                        alert('При загрузке данных произошла ошибка');
                    }
                });
            },
            update: function (options) {

                if (options.data.plan == null
                    || options.data.plan == "") {
                    options.data.plan = "0";
                }

                var data = {
                    indicator_id: options.data.id,
                    employee_id: filters.employee_id,
                    plan: options.data.plan.toString().replace('.', ','),
                    date: filters.date
                }

                $.ajax({
                    url: basePath + "SalesPlansKpi/UpdateSalesPlans",
                    type: 'post',
                    data: data,
                    success: function (response) {

                        if (response.success === false) {
                            alert('При записи данных произошла ошибка');
                        }

                        hideEditColumn();
                    },
                    error: function () {
                        alert('При записи данных произошла ошибка');
                    }
                });

                options.success(options.data);
            }
        },
        schema: {
            model: {
                id: "id",
                fields: {
                    name: {
                        type: "string",
                        editable: false
                    },
                    plan: {
                        type: "number",
                        editable: true
                    },
                    childPlan: {
                        type: "number",
                        editable: false
                    },
                    part: {
                        type: "number",
                        editable: false
                    },
                    fact: {
                        type: "number",
                        editable: false
                    },
                    change: {
                        type: "number",
                        editable: false
                    },
                    prirost: {
                        editable: false
                    }
                }

            }
        }
    });

    var nameColumn = [
        {
            field: "name",
            title: "Показатель"
        }
    ];

    var valueColumns = [
        {
            field: "fact",
            title: "Факт предыдущего периода",
            template: "<div class = 'raz'> #=fact ?kendo.toString(fact, 'n2'):''#</div>" +
                "<div class='fact' id='inputFact' hidden='true'> #=kendo.parseFloat(fact)#</div>"
        },
        {
            field: "plan",
            title: "План",
            //template: "#=plan ?kendo.toString(plan, 'n2'):''#"
            template: "<div class = 'raz'> #=plan>0 ? kendo.toString(plan, 'n2') : ''#</div>",
            editor: customEditor
        },
        {
            field: "part",
            title: "Доля вознаграждения, %",
            template: "<div class = 'raz' id='rText'> #=part>0 ? part + ' %' : ''#</div>"
        },
        {
            field: "change",
            title: "Прирост плана к факту пред. периода, %",
            template: "<div class = 'raz profitSumStr' id='outFact'> #=getProfitSumStr(fact, plan)#</div>"
        }
    ];

    var detailValueColumns = [
        {
            field: "fact",
            title: "Факт предыдущего периода",
            template: "<div class = 'raz'>#=fact ?kendo.toString(fact, 'n2'):''#</div>",
            aggregates: ["sum"],
            footerTemplate: "<div class = 'raz'>#=sum ?kendo.toString(sum, 'n2'):'0'#</div>"
        },
        {
            field: "plan",
            title: "План",
            //template: "#=plan ?kendo.toString(plan, 'n2'):''#"
            template: "<div class = 'raz'>#=plan>0 ? kendo.toString(plan, 'n2'): ''#</div>",
            aggregates: ["sum"],
            footerTemplate: "<div class = 'raz'> #=sum ?kendo.toString(sum, 'n2'):'0'#</div>"
        },
        {
            field: "part",
            title: "Доля вознаграждения, %",
            template: "<div class = 'raz'>#=part>0 ? part + ' %' : ''#</div>",
            // aggregates: ["sum"],
            //   footerTemplate: "<div class = 'raz'> #=sum ?kendo.toString(sum, 'n2'):'0'#</div>"
        },
        {
            field: "change",
            title: "Прирост плана к факту пред. периода, %",
            template: "<div class = 'raz'>#=getProfitSumStr(fact, plan)#</div>",
            aggregates: ["sum"],
            footerTemplate: getPrirostPlana
        }
    ];

    var endColumns = [
        {
            field: "prirost",
            title: "Прирост плана к подчиненным, %",
            template: "<div class = 'raz prirostSumWithPercente' id='pText' style='color: #=plan<childPlan? 'green':'red'#'>#=getPrirostSumWithPercente(plan,childPlan)#</div>" +
                "<div class='childPlan' id='inputFact' hidden='true'> #=childPlan#</div>"
        },
        {
            field: "command",
            command: [
                {
                    name: "edit",
                    text: {
                        edit: "",
                        update: "",
                        cancel: ""
                    }
                }
            ],

            title: "&nbsp;",
            width: "110px",
            hidden: true
        }
    ];

    var columns = nameColumn
        .concat(valueColumns)
        .concat(endColumns);

    var nameDetailColumn = [
        {
            field: "name",
            title: "Сотрудник",
            footerTemplate: "Итого:"
        }
    ];

    var columnsDetail = nameDetailColumn
        .concat(detailValueColumns);



    function detailInit(e) {

        var data = filters;

        data.indicator_id = e.data.id;

        $("<div/>").appendTo(e.detailCell)
            .kendoGrid({
                dataSource: {
                    type: "json",
                    transport: {
                        read: {
                            url: "SalesPlansKpi/GetSalesPlansByIndicator",
                            type: "POST",
                            data: 
                                {
                                    date: data.date,
                                    employee_id: data.employee_id,
                                    indicator_id: data.indicator_id,
                                    variant_id: data.variant_id
                            },
                        }
                    },
                    aggregate: [
                        { field: "fact", aggregate: "sum" },
                        { field: "plan", aggregate: "sum" },
                        { field: "part", aggregate: "sum" },
                        { field: "change", aggregate: "sum" }
                    ]
                },
                scrollable: false,
                sortable: true,
                columns: columnsDetail

            });
    }

    $(gridId)
        .kendoGrid({
            dataSource: dataSource,
            columns: columns,
            filterable: true,
            sortable: true,
            detailInit: detailInit,
            editable: 'inline'
        });

    function hideEditColumn() {
        if (filters.variant_id <= 0) {

            $(gridId)
                .data("kendoGrid")
                .hideColumn(6);
        }
    }
}