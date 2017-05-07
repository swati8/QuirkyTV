//tizen.tvinputdevice.registerKey("Exit");
//var EXIT_KEY = 27;
// if(IS_TV){
//var	EXIT_KEY = tizen.tvinputdevice.getKey("Exit").code;
// }

var tvKey = {
	KEY_CANCEL_KEYBOARD : 65385,
	KEY_DONE_KEYBOARD : 65376,
	KEY_BACK : 10009,
	//KEY_EXIT : EXIT_KEY,
	KEY_UP : 38,
	KEY_DOWN : 40,
	KEY_LEFT : 37,
	KEY_RIGHT : 39,
	KEY_ENTER : 13,
	KEY_PLAYPAUSE : 2082,
	KEY_STOP : 2083,
	KEY_FASTFORWARD : 2070,
	KEY_REWIND : 2066,
	KEY_VOLUME_UP : 107,
	KEY_VOLUME_DOWN : 109,
	KEY_MUTE : 2192,
	KEY_VIDEO_PLAY_PAUSE:-1,
	KEY_VIDEO_PLAY:-1,
	KEY_VIDEO_PAUSE:-1,
	KEY_VIDEO_STOP:-1,
	KEY_VIDEO_FASTFORWARD:-1,
	KEY_VIDEO_REWIND:-1,
	KEY_VIDEO_TRACK_PREVIOUS:-1,
	KEY_VIDEO_TRACK_NEXT:-1
};

/*
tvKey.registerKeys=function(){
	//register video related keys
	tizen.tvinputdevice.registerKey("MediaPlayPause");
	tizen.tvinputdevice.registerKey("MediaPlay");
	tizen.tvinputdevice.registerKey("MediaPause");
	tizen.tvinputdevice.registerKey("MediaStop");
	tizen.tvinputdevice.registerKey("MediaFastForward");
	tizen.tvinputdevice.registerKey("MediaRewind");
	tizen.tvinputdevice.registerKey("MediaTrackPrevious");
	tizen.tvinputdevice.registerKey("MediaTrackNext");
};

tvKey.initVideoKeys= function(){
//	tizen.tvinputdevice.getKey("MediaPlay").code
	tvKey.KEY_VIDEO_PLAY_PAUSE = tizen.tvinputdevice.getKey("MediaPlayPause").code;
	tvKey.KEY_VIDEO_PLAY = tizen.tvinputdevice.getKey("MediaPlay").code;
	tvKey.KEY_VIDEO_PAUSE = tizen.tvinputdevice.getKey("MediaPause").code;
	tvKey.KEY_VIDEO_STOP = tizen.tvinputdevice.getKey("MediaStop").code;
	tvKey.KEY_VIDEO_FASTFORWARD = tizen.tvinputdevice.getKey("MediaFastForward").code;
	tvKey.KEY_VIDEO_REWIND = tizen.tvinputdevice.getKey("MediaRewind").code;
	tvKey.KEY_VIDEO_TRACK_PREVIOUS = tizen.tvinputdevice.getKey("MediaTrackPrevious").code;
	tvKey.KEY_VIDEO_TRACK_NEXT = tizen.tvinputdevice.getKey("MediaTrackNext").code;
};

tvKey.getMacID=function(){
	if(APP.AppConstants.IS_TV){
	  try{
		  var macId=tizen.systeminfo.getCapability('http://tizen.org/system/tizenid');
		  return macId;
	 }
	 catch(err){
	  return 'NA';
	 }
	}
	else{
		return 'NA';
	}
};

if(APP.AppConstants.IS_TV){
	tvKey.registerKeys();
	tvKey.initVideoKeys();
}
*/