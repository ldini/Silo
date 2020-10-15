function updateAnalogBgColor(id, color)
{
    $("#" + id).children(".analog_bar").css("background-color", color);
}

function updateAnalogValBarColor(id, color)
{
    $("#" + id).children(".analog_bar").children(".analog_bar_val").css("background-color", color);
    $("#" + id).attr("valBarCol", color);
    return;
}

function updateAnalogMaxVal(id, maxVal) {
    $("#" + id).attr("maxval", maxVal.toString());
}

function updateAnalogMinVal(id, minVal) {
    $("#" + id).attr("minval", minVal.toString());
}

function updateAnalogMode(id, attriName, newValue)
{
    $("#" + id).attr(attriName, newValue);
    if (newValue != "read") {
        //$("#" + id).children(".analog_bar").attr("onclick", "setAnalogData(this)");
    }
}
function updateAnalogTextDemo(id, analogTextDemoStr, symbol, place) {
    var analogTextVal = $("#" + id).children(".valueText").children(".value");
    var analogInputPlaceholder = $("#" + id).children(".valueText").children(".inputVal");
    if (analogTextVal)
        analogTextVal.html(analogTextDemoStr);
    if (analogInputPlaceholder)
        analogInputPlaceholder.attr("placeholder", analogTextDemoStr);
    $("#" + id).attr("symbol", symbol);
    $("#" + id).attr("place", place);
}

function updateBlockFormat(id, blockFormat) {
    $("#" + id).attr("block_format", blockFormat);
}

function updateAnalogUnit(id, unit) {
    $("#" + id).children(".valueText").children(".unit").html(unit);
}
function updateAnalogGain(id, gain) {
    $("#" + id).attr("gain", gain);
}
function updateAnalogTextOffset(id, offset) {
    $("#" + id).attr("offset", offset);
}
function updateAnalogTextSymbol(id, symbol) {
    $("#" + id).attr("symbol", symbol);
}
function updateAnalogSymbolPlace(id, place) {
    $("#" + id).attr("place", place);
}
function updateTimeFormat(id, timeUnit) {
    timeUnit = timeUnit.substring(timeUnit.indexOf("(") + 1, timeUnit.indexOf(")"));
    var text = "0";
    if (timeUnit == "m") {
        text = "00:00";
    } else if (timeUnit == "s") {
        text = "00:00:00";
    } else if (timeUnit == "ms") {
        text = "00:00:00.0";
    }
    $("#" + id).attr("time_format", timeUnit);
    $("#" + id).children(".valueText").children(".inputVal").attr("placeholder", text);
    $("#" + id).children(".valueText").children(".unit").html(timeUnit);
}
function resizeAnalogDiv(id, width, height)
{
    resizeDiv(id, width, height);

    var sliderBar = $("#" + id).children(".analog_slider_comp");
    var sliderHdl = $("#" + id).children(".analog_slider_comp").children(".ui-slider-handle");
    var valueText = $("#" + id).children(".valueText");
    if (sliderBar) {
        var hdlWidth = $("#" + id).width();
        var hdlHeight = $("#" + id).height();
        var sliderBarWidth = hdlWidth - 9;
        var sliderBarHeight = hdlHeight - 2;
        var rSize = hdlWidth;
        if (hdlWidth > hdlHeight)
        {
            sliderBarWidth = hdlWidth - 2;
            sliderBarHeight = hdlHeight - 9;
            rSize = hdlHeight;
            sliderHdl.css("margin-left", (hdlWidth / 2) - (hdlHeight / 2));
            sliderHdl.css("margin-top", -6);
            sliderBar.css("margin-top", 4);
        }
        else if (hdlHeight > hdlWidth)
        {
            rSize = hdlWidth;
            sliderHdl.css("margin-top", (hdlHeight / 2) - (hdlWidth / 2));
            // delete css
            sliderHdl.css("margin-left", "");
            sliderBar.css("margin-top", "");
        }
        sliderHdl.width(rSize).height(rSize).css("background-size", rSize + "px " + rSize + "px");
        // delete css property 'bottom'
        sliderHdl.css("bottom", "");

        sliderBar.width(sliderBarWidth);
        sliderBar.height(sliderBarHeight);
        sliderBar.css("background-size", sliderBarWidth + "px " + sliderBarHeight + "px");
    }
//    if(analogText){
//        var outterHeight = $("#" + id).height();
//        var innerHeight = analogText.height();
//        if(innerHeight>outterHeight){
//            innerHeight = outterHeight;
//        }
//        var outterWidth = $("#" + id).width();
//        analogText.width(outterWidth);
//        var marginVal = (outterHeight-innerHeight) / 2;
//        analogText.css("margin-top", marginVal).css("display","flex");
//    }
    if (valueText) {
        // $("#" + id).children(".valueText").children(".inputVal").css('width', parseToInt(width) - 6);
        // $("#" + id).children(".valueText").children(".inputVal").css('height', parseToInt(height) - 6);
        $("#" + id).children(".valueText").children(".inputVal").css('width', '100%');
        $("#" + id).children(".valueText").children(".inputVal").css('height', '100%');
        $("#" + id).children(".valueText").children(".unit").css('left', parseToInt(width) + 2);
        $("#" + id).children(".valueText").children(".unit").css('top', parseToInt(height) / 2 - 7);
    }
}

