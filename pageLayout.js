/**
 * Created by Dima on 23-Jan-16.
 */
var sInterval;
var active = false;
var indexes = [0, 600, 1200];
var currentIndex = 0;
var direction = 1;
function addPage() {
    var iDiv = document.createElement('div');
    iDiv.className = 'main';
    document.getElementsByTagName('body')[0].appendChild(iDiv);
}

function scrollWin(start, height, direction) {
    var x = 0;
    console.log("one = ", document.getElementById("active").getBoundingClientRect().top);
    console.log("two = ", document.body.scrollTop);
    clearInterval(sInterval);
    active = true;
    sInterval = setInterval(function () {
        console.log("will scroll");
        window.scrollTo(0, start + direction * height * x);
        x += 0.02;
        if (x > 1.02) {
            clearInterval(sInterval);
            console.log("active is false");
            active = false;
        }
    }, 10);
}

$(document).ready(function () {
    adaptHeight();
    $('body').on({
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

function adaptHeight() {
    var stylesheet = document.styleSheets[0];
    var height = $(window).height();
    stylesheet.cssRules[3].style.height = height + "px";
    stylesheet.cssRules[4].style.height = height + "px";
    indexes = [0, height, 2 * height, 3 * height];
}

function handleScroll(e, direction) {
    var height = $(window).height();
    if (!active && currentIndex < indexes.length) {
        console.log("scrolled index ", currentIndex);
        if (currentIndex == indexes.length - 1 && direction == 1)
            return;
        scrollWin(indexes[currentIndex], height, direction);
        currentIndex += direction;
        if (currentIndex < 0)
            currentIndex = 0;
        else if (currentIndex >= indexes.length)
            currentIndex = indexes.length - 1;
    } else return;
    e.preventDefault();
    e.stopPropagation();
}