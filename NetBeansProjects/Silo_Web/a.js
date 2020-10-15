var loadCustomizedComponent = function loadCustomizedComponent() {
    var id = this.m_sShowParam;
    var ontext = document.getElementById(id).getAttribute("on_text");
    var offtext = document.getElementById(id).getAttribute("off_text");
    var onimage = document.getElementById(id).getAttribute("on_image");
    var offimage = document.getElementById(id).getAttribute("off_image");
    var value = parseInt(this.m_sValue, 16);
    document.getElementById(id).value = value;
    if (value == 0) {
        document.getElementById(id).innerHTML = offtext;
        document.getElementById(id).style.backgroundImage = "url(" + offimage + ")";
    } else {    
        document.getElementById(id).innerHTML = ontext;
        document.getElementById(id).style.backgroundImage = "url(" + onimage + ")";
    }
};

    
var loadAnalogTimeComponent2 = function loadAnalogTimeComponent2() {    
    var id = this.m_sShowParam;  
    this.SetValue("00:00:34");  
    var blockFormat = $("#" + id).attr("block_format");    
    var accessModeType = $("#" + id).attr("type");    
    var signedValue = Unsigned2Signed(parseInt(this.m_sValue, 16), accessModeType);    
    var actVal = "#";    
    if (signedValue>=0) {            
        actVal = getValueByBlockFormat(blockFormat, accessModeType, this.m_sValue);           
        var time_format = $("#" + id).attr("time_format");    
    if (time_format == "m") {    
        actVal = getMinFormatTimeByVmVal(actVal);    
    } else if (time_format == "s") {    
        actVal = getSecFormatTimeByVmVal(actVal);    
    } else if (time_format == "ms") {    
        actVal = getMsFormatTimeByVmVal(actVal);    
    }    
    }    
    $("#" + id).children(".valueText").children(".inputVal").attr("placeholder", actVal);       
    $("#" + id).attr("last_placeholder", actVal);    
}


