/*$(document).ready(
    function() {
        $("#mainContent").css("opacity","1");
    }
);*/
/*jQuery.fn.insertAt = function(index, element) {
  var lastIndex = this.children().size()
  if (index < 0) {
    index = Math.max(0, lastIndex + 1 + index)
  }
  this.append(element)
  if (index < lastIndex) {
    this.children().eq(index).before(this.children().last())
  }
  return this;
}*/
$(function() {
    $('div.split-pane').splitPane();
});

(function() {
    //PRIVATE VARIABLES
        var code_string = "";
        var previewFrame = document.getElementById('myFrame');
        var preview =  previewFrame.contentDocument ||  previewFrame.contentWindow.document;

        var removeAlerts = "<script type='text/javascript'>try{window.open=function(){};window.print=function(){};window.alert=function(){};window.prompt=function(){};window.confirm=function(){};}catch(e){}</script>";
        var bringAlerts = "<script type='text/javascript'>try{delete window.print;delete window.alert;delete window.prompt;delete window.confirm;delete window.open;}catch(e){}</script>";
        var doctype = "";
        var meta = "";
        var styleTag = "";
        var scriptTag = "";
        var htmlWarning = false;
        var success = null;
        var errorMsg = "";
        var messageBoxOpen = false;
        var ext_library = "";
    //END

    //PRIVATE FUNCTIONS
    /*
    ** Function that shows a flash message for a duration.
    ** Parameters @message (string) - the message to show
    **            @duration (number) - duration for which message is shown
    **            @classname (string) - optional class for the <p> inside the box
    */
    function _showFlashMessage(message, duration, classname) {
        classname = (typeof classname === 'string') ? classname : 'default';
        var messageBoxHandle = $("#messageBox"); //get a handle of the message box
        messageBoxHandle.html("<p class='" + classname + "'>" + message + "</p>");
        messageBoxHandle.fadeIn(200);
        setTimeout(function() {messageBoxHandle.fadeOut(200, function() {messageBoxHandle.html('');});}, duration);
    }
    //END


    $("#about").click(function() {
        $("#messageBox").fadeOut(50);
        setTimeout(function() {
            $("#messageBox").html("<p class='aboutTitle'>WebSnippet 1.0</p><p>WebSnippet is a simple tool that helps you to test your web snippets and see the results live in the result window.</p><p>Its completely written with web standards - HTML, CSS and JavaScript. At the moment there is no feature of saving your snippet and sharing with your peer. But it will be up soon.</p><p>WebSnippet was born out of a simple aspiration of trying things all in one place. Usually we edit our source code in an editor and then run it in a browser. And as a result there is constant toggling between editor and the browser. And sometimes its a bit of hassle isn't it?</p>");
            $("#messageBox").fadeIn(200);
        },200);
    });
    $("#credits").click(function() {
        if(messageBoxOpen) {
            $("#messageBox").fadeOut(50);
            messageBoxOpen = false;
        } else {
            $("#messageBox").fadeOut(50);
            setTimeout(function() {
                $("#messageBox").html("Copyright &copy; Joseph 2013");
                messageBoxOpen = true;
                $("#messageBox").fadeIn(200);
            },200);
        }
    });
    $("#help").click(function() {
        $("#messageBox").fadeOut(50);
        setTimeout(function() {
            $("#messageBox").html("<ol class='helpTitle'><li>Write your HTML snippet in the HTML panel.</li><li>Write your CSS snippet in the CSS panel.</li><li>Write your JavaScript snippet in the JavaScript panel.</li><li>Check your output live in the Result window.</li></ol>");
            $("#messageBox").fadeIn(200);
        },200);
    });
    $("#jsSelect").change(function(){
        //alert($(this).val());
        if($(this).val() === "jQuery") {
            ext_library = "<script type='text/javascript' src='http://ajax.googleapis.com/ajax/libs/jquery/1.8/jquery.min.js'></script>";
        } else {
            ext_library = "";
           _showFlashMessage($(this).val() + ' - Under Construction',1500);
        }
    });


	$("#run").click(function() {
	    code_string = "<!doctype html><html><head><meta charset='utf-8'>" +
	                        (ext_library) +
	                        "<script type='text/javascript'>" +
                                "try{delete window.print;delete window.alert;delete window.prompt;delete window.confirm;delete window.open;}catch(e){}" +
                            "</script>" +
	                        "<style type='text/css'>" +
                                css_editor.getValue() +
                            "</style></head><body>" +
                                html_editor.getValue() +
                            "<script type='text/javascript'>" +
                                js_editor.getValue() +
                            "</script>" +
                        "</body></html>";
        $("#myFrame").remove();
        previewFrame = document.createElement("iframe");
        previewFrame.id = "myFrame";

        $("#right-component div span").after(previewFrame);
        preview =  previewFrame.contentDocument ||  previewFrame.contentWindow.document;
        preview.open();
        preview.write(code_string); //js_editor.getValue()
        preview.close();
	});
	var delay;
	//initialize the editors
	var html_editor = CodeMirror.fromTextArea(document.getElementById("html"), {
        mode: 'text/html',
        tabMode: 'indent',
        autoCloseTags: true,
        lineNumbers: true,
        lineWrapping: true
    });
    var css_editor = CodeMirror.fromTextArea(document.getElementById("css"), {
        mode: 'text/css',
        tabMode: 'indent',
        lineWrapping: true,
        lineNumbers: true
    });
    var js_editor = CodeMirror.fromTextArea(document.getElementById("js"), {
        mode: 'text/javascript',
        tabMode: 'indent',
        lineWrapping: true,
        lineNumbers: true
    });

    //events
    html_editor.on("change", function() {
        //check for html tag warning
        if(html_editor.getValue().search(/<html/gi) !== -1) {
            if(!htmlWarning)  {
                //console.log('match: ' + typeof $(".htmlWarning"));
                $("#top-component .CodeMirror").after("<ul class='htmlWarning'><li><code>HTML</code> tag not required. We have already provided it in the output.</li></ul>");
                htmlWarning = true;
            }
            //display error message
        } else {
            if(htmlWarning) {
                $(".htmlWarning").remove();
                htmlWarning = false;
            }
        }
        // end
        clearTimeout(delay);
        delay = setTimeout(
            function() {
                updatePreview('h');
        }, 300);
        //console.log(html_editor.getValue());
        //updatePreview();
    });
    css_editor.on("change", function() {
        clearTimeout(delay);
        delay = setTimeout(
            function() {
                updatePreview('c');
        }, 300);
        //console.log(html_editor.getValue());
        //updatePreview();
    });
    js_editor.on("change", function() {
        errorMsg = "";
        clearTimeout(delay);
        delay = setTimeout(
            function() {
            //JSHINT check goes here
            success = JSHINT(js_editor.getValue()); //passing source as a string
            //there are issues in the code, so get those error messages
            if(!success && JSHINT.errors.length > 0) {
                $("#messageBox").css("display","block");
                for(var i = 0; i < JSHINT.errors.length; i+=1) {
                    errorMsg += "<li>" + "<b>Line: " + JSHINT.errors[i].line + "</b> -- " + JSHINT.errors[i].reason + "</li>";
                    $("#messageBox").html("<p class='errorTitle'>JavaScript Warnings</p><ul>" + errorMsg + "</ul>");
                    //console.log("ERROR Line: " + JSHINT.errors[i].line + " Details: " + JSHINT.errors[i].reason);
                }
            //} else {
                updatePreview('j');
            }  else {
                $("#messageBox").css("display","none");
            }
        }, 300);
        //updatePreview();
    });

    function updatePreview(what) {
        code_string = "<!doctype html><html><head><meta charset='utf-8'>" +
                            removeAlerts +
                            "<style type='text/css'>" +
                                css_editor.getValue() +
                            "</style></head><body>" +
                                html_editor.getValue() +
                            "<script type='text/javascript'>" +
                                js_editor.getValue() +
                            "</script>" +
                            bringAlerts +
                      "</body></html>";

       $("#myFrame").remove();
       previewFrame = document.createElement("iframe");
       previewFrame.id = "myFrame";

       $("#right-component div span").after(previewFrame);
       preview =  previewFrame.contentDocument ||  previewFrame.contentWindow.document;
       preview.open();
       preview.write(code_string); //js_editor.getValue()
       preview.close();
    }
    //setTimeout(updatePreview, 300);
})();
