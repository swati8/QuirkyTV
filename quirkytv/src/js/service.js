angular.module('quirky')
    .directive('keyNavigation',['NavigationService',function(NavigationService){
        return{
            restrict:'A',
            replace: false,
            template: '',
            scope:{},
            link:function(scope,element,attribute){
                scope.$watch(attribute.tabindex,function(){
                    if(attribute.tag){
                        NavigationService.focusableElement(attribute.tag,element);
                    }
                });
                element.off('keydown').on('keydown',function(e){
                        var key=e.keyCode?e.keyCode:e.which;
                        NavigationService.handleFocus(key,attribute.tag,element,e,scope.$parent);
                    });
            }
        }
    }])
    .factory('NavigationService',['$timeout','$state','$rootScope','$window',function($timeout,$state,$rootScope,$window){
        var navigationservice={};
        navigationservice.elements={};
        navigationservice.defaultFocus=null;
        navigationservice.lastFocus=null;
        navigationservice.controllerScope=null;
        function setFocusableElement(tag,element){
            if(!navigationservice.elements[tag]){
                navigationservice.elements[tag]=[];
            }
            navigationservice.elements[tag].push(element);
            if(element[0].getAttribute('default')=='true'){
                navigationservice.defaultFocus=element[0];
                element[0].focus();
                if(element[0].getAttribute('tag')!='popup') {
                    navigationservice.lastFocus = element[0];
                }
            }
        }
        function clearNavigation(){
            for(var i=0;i<arguments.length;i++){
                if(navigationservice.elements[arguments[i]]){
                    delete navigationservice.elements[arguments[i]];
                }
            }
        }
        function getDefaultFocused(){
            return navigationservice.defaultFocus;
        }
        function getLastFocused(){
            return navigationservice.lastFocus;
        }
        function changeFocuse(tagWithId){
            if(tagWithId) {
                var id = tagWithId.split('.');
                var ele=null;
                if(document.getElementById(id[1])){
                    ele=document.getElementById(id[1]).parentNode.children;
                    // console.log("ele=== ",ele);
                    //Change the focus for it
                    ele[id[1]].focus();
                    setLastFocus(ele[id[1]]);
                }
                // console.log("ele[id[1]]=== ",ele[id[1]]);
                // console.log("document.activeElement==== ",document.activeElement);
            }
        }
        function handleFocus(key,tag,target,e,controllerScope){
            navigationservice.controllerScope=controllerScope;
            switch(key){
                case tvKey.KEY_RIGHT:
                    navigationHandler('right',tag,target,e);
                    if(controllerScope && controllerScope.videoPlayer){
                        controllerScope.videoPlayer.navigation('right');
                        if(controllerScope && controllerScope.navigation){
                            controllerScope.navigation('right');
                        }
                    }
                    else if(controllerScope && controllerScope.navigation){
                        controllerScope.navigation('right');
                    }

                    break;
                case tvKey.KEY_DOWN:
                    navigationHandler('down',tag,target,e);
                    //scrollVertical(target[0]);
                    if(controllerScope && controllerScope.videoPlayer){
                        controllerScope.videoPlayer.navigation('down');
                    }
                    break;
                case tvKey.KEY_LEFT:
                    navigationHandler('left',tag,target,e);
                    if(controllerScope && controllerScope.videoPlayer){
                        controllerScope.videoPlayer.navigation('left');
                        if(controllerScope && controllerScope.navigation){
                            controllerScope.navigation('left');
                        }
                    }
                    else if(controllerScope && controllerScope.navigation){
                        controllerScope.navigation('left');
                    }
                    break;
                case tvKey.KEY_UP:
                    //scrollVertical(target[0]);
                    navigationHandler('up',tag,target,e);
                    if(controllerScope && controllerScope.videoPlayer){
                        controllerScope.videoPlayer.navigation('up');
                    }
                    break;
                case tvKey.KEY_BACK:
                    historyBack(e);
                    break;
                case tvKey.KEY_VIDEO_PLAY_PAUSE:
                    console.log("Play/Pause toggle button clicked");
                    // videoHelper.mediaPlayPause();
                    break;
                case tvKey.KEY_VIDEO_PLAY:
                    console.log("Play button clicked");
                    mainVideo.playVideo();
                    break;
                case tvKey.KEY_VIDEO_PAUSE:
                    console.log("Pause button clicked");
                    mainVideo.pauseVideo();
                    break;
                case tvKey.KEY_VIDEO_STOP:
                    console.log("Stop button clicked");
                    // videoHelper.mediaStop(function () {
                    //   focusService.returnHandling(scope,popupService);
                    // });
                    break;
                case tvKey.KEY_VIDEO_FASTFORWARD:
                    console.log("FF button clicked");
                    mainVideo.jumpForwardVideo(5000);
                    //  videoHelper.mediaFastForward();
                    break;
                case tvKey.KEY_VIDEO_REWIND:
                    console.log("RW button clicked");
                    mainVideo.jumpBackwardVideo(5000);
                    // videoHelper.mediaRewind();
                    break;
                case tvKey.KEY_VIDEO_TRACK_PREVIOUS:
                    console.log("RW button clicked");
                    // videoHelper.playNewVideo(videoHelper.position -1);
                    break;
                case tvKey.KEY_VIDEO_TRACK_NEXT:
                    console.log("RW button clicked");
                    // videoHelper.playNewVideo(videoHelper.position +1);
                    break;
                case tvKey.KEY_VOLUME_DOWN :
                    console.log("KEY_VOLUME_DOWN");
                    if(APP.AppConstants.TV_PLATFORM == APP.AppConstants.ORSAY && !tvKey.hasCaph) {
                        console.log("KEY_VOLUME_DOWN (in if)");
                        Audio.setRelativeVolume(1);
                    }
                    break;
                case  tvKey.KEY_VOLUME_UP :
                    console.log("KEY_VOLUME_UP");
                    if(APP.AppConstants.TV_PLATFORM == APP.AppConstants.ORSAY && !tvKey.hasCaph) {
                        console.log("KEY_VOLUME_UP (in if)");
                        Audio.setRelativeVolume(0);
                    }
                    break;
                case tvKey.KEY_MUTE :
                    console.log("KEY_MUTE");
                    if(APP.AppConstants.TV_PLATFORM == APP.AppConstants.ORSAY && !tvKey.hasCaph) {
                        console.log("KEY_MUTE (in if)");
                        Audio.handleMute();
                    }
                    break;
                default :
                    console.log("this option is not available");
                    break;
            }
        }
        function historyBack(e){
            /*if(DialogService.getModalInstance()){
                DialogService.closeModal();
                e.preventDefault();
            }
            else*/ if($rootScope.currentState=='listing.livetv' || $rootScope.currentState=='listing.favorites' || $rootScope.currentState=='listing.movies' || $rootScope.currentState=='listing.vod'){
                e.preventDefault();
                $state.go('home');
                clearNavigation('header','listing');
            }
            else if($rootScope.currentState=='app' || $rootScope.currentState=='home'){
                e.preventDefault();
                showExitPopup(e);
            }
            else if($rootScope.currentState=='videoPlayer' && navigationservice.controllerScope && navigationservice.controllerScope.videoPlayer && navigationservice.controllerScope.videoPlayer.vodListVisibility){
                navigationservice.controllerScope.videoPlayer.closeVodList();
            }
            else if($rootScope.currentState=='videoPlayer' && ($rootScope.fromState.name=="listing.catchup" || $rootScope.fromState.name=="listing.epglive")){
                if(videoHelper.videoOtherHelper){
                    videoHelper.callTo.destroy();
                }
                $state.go('listing.livetv',{id:APP.AppConstants.HomeCategory.LIVETV});
            }
            else if($rootScope.currentState=='videoPlayer' || $rootScope.currentState=='listing.movieDetail' || $rootScope.currentState=='listing.vodDetail'){
                if(videoHelper.videoOtherHelper){
                    videoHelper.callTo.destroy();
                }
                $window.history.back();
            }
            else if($rootScope.currentState=="listing.catchup" || $rootScope.fromState.name=="listing.epglive"){
                if(videoHelper.videoOtherHelper){
                    videoHelper.callTo.destroy();
                }
                $state.go('videoPlayer',{data:null,categoryType:APP.AppConstants.pageFlow.Livetv});
            }
            else{
                if(videoHelper.videoOtherHelper){
                    videoHelper.callTo.destroy();
                }
                $window.history.back();
            }
            if(APP.AppConstants.TV_PLATFORM == APP.AppConstants.ORSAY) {
                var widgetAPI = new Common.API.Widget();
                widgetAPI.blockNavigation(e);
            }
        }

        function setLastFocus(element){
            if(element.getAttribute('tag')!='popup'){
                navigationservice.lastFocus=element;
            }
        }

        function showExitPopup(event) {
            var successCallback=function (res) {
                    if(res=='yes'){
                        APP.Platform.exit(null,event);
                    }
                    else if(res=='no'){
                        $timeout(function () {
                            navigationservice.lastFocus.focus();
                        },100);
                    }
                },
                errorCallback=function () {
                };
           /* DialogService.exitModal({},successCallback,errorCallback)*/;
        }
        function navigationHandler(direction,tag,target,e){
            var d=target[0].getAttribute(direction);
            if(d=='prev'){
                var index=navigationservice.elements[tag].indexOf(target);
                if(isFocusable(navigationservice.elements[tag][index-1],true)){
                    navigationservice.elements[tag][index-1][0].focus();
                    setLastFocus(navigationservice.elements[tag][index-1][0]);
                }else{
                    navigationHandler(direction,tag,navigationservice.elements[tag][index-1])
                }
            }
            else if(d=='next'){
                var index=navigationservice.elements[tag].indexOf(target);
                if(isFocusable(navigationservice.elements[tag][index+1],true,e)){
                    navigationservice.elements[tag][index+1][0].focus();
                    setLastFocus(navigationservice.elements[tag][index+1][0]);
                }else{
                    navigationHandler(direction,tag,navigationservice.elements[tag][index+1])
                }
            }
            else{
                if(d) {
                    console.log("elem :",d);
                    var id = d.split(':');
                    var ele=null;
                    if(document.getElementById(id[1])){
                        ele=document.getElementById(id[1]).parentNode.children;
                    }
                    if(ele && isFocusable(ele[id[1]],false)){
                        ele[id[1]].focus();
                        setLastFocus(ele[id[1]]);
                    }
                }
            }
        }
        // function scrollVertical(target){
        //     console.log(target.parentNode.parentNode.parentNode);
        //     console.log(target.parentNode.parentNode.parentNode.getAttribute('index'));
        //     var placeToMove=target.parentNode.parentNode.parentNode.getAttribute('index');
        //     console.log('-'+(70* placeToMove));
        //     $('row'+(placeToMove>0?placeToMove-1:0)).animate({'margin-top' : ('-'+(70* placeToMove) + 'em')},300, function() {});
        // }
        function isFocusable(element,isAngularDOM) {
            if(isAngularDOM){
                if(!element){
                    return false;
                }
                if(element.hasClass('ng-hide')){
                    return false;
                }else if(element.hasClass('hide')){
                    return false;
                }
                element = element[0];
            }
            if (element.attributes["ng-disabled"]) {
                return element.attributes["ng-disabled"].value == "false";
            } else if (element.style.visibility == "hidden") {
                return false;
            } else if (element.style.display == "none") {
                return false;
            }else if (getComputedStyle(element, null).display=="none") {
                return false;
            }
            return true;
        };
        function getFocusableElement(){
            return navigationservice.elements;
        }
        return {
            focusableElement:setFocusableElement,
            handleFocus:handleFocus,
            getDefaultFocused:getDefaultFocused,
            getLastFocused:getLastFocused,
            clearNavigation:clearNavigation,
            getFocusableElement:getFocusableElement,
            changeFocuse:changeFocuse
        }
    }]);