dictionary = {};

String.prototype.format = function() {
    var formatted = this;
    for (arg in arguments) {
        formatted = formatted.replace("{" + arg + "}", arguments[arg]);
    }
    return formatted;
};

function Methods(){};

Methods.loading=function(selector){
    $(selector).html("<div align='center' style='width:100%;height:100%;'><table style='width:100%;height:100%;'><tr><td valign='middle' align='center'><img src='css/img/ajax-loader.gif' /></td></tr></table></div>")  
};

Methods.iniSortableTableHeaders=function(){
    $(".thSortable").mouseover(function(){
        $(this).addClass("ui-state-highlight");
    });
    $(".thSortable").mouseout(function(){
        $(this).removeClass("ui-state-highlight");
    })
}

Methods.iniIconButton=function(selector,icon){
    $(selector).button({
        icons: {
            primary:"ui-icon-"+icon
        }
    });
}

Methods.captionDefaultConfirmationTitle=dictionary["s4"];
Methods.confirm=function(message,title,callback)
{
    if(title==null) title=Methods.captionDefaultConfirmationTitle;
    $("#divGeneralDialog").html('<span class="ui-icon ui-icon-help" style="float:left; margin:0 7px 0px 0;"></span>'+message);
    $("#divGeneralDialog").dialog({
        title:title,
        minHeight:50,
        show:"fade",
        hide:"fade",
        resizable:false,
        modal:true,
        buttons:
        {
            no:function(){
                $(this).dialog("close");
            },
            yes:function(){
                callback.call(null);
                $(this).dialog("close");
            }
        }
    });
};

Methods.captionDefaultAlertTitle=dictionary["s5"];
Methods.alert=function(message,icon,title)
{
    if(title==null) title=Methods.captionDefaultAlertTitle;
    $("#divGeneralDialog").html((icon!=null?'<span class="ui-icon ui-icon-'+icon+'" style="float:left; margin:0 7px 0px 0;"></span>':'')+message);
    $("#divGeneralDialog").dialog({
        title:title,
        minHeight:50,
        show:"fade",
        hide:"fade",
        resizable:false,
        modal:true,
        buttons:
        {
            ok:function(){
                $(this).dialog("close");
            }
        }
    });
}

Methods.iniListTableExtensions=function(selector,size,cols,filter,onPageSizeChange)
{
    /*
    $.tablesorter.addParser({ 
        id: 'circaK', 
        is: function(s) { 
            return false; 
        }, 
        format: function(s) { 
            return s.replace(/~/,'').replace(/K/,''); 
        }, 
        type: 'numeric' 
    });             
     */
   
    var ts = $(selector).tablesorter({
        widthFixed:true
    });
    
    ts = ts.tablesorterPager({
        container: $(selector+"Pager"),
        positionFixed:false,
        size:size,
        onPageSizeChange:onPageSizeChange
    });
    
    if(filter)
    {
        ts.tablesorterFilter({
            filterContainer: $(selector+"PagerFilter"),
            filterClearContainer: $(selector+"PagerFilterReset"),
            filterColumns: cols,
            filterCaseSensitive: false
        });
    }
};

Methods.CKEditorDialogShowListener=function(e){
    var dialog = CKEDITOR.dialog.getCurrent();
    var validatedDialogs = [
    "checkbox",
    "radio",
    "textfield",
    "textarea",
    "select",
    "button",
    "hiddenfield"
    ];
    
    var name = null;
    
    if(validatedDialogs.indexOf(dialog.getName())!=-1){
        var contents = dialog.definition.contents;
        for(var i=0;i<contents.length;i++){
            var content = contents[i];
            var elements = content.elements;
            for(var j=0;j<elements.length;j++){
                var element = elements[j];
                if(element.type=="hbox" || element.type=="vbox") {
                    var children = element.children;
                    for(var k=0;k<children.length;k++){
                        var child = children[k];
                        if(child.label=="Name"){
                            name = dialog.getContentElement(content.id,child.id);
                            break;
                        }
                    }
                    if(name!=null) break;
                }
                else {
                    if(element.label=="Name"){
                        name = dialog.getContentElement(content.id,element.id);
                        break;
                    }
                }
            }
            if(name!=null) break;
        }
        if(name!=null){
            name.validate=function(){
                var oldValue = this.getValue();
                if ( !Test.variableValidation(oldValue) )
                {
                    var newValue = Test.convertVariable(oldValue);
                    name.setValue(Test.convertVariable(newValue));
                    alert(dictionary["s6"].format(oldValue,newValue));
                    return false;
                }
            }
        }
    }
};

