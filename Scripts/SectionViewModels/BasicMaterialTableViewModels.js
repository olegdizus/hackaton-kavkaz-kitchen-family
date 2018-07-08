function createBasicMaterialTableViewModels() {
    try {
        var basicMaterialTable = basicMaterialViewModel({
        });
        
        wigetsViewModels.add('basicMaterialTable', basicMaterialTable);

    } catch (ex) {
        console.log('Во вызова функции basicMaterialTable произошла ошибка! \nТип ошибки:' +
            ex.name +
            '\nСообщение ошибки: ' +
            ex.message +
            '\nСтек вызовов: ' +
            ex.stack);

    }
}