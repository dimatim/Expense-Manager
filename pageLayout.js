/**
 * Created by Dima on 23-Jan-16.
 */
var sInterval;
var active = false;
var indexes = [0, 600, 1200];
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
    body = $("body");
    body.find("#page" + currentIndex).css("background-color", dotActiveColor);
    adaptHeight();
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

var spinInterval;

function scrollWin(start, height, finalIndex) {
    if (finalIndex == 2) {
        clearInterval(spinInterval);
        spinInterval = setInterval(function() {
            spinGear();
        }, 50);
    } else {
        clearInterval(spinInterval);
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
    stylesheet.cssRules[3].style.height = height + "px";
    stylesheet.cssRules[4].style.height = height + "px";
    indexes = [0, height, 2 * height];
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

var deg = 0;
function spinGear() {
    var div = document.getElementById('gear');
    deg += 5;
    deg %= 360;
    div.style.webkitTransform = 'rotate('+deg+'deg)';
    div.style.mozTransform    = 'rotate('+deg+'deg)';
    div.style.msTransform     = 'rotate('+deg+'deg)';
    div.style.oTransform      = 'rotate('+deg+'deg)';
    div.style.transform       = 'rotate('+deg+'deg)';
}