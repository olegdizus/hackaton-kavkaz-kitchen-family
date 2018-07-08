/*jslint plusplus: true, sloppy: true, indent: 4 */
var waffleChart = (function () {

    function applyDefaultContextSettings(options) {
        options.ctx.lineWidth = 2;
        options.ctx.globalAlpha = 0.5;
        options.ctx.strokeStyle = "rgb(255, 255, 255)";
        options.ctx.fillStyle = 'rgb(255,255,255)';
    }

    function drawToCanvas(options) {
        options.ctx.beginPath();
        var curValue = 0;
        var n = 10;

        var emptyRectColor = "#D9D9D9";
        
        for (var i = 1; i <= n; i++) {
            for (var j = 0; j < n; j++) {
                options.ctx.globalAlpha = 1;
                options.ctx.lineWidth = 30;
                
                options.ctx.fillStyle = curValue < valueCurrent ? fillRectColor : emptyRectColor;

                options.ctx.fillRect(
                    options.width / n * j,
                    options.height / n * (n - i),
                    options.width / n - 2,
                    options.height / n - 2);

                curValue += 100 / n / n;
            }
        }

        options.ctx.globalAlpha = 1;
        options.ctx.lineWidth = 30;
        options.ctx.fillStyle = "#000000";
        options.ctx.font = "30px Arial";

        options.ctx.fillText("P " + valuePlan + "%", options.width / 2 - 35 * 1.1, options.height / 2.4);

        options.ctx.fillText("F " + valueCurrent + "%", options.width / 2 - 35 * 1.1, options.height / 1.4);

        options.ctx.stroke();
    }

    function buildOptionsAsJSON(canvas) {
        var
            width = $(canvas).width(),
            height = $(canvas).height();

        return {
            ctx: canvas.getContext('2d'),
            width: width,
            height: height
        };
    }

    function clearCanvas(options) {
        options.ctx.clearRect(0, 0, 800, 600);
        applyDefaultContextSettings(options);
    }

    function draw() {
        var canvas = document.getElementById(canvasId),
            options = null;

        if (canvas !== null
            && canvas.getContext) {
            options = buildOptionsAsJSON(canvas);

            clearCanvas(options);

            drawToCanvas(options);

        } else {
            alert("Canvas not supported by your browser!");
        }
    }

    var canvasId = "";
    var value = 0;
    var fillRectColor = "#FF0000";

    return {
        draw: draw,
        create: function (canvasIdParam, plan, fact, current, fillRectColorParam) {
            canvasId = canvasIdParam;

            valuePlan = plan == 0 ? 0 : Math.floor(fact / plan * 100);

            valueCurrent = plan == 0 ? 0: Math.floor(current / plan * 100);


            fillRectColor = fillRectColorParam;

            draw();
        }
    }
}());
