//Tizen Video helper Class

var videoHelper = {
    list : [],
    position : -1,
    isVideoControllerShow : true,
    videoPlayerController : {},
    mTimeout : null,
    currentVideoPlayTime : 0,
    currentVideoPlayTimeText : '00:00',
    currentVideoTotalTime : 0,
    currentVideoProgressPercentage : 0,
    apiData : {},
    popupService : {},
    state :{}
};

videoHelper.resgister = function(videoPlayerController, apiData, popupService, state) {
    videoHelper.videoPlayerController = videoPlayerController;
    videoHelper.apiData = apiData;
    videoHelper.popupService = popupService;
    videoHelper.state = state;
    videoHelper.counterReset();
};
videoHelper.initVideoAndPlay = function(list, position, width, height) {
    var url = list[position].videoPlayUrl || list[position].videoUrl;
    videoHelper.list = list;
    videoHelper.position = position;

    if (url) {
        videoHelper.gaCallStatus = true;
        mainVideo.init(width, height, url, videoHelper);

    } else {
        Logger.showLog("Error : ", "cannot play video");
    }
};

videoHelper.seekTo0 = function() {
    console.log("seekTo0");
    mainVideo.seekTo(1000, function() {
        // success callback
        console.log("Success Callback");
        videoHelper.currentVideoPlayTime = 0;
        videoHelper.currentVideoPlayTimeText = '00:00';
        videoHelper.currentVideoProgressPercentage = 0;
        // videoHelper.videoPlayerController("updateCurrentTime");
    }, function() {
        console.log("Failure");
        // failure callback
    });
    videoHelper.counterReset();
};
videoHelper.playVideo = function (position) {
    var url = videoHelper.list[position].videoPlayUrl;
    videoHelper.ondestroyVideo();
    mainVideo.init(1920, 1080, url, videoHelper);
};

videoHelper.isSubscribedToPlayVideo = function (newVideo) {
// is logged in
    console.log("isSubscribedToPlayVideo");
    if(loginHelper.isLogin()) {
        // is subscribed
        console.log("is login");
        if (subscriptionHelper.isSubscribed()) {
            // play video
            console.log("is subscribed");
            videoHelper.videoPlayerController("hideBG", false, false);
            videoHelper.playVideo(videoHelper.position);
        } else {
            // not subscribed
            console.log("not subscribed");
            videoHelper.videoPlayerController("showBG", false, true);
            videoHelper.popupService.showSubscribeDialog(function(result) {
                if (result == "skip") {
                    console.log("skipped");
                    videoHelper.playNewVideo(videoHelper.position + 1);
                } else if (result == "subscribe") {
                    console.log("subscribe rrm");
                    var parameter = {
                        code : newVideo.siteCode,
                        userId : loginHelper.getUserId() + "_tv",
                        id : newVideo.id
                    };
                    Utils.callApiPost(videoHelper.apiData, videoHelper.popupService, true, true, "authorize", parameter,
                        function (response) {
                            console.log("rrm response :: ");
                            if (!response.status) {
                                // if unsubscribed
                                subscriptionHelper.showSubscriptionScreen(videoHelper.popupService, function(success) {
                                    console.log("success result (app util)::");
                                    if (success) {
                                        videoHelper.videoPlayerController("hideBG", false, false);
                                        videoHelper.playVideo(videoHelper.position);
                                    }
                                },PopUpMODE.ERROR)
                            } else {
                                // show the subscribtion page
                                videoHelper.videoPlayerController("hideBG", false, false);
                                videoHelper.playVideo(videoHelper.position);
                            }
                        }, function(error) {
                            Logger.showLog("error ::: ", error);
                        }, RRM_URL);
                }
            });
        }
    }
};

