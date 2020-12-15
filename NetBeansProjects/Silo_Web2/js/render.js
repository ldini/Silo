var isFirstTimeInit = true;
var STOP_SLIDER_REFERSH_ID = undefined;
var CONNECTED_BM_LOST = false;
var WEEKDAY=new Array("Sun.","Mon.","Tues.","Wed.","Thur.","Fri.","Sat.");

function loadPage() {
    resetDivImgFromAttr();

    if (isFirstTimeInit) {
        initVM();
        isFirstTimeInit = false;
    }
    initNavivator();

    initialAnalogSliderComp();
    initialAnalogInputComp();
    // To assign a value for Rotation Css
    initRotationCss();
    // To show the drawed by svg.
    initSvgDrawShow();
    DBInit();
}
(function ($) {
    // Detect touch support
    $.support.touch = 'ontouchend' in document;
    // Ignore browsers without touch support
    if (!$.support.touch) {
        return;
    }
    var mouseProto = $.ui.mouse.prototype,
        _mouseInit = mouseProto._mouseInit,
        touchHandled;

    function simulateMouseEvent (event, simulatedType) { //use this function to simulate mouse event
    // Ignore multi-touch events
        if (event.originalEvent.touches.length > 1) {
            return;
        }
        event.preventDefault(); //use this to prevent scrolling during ui use

        var touch = event.originalEvent.changedTouches[0],
        simulatedEvent = document.createEvent('MouseEvents');
        // Initialize the simulated mouse event using the touch event's coordinates
        simulatedEvent.initMouseEvent(
            simulatedType,    // type
            true,             // bubbles                    
            true,             // cancelable                 
            window,           // view                       
            1,                // detail                     
            touch.screenX,    // screenX                    
            touch.screenY,    // screenY                    
            touch.clientX,    // clientX                    
            touch.clientY,    // clientY                    
            false,            // ctrlKey                    
            false,            // altKey                     
            false,            // shiftKey                   
            false,            // metaKey                    
            0,                // button                     
            null              // relatedTarget              
        );

        // Dispatch the simulated event to the target element
        event.target.dispatchEvent(simulatedEvent);
    }
    
    mouseProto._touchStart = function (event) {
        var self = this;
        // Ignore the event if another widget is already being handled
        if (touchHandled || !self._mouseCapture(event.originalEvent.changedTouches[0])) {
            return;
            }
        // Set the flag to prevent other widgets from inheriting the touch event
        touchHandled = true;
        // Track movement to determine if interaction was a click
        self._touchMoved = false;
        // Simulate the mouseover event
        simulateMouseEvent(event, 'mouseover');
        // Simulate the mousemove event
        simulateMouseEvent(event, 'mousemove');
        // Simulate the mousedown event
        simulateMouseEvent(event, 'mousedown');
    };

    mouseProto._touchMove = function (event) {
        // Ignore event if not handled
        if (!touchHandled) {
            return;
        }
        // Interaction was not a click
        this._touchMoved = true;
        // Simulate the mousemove event
        simulateMouseEvent(event, 'mousemove');
    };
    mouseProto._touchEnd = function (event) {
        // Ignore event if not handled
        if (!touchHandled) {
            return;
        }
        // Simulate the mouseup event
        simulateMouseEvent(event, 'mouseup');
        // Simulate the mouseout event
        simulateMouseEvent(event, 'mouseout');
        // If the touch interaction did not move, it should trigger a click
        if (!this._touchMoved) {
          // Simulate the click event
          simulateMouseEvent(event, 'click');
        }
        // Unset the flag to allow other widgets to inherit the touch event
        touchHandled = false;
    };
    mouseProto._mouseInit = function () {
        var self = this;
        // Delegate the touch handlers to the widget's element
        self.element
            .on('touchstart', $.proxy(self, '_touchStart'))
            .on('touchmove', $.proxy(self, '_touchMove'))
            .on('touchend', $.proxy(self, '_touchEnd'));

        // Call the original $.ui.mouse init method
        _mouseInit.call(self);
    };
})(jQuery);

