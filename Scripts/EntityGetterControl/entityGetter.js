function CreateEntityGetterController(id) {
    var entityInputCtrl = $('#' + id);

    if (entityInputCtrl.length == 0)
        alert("Контрол " + id + " не найден");

    var entityGetterController = new EntityGetterController(
        id,
        entityInputCtrl.attr('readonly'),
        entityInputCtrl.attr('urlList'));

    return entityGetterController;
}

function EntityGetterController(ControlID, isReadOnly, urlGetEntityByList) {

    EntityGetterController.mapById[ControlID] = this;

    this.getEntityId = function() {
        return selectEntityCtrlState.entityIdHidden.val();
    }

    this.getEntityName = function() {
        return selectEntityCtrlState.entityNameInput.val();
    }

    this.clearEntityNameInput = function() {
        TypeahedSetValue(
            selectEntityCtrlState.entityNameInput.attr('id'),
            '',
            '');
    }

    this.initHandlers = function(allowNewValue) {
        this.initCtrlState();

        var stateCtrl = createAndInitStateCtrl();

        $(selectEntityCtrlState.createNewEntityBtn)
            .on('click', function() {
                stateCtrl.changeState(stateCtrl);

                if (EntityGetterController.mapById[ControlID].newEntityCreateFormOpenSubscribersCallback)
                    EntityGetterController.mapById[ControlID].newEntityCreateFormOpenSubscribersCallback.call();
            });

      

        if (!isReadOnly) {

            InitTypehead(selectEntityCtrlState, urlGetEntityByList, insertTextAndIdValuesToInputs, allowNewValue);
        }
    }

    this.setChangeInputHandler = function(handler) {
        this.initCtrlState();

        $(selectEntityCtrlState.entityNameInput).unbind('change');

        InitTypehead(selectEntityCtrlState, urlGetEntityByList, handler);
    }

    function insertTextAndIdValuesToInputs(values) {

        if (noOneEntityIsSelected()) {
            resetEntityId();
        } else {
            $(selectEntityCtrlState.entityIdHidden).attr('value', values.value).trigger('change');
            $(selectEntityCtrlState.entityNameInput).prop('value', values.text);
        }

        if (EntityCreateListView.onEntitySelectChange != null) {
            EntityCreateListView.onEntitySelectChange(values.text, values.value);
        }
    }

    function noOneEntityIsSelected() {
        return selectEntityCtrlState.entityNameInput.val() == 0;
    }

    function resetEntityId() {
        selectEntityCtrlState.entityIdHidden.val('0');
    }

    function createAndInitStateCtrl() {
        var stateCtrl = new StateController(selectEntityCtrlState);
        stateCtrl.setThisInstance(stateCtrl);

        return stateCtrl;
    }

   
    //TODO: избавиться от глобальных переменных, заменить на передачу настроек в класс и callback-функции
    //Образец смена карты в редактировании контакта
    var selectEntityCtrlState = {
        ControlID: ControlID,
        entityNameInput: $('#' + ControlID),
        entityIdHidden: $('#' + ControlID + "_hidden"),
        thisView: $('#' + ControlID + 'entityGetterListViewDiv'),
        createNewEntityBtn: $('#' + ControlID + 'formButton'),
        createNewEntityForm: $('#createNewEntity'),
        newEntityFieldsFormDiv: $('#newEntityFieldsFormDiv'),
        readEntityCardBtn: $('#' + ControlID + 'cardButton'),
        prchsButtons: $('#submitCrateForm, #btnPurchase, #btnCreateSale'),
        alterForm: $('#formDiv')
    }

    this.initCtrlState = function() {
        selectEntityCtrlState = {
            ControlID: ControlID,
            entityNameInput: $('#' + ControlID),
            entityIdHidden: $('#' + ControlID + "_hidden"),
            thisView: $('#' + ControlID + 'entityGetterListViewDiv'),
            createNewEntityBtn: $('#' + ControlID + 'formButton'),
            createNewEntityForm: $('#createNewEntity'),
            newEntityFieldsFormDiv: $('#newEntityFieldsFormDiv'),
            readEntityCardBtn: $('#' + ControlID + 'cardButton'),
            prchsButtons: $('#submitCrateForm, #btnPurchase, #btnCreateSale'),
            alterForm: $('#reservBodyFields')
        }
    }

    this.subsribeForNewEntityCreateFormStateChange = function(callback) {
        this.newEntityCreateFormOpenSubscribersCallback = callback;
    }

    this.toggleCreateNewEntityBtn = function() {
        selectEntityCtrlState.createNewEntityBtn.toggle();
    }

    this.removeTypeahead = function() {
        selectEntityCtrlState.entityNameInput.removeData('typeahead');
        $('#typeAh' + selectEntityCtrlState.entityNameInput.attr('id') + '.typeahead').remove();
    }

    this.removeTypeaheadActiveElement = function() {
        $('#typeAh' + selectEntityCtrlState.entityNameInput.attr('id') + '.typeahead li.active').removeClass('active');
    }
}

EntityGetterController._getInstanceMap = function () {
    if (!EntityGetterController.mapById)
        EntityGetterController.mapById = [];

    return EntityGetterController.mapById;
};

EntityGetterController.GetInstance = function (id) {

    var instanceMap = EntityGetterController._getInstanceMap();

    if (!instanceMap[id]) {
        instanceMap[id] = CreateEntityGetterController(id);
    }

    return instanceMap[id];
};
