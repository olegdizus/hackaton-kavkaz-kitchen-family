$(function () {
    includeOnce('bundles/arcticmodal');

    $.requestPull = {};
    $.requestPull.abortAll = function () {
        $(this).each(function (i, storeRequest) {
            storeRequest.abort();
            $.requestPull[storeRequest] = false;
        });
    }

    $(document).ajaxSend(function (e, jqxhr, settings) {
        if ($.requestPull) {
            if ($.requestPull[e.url]) {
                return false;
            }

            $.requestPull[e.url] = true;
        }

        startLoadingAnimation();
    });

    $.ajaxSetup({
        global: true,
        error: function (jqXHR) {
            if (jqXHR.statusText == "timeout") {
                showErrorModalWindow(" Не возможно подключиться к серверу, проверьте подключение к сети.");
            }
        },
        complete: function (e) {
            if ($.requestPull) {
                var i = $.requestPull[this.url];
                if (i >= 0)
                    $.requestPull[this.url] = false;
            }

            stopLoadingAnimation();
        },
        timeout: 90000
    });

    function startLoadingAnimation() {
        $("#loadImg").show();
    }

    function stopLoadingAnimation() {
        $("#loadImg").hide();
    }

});

function showErrorModalWindow(message) {
    $('.modal-header h6', $('#timeOutError')).html(message);
    $('#timeOutError').arcticmodal();
}