// Initialize function
var mainVideo = {
    isInialized : false,
    isFullscreen : false,
    duration : -1,
    videoHelper : {},
    delay : 1000,
    errorNetworkCheck:null,
    currentVideoUrl:''
};

mainVideo.InitialConfiguration=function(){
    document.addEventListener("visibilitychange", function() {
        if(document.hidden) {
            webapis.avplay.suspend();
            // Something you want to do when hide
        } else {
            webapis.avplay.restore();
            // Something you want to do when resume
        }
    });

    webapis.appcommon.setScreenSaver(0, function(){});// For Screen server Off.
};
//screen.width and screen.height


mainVideo.listener = {
    onbufferingstart : function() {
        if (mainVideo.videoHelper)
            mainVideo.videoHelper.onLoadingShow(true, 0);
    },
    onbufferingprogress : function(percent) {
        if (mainVideo.videoHelper)
            mainVideo.videoHelper.onLoadingShow(true, percent);
    },
    onbufferingcomplete : function() {
        if (mainVideo.videoHelper)
            mainVideo.videoHelper.onLoadingHide();
    },

    oncurrentplaytime : function(currentTime) {
        mainVideo.updateCurrentTime(currentTime, function() {
            if (currentTime) {
                var diff = currentTime - mainVideo.delay;
                if ((diff > 1000) || (diff < 0)) {
                    mainVideo.delay = currentTime;
                }

                if (mainVideo.videoHelper.updateCurrentTime) {
                    mainVideo.videoHelper.updateCurrentTime(currentTime);
                }
            }
        });
    },

    onevent : function(eventType, eventData) {
        console.log("onevent function called...", eventType, eventData);
    },
    onerror : function(eventType) {
        if (mainVideo.videoHelper){
            mainVideo.videoHelper.onError(getMessageFormErrorType(eventType));
        }
    },
    onsubtitlechange : function(duration, text, data3, data4) {
    },
    ondrmevent : function(drmEvent, drmData) {
    },

    onstreamcompleted : function() {
        console.log("stream completed...");
        if (mainVideo.videoHelper.onstreamcompleted) {
            mainVideo.videoHelper.onstreamcompleted();
        }
    }
};

function getMessageFormErrorType(eventType){
    var message="";
    switch(eventType){
        case "PLAYER_ERROR_CONNECTION_FAILED":
            message ="No internet found. Please check your connection.";
            networkCheckingPoolingStart();
            break;
        case "PLAYER_ERROR_INVALID_URI":
            message ="Unable to Play this video.";
            break;
        case "PLAYER_ERROR_NOT_SUPPORTED_FILE":
            message ="This file is not supported.";
            break;
        default:
            message ="Something went wrong.";
            break;
    }
    return message;
};

function networkCheckingPoolingStart(){
//	errorNetworkCheck
    mainVideo.errorNetworkCheck = setInterval(function () {
        if (Network.isConnected()) {
            console.log("network Connected");
            clearInterval(mainVideo.errorNetworkCheck);
            mainVideo.isInialized = false;
            mainVideo.init(1920,1080,mainVideo.currentVideoUrl,mainVideo.videoHelper,mainVideo.delay);

        }else{
            console.log("network Disconnected");

        }
    },3000);
}




mainVideo.init = function(width, height, url, videoHelper,seekTimeVideo) {
    mainVideo.videoHelper = videoHelper;
    mainVideo.currentVideoUrl=url;
    // video analytics
    console.log("video analytics ::: ")
    mainVideo.videoHelper.gaEvent("videoOpen");

    mainVideo.InitialConfiguration();
    if (!mainVideo.isInialized) {

        if (mainVideo.videoHelper) {
            mainVideo.videoHelper.onLoadingShow(false);
        }
        mainVideo.videoOpen(url);
        mainVideo.prepare(width, height,function(){
            //If video is prepared.
            if(seekTimeVideo){
                mainVideo.seekTo(seekTimeVideo,function(){

                });
            }

        });
    }
};

