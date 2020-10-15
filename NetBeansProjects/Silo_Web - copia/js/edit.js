function loadEditPage() {
    resetDivImgFromAttr();
}
function resetDivImgFromAttr() {
    $("div[bg_image]").each(function (index, element) {
        var image = element.getAttribute("bg_image");
        element.style.backgroundImage = "url(" + image + ")";
    });


    $("div[off_image]").each(function (index, element) {
        var image = element.getAttribute("off_image");
        element.style.backgroundImage = "url(" + image + ")";
    });

    var sliders = $(".analog_slider_comp");

    sliders.each(function (index) {
        var parent = $(this).parent().get(0);

        var hdl_img = $(parent).attr("hdl_img");
        if (hdl_img) {
            $(parent).children(".analog_slider_comp").children(".ui-slider-handle").css('background-image', 'url(' + hdl_img + ')');
        }
        var bar_img = $(parent).attr("bar_img");
        if (bar_img) {
            $(parent).children(".analog_slider_comp").css('background-image', 'url(' + bar_img + ')');
        }

    });
}

function moveDiv(id, x, y)
{
    var target = $("#" + id);
    target.css('left', parseToInt(x));
    target.css('top', parseToInt(y));
}

function resizeDiv(id, width, height)
{
    //var target = $("#" + id).children(":first");
    var target = $("#" + id);
    target.css('width', parseToInt(width));
    target.css('height', parseToInt(height));
    target.css('text-align', "center");
    target.css('background-repeat', "no-repeat");
    target.css('background-size', parseToInt(width) + "px " + (parseToInt(height) + 1) + "px");
    if (target.hasClass("textCenter")) {
        target.css('line-height', parseToInt(height) + "px");
    }
}

function resizePageDiv(id, width, height)
{
    var target = $("#main");
    target.css('width', parseToInt(width) - 20);
    target.css('height', parseToInt(height) - 20);
    target.css('text-align', "center");
    if (target.hasClass("textCenter")) {
        target.css('line-height', parseToInt(height) + "px");
    }
    target.css('margin', 0);
    target.css('padding', 0);
    target.css('top', 0);
    target.css('left', 0);
    //alert(target.css('background-image'));
    if (target.css('background-image') && target.css('background-image').indexOf("linear-gradient") != -1) {
        //background grid
        target.css('background', "linear-gradient(60deg, white 0px, black 1px, red 0px, white 0px) 25px -24px");
        target.css('background-repeat', "initial initial");
        target.css('background-size',"")
    } else {
        target.css('background-position', "0px 0px");
        target.css('background-repeat', "no-repeat");
        if(target.css("background-image")){
            target.css('background-size', parseToInt(width) + "px " + (parseToInt(height) + 1) + "px");
        }else{
            target.css('background-size',"");
        }
    }
}

function updateBgImg(id, imgPath)
{
    imgPath = (imgPath == "img/null") ? "img/default.jpg" : imgPath;
    $("#" + id).css('background-image', 'url(' + imgPath + ')');
    $("#" + id).css('background-repeat', "no-repeat");
    if ($("#" + id).attr("comp_type") == "ImageComponent") {
        $("#" + id).attr("bg_image", imgPath);
    }
}

function updatePageBgImg(imgPath)
{
    if (imgPath == "img/" || imgPath == "img/null" || "" || imgPath == "null") {
        setPageBgAsDefault();
        return;
    }

    var width = $("#main").width();
    var height = $("#main").height();
    var newSize = width + "px " + (height) + "px";
    $("#main").css('background-image', 'url(' + imgPath + ')');
    $("#main").css('background-size', newSize);
    $("#main").css('background-repeat', "no-repeat");
    $("#main").css('background-position', "0px 0px");
    $("#main").attr("bg_image", imgPath);
    $("#main").css('margin', 0);
    $("#main").css('padding', 0);
    $("#main").css('top', 0);
    $("#main").css('left', 0);
}

function setPageBgAsDefault()
{
//    $("#main").css('background', '');
//    $("#main").css('background-color', "white");
//    $("#main").css('background:linear-gradient', "(60deg, white 0px, black 1px, red 0px, white 0px) 25px - 24px");
//    $("#main").css('background-size', "10px 10px");
//    $("#main").css('background-image', '');

    var width = $("#main").css('width');
    var height = $("#main").css('height');
    $("#main").attr("bg_image", "");
    $("#main").attr("style", "");
    $("#main").attr("class", "main");
    $("#main").css('width', parseToInt(width));
    $("#main").css('height', parseToInt(height));
}

