/**
 * Created by Dima on 16-Jan-16.
 */
var padding = 35;
var maxVal;
var barDistance = 15;
var fontSize = 12;
var intervalId;
var divisions = 5;
var barColorPositive = "#00FF00";
var barColorNegative = "#FF3333";
var lineColor = "#666666";
var textColor = "#FFFFFF";
var backgroundColor = "#222222";

function showGraph() {
    var x = 0;
    clearInterval(intervalId);
    intervalId = setInterval(function () {
        forward ? animator(data3, data4, x) : animator(data4, data3, x);
        /*for (var i = 0; i < dataArr.length; i++) {
            drawFraction(dataArr[i], x);
        }*/
        x += 0.02;
        if (x > 1.02) {
            clearInterval(intervalId);
            forward = !forward;
        }
    }, 10);
}

function drawFraction(data, x) {
    var context = data.canvas.getContext("2d");
    var interval = getValueRange(extractValues(data.values));
    context.beginPath();
    context.clearRect(0, 0, data.canvas.width, data.canvas.height);
    drawAxis(data.canvas, interval, true);
    drawLabel(data.canvas, data.label);
    for (var i = 0; i < data.values.length; i++) {
        drawBar(data, x, i, interval);
    }
}

function drawAxis(canvas, valueRange, showLines) {
    var context = canvas.getContext("2d");
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.lineWidth = 1;
    context.strokeStyle = lineColor;
    context.moveTo(padding, padding);
    context.lineTo(canvas.width - padding, padding);
    context.moveTo(padding, padding);
    context.lineTo(padding, canvas.height - padding);
    context.moveTo(padding, canvas.height - padding);
    context.lineTo(canvas.width - padding, canvas.height - padding);
    context.moveTo(canvas.width - padding, padding);
    context.lineTo(canvas.width - padding, canvas.height - padding);
    if (showLines) {
        drawLines(canvas, valueRange);
    }
    context.stroke();
}

function drawLines(c, valueRange) {
    for (var i = 0; i <= divisions; ++i) {
        drawLine(c, valueRange, valueRange[1] / divisions * i);
    }
    var count = getNegativeDivisionCount(valueRange);
    for (i = 1; i <= count; ++i) {
        drawLine(c, valueRange, valueRange[0] / count * i);
    }
}

function drawLine(canvas, valueRange, value) {
    var context = canvas.getContext("2d");
    context.lineWidth = 1;
    context.strokeStyle = lineColor;
    var yVal = canvas.height - getScaledValue(canvas, valueRange, value) - padding;
    context.moveTo(padding, yVal);
    context.lineTo(canvas.width - padding, yVal);
    context.font = `${fontSize}px Arial`;
    context.fillStyle = textColor;
    context.fillText(normalizeThousands(value), 5, fontSize / 2.3 + yVal);
}

function drawLabel(c, label) {
    var context = c.getContext("2d");
    context.font = `${fontSize}px Arial`;
    context.fillStyle = textColor;
    context.fillText(label, padding, padding - fontSize);
}

function drawBar(data, fraction, index, valueRange) {
    var info = data.values[index];
    var maxVal = valueRange[1];
    var minVal = valueRange[0];
    var negativeOffset = (data.canvas.height - padding * 2) / (maxVal + Math.abs(minVal)) * Math.abs(minVal);
    var height = fraction * (getScaledValue(data.canvas, valueRange, info.value) - negativeOffset);
    var barWidth = (data.canvas.width - padding * 2 - (data.values.length + 1) * barDistance) / data.values.length;
    var context = data.canvas.getContext("2d");
    context.fillStyle = info.value < 0 ? barColorNegative : barColorPositive;
    context.fillRect(padding + barDistance + index * (barWidth + barDistance),
        data.canvas.height - padding - 1 - negativeOffset, barWidth, -height);
    context.font = `${fontSize * 0.7}px Arial`;
    context.fillStyle = textColor;
    context.fillText(
        info.key,
        padding + barDistance + index * (barWidth + barDistance),
        data.canvas.height - padding + fontSize - negativeOffset);
    context.fillText(
        `${Math.round(fraction * info.value)}`,
        padding + barDistance + index * (barWidth + barDistance),
        data.canvas.height - padding - height - ((info.value < 0 ? -1 : 1) * fontSize) - negativeOffset);
}

function removeBars(data) {
    var context = data.canvas.getContext("2d");
    context.clearRect(0, 0, data.canvas.width, data.canvas.height);
    context.beginPath();
    var interval = getValueRange(extractValues(data.values));
    drawAxis(data.canvas, interval, true);
    drawLabel(data.canvas, "Total value(monthly)");
}
var forward = true;

function animator(data1, data2, fraction) {
    var context = data1.canvas.getContext("2d");
    var interval = getValueRange(extractValues(data1.values));
    var interval2 = getValueRange(extractValues(data2.values));
    var maxVal = interval[1];
    var minVal = interval[0];
    interval[1] = maxVal - (maxVal - interval2[1]) * fraction;
    interval[0] = minVal - (minVal - interval2[0]) * fraction;
    context.beginPath();
    context.clearRect(0, 0, data1.canvas.width, data1.canvas.height);
    drawAxis(data1.canvas, interval, true);
    drawLabel(data1.canvas, data2.label);
    for (var i = 0; i < data1.values.length; i++) {
        drawBar(
            {
                canvas: document.getElementById("animatedCanvas"),
                values: getModifiedValues(data1.values, data2.values, fraction)
            },
            1, i, interval);
    }
}