$(function () {
    $(".analog_bar_val_top").css('height', 0);
    $(".analog_bar_val").css('height', 0);
    $(".analog_text").children(".valueText").children(".value").html("0");
    var callBackParam = 0;
    checkBM_connection(callBackParam);
    setInterval(checkBM_connection, 1500);
});

function checkBM_connection(callBackParameter) {
    AjaxRequest.Instance().Request("GETSTDG",
            "",
            connectionCallBack,
            callBackParameter,
            LocalStorage.Instance().Get("logo_current_language"),
            3000,
            "SYM",
            DESMakeKey(LocalStorage.Instance().Get("logo_current_login_key1A1"), LocalStorage.Instance().Get("logo_current_login_key1A2")),
            DESMakeKey(LocalStorage.Instance().Get("logo_current_login_key1B1"), LocalStorage.Instance().Get("logo_current_login_key1B2")),
            LocalStorage.Instance().Get("logo_current_login_ref"));
}

function connectionCallBack(param)
{
    if (this.m_iLocalResult == 601 || this.m_iLocalResult == 0) { //timeout:
        $("#timeout_dlg").show();
        $("#timeout_dlg").dialog({
            title: "Connection Lost",
            autoOpen: false,
            closeOnEscape: false,
            dialogClass: "alert",
            draggable: false,
            height: 160,
            width: 300,
            modal: true,
            esizable: false
        }).dialog("open");
        $(".ui-dialog-titlebar-close").hide();
        CONNECTED_BM_LOST = true;
    } else if (CONNECTED_BM_LOST) {
        $("#timeout_dlg").dialog("destroy");
        $("#timeout_dlg").hide();
        CONNECTED_BM_LOST = false;
        DBInit();
    }
}



/**
 * update img's readlPath to relativePath
 */
function resetDivImgFromAttr() {
    $("div[bg_image]").each(function (index, element) {
        var image = element.getAttribute("bg_image");
        element.style.backgroundImage = "url(" + image + ")";
    });
}

/**
 * VM data
 */
function initVM()
{
    $.ajax({
        url: "tagtable.vm",
        type: 'GET',
        async: false,
        dataType: 'xml',
        success: function (data) {
            //parse xml file
            var array = new Array($(data).find('tVariableTable').children().length);
            $(data).find('variables').each(function (i) {
                var obj = new Object();
                obj.id = $(this).children('id').text();
                obj.range = $(this).children('blockType').attr('realvalue');
                obj.address = $(this).children('blockNum').attr('realvalue');
                obj.type = $(this).children('type').attr('realvalue');
                obj.length = $(this).children('length').attr('realvalue');
                array[i] = obj;
            });
            initBindData(array);
        },
        error: function () {
            // alert("error! vm data missing! ");
        }
    });
}
function initBindData(vmArray)
{
    $(".server_binding").each(function (index, div) {
        for (var j = 0; j < vmArray.length; j++) {
            if (div.getAttribute("tag_id") && vmArray[j].id == div.getAttribute("tag_id")) {
                div.setAttribute("type", vmArray[j].type);
                div.setAttribute("length", vmArray[j].length);
                div.setAttribute("range", vmArray[j].range);
                div.setAttribute("address", vmArray[j].address);
                break;
            }
        }
    });
}

/**
 * Navigation
 */