function addDiv(id, x, y, htmlStr, script)
{
    // If exits, delete the old html. be used for line, and so on.
    if ($("#" + id).length !== 0) {
        $("#" + id).remove();
    }
    getBody().innerHTML = getBody().innerHTML + htmlStr;
    var newNode = getBody().childNodes[getBody().childNodes.length - 1];
    newNode.id = id;
    var target = $("#" + id);
    target.css('position', "absolute");
    target.css('left', parseToInt(x));
    target.css('top', parseToInt(y));

    if (target.hasClass("server_binding")) {
        target.attr("show_param", id);
    }
    if (target.attr("comp_type") && target.attr("comp_type").indexOf("AnalogSliderComponent") != -1) {
        var slider_maxVal = parseInt(target.attr("maxval"));
        var slider_minVal = parseInt(target.attr("minval"));
        var midVal = (slider_maxVal - slider_minVal) * 0.5 + slider_minVal;
        target.attr("show_param", id);
        var sliderBar = target.children(".analog_slider_comp");
        sliderBar.slider({
            orientation: "vertical",
            max: slider_maxVal,
            min: slider_minVal,
            value: midVal
        });
        sliderBar.css("background-size", sliderBar.width() + "px " + sliderBar.height() + "px");
    }
    $(script).appendTo("#main");
}

function cloneDiv(clonedId, newId, x, y)
{
    var target = $("#" + clonedId);
    var newDiv = target.clone();
    newDiv.attr("id", newId);
    $("#main").append(newDiv);
    newDiv.css('position', "absolute");
    newDiv.css('left', parseToInt(x));
    newDiv.css('top', parseToInt(y));
    if (target.hasClass("server_binding")) {
        newDiv.attr("show_param", newId);
    }
}

function insertFromCopiedDiv(htmlStr, newId, x, y, script)
{
    var newDiv = $(htmlStr);
    newDiv.attr("id", newId);
    $("#main").append(newDiv);
    newDiv.css('position', "absolute");
    newDiv.css('left', parseToInt(x));
    newDiv.css('top', parseToInt(y));
    if (newDiv.hasClass("server_binding")) {
        newDiv.attr("show_param", newId);
    }
    $(script).appendTo("#main");
}

function getWidgetHtmlString(id)
{
    // return $("#" + id).prop('outerHTML');
    var main = $("#" + id);
    if (main && main[0]) {
        return main[0].outerHTML;
    }
    else {
        return "";
    }
}

function getRuntimeBody()
{
    var main = $("#main");
    return main[0].outerHTML;
}

function deleteDiv(id)
{
    var target = $("#" + id);
    if (target) {
        target.remove();
    }
}

function updateText(id, newValue)
{
    if ($("#" + id + " a").length > 0) {
        $("#" + id + " a").html(newValue);
    }
    else if ($("#" + id + " p").length > 0) {
        $("#" + id + " p").html(newValue);
       // updateTextHeightInDiv($("#" + id));
    }
    else {
        $("#" + id).html(newValue);
    }

}

function updateBgColor(id, color) {
    $("#" + id).css("background-color", color);
}

function updateFontColor(id, color)
{
    $("#" + id).css("color", color);
    if ($("#" + id).has("a")) {
        $("#" + id + " a").css("color", color);
    }
}

function updateFont(id, fontFamily, fontStyle, fontSize)
{
    setFontStyle(id, parseInt(fontStyle));
    $("#" + id).css({"font-family": fontFamily, "font-size": parseInt(fontSize)});
}

function setFontStyle(id, fontStyle)
{
    if (fontStyle == 0) {
        //normal
        $("#" + id).css({"font-style": "normal", "font-weight": ""});
    }
    else if (fontStyle == 1)
    {   //bold
        $("#" + id).css({"font-style": "normal", "font-weight": "bold"});
    }
    else if (fontStyle == 2)
    {   //italic
        $("#" + id).css({"font-style": "italic", "font-weight": ""});
    }
    else if (fontStyle == 3)
    {   //italic bold
        $("#" + id).css({"font-style": "italic", "font-weight": "bold"});
    }
}

function updateOnImage(id, newValue) {
    updateAttribute(id, "on_image", newValue);
}

function updateOffImage(id, newValue) {
    updateAttribute(id, "off_image", newValue);
    updateBgImg(id, newValue);
    //$("#" + id).css('background-image', 'url(' + newValue + ')');
}

function updateOnText(id, newValue) {
    updateAttribute(id, "on_text", newValue);
}

function updateOffText(id, newValue) {
    updateAttribute(id, "off_text", newValue);
}

function updateTagID(id, newValue) {
    updateAttribute(id, "tag_id", newValue);
}

function updateBlockType(id, range) {
    updateAttribute(id, "range", range);
}

function updateBlockNumber(id, address) {
    updateAttribute(id, "address", address);
}

function updateAccessMode(id, type) {
    updateAttribute(id, "type", type);
}