function updateSliderBgImage(id, imgPath)
{
    $("#" + id).attr("bar_img", imgPath);
    $("#" + id).children(".analog_slider_comp").css('background-image', 'url(' + imgPath + ')')
            .css("background-size", $("#" + id).children(".analog_slider_comp").width() + "px " + $("#" + id).children(".analog_slider_comp").height() + "px");
}

function updateSliderHandlerImage(id, imgPath)
{
    $("#" + id).attr("hdl_img", imgPath);
    var sliderHdl = $("#" + id).children(".analog_slider_comp").children(".ui-slider-handle");
    sliderHdl.css('background-image', 'url(' + imgPath + ')')
            .css("background-size", sliderHdl.width() + "px " + sliderHdl.height() + "px");
}

//-----------------AnalogBar--------------------------------------
function resizeAnalogBarDiv(id, width, height) {

    $("#" + id).css('height', height - 1 + "px");
    $("#" + id).css('width', width + "px");

    var targetBarWidth = width - 52;
    var targetBarHeight = height - 1;
    var targetBar = $("#" + id).children(".bar");
    targetBar.css('width', targetBarWidth + "px");
    targetBar.css('height', targetBarHeight + "px");
    targetBar.children(".barBg").css('width', targetBarWidth + "px");
    targetBar.children(".whiteBg").css('width', targetBarWidth + "px");

    //updateBarValue(id,parseInt(targetBar.attr("bar_value")),height);
    setAnalogBarScale(id, parseInt($("#" + id + " li:first a").html()));
}

function setAnalogBarScale(id, maxVal, minVal, minScale) {
    $("#" + id + " ul li").remove();

    maxVal = (!maxVal) ? parseInt($("#" + id).attr("max_val")) : parseInt(maxVal);
    minVal = (!minVal) ? parseInt($("#" + id).attr("min_val")) : parseInt(minVal);
    minScale = (!minScale) ? parseInt($("#" + id).attr("min_scale")) : parseInt(minScale);

    var sCount = (maxVal - minVal) / minScale;
    var scaleHeight = parseInt($("#" + id).css('height')) / sCount;
    var scaleValue = maxVal + minScale;
    var top = 0;
    sCount = Math.round(sCount);
    for (var i = 0; i <= sCount; i++) {
        scaleValue = scaleValue - minScale;
        if (scaleValue >= (minScale / 2 + minVal)) {
            $("#" + id + " ul").append("<li style='height:" + scaleHeight + "px;top:" + top + "px'><a>" + scaleValue + "</a></li>");
            top = top + scaleHeight;
        }
    }

    // for bottom scale line
    //if (scaleValue != minVal) {
    top = parseInt($("#" + id).css('height'));
    $("#" + id + " ul").append("<li style='height:" + scaleHeight + "px;top:" + top + "px'><a>" + minVal + "</a></li>");
    //}

    $("#" + id).attr("max_val", maxVal);
    $("#" + id).attr("min_val", minVal);
    $("#" + id).attr("min_scale", minScale);
    $("#" + id).attr("scale_height", scaleHeight);
    $("#" + id).attr("bar_value", parseInt((maxVal + minVal) / 2));
    updateBarValue(id);
}

function updateScopeColor(id, value) {
    $("#" + id).attr("scope_color", value);
    updateBarValue(id);
}

function updateBarBorderColor(id, color) {
    $("#" + id + " .bar ul > li > a").css('color', color);
    $("#" + id + " .bar ul > li").css('border-color', color);
    $("#" + id + " .barBg").css('border-color', color);
}

function updateBarValue(id) {
    var barHeight = parseInt($("#" + id).css('height'));
    var whiteHeight = barHeight / 2 - 1;
    var barValue = parseInt($("#" + id).attr("bar_value"));
    var color = getColorByBarValue(id, barValue);
    if (color) {
        $("#" + id + " .barBg").css('background-color', color);
    }
    $("#" + id + " .whiteBg").css('height', whiteHeight + "px");
    //for borderColor
    var borderColor = $("#" + id + " .barBg").css('border-color');
    updateBarBorderColor(id, borderColor);
}

function getColorByBarValue(id, barValue) {
    var scopeColor = $("#" + id).attr("scope_color");
    if (!scopeColor) {
        return null;
    }
    var range = scopeColor.split(",");
    barValue = parseInt(barValue);
    for (var i = 0; i < range.length; i++) {
        var value = range[i].split(":");
        if (value[0] <= barValue && barValue <= value[1]) {
            return  getColorFromRGB(value[2]);
        }
    }
}

function getColorFromRGB(colorStr) {
    var value = parseInt(colorStr);
    value = Math.abs(value);
    var val = 0xff000000 | value;
    val = val.toString(16).substring(1);
    var str = '';
    if (val.length < 6) {
        var i = 6 - val.length;
        for (var t = 0; t < i; t++) {
            str += '0';
        }
    }
    //console.log('color:' + '#' + str + val);  
    return  '#' + str + val;
}