function initNavivator()
{
    var nav = $("<div></div>");
    var rdm = new Date().getTime();
    nav.load("nav.htm?!App-Language=" + LocalStorage.Instance().Get("logo_current_language") + "&Security-Hint=" + LocalStorage.Instance().Get("logo_current_login_ref")+"&rdm="+rdm, function (response, status, xhr) {
        $("#main").append(nav);
        $("#tag").css("top", $("#main").height() / 2 - 55);
        $("#menu").css("height", $("#main").css("height"));
        $("#wrap").css('width', $("#main").css("width"));
        initNavLeftRightStyle();
    });

    //regist nav button 
    $(window).resize(navButtonReposition);
    $(window).scroll(navButtonReposition);
}
var tempSec;
function hideMenu()
{
    if (!tempSec || (new Date().getTime() - tempSec < 300)) {
        return;
    }
    $("#menu").css('width', "0px");
    $("#menu").css('opacity', 0);
    $(".item").css('display', "none");
    $(".menuTitle").css('display', 'none');
    $("#tag").css('width', "20px");
    $("#arrows").css('display', "block");
}
function showMenu()
{
    $("#menu").css('width', "230px");
    $("#menu").css('opacity', 0.9);
    $("#menu").css('overflow-y', "auto");
    $(".item").css('display', "block");
    $(".menuTitle").css('display', 'block');
    $("#tag").css('width', 0);
    $("#arrows").css('display', 'none');
    tempSec = new Date().getTime();
}
function initNavLeftRightStyle()
{
    if ($("#menu").attr("is_right") && $("#menu").attr("is_right") == "true") {
        $("#nav").attr("class", "navRight");
        $("#tag").attr("class", "tagRight");
        $("#arrows").attr("class", "arrowsRight");
        $("#menu").attr("class", "menuRight");
    }
    else
    {
        $("#nav").attr("class", "nav");
        $("#tag").attr("class", "tag");
        $("#arrows").attr("class", "arrows");
        $("#menu").attr("class", "menu");
    }
}

function navButtonReposition() {
    var windowHeight = document.body.clientHeight;
    var mainHeight = $("#main").height();
    var tagHeight = $("#tag").height()
    if (windowHeight < mainHeight) {
        var newTop = (windowHeight - tagHeight) / 2 + $(document).scrollTop() - 55;
        $("#tag").css('top', newTop);
    } else {
        $("#tag").css("top", mainHeight / 2 - 55);
    }
}
//click nav item to forward with login info
function navGo(obj){
    var link =  $(obj).attr("nav_link")+".htm";  
    window.location.replace(link + "?!App-Language=" + LocalStorage.Instance().Get("logo_current_language") + "&Security-Hint=" + LocalStorage.Instance().Get("logo_current_login_ref"));
}
/**
 * To assign a value for Rotation Css, according to the different browsers.
 */
function initRotationCss()
{
    $("div[degree]").each(function ()
    {
        var degree = $(this).attr("degree");
        var cValue = "rotate(" + parseFloat(degree) + "deg)";
        // Other Browser, including IE > 9
        $(this).css("transform", cValue);
        $(this).css("-webkit-transform", cValue);
        $(this).css("-moz-transform", cValue);
        $(this).css("-o-transform", cValue);
        $(this).css("-ms-transform", cValue);
    });
}

/**
 * To show the drawed by svg.
 */
