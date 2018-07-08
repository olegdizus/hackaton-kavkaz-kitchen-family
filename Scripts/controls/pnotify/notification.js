var notification = (function () {
    //opts.type = "error";

    var stack_bottomright = {
        "dir1": "up",
        "dir2": "left",
        "firstpos1": 0,
        "firstpos2": 10,
        "spacing1": -10,
        "spacing2": 0

    };

    function showPopUpBottomRight(opts) {
        //var stack_bottomright = { "dir1": "up", "dir2": "left" };

        // когда потребуется сделать так, что бы уведомления автоматически закрывалось, удалить строку ниже
        opts.hide = false;

        new PNotify({
            title: opts.title,
            text: opts.text,
            type: opts.type,
            delay: 5000,
            hide: opts.hide,
            addclass: "stack-bottomright",
            stack: stack_bottomright
        });
    }


    function showWindowsOptions(options, text, hide) {
        if (text != undefined) {
            options.text = text;
        }

        if (hide != undefined) {
            options.hide = hide;
        }

        showPopUpBottomRight(options);
    }

    function info(text, hide) {
        var options = {
            title: 'Информация',
            text: 'Укажите текст сообщения',
            type: "success",
            hide: true
        }

        showWindowsOptions(options, text, hide);
    }

    function infoWithExtra(extraOptions, hide) {

        var options = {
            title: 'Информация',
            text: 'Укажите текст сообщения',
            type: "success",
            hide: true,

            afterCloseCallback: function () {
                OnCloseAction(extraOptions.id);
            }
        }

        showWindowsOptions(options, ConfigExtraText(extraOptions), hide);
    }

    function ConfigExtraText(options) {

        var result = options.text;

        for (var i = 0; i < options.links.length; i++) {

            var params = "";

            if (options.links[i].data) {
                params += "?";

                for (key in options.links[i].data) {

                    params += key + '=';
                    params += options.links[i].data[key] + '&';
                }

                params = params.slice(0, -1);
            }


            result = result + '\n\r'
            + '<a target="_blank" href=' + options.links[i].url
            + params
            + '>'
            + options.links[i].title
            + '</a>';
        }

        return result;
    }

    function warning(text,hide) {
        var options = {
            title: 'Внимание!',
            text: 'Укажите текст сообщения',
            type: "notice",
            hide: true
        }
        showWindowsOptions(options, text, hide);
    }

    function warningWithExtra(extraOptions, hide) {

        var options = {
            title: 'Информация',
            text: 'Укажите текст сообщения',
            type: "notice",
            hide: true,

            afterCloseCallback: function () {
                OnCloseAction(extraOptions.id);
            }
        }

        showWindowsOptions(options, ConfigExtraText(extraOptions), hide);
    }

    function error(text,hide) {
        var options = {
            title: 'Ошибка!',
            text: 'Укажите текст сообщения',
            type: "error",
            hide: true
        }
        showWindowsOptions(options, text, hide);
    }

    function errorWithExtra(extraOptions, hide) {

        var options = {
            title: 'Информация',
            text: 'Укажите текст сообщения',
            type: "error",
            hide: true,

            afterCloseCallback: function () {
                OnCloseAction(extraOptions.id);
            }
        }

        showWindowsOptions(options, ConfigExtraText(extraOptions), hide);
    }

    function OnCloseAction(id) {

        var url = basePath + 'Notification/DiscardShow';

        console.log("OK");

        $.ajax({
            url: url,
            dataType: 'json',
            type: 'Post',
            data: { id: id },
            success: function (result) {

                if (result.success) {

                } else {

                    notification.error("Ошибка отмены отображения уведомления для " + actionName);
                }
            },
            error: function () {

                notification.error("Ошибка запроса отмены отображения уведомления для " + actionName);
            }

        });

    }

    function ShowCheckedMessage(options) {

        var checkNotificationNeed = basePath + 'Notification/CheckNeedNotificationShow';

        $.ajax({
            url: checkNotificationNeed,
            dataType: 'json',
            type: 'Post',
            data: { id: options.id },
            success: function (result) {

                if (result.success) {

                    notification.infoWithExtra(options);
                }
            }

        });

    }

    return {
        warning: warning,
        error: error,
        info: info,
        infoWithExtra: infoWithExtra,
        warningWithExtra: warningWithExtra,
        errorWithExtra: errorWithExtra,
        onCloseAction: OnCloseAction,
        ShowCheckedMessage: ShowCheckedMessage,

        showMessage: function (data) {
            if (data.message) {
                switch (data.messageType) {
                    case "Error":
                        error(data.message);
                        break;
                    case "Info":
                        info(data.message);
                        break;
                    case "Warning":
                        warning(data.message);
                        break;
                    default:
                        throw "Unexpected message type in notification.showMessage";
                }
            }
        }
    }
})();