videoHelper.playNewVideo = function(position, callback) {
    if (Network.isConnected()) {
        videoHelper.position = (position > -1 && position < videoHelper.list.length) ? position	: 0;
        var newVideo = videoHelper.list[videoHelper.position];
        videoHelper.videoPlayerController("showBG", false);
        videoHelper.gaCallStatus = true;

        if (newVideo.isPaid) {
            console.log("Video is paid");
            // show the dialog flow - May be login or scribe
            videoHelper.mediaStop(function (callBackValue) {
                // is loggedIn
                console.log("nedia stop");
                if (loginHelper.isLogin()) {
                    // updated login status
                    console.log("is login");
                    //videoHelper.videoPlayerController("testLogin");
                    Utils.callAPIGet(videoHelper.apiData,videoHelper.popupService,true,true,"tvUserLoginStatus",null,function (response) {
                        console.log("Got response : ",response.data);
                        if(response.data.logout){
                            console.log("logout is true : ");
                            loginHelper.logout(videoHelper.state);
                        } else {
                            console.log("in else... response.data.logout ");
                            console.log("login status (updated) :");
                            console.log("is subscribed to play video ");
                            videoHelper.isSubscribedToPlayVideo(newVideo);
                        }
                    },function () {

                    },null,videoHelper.state);

                } else {
                    console.log("in else");
                    videoHelper.videoPlayerController("showBG", false, true);
                    videoHelper.popupService.showSubscribeDialog(function (result) {
                        if (result == "skip") {
                            videoHelper.playNewVideo(videoHelper.position + 1);
                        } else if (result == "subscribe") {
                            // login popup
                            console.log("clicked on subscribe");
                            loginHelper.showLoginScreen(videoHelper.apiData, videoHelper.popupService, function (isLoginFromAPI) {
                                // Success login response
                                console.log(">>>>.... login screen response", isLoginFromAPI);
                                if (isLoginFromAPI) {
                                    console.log("isLoginFromAPI");
                                    if (subscriptionHelper.isSubscribed()) {
                                        console.log("subscriptionHelper.isSubscribed");
                                        videoHelper.videoPlayerController("hideBG", false, false);
                                        videoHelper.playVideo(videoHelper.position);
                                    } else {
                                        console.log("subscriptionHelper.isSubscribed (in else)");
                                        subscriptionHelper.showSubscriptionScreen(videoHelper.popupService, function() {
                                            console.log("app util state change");
                                            videoHelper.videoPlayerController("hideBG", false, false);
                                            videoHelper.playVideo(videoHelper.position);
                                        },PopUpMODE.ERROR);
                                    }
                                }
                            },PopUpMODE.ERROR);
                        }
                    });
                }
            })
        } else {
            // Direct play the video
            if (videoHelper.list[videoHelper.position].videoPlayUrl) {
                videoHelper.videoPlayerController("hideBG", false, false);
                videoHelper.playVideo(videoHelper.position);
                videoHelper.videoPlayerController("playNewVideo");
            } else {
                Logger.showLog("No Video : ","does not contain video");
            }
        }
    } else {
        if (videoHelper.videoPlayerController) {
            videoHelper.videoPlayerController("showNetworkErrorDialog");
        }
    }
    videoHelper.counterReset();
};

videoHelper.updateCurrentTime = function(duration) {
    videoHelper.currentVideoPlayTime = duration;
    if(videoHelper.gaCallStatus && duration > 3000) {
        videoHelper.gaCallStatus = false;
        videoHelper.gaEvent("videoStart");
    }
    // document.getElementById("curtimetext").innerHTML =
    // getTimeInHHMMSSFormat(duration);
    videoHelper.currentVideoPlayTimeText = getTimeInHHMMSSFormat(duration);
    var totalTime = getHHMMSStoMS(videoHelper.list[videoHelper.position].duration);
    videoHelper.currentVideoTotalTime = totalTime;
    var percentage = parseInt(duration * 100 / totalTime, 10);
    // document.getElementById("progressSelected").style.width=percentage.toString()
    // + "%";
    videoHelper.currentVideoProgressPercentage = percentage.toString();
    videoHelper.videoPlayerController("updateCurrentTime");
};