function initSvgDrawShow()
{
    $("svg").each(function ()
    {
        $(this).css("display", "");
    });
}
function initialAnalogSliderComp() {
    
    var sliders = $(".analog_slider_comp").rotateSlide({
        orientation: "vertical"
    });
    sliders.rotateSlide("disable");
    sliders.each(function (index) {
        var parent = $(this).parent().get(0);
        var slider_maxVal = parseInt($(parent).attr("maxval"));
        var slider_minVal = parseInt($(parent).attr("minval"));
        var hdl_img = $(parent).attr("hdl_img");
        if (hdl_img) {
            $(parent).children(".analog_slider_comp").children(".ui-slider-handle").css('background-image', 'url(' + hdl_img + ')');
        }
        var bar_img = $(parent).attr("bar_img");
        if (bar_img) {
            $(parent).children(".analog_slider_comp").css('background-image', 'url(' + bar_img + ')');
        }
        var orientation     = parseInt($(parent).attr("degree"));
        var midVal = slider_minVal + (slider_maxVal - slider_minVal) * 0.5;
        $(this).rotateSlide({
            degree:orientation,
            max: slider_maxVal,
            min: slider_minVal,
            value: midVal
        });
        $(this).children(".ui-slider-handle").attr({title: midVal}).tooltip({track: true, hide: { effect: "slide"}});
        if ($(parent).attr("mode") == "true") {
            $(this).rotateSlide("enable").rotateSlide({
                change: function (event, ui) {
                    var newValue = getFormatValue($(parent), ui.value);
                    if ($(parent).attr("event_mode") == "write") {
                        doSetAnalogValue(parent.id, newValue);
                    }
                    $(parent).attr("event_mode", "read");
                    $(this).children(".ui-slider-handle").tooltip({content: function(){
                            return ui.value.toString();
                    }});
                    $(this).children(".ui-slider-handle").tooltip( "close" );
                    $(this).children(".ui-slider-handle").attr("title", ui.value);
                },
                start: function (event, ui) {
                    STOP_SLIDER_REFERSH_ID = parent.id;
                },
                stop: function (event, ui) {
                    STOP_SLIDER_REFERSH_ID = undefined;
                    $(parent).attr("event_mode", "write");
                    $(this).children(".ui-slider-handle").tooltip( "close" );
                },
                slide: function (event, ui) {
                    $(this).children(".ui-slider-handle").tooltip({content: function(){
                            return ui.value.toString()}});
                }
            }).children(".ui-slider-handle").css('margin-top', "0"); //.attr({title: midVal})
        }
    });
}

function initialAnalogInputComp() {
    $(".analog_input").children(".valueText").children(".inputVal").attr("placeholder", "0");
    $(".analog_input").each(function (index) {
        var bindObj = this;
        var inputBox = $(this).children(".valueText").children(".inputVal");
        var placeHolder = 0;
        inputBox.attr("disabled", "disabled");
        if ($(this).attr("mode") == "true") {
            inputBox.removeAttr("disabled");
            inputBox.focusin(function () {
                placeHolder = $(bindObj).attr("last_placeholder");
                inputBox.attr("placeholder", "");
            }).focusout(function () {
                inputBox.val("");
                inputBox.attr("placeholder", $(bindObj).attr("last_placeholder"));
            })
                    .keydown(function (event) {
                        if (event.keyCode == 13) {
                            var inputVal = inputBox.val().trim();
                            submitAnalogInput(bindObj, inputVal, placeHolder);
                        }
                    })
                    .keyup(function (event) {
                        var inputVal = inputBox.val().trim();
                        if ($(bindObj).attr("comp_type") == "AnalogValueComponent") {
                            checkInputValue(bindObj, inputVal, inputBox);
                        }

                    });
            //.change(function () {
            //    var inputVal = inputBox.val().trim();
            //    onChangeFunForAnalogInput(bindObj, inputVal, placeHolder);
            //});
        }
    });
}