function updateLength(id, length) {
    updateAttribute(id, "length", length);
}

function updateAttribute(id, attriName, newValue)
{
    $("#" + id).attr(attriName, newValue);
}

function updateZIndex(id, newValue)
{
    $("#" + id).css("zIndex", newValue);
}

function updateMode(id, newValue) {
    $("#" + id).attr("mode", newValue);
    if ($("#" + id).attr("comp_type") == "CustomizedComponent") {
        if (newValue == "true") {
            $("#" + id).attr("onclick", "setDigitalData(this)");
        } else {
            $("#" + id).removeAttr("onclick");
        }
    }
}

function updateUrl(id, url) {
    $("#" + id + " a").attr("href", url);
}

function getBody()
{
    return document.getElementById("main");
}

function parseToInt(value)
{
    if (typeof (value) === "string") {
        if (value.indexOf(",") > 0)
        {
            value = value.replace(",", "");
        }
        return parseInt(value);
    } else {

    }
}

//called by init logoBrowser
function resizeMain(width, height)
{
    var target = $("#main");
    target.css('width', parseInt(width));
    target.css('height', parseInt(height));
}

//-----------nav-----------------------------------------------

function addNavItem(id, html)
{
    $("#logOff").before(html);
    $("#newItem").attr('id', id);
    var color = $(".menuTitle").css("color");
    $("#" + id + " a").css("color", color);
}

function insertNavItem(newId, position, html)
{
    var newDiv = $(html);
    newDiv.attr("id", newId);
    $('.items').children().eq(position).before(newDiv);
    var color = $(".menuTitle").css("color");
    $("#" + newId + " a").css("color", color);
}

function insertNavItemFromCopiedItem(newId, htmlStr)
{
    var newDiv = $(htmlStr);
    newDiv.attr("id", newId);
    $("#logOff").before(newDiv);
}

function sortNavItems(id, position, isMoveDown)
{
    var target = $("#" + id);
    var newDiv = target.clone();
    if (isMoveDown) {
        $('.items').children().eq(position).after(newDiv);
    } else {
        $('.items').children().eq(position).before(newDiv);
    }
    target.remove();
}

function updateNavItemLink(id, link, text)
{
    updateNavItmeText(id, text);
    link = (link == "Home Page") ? "main" : link;
    $("#" + id + " a").attr("nav_link", link);
}

function updateNavItmeText(id, text)
{
    //text = text.replace(/&/g, '&amp;');
    //text = text.replace(/</g, '&lt;');
    //text = text.replace(/>/g, '&gt;');
    //text = text.replace(/"/g, '&quot;');
    //text = text.replace(/'/g, '&#039;');
    //text = text.replace(/\\/g, '\\\\');
    $("#" + id + " a").html(text);
}

function updateNavItemFontColor(id, color)
{
    $("#" + id + " a").css("color", color);
}

function getRuntimeNavBody()
{
    var main = $("#menu");
    return main[0].outerHTML;
}

function updateNavDisplayStyle(isRight)
{
    $("#menu").attr("is_right", isRight);
}

function updateNavFontColor(id, color)
{
    $(".item").css("color", color);
    $(".menuTitle").css("color", color);
}
/**
 * border-color
 */
function updateBorderColor(id, value)
{
    updateDivCss(id, 'border-color', value);
}

/**
 * border-style
 */
function updateBorderStyle(id, value)
{
    updateDivCss(id, 'border-style', value);
}

/**
 * border-width
 */
function updateBorderWidth(id, value, width, height)
{
    // update border width
    updateDivCss(id, 'border-width', value);
    // update div size
    resizeDiv(id, width, height);
}

/**
 * common method: update div css by styleName.
 */
function updateDivCss(id, cssName, value)
{
    var divObj = $("#" + id);
    if (divObj)
    {
        divObj.css(cssName, value);
    }
}

/**
 * alpha
 */
function updateAlpha(id, value)
{
    // filter: Alpha(opacity=50);zoom:1;opacity: 0.5;/*background-color:rgba(0,0,0,0.1);*/
    var divObj = $("#" + id);
    if (divObj)
    {
        value = 100 - parseInt(value);
        var tempValue = value / 100;
        divObj.css("filter", "Alpha(opacity=" + value + ")");
        divObj.css("zoom", "1");
        divObj.css("opacity", tempValue);
    }
}

