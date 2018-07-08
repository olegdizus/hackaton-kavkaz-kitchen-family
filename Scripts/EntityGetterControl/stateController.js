function StateController(selectContactCtrlState) {
    var thisInstance;
    
    this.setThisInstance = function(stateContollerInstance) {
        thisInstance = stateContollerInstance;
    }
        
    this.changeState = function () {
        var button = selectContactCtrlState.createNewEntityBtn;
        var currentState = button.attr('state');

        switch (currentState) {
            case 'new':
                {
                    toSelectionState();
                    break;
                }
            case 'exist':
                {
                    this.toCreationOfNew();
                    break;
                }

            default:
                {
                    alert('Неизвестное состояние: ' + currentState);
                }
        }
    }

    this.addNewContact = function(
        data,
        ajaxMethodUrl,
        initConfirmViewHandlersCallback,
        initCreateNewContactHandlerCallback) {
        $.ajax({
            url: ajaxMethodUrl,
            data: data,
            type: 'POST',
            success: function (data) {
                if (data.needCreateAddress) {
                    var warning = {
                        messageType: "Warning",
                        message: "Заполните адрес клиента. <br><br>Подсказка Хостесу: <br><i>Мы постоянно улучшаем наш сервис и потому собираем информацию о клиентах. Вас не затруднит, посодействовать нам в этом? Подскажите, по какому адресу Вы проживаете?</i><br> <br>Для продолжения нажмите 'Создать' еще раз."
                    }
                    notification.showMessage(warning);

                    return;
                }

                var answer = $('#answer', data);
                var confirmView = $('#createContactConfirmView', data);

                if (answer.length > 0) {
                    createSuccess($('#contact_id', data).val(), $('#name', data).val());


                } else if (confirmView.length > 0) {
                    var innerHtml = confirmView[0].innerHTML;

                    $('#CreateConfirmModal').html(innerHtml);
                    $('#CreateConfirmModal').modal('show');

                    initConfirmViewHandlersCallback();
                } else {
                    console.log(data);
                    $('#ContactFormParenDiv').html('');
                    $('#ContactFormParenDiv').html($('#ContactFormParenDiv', data).html());
                    InitAllPickers($('#ContactFormParenDiv'));
                }

                initCreateNewContactHandlerCallback();
            }
        });
    }

    function createSuccess(contact_id, name) {
        selectContactCtrlState.entityIdHidden.attr('value', contact_id);
       
        TypeahedSetValue(
            selectContactCtrlState.entityNameInput.attr('id'),
            contact_id,
            name);

        toSelectionState();
    }

    function toSelectionState() {
        hideContactForm();
        selectContactCtrlState.createNewEntityBtn.attr('state', 'exist');
        selectContactCtrlState.createNewEntityBtn.val('Новый');

    }

    function hideContactForm() {
        selectContactCtrlState.createNewEntityForm.css('display', 'none');
        selectContactCtrlState.newEntityFieldsFormDiv.html('');
        selectContactCtrlState.prchsButtons.show();
        selectContactCtrlState.alterForm.fadeIn(1000);

        selectContactCtrlState.entityNameInput.prop('disabled', false);
    }

    this.toCreationOfNew = function () {
        this.showContactForm();

        selectContactCtrlState.createNewEntityBtn.attr('state', 'new');
        selectContactCtrlState.createNewEntityBtn.val('Выбрать');

    }

    this.showContactForm = function () {
        selectContactCtrlState.alterForm.fadeOut(500);
        //selectContactCtrlState.createNewEntityForm.css('display', '');
        selectContactCtrlState.prchsButtons.hide();
        

        this.insertContacFieldForm();

        var contactTypeHead = selectContactCtrlState.entityNameInput;

        $('.typeahead.dropdown-menu', selectContactCtrlState.thisView).html('');

        contactTypeHead.prop('disabled', true);
        contactTypeHead.prop('value', '');
    }

    this.insertContacFieldForm = function () {
        $.ajax({
            url: basePath + 'Contacts/CreateFieldView',
            contentType: 'application/html; charset=utf-8',
            dataType: 'html',
            success: function (data) {
                var newContactDiv = selectContactCtrlState.newEntityFieldsFormDiv;
                //newContactDiv.html('');
                var ContactFormDiv = $('#ContactFormParenDiv', data);
                newContactDiv.html(ContactFormDiv[0].outerHTML);
                InitAllPickers(newContactDiv);

                var scripts = $('script', ContactFormDiv);
                var form = $(selectContactCtrlState.thisView);

                scriptRegistration(scripts, form);

                var viewCtrl = new CreateFieldViewController(thisInstance);
                viewCtrl.initHandlers();
                selectContactCtrlState.createNewEntityForm.fadeIn(500);
                //$(selectContactCtrlState.entityNameInput).change();
            }
        });
    }

    function scriptRegistration(scripts, parentDiv) {
        $(parentDiv).append(scripts);
    };
}