function checkInputValue(bindObj, inputVal, inputBox) {
    if (!inputVal || inputVal == "" || inputVal == "NAN" || inputVal == "-") {
        return;
    }
    //parse value:
    var blockFormat = $(bindObj).attr("block_format");
    var accessModeType = $(bindObj).attr("type");

    var sValue = inputVal;
    var iValue;

    switch (blockFormat) {
        case "Binary":
        {
            iValue = parseInt(sValue, 2);
            break;
        }
        case "Hex":
        {
            iValue = parseInt(sValue, 16);
            break;
        }
        case "Signed":
        {
            iValue = parseInt(sValue, 10);
            break;
        }
        case "Unsigned":
        {
            iValue = parseInt(sValue, 10);
            break;
        }
        default:
            break;
    }

    //parse type:
    var iMin;
    var iMax;
    switch (accessModeType) {
        case "1":
        {
            iMin = 0;
            iMax = 1;
            break;
        }
        case "2":
        {
            if (blockFormat == "Signed") {
                iMin = -128;
                iMax = 127;
            }
            else {
                iMin = 0;
                iMax = 255;
            }
            break;
        }
        case "4":
        {
            if (blockFormat == "Signed") {
                iMin = -32768;
                iMax = 32767;
            }
            else {
                iMin = 0;
                iMax = 65535;
            }
            break;
        }
        case "6":
        {
            if (blockFormat == "Signed") {
                iMin = -2147483648;
                iMax = 2147483647;
            }
            else {
                iMin = 0;
                iMax = 4294967295;
            }
            break;
        }
        default:
        {
            iMin = 0;
            iMax = 0;
            break;
        }
    }
    if (iValue > iMax)
        iValue = iMax;
    if (iValue < iMin)
        iValue = iMin;
    switch (blockFormat) {
        case "Binary":
        {
            sValue = iValue.toString(2);
            break;
        }
        case "Hex":
        {
            sValue = iValue.toString(16).toUpperCase();
            break;
        }
        case "Signed":
        {
            sValue = iValue.toString(10);
            break;
        }
        case "Unsigned":
        {
            sValue = iValue.toString(10);
            break;
        }
        default:
            sValue = iValue.toString(10);
            break;
    }

    //if(sValue!=inputVal){
    inputBox.val(sValue);
    //}
}


function submitAnalogInput(bindObj, inputVal, placeHolder) {
    var result = inputVal;
    if ($(bindObj).attr("comp_type") == "AnalogTimeComponent") {
        if (isAnalogTimeValid($(bindObj), inputVal)) {
            result = getAtcValFromAnalogTime($(bindObj), inputVal);
            result = getFormatValue(bindObj, result);
            //console.log("getAtcValFromAnalogTime:"+result);
            doSetAnalogValue(bindObj.id, result);
            return inputVal;
        }
    }
    else {//AnalogValueComponent
        if (isAnalogInputValid(inputVal, bindObj)) {
            result = getFormatValue(bindObj, inputVal);
            //console.log("AnalogValueComponent:"+result);
            doSetAnalogValue(bindObj.id, result);
            return  result;
        }
    }

    //not pass
    var noticeObj = $(bindObj).children(".notice");
    $(noticeObj).css("display", "inline").html("Invalid Value").fadeOut(1500, function () {
        var inputBox = $(bindObj).children(".valueText").children(".inputVal");
        inputBox.val("");
        inputBox.attr("placeholder", placeHolder);
    });
    return placeHolder
}

function getFormatValue(bindObj, inputVal)
{
    var tValue = inputVal + "";
    var sType = $(bindObj).attr("type");
    var sRange = $(bindObj).attr("range");
    var sAddress = $(bindObj).attr("address");
    var sDispFormat = $(bindObj).attr("block_format");
    tValue = getInputValueByDispFormat(sDispFormat, tValue, sType)
    if (sRange != "" && sAddress != "" && sType != "" && tValue != "") {
        if (sRange != "129" && sRange != "12" && sRange != "13" && sRange != "14" && sRange != "18") {
            //all input can not be edited(exclude the NetI and NetAI, they are considered as a marker):
            getAddressByRange(sRange);
            var iDataLength = getDataLengthByType(sType);
            if (iDataLength > 0) {
                var iTempIndex;
                var iPaddingLength = iDataLength - tValue.length;
                var sPadding = "";
                for (iTempIndex = 0; iTempIndex < iPaddingLength; ++iTempIndex) {
                    sPadding += "0";
                }
                tValue = sPadding + tValue;
                tValue = tValue.substring(tValue.length - iDataLength);
            }
        }
    }
    return tValue;
}

function getDataLengthByType(sType) {
    var iDataLength;
    switch (sType) {
        case "1":
        {
            iDataLength = 1;
            break;
        }
        case "2":
        {
            iDataLength = 1;
            break;
        }
        case "4":
        {
            iDataLength = 2;
            break;
        }
        case "6":
        {
            iDataLength = 4;
            break;
        }
        default:
        {
            iDataLength = 0;
            break;
        }
    }
    iDataLength *= 2;
    return iDataLength;
}

