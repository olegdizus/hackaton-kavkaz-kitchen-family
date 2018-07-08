function FilterControl(options) {
    "use strict";
    try {
        var that = this;

        this.showLoadingData = function (isVisible) {
            if (isVisible) {
                $(that.refreshButton)
                    .prop('disabled', 'disabled')
                    .css('background', '#666');
                $("#loadingFilterEnabled").css('display', 'inline-block');
            }
            else {
                $(that.refreshButton).prop('disabled', '')
                    .css('background', '');
                $("#loadingFilterEnabled").hide();
            }
        };

        this.groupsInput = '#tagsInput';
        this.refreshButton = options.button || "#filterRefreshButton";

        this.refreshDiv = options.refreshNoteDiv || "#refreshNote";

        this.groupsUrl = options.groupsUrl || basePath + 'Filters/GetGroupNames';
        this.indicatorsUrl = options.indicatorsUrl || basePath + 'Filters/GetGroupValues';
        this.searchUrl = options.searchUrl || basePath + 'Filters/Search';

        this.onFilterChanged = options.onFilterChanged;
        this.onRefreshButtonClick = options.onRefreshButtonClick;

        this.onRefreshButtonClickCallback = options.onRefreshButtonClickCallback ||
            this.showLoadingData;

        this.filterGroups = [];

        this.isNotFireFilterChangedEventMode = false;

        this.activateRefreshButtonSelector = options.activateRefreshButtonSelector;

        this.RefreshButtonLocked = false;

        this.DataSource = new FilterDataSource(options);

        

    } catch (ex) {
        console.log('При вызове функции FilterControl произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);

    }
   
}

FilterControl.prototype.fireFilterChanged = function () {
    if (this.onFilterChanged) {
        var filters = filterControl.getFilterValues();

        this.onFilterChanged(filters);
    }

}

FilterControl.prototype.onRefreshButtonCallback=function() {
    
}

FilterDataSource=function(options) {
    this.groupsUrl = options.groupsUrl || basePath + 'Filters/GetGroupNames';
    this.indicatorsUrl = options.indicatorsUrl || basePath + 'Filters/GetGroupValues';
    this.searchUrl = options.searchUrl || basePath + 'Filters/Search';
}

function TrisStateInit() {

    $('.tristate').tristate();

    $('.tristate').change(function() {

        var parentElement = $($(this).context.parentElement);
        var headElement = $(parentElement.context.parentElement);
        var parentHeadsElement = $(headElement.context.parentElement);
        var groupElement = $(parentHeadsElement.context.children[1]);
        var mass = $(groupElement.context.children);

        if (this.indeterminate == true
            || this.checked == false) {

            $($('#' + this.id).tristate()).tristate('state', false);

            mass.removeClass("selected");
        } else if (this.checked == true) {

            mass.addClass("selected");
        }
    });
}


FilterControl.prototype.ChangeStateCheckBox = function (selector) {

    var countSelected = $('#' + selector.id).find(".selected").length;

    var countAll = $($(selector).context.children).length;

    var checkBox = $("#cb" + selector.id);

    var $tristate = checkBox.tristate();

    if (countSelected == 0) {
        $tristate.tristate('state', false);

        return;
    }

    if (countSelected == countAll) {
        $tristate.tristate('state', true);

        return;
    }

    if (countSelected != countAll) {
        $tristate.tristate('state', null);

        return;
    }
}

FilterDataSource.prototype.loadGroups = function (loadGroupsCallBack) {

    try {
        $.ajax({
            url: this.groupsUrl,
            type: "get",
            async: false,
            dataType: "json",
            success: function (dataJson) {

                loadGroupsCallBack(dataJson);
            }
        });
    } catch (ex) {
        console.log('При вызове функции FilterControl.loadGroups произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);

    }
}

FilterControl.prototype.loadGroups = function () {

    var that = this;

    this.DataSource.loadGroups(
        function(dataJson) {

            that.DrawModalFilters(dataJson);
            that.initGroups();
        });
}

FilterControl.prototype.DrawModalFilters = function (data) {
    try {
        var appendArray = [];


        // Создаем группы в модальном окне
        for (var property in data) {

            if (!data.hasOwnProperty(property)) {
                continue;
            }

            var dataProperty = data[property];
            var value = dataProperty.value;

            var template = [
                '<div class="col-md-3">' +
                    '<div class="list-group">' +
                        '<a href="#" class="list-group-item active" data-value="' + value + '" ' +
                            'data-large="' + dataProperty.isLarge + '" id="tl' + value + '" >' + property + 
                            "<input class='tristate' type='checkbox' id='cb" + value + "' style='float:right'>" +
                            "</a> " +
                    '</div>' +
                    '<div id="' + value + '" ' +
                    'data-isTransferNameToServer="' + dataProperty.isTransferNameToServer + '" ' +
                    'class="list-group scrollable-list">' +

                    '</div>' +
                '</div>'
            ];

            appendArray.push.apply(appendArray, template);

            this.filterGroups.push(value);

        }
        
        $('.filter-groups').append(appendArray);


        TrisStateInit();


        for (property in data) {

            if (!data.hasOwnProperty(property)) {
                continue;
            }

            dataProperty = data[property];
            value = dataProperty.value;

            if (!dataProperty.isLarge) {
                continue;
            }

            var selector = 'find' + value;

            $('#' + value)
                .append('<input type="text" class="form-control" id="' + selector + '" value="" placeholder="Начните ввод...">');

            var groupName = value;

            this.InitTypeAhead(groupName, selector);
        }

    } catch (ex) {
        console.log('При вызове функции FilterControl.fillModalFilters произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);

    }
}

FilterControl.prototype.InitTypeAhead = function (groupName, ourSelector) {
    var that = this;

    that.createTypeAhead(
        '#' + ourSelector,
        function (query) {

            var results = that.searchInGroup(query, groupName);

            return results;
        },
        that.onChangeModalItem,
        true);
}

FilterControl.prototype.initGroups = function () {
    try {
        var that = this;

        var selectorGroups = this.disp_FilterElements();

        selectorGroups.forEach(function (currentGroupSelector) {
            var selector = currentGroupSelector;

            $(document)
                .on("click", selector,
                    function () {
                        that.changeSelection(this, true);
                    });
        });
        
    } catch (ex) {
        console.log('При вызове функции FilterControl.initGroups произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);

    }
}

FilterControl.prototype.changeSelect = function (selectedItem, allowMultiple) {

    var selected = $(selectedItem);

    if (selected.hasClass("active"))
        return;

    if (!allowMultiple) {//TODO: Проверить!!
        selected.removeClass("selected");
    }

    selected.toggleClass("selected");

    this.updateButtonStatus(true);//TODO: сделать событием!!!

    return selected;
}


FilterControl.prototype.changeSelection = function (selectedItem, allowMultiple) {

    try {

        var selected = FilterControl.prototype.changeSelect(selectedItem, allowMultiple);

        var parent = selected.context.parentElement;

        FilterControl.prototype.ChangeStateCheckBox(parent);//TODO: в событие


    } catch (ex) {
        console.log('При вызове функции FilterControl.changeSelection произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);

    }
}


FilterControl.prototype.disp_FilterElements=function() {
    var filterValuesSelectors=[];

    for (var i = 0, length = this.filterGroups.length; i < length; i++) {

        var current = this.filterGroups[i];

        var selector = '#' + current + ' a';

        filterValuesSelectors[i] = selector;
    }

    return filterValuesSelectors;
}

FilterControl.prototype.getAllFilterValues = function () {
    try {
        var filterValues = [];
        var selectors = this.disp_FilterElements();

        for (var i = 0, length = selectors.length; i < length; i++) {

            $(selector[i])
                .each(function (ind, val) {

                filterValues
                    .push({
                        name: $(val).text(),//TODO: трансляция
                        parent: current
                    });

                    return true;
                });
        }

        return filterValues;
    } catch (ex) {
        console.log('При вызове функции FilterControl.getAllFilterValues произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);

    }
}

FilterControl.prototype.getFilterValues = function () {
    try {

        var arr = {};

        var selectors = this.filterGroups;

        for (var i = 0, length = selectors.length; i < length; i++) {

            var current = selectors[i];

            var selector = '#' + current + ' a[class*="list-group-item"]';

            arr[current] = [];

            $(selector).each(function (ind, val) {
                if (!$(val).hasClass("selected")) {
                    return true;
                }

                arr[current].push(
                    {
                        name: $(val).text(),//TODO: трансляция
                        id: $(val).attr('id')
                    }
                );

                //arr[current].push($(val).text());

                return true;
            });
            
            //if (current == "Goods_Type") {//TODO: изменить! В событие!
            //    if (arr[current].length == 0) {

            //        arr[current].push($(selector).last().text());

            //        $(selector).last().toggleClass("selected", true);
            //    }
            //}

            var group = $('#' + current);

            FilterControl.prototype.ChangeStateCheckBox(group[0]);//TODO: В событие!

        }

        return arr;
    } catch (ex) {
        console.log('При вызове функции FilterControl.getFilterValues произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);

    }
}

FilterControl.prototype.fillFiltersList = function (dataFilters) {

    try {
        var filter = dataFilters ? dataFilters : this.getFilterValues();

        try {

            this.refreshFiltersList(filter);

        } catch (ex) {
            console.log('При вызове функции FilterControl.refreshFiltersList произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);
        }

        if (!dataFilters) {
            this.fireFilterChanged();

        } else {
            this.updateButtonStatus(false);
        }
    } catch (ex) {
        console.log('При вызове функции FilterControl.fillFiltersList произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);

    }
}

//TODO: Разделить на модальное окно и на ввод фильтров
FilterControl.prototype.refreshFiltersList = function (filter) {

    $('#input-groups').empty();

    $(this.groupsInput).tagsinput('removeAll');

    for (var index in filter) {

        var filterIndex = filter[index];

        if (filterIndex.length == 0) {
            continue;
        }

        var groupName = $('#tl' + index).text();

        $(this.groupsInput)
            .tagsinput(
            'add', this.GetTagsinputField(groupName, groupName));

        for (var i = 0; i < filterIndex.length; i++) {
            $('#gr' + index).tagsinput('add', 
                {
                    name: filterIndex[i].name, //TODO: трансляция
                    id: filterIndex[i].id
                } );
        }
    }
}

FilterControl.prototype.GetTagsinputField = function (name, id) {//TODO: трансляция
    return { name: name, id: id };
}

//TODO: к каким группам относится?
FilterControl.prototype.fillGroups = function (data, onLoaded) {
    try {
        var that = this;

        var onSuccess = function (dataJson) {

            var parsed = JSON.parse(dataJson);

            for (var property in parsed) {
                if (!parsed.hasOwnProperty(property))
                    continue;

                var parsedProperty = parsed[property];


                if (parsedProperty.length > 0) {
                    for (var i = 0; i < parsedProperty.length; i++) {
                        //TODO: убрать дублирование
                        $('#' + property).append('<a href="#" id="' + parsedProperty[i].id + '" class="list-group-item">' + parsedProperty[i].name + '</a>');
                    }
                }
                else{
                    $('#' + property).append('<label class="list-group-item">Нет фильтров для текущего интервала</label>');
                }

            }

            that.init();

            if (onLoaded) {
                onLoaded();
            }
        }

        this.loadIndicators(data, onSuccess);
    } catch (ex) {
        console.log('При вызове функции FilterControl.fillGroups произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);

    }
}

FilterControl.prototype.createTypeAhead = function (selector, sourceFunc, onChangeFunc, hideTags) {
    try {
        var that = this;

        var getTagsClass = function (item) {

            return hideTags ? 'label label-info hide-tags' : 'label label-info';
        }

        getTagsClass();



        var typeaheadOptions = {
            //name: 'sourceFunc',
            minlength: 1,
            itemValue: 'id',
            displayKey: 'name',

            matcher: function (item) {
                return true;
            },
            sorter: function (items) {
                return items;
            },
            highlighter: function (item, query) {

                var find = query
                    .replace(/[\.\*\+]/g, ' ')
                    .replace(/\*/g, ' ')
                    .replace(new RegExp('(.)', 'gi'), "$1|");

                var regex = new RegExp('(' + find.substr(0, find.length - 1) + ')', 'gi');

                return item.replace(regex, "<strong>$1</strong>");
            },
            source: sourceFunc,
            afterSelect: function () {
                this.$element[0].value = '';
            },
            freeInput: false,
            tagClass: getTagsClass
        };

        $(selector).tagsinput({
            itemValue: 'id',
            itemText: 'name',
            typeahead: typeaheadOptions
        });


        $(selector).on('itemRemoved', function (event) {
            onChangeFunc(that, event, true);
        });

        $(selector).on('itemAdded', function (event) {
            onChangeFunc(that, event, false);
        });
    } catch (ex) {
        console.log('При вызове функции FilterControl.createTypeAhead произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);

    }
}

FilterControl.prototype.init = function () {
    try {
        var that = this;

        this.createTypeAhead(this.groupsInput,
            function (query) {

                var groups = $('.filter-groups .list-group .active')
                    .map(function () {
                        return { id: this.id, name: this.text };
                    })
                    .get();

                var findedGroups = StringNote.filterByLcs(query, groups, 5);

                return findedGroups;
            },
            that.onChangeGroup);

        $("#openFilterControlModalButton").click(function () {
            var bubbleFilterModalWindow = $('#filterControlModal');

            bubbleFilterModalWindow.modal('show');
        });

        $("#saveFilterButton").click(function () {

            $("#filterControlModal").modal("toggle");

            that.isNotFireFilterChangedEventMode = true;

            that.fillFiltersList();

            that.isNotFireFilterChangedEventMode = false;

            that.fillView();
        });

        $("#filterControlCollapseClick").click(function () {

            that.changeView();
        });

    

        this.initializeButton();
    } catch (ex) {
        console.log('При вызове функции FilterControl.init произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);

    }
}


FilterControl.prototype.bindControlsWithRefreshButton = function () {

    var that = this;

    $(document)
        .on(
            "change",
            ".activateRefreshButton",
            function () { that.SetButtonStatus(that); });
}


//TODO: вынести в обертку кнопки


FilterControl.prototype.SetOnRefreshButtonClick = function (refreshButtonClick) {
    try {

        this.onRefreshButtonClick = refreshButtonClick;

    } catch (ex) {
        console.log('При вызове функции SetOnRefreshButtonClick произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);

    }

}

FilterControl.prototype.SetButtonStatus = function (obj) {
    try {
        obj.updateButtonStatus(true);

    } catch (ex) {
        console.log('При вызове функции SetButtonStatus произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);

    }

}

FilterControl.prototype.lockRefreshButton = function () {
    this.RefreshButtonLocked = true;
}

FilterControl.prototype.dislockRefreshButton = function () {
    this.RefreshButtonLocked = false;
}



//TODO: вынести в обертку кнопки.
FilterControl.prototype.initializeButton = function () {
    try {

        $(this.refreshButton).show();


        var that = this;

        if (typeof this.onRefreshButtonClick == 'function') {

            $(this.refreshButton).click(function () {

                that.onRefreshButtonClick(that.onRefreshButtonClickCallback);
                
            });


            $(this.refreshDiv).click(function () {

                that.onRefreshButtonClick();
                that.onRefreshButtonClick(that.onRefreshButtonClickCallback);
                that.updateButtonStatus(false);
            });
        }

        $(this.refreshButton).click(function () {

            that.updateButtonStatus(false);
        });
    } catch (ex) {
        console.log('При вызове функции FilterControl.initializeButton произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);

    }
}

//TODO: вынести в обертку кнопки.
FilterControl.prototype.updateButtonStatus = function (isChanged) {
    if (this.RefreshButtonLocked!=true) {
        try {
            var changedClass = 'btn-danger';
            var refreshedClass = 'btn-primary';

            if (isChanged) {
                $(this.refreshButton)
                    .addClass(changedClass)
                    .removeClass(refreshedClass);

                $(this.refreshDiv).show();
            } else {
                $(this.refreshButton)
                    .addClass(refreshedClass)
                    .removeClass(changedClass);

                $(this.refreshDiv).hide();
            }
        } catch (ex) {
            console.log('При вызове функции FilterControl.updateButtonStatus произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);

        }
    }
}

FilterControl.prototype.getGroupsDict = function () {
    try {
        var groups = $('.filter-groups .list-group .active')
            .map(function () {
                return { text: this.text, value: this.getAttribute('data-value') };
            })
            .get();

        return groups;
    } catch (ex) {
        console.log('При вызове функции FilterControl.getGroupsDict произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);

    }
}

FilterControl.prototype.onChangeFilterItem = function (control, event, isRemove) {
    try {

        //console.log(this);

    var parent = event.target.id.substring(2);

    var selected = $('#' + parent + ' a[class*="list-group-item"]:contains("' + event.item.name + '")');


        $(selected).each(function(index, value) {

            if (value.text == event.item.name) {
                $(this).toggleClass("selected", !isRemove);
            }
            return true;
        });


        if (control.isLarge(parent)) {
            $('#find' + parent).tagsinput(isRemove ? 'remove' : 'add', { name: event.item.name, id: event.item.id });
        }

        if (!control.isNotFireFilterChangedEventMode) {

            control.fireFilterChanged();
        }

        if (isRemove) {
            control.fillFiltersList();
        }
        
        control.updateButtonStatus(true);


    } catch (ex) {
        console.log('При вызове функции FilterControl.onChangeFilterItem произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);

    }
}

FilterControl.prototype.isLarge = function (group) {
    try{
        return $('#tl' + group).data('large');
    } catch (ex) {
        console.log('При вызове функции FilterControl.isLarge произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);

    }
}

FilterControl.prototype.onChangeModalItem = function (control, event, isRemove) {
    try {
        var parent = event.target.id.substring(4);

        var selected = $('#' + parent + ' a[class*="list-group-item"]:contains("' + event.item.name + '")');


        if (isRemove) {
            selected.remove();
        } else {

            if (!selected.length) {
                $('#' + parent).append('<a href="#" id="' + event.item.id + '" class="list-group-item">' + event.item.name + '</a>');

                selected = $('#' + parent + ' a[class*="list-group-item"]:contains("' + event.item.name + '")');


                selected.click(function () {

                    var current = selected;
                    var title = event.item.name;

                    if (current.hasClass('selected')) {
                        $('#find' + parent).tagsinput('remove', this.GetTagsinputField(title, event.item.id));
                    }
                });

            }

            selected.toggleClass("selected", true);
        }



    } catch (ex) {
        console.log('При вызове функции FilterControl.onChangeModalItem произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);

    }
}

FilterControl.prototype.searchInGroup = function (query, group) {
    try{
        if (this.isLarge(group)) {

            var url = this.searchUrl;

            var results = [];

            $.ajax({
                url: url,
                type: "post",
                data: {
                    query: query,
                    group: group
                },
                async: false,
                dataType: "json",
                success: function (dataJson) {
                    results = dataJson;
                }
            });

            return results;
        } else {

            var items = $('#' + group + ' a')
                .map(
                    function() {
                        return { id: this.id, name: this.text };
                    });

            //var findedItems = StringNote.filterByLcs(query, items, 10);

            return items;
        }
    } catch (ex) {
        console.log('При вызове функции FilterControl.searchInGroup произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);

    }
}

FilterControl.prototype.addGroup = function (name, text) {
    try{
    var selector = 'gr' + name;

    var that = this;

    var template = [
        '<div class="input-group">' +
            '<span class="input-group-addon">' + text + '</span>' +
            '<input type="text" class="form-control" id="' + selector + '" value="" >' +
        '</div>'
    ];

    $('#input-groups').append(template);

    that.createTypeAhead('#' + selector,
        function (query) {

            var groupName = name;

            var results = that.searchInGroup(query, groupName);

            return results;
        },
        that.onChangeFilterItem);
    } catch (ex) {
        console.log('При вызове функции FilterControl.addGroup произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);

    }
}

FilterControl.prototype.onChangeGroup = function (control, event, isRemove) {
    try{
        var groups = control.getGroupsDict();

        var group = $.grep(groups, function (e) { return e.text == event.item.name; })[0];

        var selector = 'gr' + group.value;

        if (isRemove) {

            if (control.isLarge(group.value)) {
                $('#' + group.value + ' a').remove();
                $('#find' + group.value).tagsinput('removeAll');
            }

            $('#' + group.value + ' a').toggleClass('selected', false);
            $('#' + selector).parent().remove();

            // При удалении группы шлем обновление
            control.fireFilterChanged();
            control.updateButtonStatus(true);

            control.fillFiltersList();

            control.fillView();
        } else {

            control.addGroup(group.value, group.text);

        }
    } catch (ex) {
        console.log('При вызове функции FilterControl.onChangeGroup произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);

    }
}

FilterControl.prototype.updateModalFilters = function (data) {
    try{
    var that = this;

    var onSuccess = function (dataJson) {

        var parsed = JSON.parse(dataJson);

        for (var property in parsed) {
            if (!parsed.hasOwnProperty(property) || that.isLarge(property))
                continue;

            // Сначала получаем выбранные элементы
            var selectedItems = $('#' + property + ' a[class*="list-group-item selected"]')
                .map(function () {
                    return this.text;
                });

            // Затем удаляем текущий список
            $('#' + property + ' a[class*="list-group-item"]').remove();

            // Заполняем список новыми данными
            var parsedProperty = parsed[property];

            var properties = [];

            for (var i = 0, length = parsedProperty.length; i < length; i++) {
                properties.push('<a href="#" id="' + parsedProperty[i].id + '" class="list-group-item">' + parsedProperty[i].name + '</a>');
            }

            $('#' + property).append(properties);

            if (!selectedItems.length) {
                continue;
            }

            // Восстанавливаем выбранные элементы
            for (i = 0, length = selectedItems.length; i < length; i++) {

                var selectedItem = selectedItems[i];

                var selected = $('#' + property + ' a[class*="list-group-item"]:contains("' + selectedItem + '")');

                    $(selected).each(function (index, value) {

                        if (value.text == selectedItem) {
                            
                            if (!$(this).length) {

                                $('#gr' + property).tagsinput('remove', this.GetTagsinputField(selectedItem, selectedItem));

                                return true;
                            }

                            $(this).toggleClass("selected", true);

                        }

                        return true;
                    });
            }
        }
        console.log("End filter " + new Date());
    }

    this.loadIndicators(data, onSuccess);

    

  } catch (ex) {
      console.log('При вызове функции FilterControl.updateModalFilters произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);

}
}

FilterControl.prototype.loadIndicators = function(data, callback) {
    try {
        var url = this.indicatorsUrl;

        $.ajax({
            dataType: "json",
            url: url,
            type: 'get',
            async: true,
            data: data,
            success: function(dataJson) {

                callback(dataJson);
            }
        });
    } catch (ex) {
        console.log('При вызове функции FilterControl.loadIndicators произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);

    }
}

FilterControl.prototype.bindAndInit = function(beginSelector, endSelector, onLoadFunc) {
    try {
        var that = this;

        //TODO: убрали поскольку при редактировании дат отправлялся запрос на сервер, даже когда даты были не корректны
        //$(beginSelector).change(function() {
        //    that.updateModalFilters(getDates());
        //});

        //$(endSelector).change(function() {
        //    that.updateModalFilters(getDates());
        //});

        this.loadGroups();

        this.fillGroups(getDates(), onLoadFunc);
    } catch (ex) {
        console.log('При вызове функции FilterControl.bindAndInit произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);

    }
}

FilterControl.prototype.isShortMode = function () {
    try{
        return $('#filterControlCollapse').hasClass('glyphicon-chevron-up');
    } catch (ex) {
        console.log('При вызове функции FilterControl.isShortMode произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);

    }
}

FilterControl.prototype.changeView = function () {
    try{
    var showPreview = this.isShortMode();

    if (showPreview) {

        this.fillView();

        $('.filter-hide').hide();
        $('#filterControlPreviewPanel').show();
        $('#filterControlCollapse').addClass('glyphicon-chevron-down').removeClass('glyphicon-chevron-up');
    } else {
        $('#filterControlPreviewPanel').hide();
        $('.filter-hide').show();
        $('#filterControlCollapse').addClass('glyphicon-chevron-up').removeClass('glyphicon-chevron-down');
    }
 } catch (ex) {
     console.log('При вызове функции FilterControl.changeView произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);

}
}

// Заполняет представление короткого обзора выбранных групп
FilterControl.prototype.fillView = function() {
    try {
        $('#filterControlPreviewPanel').empty();

        var filters = this.getFilterValues();

        for (property in filters) {

            if (!filters.hasOwnProperty(property) || !filters[property].length) {
                continue;
            }

            filterNames = [];
            for (var i = 0; i < filters[property].length; i++) {

                filterNames.push(filters[property][i].name);
            }

            var groupName = $('#tl' + property).text();

            $('#filterControlPreviewPanel')
                .append('<strong>' + groupName + '</strong>: ' + filterNames.join(', '));
            $('#filterControlPreviewPanel').append('. ');
        }
    } catch (ex) {
        console.log('При вызове функции FilterControl.fillView произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);
    }
}


FilterControl.prototype.fillFromString = function(jsonString) {

    try {
        var filter = JSON.parse(jsonString);

        this.isNotFireFilterChangedEventMode = true;

        //if (!filter.Goods_Type) {
        //    filter.Goods_Type = [];
        //}

        //if (filter.Goods_Type.length == 0) {
        //    filter.Goods_Type.push(
        //        {
        //            id: "2",
        //            name: "Продукция Сатурн"
        //        }
        //    );

        //    
        //}


        var needUpdate = true;
        this.fillFiltersList(filter);

        if (needUpdate) {
            this.fireFilterChanged();
        }


        this.isNotFireFilterChangedEventMode = false;
    } catch (ex) {
        console.log('При вызове функции FilterControl.fillFromString произошла ошибка! \nТип ошибки:' + ex.name + '\nСообщение ошибки: ' + ex.message + '\nСтек вызовов: ' + ex.stack);

    }
}