mainVideo.videoOpen = function(url) {
    try {
        // open API gets target URL. URL validation is done in prepare API.
        // "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"

//		if (url.indexOf(".m3u8") !== -1) {
//			url = url + "|COMPONENT=HLS";
//		}

        console.log("Video Url : ", url);
        webapis.avplay.open(url);
        webapis.avplay.setListener(mainVideo.listener, function() {

        });
        // main.updateDuration();
    } catch (e) {
    }
};

mainVideo.prepare = function(width, height,asyncCallback) {
    console.log("prepare");

    try {
        mainVideo.isInialized = true;
        if (webapis.productinfo.isUdPanelSupported()){
            //4K Supported
            webapis.avplay.setStreamingProperty("SET_MODE_4K", "TRUE"); //For 4K mode set true.
        }else{
            //4K Supported Not supported
            webapis.avplay.setStreamingProperty("ADAPTIVE_INFO", "|BITRATES=5000~37000000");
        }
        webapis.avplay.prepareAsync(function() {
            webapis.avplay.setDisplayRect(0, 0, width, height);
            mainVideo.playVideo();
            if(asyncCallback){
                asyncCallback();
            }
            if (mainVideo.videoHelper)
                mainVideo.videoHelper.onLoadingHide();
        });

    } catch (e) {
    }
};

mainVideo.playVideo = function() {
    console.log("Current state of Play Video : ",webapis.avplay.getState());
    if (webapis.avplay.getState() == "PAUSED"
        || webapis.avplay.getState() == "READY") {
        console.log("Going to Play Video");
        webapis.avplay.play();
        if (mainVideo.videoHelper.registerCallbackForPlayPause) {
            mainVideo.videoHelper.registerCallbackForPlayPause("mediaPlay");
        }
    }
};

mainVideo.pauseVideo = function() {
    console.log("Current state of Pause Video : ",webapis.avplay.getState());
    if (webapis.avplay.getState() == "PLAYING") {
        console.log("Going to pause Video");
        webapis.avplay.pause();
        if (mainVideo.videoHelper.registerCallbackForPlayPause) {
            mainVideo.videoHelper.registerCallbackForPlayPause("mediaPause");
        }
    }
};

mainVideo.tooglePlayPause = function() {
    console.log("Current state of tooglePlayPause Video : ",webapis.avplay.getState());
    if (webapis.avplay.getState() == "PAUSED"
        || webapis.avplay.getState() == "READY") {
        mainVideo.playVideo();

    } else if (webapis.avplay.getState() == "PLAYING") {
        mainVideo.pauseVideo();
    }
};

mainVideo.destroyVideo = function() {

    if(mainVideo.errorNetworkCheck){
        clearInterval(mainVideo.errorNetworkCheck);
    }

    try {
        document.removeEventListener("keydown", function() {
            Logger.showLog("listener removed", "removing event listener");
        });
        webapis.avplay.stop();
        webapis.avplay.close();
    } catch (e) {
        console.log("cannot close:::", e);
    }

};

mainVideo.updateCurrentTime = function(currentTime, callback) {
    // current time is given in millisecond
    if (currentTime == null) {
        currentTime = webapis.avplay.getCurrentTime();
    }
    callback();
}


mainVideo.stopVideo = function(cb) {
    try {
        webapis.avplay.stop();
        if (cb) {
            cb();
        }
    } catch (e) {
        console.log(e);
    }
};

mainVideo.jumpForwardVideo = function(time) {
//	try {
//		webapis.avplay.jumpForward(time);
//	} catch (e) {
//		console.log(e);
//	}
    if (webapis.avplay.getState() == "PAUSED"
        || webapis.avplay.getState() == "PLAYING") {
        webapis.avplay.jumpForward(time);
    }
};

mainVideo.jumpBackwardVideo = function(time) {
    if (webapis.avplay.getState() == "PAUSED"
        || webapis.avplay.getState() == "PLAYING") {
        webapis.avplay.jumpBackward(time);

    }
};

mainVideo.seekTo = function(timeInMilliseconds, successCallback, errorCallback) {
    mainVideo.pauseVideo();
    try {
        if (webapis.avplay.getState() == "PAUSED"
            || webapis.avplay.getState() == "IDLE") {
            webapis.avplay.seekTo(timeInMilliseconds, successCallback);
        }
    } catch (e) {
        console.log(e);
    } finally {
        mainVideo.playVideo();
    }
};
