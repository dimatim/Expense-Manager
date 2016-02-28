/**
 * Created by Dima on 21-Feb-16.
 */
function resize(cell, config) {
    var finalSize = config.finalSize;
    var cellSize = config.cellSize;
    var size = [$(cell).width(), $(cell).height()];
    var growBy = [finalSize[0] - cellSize[0], finalSize[1] - cellSize[1]];
    var leftTopDiff = getLeftTopDifference(config);
    var currentLeftTop = [$(cell).offset().left, $(cell).offset().top];
    var growFactor = (grow ? 1 : -1);
    var scroll = config.fitAnchor ? [0, 0] : [window.scrollX, window.scrollY];
    $(cell).css('z-index', 1);
    $(cell).animate({
        width: size[0] + growFactor * growBy[0],
        height: size[1] + growFactor * growBy[1],
        left: growFactor * scroll[0] + currentLeftTop[0] - growFactor * leftTopDiff[0],
        top: growFactor * scroll[1] + currentLeftTop[1] - growFactor * leftTopDiff[1]
    }, {
        duration: config.duration,
        start: function () {
            $(cell).find('.expandable_cell_preview').animate({
                left: grow ? (leftTopDiff[0] - scroll[0]) : 0,
                top: grow ? (leftTopDiff[1] - scroll[1]) : 0,
                opacity: grow ? 0 : 1
            }, {
                duration: config.duration
            });
            $(cell).find('.expandable_cell_content').css({
                left: grow ? (-finalSize[0] + cellSize[0]) / 2 : 0
            });
            $(cell).find('.expandable_cell_content').animate({
                left: grow ? 0 : (-finalSize[0] + cellSize[0]) / 2,
                opacity: grow ? 1 : 0
            }, {
                start: function () {
                    if (grow) $(this).show();
                },
                complete: function () {
                    if (!grow) $(this).hide();
                },
                duration: config.duration
            });
            blockScroll = grow;
        },
        complete: function () {
            grow = !grow;
            if (grow)
                $(cell).css('z-index', 0);
        }
    });
}
var cellOffset;
var grow = true;

function normalizeConfig(config) {
    var anchor = config.anchor != null ? config.anchor : $(window);

    if (config.fitAnchor)
        config.finalSize = [-2, -2];

    if (config.finalSize[0] == -1)
        config.finalSize[0] = $(window).width();
    else if (config.finalSize[0] == -2)
        config.finalSize[0] = anchor.width();

    if (config.finalSize[1] == -1)
        config.finalSize[1] = $(window).height();
    else if (config.finalSize[1] == -2)
        config.finalSize[1] = anchor.height();

    var numCells = $('.expandable_cell').length;
    if (config.cellSize[0] == -1)
        config.cellSize[0] = Math.floor(anchor.width() / config.columns);
    if (config.cellSize[1] == -1)
        config.cellSize[1] = Math.floor(anchor.height() / Math.ceil(numCells / config.columns));
}
var blockScroll = false;
var clickedIndex;

function initOpen(config) {
    $('body').on({
        'mousewheel': function (e) {
            if (blockScroll) {
                e.preventDefault();
                e.stopPropagation();
            }
        }
    });
    normalizeConfig(config);
    var columns = config.columns;
    var cellSize = config.cellSize;
    var finalSize = config.finalSize;
    var cellArray = $('.expandable_cell');
    var numCells = cellArray.length;
    var tableSize = [cellSize[0] * columns, cellSize[1] * Math.ceil(numCells / columns)];
    var tableLeftTop = config.anchor != null ? [config.anchor.offset().left, config.anchor.offset().top] : getLeftTop(tableSize);
    cellArray.each(function (index, elem) {
        var row = Math.floor(index / columns);
        var column = index % columns;
        $(elem).click(function () {
            if (grow) {
                cellOffset = $(elem).offset();
                clickedIndex = index;
            }
            if (clickedIndex == index)
                resize($(elem), config)
        });
        $(elem).find('.expandable_cell_content').hide();
        $(elem).css({
            left: tableLeftTop[0] + cellSize[0] * column,
            top: tableLeftTop[1] + cellSize[1] * row,
            width: cellSize[0],
            height: cellSize[1]
        });
    });
    $('.expandable_cell_preview').each(function (index, elem) {
        $(elem).css({
            width: cellSize[0],
            height: cellSize[1]
        });
    });
    $('.expandable_cell_content').each(function (index, elem) {
        $(elem).css({
            width: finalSize[0],
            height: finalSize[1]
        });
    });
}

function showPreview(element) {
    $(element).find('.expandable_cell_preview').show();
}

function hidePreview(element) {
    $(element).find('.expandable_cell_preview').hide();
}

function showContent(element) {
    $(element).find('.expandable_cell_content').show();
}

function hideContent(element) {
    $(element).find('.expandable_cell_content').hide();
}

function getLeftTop(desiredSize) {
    return [Math.max(0, Math.floor(($(window).width() - desiredSize[0]) / 2)),
        Math.max(0, Math.floor(($(window).height() - desiredSize[1]) / 2))];
}

function getLeftTopDifference(config) {
    var finalLeftTop = config.fitAnchor ? [config.anchor.offset().left, config.anchor.offset().top] : getLeftTop(config.finalSize);
    return [cellOffset.left - finalLeftTop[0], cellOffset.top - finalLeftTop[1]];
}