//--------------------File-----------------------------------------
function removeEditReference()
{
    $('script').remove();
}
function setEditReference()
{
    $(document.createElement("script")).attr('type', "text/javascript").attr('src', "res/js/jquery-1.11.2.min.js").appendTo("head").after("\n");
    $(document.createElement("script")).attr('type', "text/javascript").attr('src', "res/js/jquery-ui/jquery-ui.min.js").appendTo("head").after("\n");
    $(document.createElement("script")).attr('type', "text/javascript").attr('src', "res/js/edit.js").appendTo("head").after("\n");
    $(document.createElement("script")).attr('type', "text/javascript").attr('src', "res/js/bootstrap2-toggle.js").appendTo("head").after("\n");
    $(document.createElement("script")).attr('type', "text/javascript").attr('src', "res/js/bootstrap.min.js").appendTo("head").after("\n");
    $('body').attr('onload', "");
}
function setRuntimeReference()
{
    $(document.createElement("script")).attr('type', "text/javascript").attr('src', "/js/storage.js").appendTo("head").after("\n");
    $(document.createElement("script")).attr('type', "text/javascript").attr('src', "/js/utility.js").appendTo("head").after("\n");
    $(document.createElement("script")).attr('type', "text/javascript").attr('src', "/js/bigint.js").appendTo("head").after("\n");
    $(document.createElement("script")).attr('type', "text/javascript").attr('src', "/js/encrypt.js").appendTo("head").after("\n");
    $('body').attr('onload', "DBInit()");
}


//-----------------rotation--------------------------
/**
 * browser compatibility: when open the page, Processing the special page properties.
 */
$(function ()
{
    var main = $("#main");
    if (main && main.children && main.children().length > 0)
    {
        // control the div rotate.
        $("div[degree]").each(function ()
        {
            var degree = $(this).attr("degree");
            if (undefined === degree)
            {
                degree = 0;
            }
            updateRotateCss($(this), parseFloat(degree));
        });
        // control the svg tags show.
        $("svg").each(function ()
        {
            $(this).css("display", "");
        });
    }
});

/**
 * the function of common rotate.
 */
function rotate(id, rotation)
{
    var divObj = $("#" + id);
    if (divObj.length !== 0) {
        if (undefined === rotation)
        {
            rotation = 0;
        }
        var degree = parseFloat(rotation);
        updateRotateCss(divObj, degree);
        // save the degree.
        divObj.attr("degree", degree);
    }
}

/**
 * the function of line rotate.
 */
function rotateLine(id, rotation, x, y)
{
    var svg = $("#" + id);
    if (svg.length !== 0) {
        var g = svg.find("g");
        if (g.length !== 0) {
            // delete the separator of the micrometer level.(eg. ',')
            x = x.replace(/,/gi, '');
            y = y.replace(/,/gi, '');
            var str = "rotate(" + rotation + " " + x + "," + y + ")";
            g.attr("transform", str);
        }
    }
}

/**
 * update rotate css.
 */
function updateRotateCss(obj, degree)
{
    var cValue = "rotate(" + degree + "deg)";
    // Other Browser, including IE > 9
    obj.css("transform", cValue);
    obj.css("-webkit-transform", cValue);
    obj.css("-moz-transform", cValue);
    obj.css("-o-transform", cValue);
    obj.css("-ms-transform", cValue);
}

//-----------------SVG graphics--------------------------
/**
 * update the weight of line.
 * @param {type} id
 * @param {type} value
 */
function updateLineWeight(id, value) {
    updateLineCss(id, "stroke-width", value);
}

/**
 * update the color of line.
 * @param {type} id
 * @param {type} value
 */
function updateLineColor(id, value) {
    updateLineCss(id, "stroke", value);
}

/**
 * update the dashed of line.
 * @param {type} id
 * @param {type} value
 */
function updateLineDash(id, value1, value2) {
    updateLineCss(id, "stroke-dasharray", value1);
    updateLineCss(id, "stroke-linecap", value2);
}


/**
 * common method: update the style of line.
 * @param {type} id
 * @param {type} cssName
 * @param {type} value
 */
function updateLineCss(id, cssName, value) {
    var svg = $("#" + id);
    if (svg.length !== 0) {
        var g = svg.find("g");
        if (g.length !== 0) {
            var leng = g.children().length;
            for (var i = 0; i < leng; i++) {
                var line = g.children()[i];
                line.setAttributeNS(null, cssName, value);
            }
        }
    }
}

/**
 * update the alpha of line.
 * @param {type} id
 * @param {type} value
 */
function updateLineAlpha(id, value) {
    var svg = $("#" + id);
    if (svg.length !== 0) {
        var g = svg.find("g");
        if (g.length !== 0) {
            var leng = g.children().length;
            var opacity = 100 - parseInt(value);
            var tempValue = opacity / 100;
            for (var i = 0; i < leng; i++) {
                var line = g.children()[i];
                line.setAttributeNS(null, "filter", "Alpha(opacity=" + opacity + ")");
                line.setAttributeNS(null, "opacity", tempValue);
            }
        }
    }
}