Methods.iniCKEditor=function(selector)
{
    Methods.removeCKEditor(selector);
    var editor = $(selector).ckeditor(function(){
        this.removeListener('dialogShow', Methods.CKEditorDialogShowListener);
        this.on( 'dialogShow', Methods.CKEditorDialogShowListener);
    });
};


Methods.removeCKEditor=function(selector)
{
    var name = $(selector).attr("name");
    var instance = CKEDITOR.instances[name];
    if(instance) 
    {
        try{
            $(selector).ckeditorGet().destroy(true);
        } catch(err) {
            
        }
        CKEDITOR.remove(instance);
    }
};

Methods.iniColorPicker=function(selector,color)
{
    $(selector).css("background-color","#"+color);
    $(selector).ColorPicker({
        color:color,
        onShow: function (colpkr) {
            $(colpkr).fadeIn(250);
            return false;
        },
        onHide: function (colpkr) {
            $(colpkr).fadeOut(250);
            return false;
        },
        onChange: function (hsb, hex, rgb) {
            $(selector).val(hex);
            $(selector).css("background-color","#"+hex);
        }
    });
};

Methods.iniDatePicker=function(selector)
{
    $(selector).datepicker({
        dateFormat:"yy-mm-dd",
        changeMonth:true,
        changeYear:true
    });
};

Methods.iniTimePicker=function(selector)
{
    $(selector).each(function(index){
        var id=$(this).attr("id");
        $("#"+id).timepicker({});
    });
};

Methods.getCKEditorData=function(selector)
{
    try{
        return $(selector).ckeditorGet().getData();
    }
    catch(err){
        return "";
    }
}

Methods.setCKEditorData=function(selector,data){
    try{
        return $(selector).ckeditorGet().setData(data);
    }
    catch(err){
    }
}

Methods.getTempID=function()
{
    var time = new Date().getTime();
    return User.sessionID+"_"+time;
};

Methods.iniCodeMirror=function(id,mode,readOnly)
{
    var obj = document.getElementById(id);
    var myCodeMirror = CodeMirror.fromTextArea(obj,{
        mode:mode,
        fixedGutter:true,
        theme:"night",
        lineNumbers:true,
        matchBrackets:true,
        lineWrapping:true, 
        "readOnly":(readOnly!=null&readOnly?true:false),
        onChange:function(instance){
            instance.save();
            instance.refresh();
        }
    });
    return myCodeMirror;
};

Methods.uiToggleHover=function(obj,highlight){
    if(obj.hasClass("ui-state-highlight") && !highlight) obj.removeClass("ui-state-highlight");
    else obj.addClass("ui-state-highlight");
}

Methods.iniTooltips=function(){
    $(".tooltip").tooltip({
        tooltipClass:"tooltipWindow"
    });
};

Methods.currentVersion = "";
Methods.latestVersion = "";
Methods.checkLatestVersion=function(callback,proxy)
{
    jQuery.getFeed({
        url: proxy==null?'lib/jfeed/proxy.php':proxy,
        data: {
            url:"http://code.google.com/feeds/p/concerto-platform/downloads/basic"
        },
        success: function(feed) {
            var max=Methods.currentVersion;
            var isNewerVersion=false;
            for(var i=0;i<feed.items.length;i++) 
            {
                var desc = feed.items[i].description;
                if(desc.indexOf("Source-Version:")==-1) continue;
                var version = desc.substr(desc.indexOf("Source-Version:")+15);
                version = version.substr(0,version.indexOf("\n"));
                
                var amax = max.split(".");
                var avers = version.split(".");
                
                for(var a=0;a<3;a++)
                {
                    if(parseInt(amax[a])>parseInt(avers[a])) break;
                    if(parseInt(amax[a])<parseInt(avers[a])) 
                    {
                        max=version;
                        isNewerVersion = true;
                        break;
                    }
                }
            }
            
            Methods.latestVersion=max;
            
            callback.call(this,isNewerVersion?1:0,Methods.latestVersion);
        }
    });  
};