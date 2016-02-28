/**
 * Created by Dima on 06-Feb-16.
 */
$(document).ready(function () {

    var w = $(window).width();
    var h = $(window).height();
    var min = Math.min(w, h);
    var columns = 3;
    var rows = Math.ceil($('.expandable_cell').length / columns);
    var cellSize = [Math.min(min / columns, min / rows), Math.min(min / columns, min / rows)];
    $('#anchorDiv').css({
        height: cellSize[1] * rows,
        width: cellSize[0] * columns
    });

    var config = {
        anchor: $('#anchorDiv'),
        fitAnchor: true,
        duration: 300,
        columns: columns,
        finalSize: [-2, -2], //-2 == anchor size, -1 == screen size
        cellSize: [-1, -1]  //-1 == screen size
    };
    initOpen(config);

    var bundle = {
        words: ['Java', 'Kotlin', 'C++', 'SQL', 'HTML5', 'JavaScript', 'CSS', 'jQuery', 'Android'],
        //words : ['oio'],
        numItems: 5,
        duration: 2500,
        container: $("#super")
    };

    $('.circularTable').each(function (i, obj) {
        $(obj).css({
            height: cellSize[1],
            width: cellSize[0]
        });
    });
    $('.circularCell').each(function (i, obj) {
        $(obj).css({
            height: cellSize[1] / 2,
            width: cellSize[0] / 2
        });
    });
    $('.circularCanvas').each(function (i, obj) {
        obj.getContext('2d').canvas.height = cellSize[1] / 2;
        obj.getContext('2d').canvas.width = cellSize[0] / 2;
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

    var c3 = {
        canvas: $('#circular3'),
        radianIncrement: Math.PI / 75,
        duration: 2000,
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

    var c4 = {
        canvas: $('#circular4'),
        radianIncrement: Math.PI / 75,
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

    startSpinner(c1);
    startSpinner(c3);
    startSpinner(c4);

    callback = function (index) {
        if (index == 1) {
            startRain(bundle);
        } else {
            stopRain('super');
        }
    };

    $('#toggle').on({
        'click' : function (e) {
            showGraph([data]);
            e.stopPropagation();
        }
    });
});