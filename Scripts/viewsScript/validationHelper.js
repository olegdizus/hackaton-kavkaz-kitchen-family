
function ShowValidationError(data) {
    if (data.errorModel) {       
        $.each(data.errorModel, function (i, itemData) {
            var strErrors="";

            $.each(itemData, function (j, itemStr) {
                strErrors = strErrors + itemStr + "<br>";
            });

            strErrors = strErrors
                .substring(0, strErrors.length - 4);

            $('span[data-valmsg-for="' + i + '"]')
                .html(strErrors);
        });
    }
    else if (data.error) {
        $('.servicesValid').text(data.error);
    }
}
