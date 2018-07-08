var insertLinebreaks = function (d) {
    var el = d3.select(this);
    var words = [d.value.label, d.value.bubble];

    el.text('');

    for (var i = 0; i < words.length; i++) {
        var tspan = el.append('tspan').text(words[i].toLocaleString());

        if (i > 0) {
            tspan
                .attr('x', 0)
                .attr('dy', '15');
        }
    }
};

// Отслеживаем изменения размера окна
var doit;

function onResizeEvent(withHeight) {
    bubbleChart.width($('#bubbleParentDiv').width());

    if (withHeight) {
        bubbleChart.height($('#bubbleParentDiv').height());
    }

    redrawChart();

    $('#grid').width($('#bubbleParentDiv').width());
    $('#gridTotal').width($('#bubbleParentDiv').width());
}

window.onresize = function () {
    clearTimeout(doit);
    doit = setTimeout(function () {
        onResizeEvent(false);
    }, 150);
};

// Отслеживаем выход из полноэкранного режима

var bubbleParentDivWidth = 800, bubbleParentDivHeight = 400;

function isFullScreenMode() {
    return !(!document.fullscreenElement
        && !document.mozFullScreenElement
        && !document.webkitFullscreenElement
        && !document.msFullscreenElement);
}

function fullScreenCancel() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}

function resizeBubbleChart(width, height) {
    $('#bubbleParentDiv').width(width);
    $('#bubbleParentDiv').height(height);

    onResizeEvent(true);
}

function fullScreenHandler() {

    if (!isFullScreenMode()) {
        resizeBubbleChart(bubbleParentDivWidth, bubbleParentDivHeight);
        $('#fullScreenButton').html('<span class="glyphicon glyphicon-resize-full"></span>');
    }
    else {
        $('#fullScreenButton').html('<span class="glyphicon glyphicon-resize-small"></span>');
    }
}

$("#fullScreenButton").click(function () {

    if (!isFullScreenMode()) {
        var chart = document.getElementById("bubbleParentDiv");

        bubbleParentDivWidth = $('#bubbleParentDiv').width();
        bubbleParentDivHeight = $('#bubbleParentDiv').height();

        resizeBubbleChart(window.screen.width, window.screen.height);

        var request = chart.requestFullScreen || chart.webkitRequestFullScreen || chart.mozRequestFullScreen;
        request.call(chart);
    } else {
        fullScreenCancel();
    }

    $('#fullScreenButton').blur();
});

if (document.addEventListener) {
    document.addEventListener('webkitfullscreenchange', fullScreenHandler, false);
    document.addEventListener('mozfullscreenchange', fullScreenHandler, false);
    document.addEventListener('fullscreenchange', fullScreenHandler, false);
    document.addEventListener('MSFullscreenChange', fullScreenHandler, false);
}