//var SHOW_CLOSE_BUTTON_DELAY = 10000;
//var RESTART_HUB_DELAY = 5000;

//var notificationObject = {
//    title: null,
//    date: null,
//    id: null
//};

//function goToTask(task_id) {
//    window.open(basePath + 'Tasks?taskId=' + task_id);
//};

//function SetMessageBody(task_id, theme, plannedDate) {

//    notificationObject.title =
//        "<a class='cursor-pointer blankTextDecoration' href='#' onclick='goToTask(" +
//        task_id + ")'>" +
//        theme + "</a>";

//    notificationObject.date = plannedDate;

//    notificationObject.id = task_id;

//}

//$(function () {
//    var client = $.connection.taskNotificationHub.client;

//    // уведомление о истекающих задачах
//    client.showBeforeNotification = function (data) {

//        for (var i = 0; i < data.length; ++i) {

//            var task = data[i];

//            SetMessageBody(task.id, task.Theme, task.PlannedDate);

//            taskNotification.beforeNotification(
//                notificationObject.title,
//                notificationObject.date,
//                notificationObject.id
//            );
//        }
//    };

//    // уведомление о просроченных задачах
//    client.showOverdueNotification = function (data) {

//        for (var i = 0; i < data.Tasks.length; ++i) {

//            var task = data.Tasks[i];

//            SetMessageBody(task.id, task.Theme, task.PlannedDate);

//            taskNotification.overdueNotification(
//                notificationObject.title,
//                notificationObject.date,
//                notificationObject.id
//            );
//        }

//        $(".ui-pnotify-closer").click(hiddenModal);

//        setTimeout(setVisibleForButtonControl,
//           SHOW_CLOSE_BUTTON_DELAY);
//    };

//    // уведомление о истекающих задачах
//    client.showNotification = function (data) {

//        for (var i = 0; i < data.length; ++i) {

//            var task = data[i];

//            var links = [];

//            if (task.lincs) {
//                task.lincs.forEach(function(el) {
//                    links.push(
//                        {
//                            title: el.title,
//                            url: basePath + el.addPath
//                        }
//                    );
//                });
//            }

//            switch(task.type) {
//                case "notice":
//                    notification.warningWithExtra(
//                        {
//                            id: task.title,
//                            title: task.title,
//                            text: task.text,
//                            links: links
//                        });
//                    break;
//                case "info":
//                    notification.infoWithExtra(
//                    {
//                        id: task.title,
//                        title: task.title,
//                        text: task.text,
//                        links: links
//                    });
//                    break;
//                case "error":
//                    notification.errorWithExtra(
//                        {
//                            id: task.title,
//                            title: task.title,
//                            text: task.text,
//                            links: links
//                        });
//                    break;
//                default:
//                    break;
//            }
//        }
//    };

//    function hiddenModal() {

//        $(".ui-pnotify-modal-overlay").hide();

//    }

//    function setVisibleForButtonControl() {

//        $(".ui-pnotify-closer").css("visibility", "visible");

//        $(".ui-pnotify-closer").css("display", "block");

//        hiddenModal();
//    }

//    var hub = $.connection.hub;

//    // Обработка события переподключения
//    hub.reconnected(function () {
//        hub.stop();
//    });

//    // Обработка события отключения
//    hub.disconnected(function () {
//        setTimeout(function () {
//            hub.start();
//        }, RESTART_HUB_DELAY);
//    });

//    hub.start();
//});