function getHHMMSStoMS(hms) {
    var a = hms.split(':'); // split it at the colons
    var seconds = 0;
    if (a.length == 3) {
        // minutes are worth 60 seconds. Hours are worth 60 minutes.
        seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
    } else {
        seconds = (+a[0]) * 60 + (+a[1]);
    }
    return seconds * 1000;
}
function getTimeInHHMMSSFormat(currentTime) {
    var hours = Math.floor(currentTime / 3600000);
    var minutes = Math.floor((currentTime / 60000) % 60);
    var seconds = Math.floor((currentTime / 1000) % 60);
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    if (hours == "00") {
        return minutes.toString() + ":" + seconds.toString();
    } else {
        return hours.toString() + ":" + minutes.toString() + ":"
            + seconds.toString();
    }
}

videoHelper.onLoadingShow = function(isBuffering, bufferingPercentage) {
    videoHelper.videoPlayerController("showLoader", isBuffering,
        bufferingPercentage);
};

videoHelper.onLoadingHide = function() {
    console.log("hide in helper");
    videoHelper.videoPlayerController("hideLoader");
};

videoHelper.onError = function(error) {
    videoHelper.videoPlayerController("error", false, error);
};

videoHelper.onstreamcompleted = function() {
    videoHelper.playNewVideo(videoHelper.position + 1);
};

videoHelper.mediaPlayPause = function() {
    if (videoHelper.videoPlayerController("isreadyToPlayPause")) {
        return;
    }
    mainVideo.tooglePlayPause();

};

videoHelper.mediaPlay = function() {
    if (videoHelper.videoPlayerController("isreadyToPlayPause")) {
        return;
    }
    mainVideo.playVideo();
};

videoHelper.mediaPause = function() {
    if (videoHelper.videoPlayerController("isreadyToPlayPause")) {
        return;
    }
    mainVideo.pauseVideo();
};

videoHelper.mediaStop = function(callback) {
    videoHelper.ondestroyVideo();
    callback("STOP");
    videoHelper.counterReset();
};

videoHelper.mediaFastForward = function() {
    mainVideo.jumpForwardVideo(10000);
    videoHelper.counterReset();
};

videoHelper.mediaRewind = function() {
    mainVideo.jumpBackwardVideo(10000);
    videoHelper.counterReset();
};

videoHelper.progressbar = function() {

};

videoHelper.ondestroyVideo = function() {
    //ga of last video finished
    videoHelper.gaEvent("videoFinish");

    mainVideo.stopVideo();
    videoHelper.setParameter();
    mainVideo.destroyVideo();
};

videoHelper.setParameter = function() {
    mainVideo.isInialized = false;
    mainVideo.isFullscreen = false;
    mainVideo.avPlayerObj = {};
    mainVideo.duration = -1;
    mainVideo.showVideo = false;
    mainVideo.myVideoControllerListener = {};
    mainVideo.delay = 1000;
};

videoHelper.counterReset = function() {
    if (videoHelper.mTimeout) {
        clearTimeout(videoHelper.mTimeout);
    }
    videoHelper.showControllerView();
    videoHelper.mTimeout = setTimeout(function() {
        // Display a login box
        clearTimeout(videoHelper.mTimeout);
        videoHelper.hideControllerView();
    }, 10000);
};

videoHelper.showControllerView = function() {
    if (!videoHelper.isVideoControllerShow) {
        // show View Code
        videoHelper.videoPlayerController("showController");
        videoHelper.isVideoControllerShow = true;
    }
};

videoHelper.hideControllerView = function() {
    if (videoHelper.isVideoControllerShow) {
        videoHelper.videoPlayerController("hideController");
        videoHelper.isVideoControllerShow = false;
    }
};

videoHelper.registerCallbackForPlayPause = function(playPauseStatus) {
    videoHelper.videoPlayerController(playPauseStatus);
    videoHelper.counterReset();
};

videoHelper.gaEvent = function (event) {
    console.log("video analytics helper");
    console.log(event);
    videoHelper.videoPlayerController("GA",false,event);
};