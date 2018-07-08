var taskNotification = (function () {

    var stack_bar_top = {
        "dir1": "down",
        "dir2": "right",
        "modal": true,
        "firstpos1": 100,
        //"firstpos2": $(window).width() / 2 - 180,
        "spacing1": 0,
        "spacing2": 10
    };

    var stack_bottom_right = {
        "dir1": "up",
        "dir2": "left",
        "firstpos1": 0,
        "firstpos2": 10,
        "spacing1": -10,
        "spacing2": 0,
        "push": "down"
    };

    function setOptionsTaskNotify(opts) {
        new PNotify({
            title: opts.title,
            text: opts.text,
            type: opts.type,
            hide: false,
            buttons: {
                closer_hover: opts.hoverButton, //скрывать кнопки при потере фокуса мышкой
                sticker_hover: opts.hoverButton,
                closer: opts.showButton, //показывать кнопки
                sticker: opts.showButton
            },
            stack: opts.stack,
            min_height: "100px",
            addclass: opts.addclass
        });
    }

    function showTaskNotify(options, title) {
        if (title != undefined) {
            options.title = title;
        }

        setOptionsTaskNotify(options);
    }

    function overdueNotification(title, dateTime, task_id) {
        var options = {
            title: 'Не найдена тема задачи',
            text: "<a class='cursor-pointer blankTextDecoration' href='#' onclick='goToTask(" +
                      task_id + ")'> Время выполнения задачи истекло <br>" + dateTime + "</a>",
            type: "error",
            showButton: false,
            stack: stack_bar_top,
            addclass: "error_notification",
            hoverButton: false
        }

        showTaskNotify(options, title);
    }

    function beforeNotification(title, dateTime, task_id) {
        var options = {
            title: 'Не найдена тема задачи',
            text: "<a class='cursor-pointer blankTextDecoration' href='#' onclick='goToTask(" +
                      task_id + ")'> Время выполнения задачи истекает:<br>" + dateTime + "</a>",
            type: "notice",
            showButton: true,
            stack: stack_bottom_right,
            addclass: "stack-bottomright",
            hoverButton: true
        }

        showTaskNotify(options, title);
    }

    function customNotification(type, title, text, links) {

        var sendText = text;

        if (links && links.length > 0) {
            sendText += "<br/>";

            links.forEach(function (entry) {
                sendText += "<br/><a href='" + basePath + entry.addPath + "'>" + entry.text + "</a>";
            });
        } 

        var options = {
            title: title,
            text: sendText,
            type: type,
            showButton: true,
            stack: stack_bottom_right,
            addclass: "stack-bottomright",
            hoverButton: true
        }

        showTaskNotify(options, title);
    }

    return {
        beforeNotification: beforeNotification,
        overdueNotification: overdueNotification,
        customNotification: customNotification,
        showMessage: function (data) {
            if (data.message) {
                switch (data.messageType) {
                    case "BeforeNotification":
                        beforeNotification(data.message);
                        break;
                    case "OverdueNotification":
                        overdueNotification(data.message);
                        break;
                    case "CustomNotification":
                        customNotification(data.message);
                        break;
                    default:
                        throw "Unexpected message type in notification.showMessage";
                }
            }
        }
    }
})();