function getInputValueByDispFormat(sDispFormat, input, sType) {
    var iValue;
    var newValue;
    switch (sDispFormat) {
        case "Bool":
        {
            iValue = parseInt(input, 2);
            newValue = iValue.toString(16);
            break;
        }
        case "Binary":
        {
            iValue = parseInt(input, 2);
            newValue = iValue.toString(16);
            break;
        }
        case "Hex":
        {
            iValue = parseInt(input, 16);
            newValue = iValue.toString(16);
            break;
        }
        case "Signed":
        {
            iValue = parseInt(input, 10);
            if (iValue < 0) {
                iValue = Signed2Unsinged(iValue, sType);
            }
            newValue = iValue.toString(16);
            break;
        }
        case "Unsigned":
        {
            iValue = parseInt(input, 10);
            newValue = iValue.toString(16);
            break;
        }
        default:
        {
            newValue = "";
            break;
        }
    }
    return newValue;
}

function getAddressByRange(range) {
    var address;
    switch (range) {
        case "132":
        {
            address *= 8;
            break;
        }
        case "18":
        case "21":
        case "19":
        case "22":
        case "20":
        {
            address *= 16;
            break;
        }
        default:
        {
            break;
        }
    }
    return address;
}

function isAnalogTimeValid(obj, input) {
    var timeUnit = obj.attr("time_format");
    var reg = /^(\d{1,5})$/; //hour 
    if (timeUnit == "m") {
        reg = /^(\d{2}):(\d{2})$/;  //"00:00";
    } else if (timeUnit == "s") {
        reg = /^(\d{2}):(\d{2}):(\d{2})$/;//"00:00:00";
    } else if (timeUnit == "ms") {
        reg = /^(\d{2}):(\d{2}):(\d{2}).\d{1,2}$/;//"00:00:00.00";
    }
    return reg.test(input);
}
function getAtcValFromAnalogTime(obj, input) {
    var timeUnit = obj.attr("time_format");
    var atcVal = input;
    if (timeUnit == "m") {
        var time = input.split(":");
        atcVal = parseInt(time[0]) * 60 + parseInt(time[1]);
    } else if (timeUnit == "s") {
        var time = input.split(":");
        atcVal = parseInt(time[0]) * 60 + parseInt(time[1]) * 60 + parseInt(time[2]);
    } else if (timeUnit == "ms") {
        var hms = input.split(".");
        var time = hms[0].split(":");
        atcVal = parseInt(time[1]) * 6000 + parseInt(time[2]) * 100 + parseInt(hms[1]);
    }
    //console.log("AnlogTimeVal:" + input + "==" + timeUnit + "==" + atcVal);
    return atcVal;
}


var intervalId;

function setDigitalData(obj) {
    var id = obj.id;
    var oRequest = new DBRequest(document.getElementById(id));
    if (obj.value) {
        oRequest.SetValue("00");
    } else {
        oRequest.SetValue("01");
    }
    if (oRequest.SetQuery()) {
        intervalId = setInterval(checkResult, 1000, oRequest);
    }
    return false;
}

