/**
 * Created by Dima on 05-Feb-16.
 */
var duration = 2500;
var words = [];
var itemClass = 'droplet';
var idMap = {};
function move(container, object, text) {
    object.text(text);
    var height = $(container).height() - object.outerHeight();
    var width = $(container).width() - object.outerWidth();
    object.css({
        top: Math.random() * height,
        left: Math.random() * width
    });
    animateText(object, true);
}
function startRain(bundle) {
    this.duration = bundle.duration;
    words = bundle.words;
    for (var i = 0; i < bundle.numItems; ++i) {
        var mObj = '<div class="' + itemClass + '">';
        $(bundle.container).append(mObj);
    }
    start(bundle);
}

function start(bundle) {
    var index = 0;
    function triggerDelayedAnimation() {
        $(bundle.container).find('.' + itemClass).each(function (i, obj) {
            setTimeout(function () {
                move(bundle.container, $(obj), bundle.words[index++]);
                index %= bundle.words.length;
            }, (duration / bundle.numItems) * i)
        });
    }

    triggerDelayedAnimation();
    idMap[$(bundle.container).attr('id')] = setInterval(function () {
        triggerDelayedAnimation();
    }, duration);
}

function stopRain(id) {
    clearInterval(idMap[id]);
    $('#' + id).children('.' + itemClass).remove();
}

function animateText(object, show) {
    $({alpha: show ? 0 : 1}).animate({alpha: show ? 1 : 0}, {
        duration: duration * (show ? .17 : .83),
        easing: "linear",
        step: function (now) {
            var scale = show ? (0.4 + 0.1 * now) : (0.5 + (1 - now) * 0.5);
            $(object).css({
                opacity: now,
                transform: 'scale(' + scale + ',' + scale + ')'
            });
        },
        complete: function () {
            if (show)
                animateText(object, false);
        }
    });
}