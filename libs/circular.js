/**
 * Created by Dima on 07-Feb-16.
 */


//TODO add reverse direction functionality
function startSpinner(data) {
    data['adjustPosition'] = 0;
    animate(data);
}

function animate(data) {
    $({progress: 0}).animate({progress: 1}, {
        duration: 3000,
        easing: "linear",
        step: function (now) {
            data.adjustPosition += Math.PI / 90; // speed
            create(now, data);
        },
        complete: function () {
            data.adjustPosition += data.maxRadians;
            data.adjustPosition %= 2 * Math.PI;
            animate(data)
        }
    });
}

function create(now, data) {
    var context = data.canvas[0].getContext('2d');
    context.clearRect(0, 0, data.canvas.width(), data.canvas.height());
    for (var i = 0; i < data.repeat * data.colors.length; ++i) {
        drawCircle(data, i, now);
    }
}

function drawCircle(data, iteration, fraction) {
    var context = data.canvas[0].getContext('2d');
    var size = [data.canvas.width() / 2, data.canvas.height() / 2];
    var index = iteration % data.colors.length;
    var radius = data.maxRadius - iteration * data.lineWidth;
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