function GetUserAccountData() {
    $.ajax({
        type: 'POST',
        url: basePath + 'Account/GetUserAccountData/',
        data:
        {
            currentUserName: currentUserName
        },
        success: function (response) {

            if (response.success) {
                FillAccountData(response.userAccountsData);
            } else {

                //AddPositionMenuTopItems();

                if (response.message) {
                    console.log(response.message);
                } else {
                    alert("Ошибка получения учетных данных пользователя!");
                }
            }
        },
        error:
            function () {
                alert("Ошибка получения данных!");
            },
    });
}

function FillAccountData(userAccountData) {

    var positionMenu = $(".positionMenu");

    positionMenu.empty();

    AddPositionMenuTopItems();

    for (var i = 0; i < userAccountData.length; i++) {

        AddPositionMenuItem(positionMenu, userAccountData[i].text, userAccountData[i].userName);
    }
}

function AddPositionMenuTopItems() {

    positionMenu = $(".positionMenu");

    var li = '<li><a href=' +
        basePath +
        'Account/Details/'
        + userId
        + '>Профиль</a></li>';

    var lidivider = '<li class="divider"></li>';

    positionMenu.append($(li));
    positionMenu.append($(lidivider));
}

function AddPositionMenuItem(positionMenu, text, userName) {

    var li = '<li><a href=' +
        basePath +
        'Account/ChangeLogin?userName='
        + userName
        + '&controllerName=' + controllerName
        + '&actionName=' + actionName
        + '>'
        + text
        + '</a></li>';

    positionMenu.append($(li));
}

