(function (APP) {

    var Platform=Platform || {};

    Platform.exit=function () {
        tizen.application.getCurrentApplication().exit();
    };

    Platform.getScreenResolution = function (callback) {
        var resolution;
        tizen.systeminfo.getPropertyValue("DISPLAY", function(e){
            console.log(e.resolutionHeight);
            console.log(e.resolutionWidth);
            resolution =  {
                screenHeight : e.resolutionHeight,
                screenWidth : e.resolutionWidth
            }
            callback(resolution);
        });
    };

    document.addEventListener("visibilitychange", function(){
     if(videoHelper && videoHelper.callTo){   
         if(document.hidden){ 
            videoHelper.callTo.suspend();
         } 
         else{ 
           videoHelper.callTo.restore();
          }
     }
    });
  
    APP.Platform=Platform;
})(APP);

function func_onLoad() {
    // This function does not do any thing but is required for Orsay.
    // Thus created a blank dummy function.
   // console.log("on Application load");
}