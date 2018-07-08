var EntityCreateListView = {
    onEntitySelectChange: null
}

function InitTypehead(selectEntityCtrlState, ajaxMethodUrl, insertTextAndIdValuesToInputs,allowNewValue) {
    var thisView = selectEntityCtrlState.thisView;
    var nameInput = selectEntityCtrlState.entityNameInput;
    this.countElement = 10;
    nameInput.attr('data-provide', "typeahead");

    unbindOldTypeaheadHandlers();
    removeOldTypeahead();
    createNewTypeahead();

    function unbindOldTypeaheadHandlers() {
        nameInput.unbind('focus');
        nameInput.unbind('blur');
        nameInput.unbind('keyup');
        nameInput.unbind('keydown');
        nameInput.unbind('keypress');
        nameInput.unbind('mouseenter');
    }

    function removeOldTypeahead() {
        nameInput.removeData('typeahead');
        $('#typeAh' + nameInput.attr('id') + '.typeahead').remove();
    }

    function createNewTypeahead() {
        nameInput.typeahead({
            ajax: ajaxMethodUrl,
            matcher: function (item) {
                return true;
            },
            sorter: function (items) {
                return items;
            },
            highlighter: function (item) {

                var find = this.query
                    .replace(/[\.\*\+]/g, ' ')
                    .replace(/\*/g, ' ')
                    .replace(new RegExp('(.)', 'gi'), "$1|");
                var regex = new RegExp('(' + find.substr(0, find.length - 1) + ')', 'gi');

                return item.replace(regex, "<strong>$1</strong>");
            },
            showAll: true
        });
    }

    function getValue() {
        var activeEntity = $('#typeAh' + nameInput.attr('id') + '.typeahead li.active');

        var text = $('a', activeEntity).text();
        var value = activeEntity.data('value');

        return { value: value, text: text };
    };

    if (!allowNewValue) {

        $(nameInput).on('change', function () {
            insertTextAndIdValuesToInputs(getValue());
        });
    }
}

function TypeahedSetValue(controlId, value, text) {
    var typeahedMenu = $('#typeAh' + controlId + '.typeahead');

    $('li.active', typeahedMenu).removeClass("active");

    typeahedMenu.prepend("<li class='active' data-value='" + value + "' >"
        + "<a href='#'>" + text + "</a></li>");

    var textInput = $('#' + controlId);

    textInput.prop('value', text);
    textInput.trigger('change');

};