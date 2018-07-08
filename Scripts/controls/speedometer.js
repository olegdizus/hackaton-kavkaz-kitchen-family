/*jslint plusplus: true, sloppy: true, indent: 4 */
var speedometer = (function () {

    function degToRad(angle) {
        // Degrees to radians
        return ((angle * Math.PI) / 180);


    }

    function radToDeg(angle) {
        // Radians to degree

        return ((angle * 180) / Math.PI);
    }

    function drawLine(options, line) {
        // Draw a line using the line object passed in
        options.ctx.beginPath();

        // Set attributes of open
        options.ctx.globalAlpha = line.alpha;
        options.ctx.lineWidth = line.lineWidth;
        options.ctx.fillStyle = line.fillStyle;
        options.ctx.strokeStyle = line.fillStyle;
        options.ctx.moveTo(line.from.X,
            line.from.Y);

        // Plot the linef
        options.ctx.lineTo(
            line.to.X,
            line.to.Y
        );

        options.ctx.stroke();
    }

    function createLine(fromX, fromY, toX, toY, fillStyle, lineWidth, alpha) {
        // Create a line object using Javascript object notation
        return {
            from: {
                X: fromX,
                Y: fromY
            },
            to: {
                X: toX,
                Y: toY
            },
            fillStyle: fillStyle,
            lineWidth: lineWidth,
            alpha: alpha
        };
    }

    function applyDefaultContextSettings(options) {
        /* Helper function to revert to gauges
         * default settings
         */

        options.ctx.lineWidth = 2;
       // options.ctx.globalAlpha = 0.5;
        options.ctx.strokeStyle = "rgb(255, 255, 255)";
        options.ctx.fillStyle = 'rgb(255,255,255)';
    }

    function drawTextMarkers(options, colorOpt) {
        /* The text labels marks above the coloured
         * arc drawn every 10 mph from 10 degrees to
         * 170 degrees.
         */
        var startPosArray = calculateStartPos(colorOpt);
        startPosArray[startPosArray.length] = { startPos: 180 };

        applyDefaultContextSettings(options);

        // Font styling
        options.ctx.font = '10px sans-serif';
        options.ctx.fillStyle = "black";
        
        options.ctx.beginPath();

        options.ctx.textBaseline = 'middle';

        var currentProcent = 0;
        // Tick every 20 (small ticks)
        for (var i = 0; i < colorOpt.length; i++) {
            currentProcent += colorOpt[i].procent;
            drawMarker(options, (startPosArray[i].startPos+startPosArray[i + 1].startPos)/2, currentProcent);
        }

        options.ctx.stroke();
    }

    function drawMarker(options, positions, text, needle) {
        var gaugeOptions = options.gaugeOptions;
        var radius = gaugeOptions.radius - 10 + (needle ? 25 :0);

        var innerTickX = - (Math.cos(degToRad(positions)) * radius);
        var innerTickY =  - (Math.sin(degToRad(positions)) * radius);

        //console.log('Write marker:', positions);
        if (needle) {
            options.ctx.font = '12px sans-serif bold';
            options.ctx.fillStyle = "#000000";
        }
        
        //TODO: определять запись как окружность и ее центр должен находится по этим координатам.
        
        var x = (options.center.X) + innerTickX;
        var y = (options.center.Y) + innerTickY;


        // чтобы цифра не скрывалась под непрорисовываемую область
        var halfFontSize = 6;
        if (y > options.radius - halfFontSize) {
            y = y - halfFontSize;
        }
       
        options.ctx.fillText(text + options.measure, x, y);
    }

    function drawSpeedometerPart(options, alphaValue, strokeStyle, startPos) {
        /* Draw part of the arc that represents
        * the colour speedometer arc
        */

        options.ctx.beginPath();

      //  options.ctx.globalAlpha = alphaValue;
        options.ctx.lineWidth = 30;
        options.ctx.strokeStyle = strokeStyle;

        options.ctx.arc(options.center.X,
            options.center.Y,
            options.levelRadius,
           
            Math.PI + (Math.PI / 180 * startPos),
            0 - (Math.PI / 360),
            false);

        options.ctx.stroke();
    }

    function drawSpeedometerColourArc(options, colorParameters) {
        /* Draws the colour arc.  Three different colours
         * used here; thus, same arc drawn 3 times with
         * different colours.
         * TODO: Gradient possible?
         */

        //sortAscending(colorParameters);

        var startPosArray = calculateStartPos(colorParameters);

        for (var i = 0; i < startPosArray.length; i++) {
            drawSpeedometerPart(options, 1, startPosArray[i].color, startPosArray[i].startPos);
        }
    }

    function sortAscending(array) {
        array.sort(function (a, b) {
            if (a.procent < b.procent)
                return -1;
            if (a.procent > b.procent)
                return 1;

            return 0;
        });
    }

    function calculateStartPos(array) {
        var sum = 0;

        var resultArray = [];

        for (var i = 0; i < array.length; i++) {
            resultArray.push({
                startPos: sum,
                color: array[i].color
            });

            sum += array[i].procent;
        }

        for (var i = 0; i < array.length; i++) {
            resultArray[i].startPos = resultArray[i].startPos * 180 / sum;
        }

        return resultArray;
    }


    function convertSpeedToAngle(options) {
        /* Helper function to convert a speed to the 
        * equivelant angle.
        */
        var iSpeed = (options.speed),
            iSpeedAsAngle = iSpeed % 180;

        // Ensure the angle is within range
        if (iSpeedAsAngle > 180) {
            iSpeedAsAngle = iSpeedAsAngle - 180;
        } else if (iSpeedAsAngle < 0) {
            iSpeedAsAngle = iSpeedAsAngle + 180;
        }

        return iSpeedAsAngle;
    }

    function drawNeedle(options) {
        /* Draw the needle in a nice read colour at the
        * angle that represents the options.speed value.
        */
        var gaugeOptions = options.gaugeOptions;
        var radius = gaugeOptions.radius + 10;

        var iSpeedAsAngle = convertSpeedToAngle(options),
            iSpeedAsAngleRad = degToRad(iSpeedAsAngle),
            innerTickX = radius - (Math.cos(iSpeedAsAngleRad) * 20),
            innerTickY = radius - (Math.sin(iSpeedAsAngleRad) * 20),
            fromX = (options.center.X - radius) + innerTickX,
            fromY = (gaugeOptions.center.Y - radius) + innerTickY,
            endNeedleX = radius - (Math.cos(iSpeedAsAngleRad) * radius),
            endNeedleY = radius - (Math.sin(iSpeedAsAngleRad) * radius),
            toX = (options.center.X - radius) + endNeedleX,
            toY = (gaugeOptions.center.Y - radius) + endNeedleY,
            line = createLine(fromX, fromY, toX, toY, "rgb(0,0,0)", 2, 1);

        drawLine(options, line);
        
    }

    function buildOptionsAsJSON(canvas, iSpeed) {
        /* Setting for the speedometer 
        * Alter these to modify its look and feel
        */

        var centerX = canvas.width / 2,
            centerY = canvas.height,
            radius = canvas.height - 30,
            outerRadius = 100;

        // Create a speedometer object using Javascript object notation
        return {
            ctx: canvas.getContext('2d'),
            speed: iSpeed,
            center: {
                X: centerX,
                Y: centerY
            },
            levelRadius: radius - 10,
            gaugeOptions: {
                center: {
                    X: centerX,
                    Y: centerY
                },
                radius: radius
            },
            radius: outerRadius
        };
    }

    function clearCanvas(options) {
        options.ctx.clearRect(0, 0, 800, 600);
        applyDefaultContextSettings(options);
    }


    var Speedometr = function(canvasIdParam, colorOptParam, measure) {
        this.colorOpt = colorOptParam;
        this.currentSpeed = 0;
        this.currentValue = 0;
        this.canvasId = canvasIdParam;

        this.measure = measure;
    };

    Speedometr.prototype.draw = function (currentValue) {

        if (!(currentValue == undefined)) {
            this.currentValue = currentValue;

            var sum = 0;

            for (var i = 0; i < this.colorOpt.length; i++) {
                sum += this.colorOpt[i].procent;
            }

            this.targetSpeed = Math.round(currentValue / sum * 180);

            // чтобы спидометр зашкаливал, а не уходил по кругу
            if (this.targetSpeed > 179) {
                this.targetSpeed = 179;
            }

        }

        //  console.log("draw " + this.canvasId + " " + this.currentValue);

        var canvas = document.getElementById(this.canvasId),
            options = null;

        // Canvas good?
        if (canvas !== null && canvas.getContext) {
            options = buildOptionsAsJSON(canvas, this.currentSpeed);
            options.measure = this.measure;

            options.ctx.textAlign = "center";
            // Clear canvas
            clearCanvas(options);
            
            drawSpeedometerColourArc(options, this.colorOpt);
           
            // Draw labels on markers
            drawTextMarkers(options, this.colorOpt);


            drawMarker(options, convertSpeedToAngle(options), this.currentValue, true);
           
            drawNeedle(options);

        } else {
            alert("Canvas not supported by your browser!");
        }

        if (this.targetSpeed == this.currentSpeed) {
            clearTimeout(this.job);
            return;
        } else if (this.targetSpeed < this.currentSpeed) {
            this.bDecrement = true;
        } else if (this.targetSpeed > this.currentSpeed) {
            this.bDecrement = false;
        }

        if (this.bDecrement) {
            if (this.currentSpeed - 10 < this.targetSpeed)
                this.currentSpeed = this.currentSpeed - 1;
            else
                this.currentSpeed = this.currentSpeed - 5;
        } else {

            if (this.currentSpeed + 10 > this.targetSpeed)
                this.currentSpeed = this.currentSpeed + 1;
            else
                this.currentSpeed = this.currentSpeed + 5;
        }

        var self = this;
        this.job = setTimeout(function() { self.draw(); }, 2);
    };

    return {
            create: function(canvasIdParam, colorOptParam, currentValueParam, measure) {
                var speedometr = new Speedometr(canvasIdParam, colorOptParam, measure);

                speedometr.draw(currentValueParam);
        }
    }
}());