//experimental
/*function animateDataChange(fraction, oldVals, newVals) {
    oldVals = extractValues(oldVals);
    newVals = extractValues(newVals);

    var range = getValueRange(oldVals);
    var rangeFinal = getValueRange(newVals);
    var oldDivs = getDivisionsForRange(range);
    var newDivs = getDivisionsForRange(rangeFinal);
    var idx = getReusableValueIndex(oldDivs, newDivs);
    /!*newDivs = oldDivs.splice(idx, idx + 1).concat(newDivs.splice(1, newDivs.length));
     log(newDivs);*!/
    /!*TODO create transformation arrays
     * A:20 40 60 80 100
     B:6  12 18 24 30

     A+B'
     A'+B'

     20 40 60 80 100 6 12 24 30 - (concat except compatible values)
     18 40 60 80 100 6 12 24 30 - replace if relatively close
     (within 5% value diff of the biggest range,
     if multiple values fit - pick closest)
     *!/
    oldDivs = [1600, 3200, 4800, 6400, 8000, -1200, -600, 0, 600, 1200, 2400];
    //newDivs = [600, 1200, 1800, 2400, 3000];
    newDivs = [1800, 3000, 4800, 6400, 8000, -1200, -600, 0, 600, 1200, 2400];
    /!*var range = [0, 500];
     var rangeFinal = [0, 250];*!/
    var canvas = document.getElementById("animatedCanvas");
    var context = canvas.getContext("2d");
    /!*var value = [500, 400, 300, 200, 100];
     var valueFinal = [500, 400, 300, 170, 80];*!/
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    drawAxis(canvas, [0, 60000], false);
    for (var i = 0; i < oldDivs.length; ++i) {
        var height = getLineHeightAtFraction(canvas, [oldDivs[i], newDivs[i]], [range, rangeFinal], fraction);
        drawAnimatedLine(canvas, height, Math.round(oldDivs[i] + fraction * (newDivs[i] - oldDivs[i])));
    }
}

function drawAnimatedLine(canvas, height, value) {
    if (height >= padding - 1 && height <= canvas.height - padding) {
        var context = canvas.getContext("2d");
        context.lineWidth = 1;
        context.strokeStyle = "#666666";
        context.font = `${fontSize}px Arial`;
        context.fillStyle = "#FFFFFF";
        context.moveTo(padding, height);
        context.lineTo(canvas.width - padding, height);
        context.stroke();
        context.fillText(
            normalizeThousands(value), 5, fontSize / 2.3 + height);
    }
}*/

/*--------------------------------------------------------------------------------------------------------------------
 --------------------------------------------------------Utils---------------------------------------------------------
 --------------------------------------------------------------------------------------------------------------------*/


function getModifiedValues(data1, data2, fraction) {
    var arr = [];
    for (var i = 0; i < data1.length; ++i) {
        arr[i] = {key: data1[i].key, value: data1[i].value - (data1[i].value - data2[i].value) * fraction}
    }
    return arr;
}

function extractValues(array) {
    return array.map(function (val) {
        return val.value
    });
}

/*function getDivisionsForRange(range) {
    var array = [];
    /!*if (range[0] < 0) {
     var count = getNegativeDivisionCount(range);
     for (var i = 1; i <= count; ++i) {
     array[i - 1] = range[0] / count * i;
     }
     }
     array.reverse();*!/
    var aux = i - 1;
    var aux = 0;
    for (i = 1; i <= divisions; ++i) {
        array[aux++] = range[1] / divisions * i;
    }
    return array;
}*/

function getNegativeDivisionCount(range) {
    return Math.abs(range[0] / (range[1] / divisions));
}

/*function getReusableValueIndex(values, newValues) {
    var reusableIndexCutoff = Infinity;
    for (var i = 0; i < values.length; ++i) {
        if (values[i] <= Math.max.apply(Math, newValues)) {
            reusableIndexCutoff = i;
            break;
        }
    }
    return reusableIndexCutoff;
}*/

/*function getLineHeightAtFraction(canvas, values, ranges, fraction) {
    var delta = getScaledValue(canvas, ranges[0], values[0]) - getScaledValue(canvas, ranges[1], values[1]);
    return canvas.height - padding - getScaledValue(canvas, ranges[0], values[0]) + fraction * delta;
}*/

function getValueRange(valueArr) {
    var min = Math.min.apply(Math, valueArr);
    var max = Math.max.apply(Math, valueArr);
    max = getNextRound(max);
    if (min < 0) {
        for (var i = 1; i <= divisions; ++i) {
            if (Math.abs(min) < max / divisions * i) {
                min = max / divisions * i * -1;
                break;
            }
        }
    } else min = 0;
    return [min, max];
}

function getNextRound(value) {
    var zeroes = 0;
    var abs = Math.abs(value);
    while (abs >= 10) {
        abs /= 10;
        zeroes++;
    }
    return Math.ceil(abs) * Math.pow(10, zeroes) * (value < 0 ? -1 : 1);
}

function getScaledValue(canvas, interval, value) {
    var minVal = interval[0];
    var maxVal = interval[1];
    return (canvas.height - padding * 2) / (maxVal + Math.abs(minVal)) * (value + Math.abs(minVal));
}

function normalizeThousands(value) {
    var val = "";
    value = Math.round(value);
    while (Math.abs(value) >= 1000) {
        val += "k";
        value /= 1000;
    }
    return val.length == 0 ? value.toString() : (value.toFixed(1).toString() + val);
}

function log(object) {
    document.getElementById("debug").value = object.toString();
}