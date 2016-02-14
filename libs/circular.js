/**
 * Created by Dima on 07-Feb-16.
 */

function startSpinner(data) {
    if (data['canvas'] == null || data['colors'] == null)
        return;
    data['adjustPosition'] = 0;
    if (data['spacing'] == null)
        data['spacing'] = 0;
    if (data['repeat'] == null)
        data['repeat'] = 1;
    if (data['lineWidth'] == null)
        data['lineWidth'] = 5;
    if (data['maxRadius'] == null)
        data['maxRadius'] = 50;
    if (data['minRadians'] == null)
        data['minRadians'] = Math.PI / 3;
    if (data['maxRadians'] == null)
        data['maxRadians'] = 3 / 2 * Math.PI;
    animate(data);
}

//TODO add stop animation
/*function stopSpinner() {
 }*/

function animate(data) {
    var reverse = data.reverse;
    var dir = reverse ? -1 : 1;
    $({progress: reverse ? 1 : 0}).animate({progress: reverse ? 0 : 1}, {
        duration: 3000,
        easing: "linear",
        step: function (now) {
            data.adjustPosition += Math.PI / 90 * dir; // speed
            create(now, data);
        },
        complete: function () {
            data.adjustPosition += data.maxRadians * dir;
            data.adjustPosition %= 2 * Math.PI;
            animate(data)
        }
    });
}

function create(now, data) {
    var context = data.canvas[0].getContext('2d');
    context.clearRect(0, 0, data.canvas.width(), data.canvas.height());
    var maxNumIterations = Math.min((data.maxRadius - 2) / (data.lineWidth + data.spacing), data.repeat * data.colors.length);
    for (var i = 0; i < maxNumIterations; ++i) {
        drawCircle(data, i, now);
    }
}

function drawCircle(data, iteration, fraction) {
    var context = data.canvas[0].getContext('2d');
    var size = [data.canvas.width() / 2, data.canvas.height() / 2];
    var index = iteration % data.colors.length;
    var radius = data.maxRadius - iteration * (data.lineWidth + data.spacing);
    var color = data.colors[index].color;
    var offset = data.colors[index].offset;
    context.beginPath();
    context.lineWidth = data.lineWidth;
    context.strokeStyle = color;
    var reverse = fraction > .5;
    var start = offset + data.adjustPosition + (reverse ? (fraction - .5) * 2 * data.maxRadians : 0);
    var end = data.minRadians + offset + data.adjustPosition + (reverse ? data.maxRadians : fraction * 2 * data.maxRadians);
    context.arc(size[0], size[1], radius, start, end);
    context.stroke();
}