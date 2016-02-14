/**
 * Created by Dima on 06-Feb-16.
 */
$(document).ready(function () {
    //FIXME should calculate cell size based on table size
    var w = $(window).width() / 3 - 50;
    var h = $(window).height() / 2 - 150;
    var min = Math.min(w, h);
    $('.animationGridCell').each(function (i, obj) {
        $(obj).css({
            height: min,
            width: min
        });
    });
    $('.linkGridCell').each(function (i, obj) {
        $(obj).css({
            height: min,
            width: min
        });
    });
    $('.circularTable').each(function (i, obj) {
        $(obj).css({
            height: min,
            width: min
        });
    });
    $('.circularCell').each(function (i, obj) {
        $(obj).css({
            height: min / 2,
            width: min / 2
        });
    });
    $('.circularCanvas').each(function (i, obj) {
        obj.getContext('2d').canvas.height = min / 2;
        obj.getContext('2d').canvas.width = min / 2;

    });

    var c1 = {
        canvas: $('#circular1'),
        colors: [
            {color: '#FFD034', offset: 0},
            {color: '#0072BB', offset: 2 * Math.PI / 3},
            {color: '#FF4C3B', offset: 4 * Math.PI / 3}
        ],
        repeat: 5,
        lineWidth: 3,
        minRadians: Math.PI / 6,
        maxRadians: 4 * Math.PI / 6
    };
    c1['maxRadius'] = .75 * Math.min.apply(Math, [(c1.canvas.width() - c1.lineWidth) / 2, (c1.canvas.height() - c1.lineWidth) / 2]);
    startSpinner(c1);

    /*var c2 = {
        canvas: $('#circular2'),
        colors: [
            {color: '#FFD034', offset: 0},
            {color: '#0072BB', offset: Math.PI},
            {color: '#FF4C3B', offset: 0},
            {color: '#666699', offset: Math.PI}
        ],
        reverse: true,
        repeat: 1,
        spacing: 4,
        lineWidth: 8,
        minRadians: Math.PI / 6,
        maxRadians: 3 / 2 * Math.PI
    };
    c2['maxRadius'] = .75 * Math.min.apply(Math, [(c2.canvas.width() - c2.lineWidth) / 2, (c2.canvas.height() - c2.lineWidth) / 2]);
    startSpinner(c2);*/

    var c3 = {
        canvas: $('#circular3'),
        colors: [
            {color: '#FFD034', offset: 0}
        ],
        reverse: true,
        repeat: 1,
        lineWidth: 8,
        minRadians: Math.PI / 6,
        maxRadians: 3 / 2 * Math.PI
    };
    c3['maxRadius'] = .75 * Math.min.apply(Math, [(c3.canvas.width() - c3.lineWidth) / 2, (c3.canvas.height() - c3.lineWidth) / 2]);
    startSpinner(c3);

    var c4 = {
        canvas: $('#circular4'),
        colors: [
            {color: '#FFD034', offset: 0},
            {color: '#0072BB', offset: Math.PI / 4},
            {color: '#FF4C3B', offset: Math.PI / 2},
            {color: '#666699', offset: 3 * Math.PI / 4},
            {color: '#003366', offset: Math.PI}
        ],
        repeat: 3,
        spacing: 6,
        lineWidth: 3,
        minRadians: Math.PI / 3,
        maxRadians: 6 / 4 * Math.PI
    };
    c4['maxRadius'] = .75 * Math.min.apply(Math, [(c4.canvas.width() - c4.lineWidth) / 2, (c4.canvas.height() - c4.lineWidth) / 2]);
    startSpinner(c4);

    var bundle = {
        words: ['Java', 'Kotlin', 'C++', 'SQL', 'HTML5', 'JavaScript', 'CSS', 'jQuery', 'Android'],
        //words : ['oio'],
        numItems: 5,
        duration: 2500,
        container: document.getElementById("super")
    };

    callback = function (index) {
        if (index == 2)
            startRain(bundle);
        else
            stopRain('super')
    };
});