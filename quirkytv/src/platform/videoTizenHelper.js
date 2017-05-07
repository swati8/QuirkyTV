var videoTizenHelper = {
  videoHelper : null,
  seekTime:0,
  jumpDirection:null
};

 videoTizenHelper.register=function(videoHelper){
   videoTizenHelper.videoHelper=videoHelper;
   videoTizenHelper.seekTime=0;
   try{
   webapis.appcommon.setScreenSaver(0, function(){});
   }
   catch(err){}
 };

/*
* Set the listener for the callback Handle
*/
videoTizenHelper.callTo = {
    initPlayer: function(url){
    videoTizenHelper.init(url);
    },
    play: function (data,isNeedToRefresh) {
      try {
        if(videoTizenHelper.seekTime!=0 && videoTizenHelper.jumpDirection){
            if(videoTizenHelper.jumpDirection=='forward'){
              webapis.avplay.jumpForward(videoTizenHelper.seekTime);
            }
            else if(videoTizenHelper.jumpDirection=='backward'){
              webapis.avplay.jumpBackward(videoTizenHelper.seekTime);
            }
            videoTizenHelper.jumpDirection=null;
            FB.reInit();
            videoTizenHelper.seekTime=0;
       }
        webapis.avplay.play();
      } catch (e) {}
      videoTizenHelper.videoHelper.listener.play(data,isNeedToRefresh);
    },
    pause: function (data,isNeedToRefresh) {
      try {webapis.avplay.pause();} catch (e) {}
      videoTizenHelper.videoHelper.listener.pause(data,isNeedToRefresh);
    },
    totalDuration: function (data,isNeedToRefresh) {
      var duration =parseInt(webapis.avplay.getDuration()/1000);
      videoTizenHelper.videoHelper.listener.totalDuration(duration,isNeedToRefresh);
    },
    seekTo: function (time,direction) {
      //time will be in seconds
      console.log("seekTo=== "+time);
       try {
        webapis.avplay.jumpForward(time);
      } catch (e) {}
    },
    forward: function (time) {
      //Time will be in long format. Success and fail callback is optional.
      videoTizenHelper.seekTime=time;
      try {
        webapis.avplay.pause();
        videoTizenHelper.callTo.pause('',true);
      } catch (e) {}
      videoTizenHelper.jumpDirection='forward';
      //try {webapis.avplay.jumpForward(time);} catch (e) {}
    },
    backward: function (time) {
      videoTizenHelper.seekTime=time;
      try {
        webapis.avplay.pause();
        videoTizenHelper.callTo.pause('',true);
      } catch (e) {}
       videoTizenHelper.jumpDirection='backward';
      //try {webapis.avplay.jumpBackward(time);} catch (e) {}
    },
    destroy: function () {
      // videoHelper.videoOtherHelper.callTo.destroy();
      try {
        webapis.avplay.setListener(null);
        webapis.avplay.stop();
        webapis.avplay.close();
      } catch (e) {}
    },
    suspend:function(){
       try {
          webapis.avplay.suspend();
       } catch (e) {}
    },
    restore:function(){
      try {
        webapis.avplay.restore();
       } catch (e) {}
    }

};

videoTizenHelper.listener = {
    onbufferingstart: function () {
        // console.log("Buffering start.");
        videoTizenHelper.videoHelper.listener.onbufferingstart();
    },
    onbufferingprogress: function (percent) {
        // console.log("Buffering progress data : " + percent);
        videoTizenHelper.videoHelper.listener.onbufferingprogress(percent);
    },
    onbufferingcomplete: function () {
        // console.log("Buffering complete.");
        videoTizenHelper.videoHelper.listener.onbufferingcomplete();
    },
    oncurrentplaytime: function (currentTime) {
        currentTime = parseInt(currentTime/1000);
        videoTizenHelper.videoHelper.listener.oncurrentplaytime(currentTime);
    },
    onevent: function (eventType, eventData) {
        console.log("event type: " + eventType + ", data: " + eventData);
    },
    ondrmevent: function (drmEvent, drmData) {
        console.log("DRM callback: " + drmEvent + ", data: " + drmData);
    },
    onstreamcompleted: function () {
        // console.log("Stream Completed");
        try {webapis.avplay.stop();} catch (e) {}
        videoTizenHelper.videoHelper.listener.onstreamcompleted();
    },
    onerror: function (eventType) {
        if (eventType=="PLAYER_ERROR_CONNECTION_FAILED") {
            videoTizenHelper.videoHelper.listener.onnetworkerror(eventType);
        } else {
            videoTizenHelper.videoHelper.listener.onerror(eventType);
        }
    }
};

/*
*  Other Dependant Method call
*/
 videoTizenHelper.init=function(url){
   try {
     webapis.avplay.open(url);
     if(APP.AppConstants.playerDisplaySize=="BIG"){
      webapis.avplay.setDisplayRect(0, 0, 1920, 1080);
    }
     else if(APP.AppConstants.playerDisplaySize=="SMALL"){
      // console.log("playerPositionX============== ",APP.AppConstants.playerPositionX);
      // console.log("playerPositionY============== ",APP.AppConstants.playerPositionY);
      // console.log("width============== ",APP.AppConstants.playerWidth);
      // console.log("height============== ",APP.AppConstants.playerHeight);
      webapis.avplay.setDisplayRect(APP.AppConstants.playerPositionX, APP.AppConstants.playerPositionY, APP.AppConstants.playerWidth,APP.AppConstants.playerHeight);
     }
     else{
      webapis.avplay.setDisplayRect(0, 0, 1920, 1080);
     }
     webapis.avplay.setStreamingProperty("SET_MODE_4K");
     webapis.avplay.setListener(videoTizenHelper.listener);
     webapis.avplay.prepareAsync(function() {
       videoTizenHelper.callTo.play('',true);
       videoTizenHelper.callTo.totalDuration('',true);
     });
   } catch (e) {}

 };
