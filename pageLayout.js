/**
 * Created by Dima on 23-Jan-16.
 */
var sInterval;
var active = false;
var indexes = [];
var currentIndex = 0;
var direction = 1;
var dotInactiveColor = "#999999";
var dotActiveColor = "#FFFFFF";
var body;
/*function addPage() {
 var iDiv = document.createElement('div');
 iDiv.className = 'main';
 document.getElementsByTagName('body')[0].appendChild(iDiv);
 }*/

$(document).ready(function () {
    /*$('html').animate({scrollTop:0}, 1);
     $('body').animate({scrollTop:0}, 1);*/
    body = $("body");
    adaptHeight();
    addPageIndicators();
    body.find("#page" + currentIndex).css("background-color", dotActiveColor);
    body.on({
        'mousewheel': function (e) {
            if (e.originalEvent.wheelDelta >= 0) {
                console.log('Scroll up');
                direction = -1;
            } else {
                console.log('Scroll down');
                direction = 1;
            }
            handleScroll(e, direction);
        }
    });
    $(document).keydown(function (e) {
        switch (e.which) {
            case 37: // left
                break;
            case 38: // up
                direction = -1;
                break;
            case 39: // right
                break;
            case 40: // down
                direction = 1;
                break;
            default:
                return; // exit this handler for other keys
        }
        handleScroll(e, direction);
    });
});

function addPageIndicators() {
    var container = $('.pager');
    for (var i = 0; i < indexes.length; ++i) {
        var button = '<button type="button" id=' + "page" + i + ' class="page_indicator" onclick="performScroll(' + i + ')">';
        container.append(button);
    }
}

function scrollWin(start, height, finalIndex) {
    if (finalIndex == 2) {
        spinGear()
    }
    body.find("#page" + currentIndex).css("background-color", dotInactiveColor);
    body.find("#page" + finalIndex).css("background-color", dotActiveColor);
    animateBackground(finalIndex);
    var x = 0;
    clearInterval(sInterval);
    active = true;
    sInterval = setInterval(function () {
        console.log("will scroll");
        window.scrollTo(0, start + height * x);
        x += 0.02;
        if (x > 1.02) {
            clearInterval(sInterval);
            console.log("active is false");
            active = false;
        }
    }, 10);
}

function animateBackground(pageIndex) {
    var color;
    switch (pageIndex) {
        case 0:
        case 2:
        default:
            color = "#222222";
            break;
        case 1:
            color = "#003b64";
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
    var height = $(window).height();
    if ((currentIndex == 0 && direction == -1) ||
        (currentIndex == indexes.length - 1 && direction == 1) ||
        active) return;
    scrollWin(indexes[currentIndex], direction * height, currentIndex + direction);
    currentIndex += direction;
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
    if (diff != 0) {
        scrollWin(indexes[currentIndex], diff * height, pageIndex);
        currentIndex = pageIndex;
    }

}

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
            if (currentIndex == 2)
                spinGear();
        }
    });
}