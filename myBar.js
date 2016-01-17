/**
 * Created by Dima on 16-Jan-16.
 */
var padding = 30;
var maxVal;
var barDistance = 15;
var fontSize = 12;
var x = 0;
var intervalId;
var divisions = 5;

function drawBars() {
    intervalId = setInterval(d, 10)
}

function getBestInterval(valueArr) {
    var min = Math.min.apply(Math, valueArr.map(function (val) {
        return val.value
    }));
    var max = Math.max.apply(Math, valueArr.map(function (val) {
        return val.value
    }));
    //if (min > 0) min = 0; else min = getNextRound(min);
    max = getNextRound(max);
    if (min < 0) {
        var sign = min < 0 ? -1 : 1;
        for (var i = 1; i <= divisions; ++i) {
            if (Math.abs(min) < max / divisions * i) {
                min = max / divisions * i;
                break;
            }
            min *= sign;
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
    return (canvas.height - padding * 2) / (maxVal + Math.abs(minVal)) * value;
}

function d() {
    drawGraph(document.getElementById("myCanvas"), valueArr, "Total value(monthly)");
    var valueArr2 = JSON.parse(JSON.stringify(valueArr));
    for (var i = 0; i < valueArr2.length; ++i) {
        if (i == 0) {
            valueArr2[i].value = 0;
        } else {
            valueArr2[i].value = valueArr2[i].value - valueArr[i - 1].value;
        }
    }
    drawGraph(document.getElementById("myCanvas2"), valueArr2, "Delta(monthly)");
    x += 0.02;
    if (x > 1.02) {
        clearInterval(intervalId);
    }
}

function drawGraph(c, valueArr, label) {
    var bar = c.getContext("2d");
    var interval = getBestInterval(valueArr);
    bar.clearRect(0, 0, c.width, c.height);
    drawAxis(c, interval);
    drawLabel(c, label);
    for (var i = 0; i < valueArr.length; i++) {
        drawBar(c, i, valueArr[i], interval);
    }
}

function drawLabel(c, label) {
    var text = c.getContext("2d");
    text.font = `${fontSize}px Arial`;
    text.fillStyle = "#FFFFFF";
    text.fillText(label, padding, padding - fontSize);
}

function drawBar(c, index, data, interval) {
    var maxVal = interval[1];
    var minVal = interval[0];
    var negativeOffset = (c.height - padding * 2) / (maxVal + Math.abs(minVal)) *  Math.abs(minVal);
    var height = x * getScaledValue(c, interval, data.value);
    var barWidth = (c.width - padding * 2 - (valueArr.length + 1) * barDistance) / valueArr.length;
    var bar = c.getContext("2d");
    bar.fillStyle = "#00FF00";
    bar.fillRect(padding + barDistance + index * (barWidth + barDistance), c.height - padding - 1 - negativeOffset, barWidth, -height);
    var text = c.getContext("2d");
    text.font = `${fontSize * 0.7}px Arial`;
    text.fillStyle = "#FFFFFF";
    text.fillText(data.key, padding + barDistance + index * (barWidth + barDistance), c.height - padding + fontSize - negativeOffset);
    text.fillText(`${Math.round(x * data.value)}`, padding + barDistance + index * (barWidth + barDistance), c.height - padding - height - ((data.value < 0 ? -1 : 1) * fontSize) - negativeOffset);
}

function drawAxis(c, interval) {
    var maxVal = interval[1];
    var minVal = interval[0];
    var negativeOffset = getScaledValue(c, interval, Math.abs(minVal));
    var background = c.getContext("2d");
    background.fillStyle = "#222222";
    background.fillRect(0, 0, c.width, c.height);
    var line = c.getContext("2d");
    line.lineWidth = 1;
    line.strokeStyle = "#666666";
    line.moveTo(padding, padding);
    line.lineTo(padding, c.height - padding);
    line.stroke();
    line.moveTo(padding, c.height - padding - negativeOffset);
    line.lineTo(c.width - padding, c.height - padding - negativeOffset);
    line.stroke();
    var text = c.getContext("2d");
    text.font = `${fontSize}px Arial`;
    text.fillStyle = "#FFFFFF";
    text.fillText("0", 5, fontSize / 2.3 + c.height - padding - negativeOffset);
    drawPositiveLines(c, negativeOffset, maxVal);
    drawNegativeLines(c, minVal, maxVal);
}

function drawPositiveLines(c, negativeOffset, maxVal) {
    var line = c.getContext("2d");
    line.lineWidth = 1;
    line.strokeStyle = "#666666";
    var yVal;
    for (var i = 0; i < divisions; ++i) {
        yVal = padding + (c.height - padding * 2 - negativeOffset) / divisions * i;
        line.moveTo(padding, yVal);
        line.lineTo(c.width - padding, yVal);
        line.stroke();
    }
    var text = c.getContext("2d");
    for (i = 0; i < divisions; ++i) {
        yVal = padding + (c.height - padding * 2 - negativeOffset) / divisions * i;
        text.font = `${fontSize}px Arial`;
        text.fillStyle = "#FFFFFF";
        text.fillText(normalizeThousands(Math.ceil(maxVal - maxVal / divisions * i)), 5, fontSize / 2.3 + yVal);
    }
}

function drawNegativeLines(c, minVal, maxVal) {
    var line = c.getContext("2d");
    line.lineWidth = 1;
    line.strokeStyle = "#666666";
    var count = Math.abs(minVal / (maxVal / divisions));
    var yVal;
    for (var i = 0; i < count; ++i) {
        yVal = (c.height - padding) - getScaledValue(c, [minVal, maxVal], minVal / count) * i;
        line.moveTo(padding, yVal);
        line.lineTo(c.width - padding, yVal);
        line.stroke();
    }
    var text = c.getContext("2d");
    for (i = 0; i < count; ++i) {
        yVal = (c.height - padding) - getScaledValue(c, [minVal, maxVal], minVal / count) * i;
        text.font = `${fontSize}px Arial`;
        text.fillStyle = "#FFFFFF";
        text.fillText(`-${normalizeThousands(Math.ceil(minVal - minVal / count * i))}`, 5, fontSize / 2.3 + yVal);
    }
}

function normalizeThousands(value) {
    var val = "";
    while (value >= 1000) {
        val += "k";
        value /= 1000;
    }
    return value.toString() + val;
}