function setAnalogData(obj) {
    var id = obj.parentNode.id;
    var slider_maxVal = parseInt($("#" + id).children(".analog_max_val").contents()[0].data);
    var slider_minVal = parseInt($("#" + id).children(".analog_min_val").contents()[0].data);
    var currentVal = parseInt($("#" + id).children(".analogValue").val());
    $("#" + id).children(".analog_bar").hide();
    $("#" + id).children(".analog_min_val").hide();
    $("#" + id).children(".setAnalogBtn").show();
    var slider = $("#" + id).children(".analog_set_val").css('margin', '10 auto').show().rotateSlide({
        orientation: "vertical",
        max: slider_maxVal,
        min: slider_minVal,
        value: currentVal,
        change: function (event, ui) {
            $("#" + id).children(".analog_max_val").html(ui.value);
            $("#" + id).children(".analogValue").val(ui.value);
        }
    });
    $("#" + id).children(".setAnalogBtn").click(function () {
        var setValue = slider.rotateSlide("value");
        rotateSlide.hide();
        $("#" + id).children(".analog_bar").show();
        $("#" + id).children(".analog_min_val").show();
        $("#" + id).children(".analog_max_val").html(slider_maxVal);
        $("#" + id).children(".setAnalogBtn").hide();
        //console.log("analog_bar_slider:"+newValue);
        doSetAnalogValue(id, setValue);
        //showAnalogBar(id,slider_maxVal,slider_minVal, setValue); // for off-line test
    });
}
function doSetAnalogValue(divID, value) {
    var oRequest = new DBRequest(document.getElementById(divID));
    oRequest.SetValue(value);
    console.log("doSetAnalogValue:" + value);
    if (oRequest.SetQuery()) {
        updateNoticeDisplay(divID, value);
        return true;
    }
    return false;
}

function updateNoticeDisplay(divID, value) {
    if ($("#" + divID).has(".analog_input")) {
        $("#" + divID).children(".notice").css("display", "inline").html("submitted").fadeOut(2500, function () {
            $("#" + divID + " .inputVal").val("");
            // $("#" + divID + " .inputVal").attr("placeholder", value);
        });
    }
}

function checkResult(obj) {
    if (0 == obj.m_iSetPendingFlag) {
        clearInterval(intervalId);
    }
}

function isAnalogInputValid(inputVal, bindObj) {
    var sType = $(bindObj).attr("block_format");
    var patt = /^1[10]*$/;
    if (sType == "Binary") {
        patt = /^1[10]*$/;
    }
    if (sType == "Signed") {
        patt = /^(-|\+)?\d+$/;
    }
    if (sType == "Unsigned") {
        patt = /^\d+$/;
    }
    if (sType == "Hex") {
        inputVal = inputVal.toUpperCase();
        patt = /^[0-9A-F]{0,4}$/;
    }
    return (patt.test(inputVal));
}

function getMinFormatTimeByVmVal(val) {
    var min = parseInt(val / 60);
    var sec = val % 60;
    min = (min > 9) ? min : "0" + min;
    sec = (sec > 9) ? sec : "0" + sec;
    return min + ":" + sec;
}
function getSecFormatTimeByVmVal(val) {
    var h = parseInt(val / 3600);
    var m = parseInt(val / 60 % 60);
    var s = parseInt(val % 60 % 60);
    h = h >= 10 ? h : "0" + h;
    m = m >= 10 ? m : "0" + m;
    s = s >= 10 ? s : "0" + s;
    return h + ":" + m + ":" + s;
}
function getMsFormatTimeByVmVal(val) {
    var minute = parseInt(val / 6000);
    var sec = (val % 6000) + "";
    minute = (minute > 9) ? "00:" + minute : "00:0" + minute;
    var newSec = "0000" + sec;
    newSec = newSec.substr(sec.length, 4);
    newSec = newSec.substr(0, 2) + "." + newSec.substr(2, 4);
    return minute + ":" + newSec;
}

function getValueByBlockFormat(blockFormat, accessModeType, sValue) {
    var orgin;
    var display;
    switch (blockFormat) {
        case "Binary":
        {
            orgin = "bin_" + sValue;
            display = "2#" + parseInt(sValue, 16).toString(2);
            return display;
        }
        case "Hex":
        {
            orgin = "hex_" + sValue;
            display = "16#" + parseInt(sValue, 16).toString(16).toUpperCase();
            return display;
        }
        case "Signed":
        {
            //byte=2,word=4,dword==6;
            orgin = "signed_" + sValue;
            display = Unsigned2Signed(parseInt(sValue, 16), accessModeType).toString();
            return display;
        }
        case "Unsigned":
        default:
        {
            orgin = "def_" + sValue;
            display = parseInt(sValue, 16).toString();
            return display;
        }
    }
    
    
}