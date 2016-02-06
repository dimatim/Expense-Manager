/**
 * Created by Dima on 06-Feb-16.
 */
$(document).ready(function () {
    //FIXME should calculate cell size based on table size
    var w = $(window).width() / 3 - 50;
    var h = $(window).height() / 2- 150;
    var min = Math.min(w, h);
    $('.animationGridCell').each(function(i, obj) {
        $(obj).css({
            height: min,
            width: min
        });
    });
    $('.linkGridCell').each(function(i, obj) {
        $(obj).css({
            height: min,
            width: min
        });
    });
});