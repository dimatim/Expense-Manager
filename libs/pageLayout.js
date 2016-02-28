/**
 * Created by Dima on 23-Jan-16.
 */
var active = false;
var indexes = [];
var currentIndex = 0;
var direction = 1;
var dotInactiveColor = "#999999";
var dotActiveColor = "#FFFFFF";
var body;

$(document).ready(function () {
    /*$('html').animate({scrollTop:0}, 1);
     $('body').animate({scrollTop:0}, 1);*/
    body = $("body");
    adaptHeight();
    addPageIndicators();
    body.on({
        'mousewheel': function (e) {
            if (e.originalEvent.wheelDelta >= 0) {
                direction = -1;
            } else {
                direction = 1;
            }
            handleScroll(e, direction);
        }
    });
    //var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    var top = getTopOffset();
    currentIndex = Math.max(0, indexes.indexOf(top));
    performScroll(currentIndex);
    $(document).keydown(function (e) {
        switch (e.which) {
            case 37: // left
                direction = 0;
                break;
            case 38: // up
                direction = -1;
                break;
            case 39: // right
                direction = 0;
                break;
            case 40: // down
                direction = 1;
                break;
            default:
                return; // exit this handler for other keys
        }
        if (direction != 0)
            handleScroll(e, direction);
    });
});

function getTopOffset() {
    var doc = document.documentElement;
    var top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    var split = $(location).attr('href').split('#');
    if (split.length > 1 && split[1].length > 1) {
        var $_elem = $('#' + split[1]);
        top = $_elem.offset().top;
    }
    return top;
}

function addPageIndicators() {
    var container = $('.pager');
    for (var i = 0; i < indexes.length; ++i) {
        var button = '<button type="button" id=' + "page" + i + ' class="page_indicator" onclick="performScroll(' + i + ')">';
        container.append(button);
    }
}

function scrollWin(start, height) {
    active = true;
    $({x: 0}).animate({x: 1}, {
        duration: 500,
        easing: "linear",
        step: function (now) {
            window.scrollTo(0, start + height * now);
        },
        complete: function () {
            active = false;
        }
    });
}

var callback;

function animateBackground(pageIndex) {
    var color;
    switch (pageIndex) {
        case 0:
        default:
            color = "#222222";
            break;
        case 1:
        case 2:
            color = "#01243B";
            break;
        case 3:
            color = "#641D1D";
            break;

    }
    $('body').animate({backgroundColor: color}, 500);
}

function adaptHeight() {
    var stylesheet = document.styleSheets[0];
    var height = $(window).height();
    var s = stylesheet.cssRules;
    for (var i = 0; i < s.length; ++i) {
        if (s[i].selectorText == ".page") {
            s[i].style.height = height + "px";
            break;
        }
    }
    var numItems = $('.page').length;
    indexes = [0];
    for (i = 1; i < numItems; ++i) {
        indexes.push(height * i);
    }
}

function handleScroll(e, direction) {
    if ((currentIndex == 0 && direction == -1) ||
        (currentIndex == indexes.length - 1 && direction == 1) ||
        active) return;
    performScroll(currentIndex + direction);
    if (currentIndex < 0)
        currentIndex = 0;
    else if (currentIndex >= indexes.length)
        currentIndex = indexes.length - 1;
    e.preventDefault();
    e.stopPropagation();
}

function performScroll(pageIndex) {
    var height = $(window).height();
    var diff = pageIndex - currentIndex;
    body.find("#page" + currentIndex).css("background-color", dotInactiveColor);
    body.find("#page" + pageIndex).css("background-color", dotActiveColor);
    if (diff != 0) {
        scrollWin(indexes[currentIndex], diff * height);
        currentIndex = pageIndex;
    }
    animateBackground(pageIndex);
    setTimeout(function () {
        if (callback != null)
            callback(pageIndex);
    }, 500);
}

/*
 function spinGear() {
 var $elem = $("#gear");
 $({deg: 0}).animate({deg: 360}, {
 duration: 2000,
 easing: "linear",
 step: function (now) {
 // in the step-callback (that is fired each step of the animation),
 // you can use the `now` paramter which contains the current
 // animation-position (`0` up to `angle`)
 $elem.css({
 transform: 'rotate(' + now + 'deg)'
 });
 },
 complete: function () {
 if (currentIndex == indexes.length - 1)
 spinGear();
 }
 });
 }*/
