
angular.module('quirky', ['ui.router', 'angularModalService'])
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        var Base = "appLauncher/app/quirkytv/";
        Base= "";
        $stateProvider
            .state('home', {
                url: '/',
                controller: 'homeController as home',
                templateUrl: Base+'src/views/home.html'
            })
            .state('video', {
                url: '/video',
                templateUrl: Base + 'src/views/video.html',
                controller: 'videoController as video',
                params: {
                    data: [],
                    index: -1
                }
            });
        $urlRouterProvider.otherwise('/');
    }]);

angular.module('quirky')
    .controller('homeController', ['$scope', '$http','$state', function ($scope, $http, $state) {

        var home = this,api = "http://stage.quirkytv.net/api/demo@quirkytv.net",currentPlaylist=[];
        console.log("api", api);

        $http.get(api).then(function (response) {
            console.log("response :", response);
            home.playList = response.data.playlistList;
            home.videoList = response.data.videoList;
        }, function (error) {
            console.log("error : ", error);
            var res = {
                "videoList": [
                    {
                        "_id": "58fab96cda65ad0011160da7",
                        "videoName": "Tres",
                        "videoURL": "https://dvfqe96bewx82.cloudfront.net/demo@quirkytv.net/14928264298031491488913438WhatsAppVideo20170222at2.19.16PM.mp4",
                        "__v": 1,
                        "created": "2017-04-22T02:01:16.713Z",
                        "author": {"id": "58dedf6224ea6c0011d5f0c9", "username": "demo@quirkytv.net"},
                        "playlists": ["58fab7bcda65ad0011160da4"],
                        "imageURL": "https://dvfqe96bewx82.cloudfront.net/demo@quirkytv.net/14928264750201491489039123WhatsAppImage20170401at1.21.02PM.jpeg"
                    }, {
                        "_id": "58fab8a3da65ad0011160da6",
                        "videoName": "Dos",
                        "videoURL": "https://dvfqe96bewx82.cloudfront.net/demo@quirkytv.net/14928262417041491488180275WhatsAppVideo20170317at6.37.39PM.mp4",
                        "__v": 1,
                        "created": "2017-04-22T01:57:55.247Z",
                        "author": {"id": "58dedf6224ea6c0011d5f0c9", "username": "demo@quirkytv.net"},
                        "playlists": ["58fab7bcda65ad0011160da4"],
                        "imageURL": "https://dvfqe96bewx82.cloudfront.net/demo@quirkytv.net/14928262734421491488592262WhatsAppImage20170224at2.48.50PM.jpeg"
                    }, {
                        "_id": "58fab7ddda65ad0011160da5",
                        "videoName": "Uno",
                        "videoURL": "https://dvfqe96bewx82.cloudfront.net/demo@quirkytv.net/14928260597621491489037113WhatsAppVideo20170405at5.03.17PM.mp4",
                        "__v": 1,
                        "created": "2017-04-22T01:54:37.381Z",
                        "author": {"id": "58dedf6224ea6c0011d5f0c9", "username": "demo@quirkytv.net"},
                        "playlists": ["58fab7bcda65ad0011160da4"],
                        "imageURL": "https://dvfqe96bewx82.cloudfront.net/demo@quirkytv.net/14928260759461491488184850WhatsAppImage20170321at7.10.43PM.jpeg"
                    }, {
                        "_id": "58fab797da65ad0011160da2",
                        "videoName": "Moni Video",
                        "videoURL": "https://dvfqe96bewx82.cloudfront.net/demo@quirkytv.net/14928259928981491488589919WhatsAppVideo20170224at2.58.14PM.mp4",
                        "__v": 1,
                        "created": "2017-04-22T01:53:27.202Z",
                        "author": {"id": "58dedf6224ea6c0011d5f0c9", "username": "demo@quirkytv.net"},
                        "playlists": ["58fab771da65ad0011160da1"],
                        "imageURL": "https://dvfqe96bewx82.cloudfront.net/demo@quirkytv.net/14928260025101491488920978WhatsAppImage20170401at1.21.02PM.jpeg"
                    }, {
                        "_id": "58fab755da65ad0011160da0",
                        "videoName": "Best Video",
                        "videoURL": "https://dvfqe96bewx82.cloudfront.net/demo@quirkytv.net/14928259049401491488913438WhatsAppVideo20170222at2.19.16PM.mp4",
                        "__v": 1,
                        "created": "2017-04-22T01:52:21.056Z",
                        "author": {"id": "58dedf6224ea6c0011d5f0c9", "username": "demo@quirkytv.net"},
                        "playlists": ["58fab6fada65ad0011160d9e"],
                        "imageURL": "https://dvfqe96bewx82.cloudfront.net/demo@quirkytv.net/14928259393341491488207648WhatsAppImage20170401at1.21.02PM.jpeg"
                    }, {
                        "_id": "58fab715da65ad0011160d9f",
                        "videoName": "Great Video",
                        "videoURL": "https://dvfqe96bewx82.cloudfront.net/demo@quirkytv.net/14928258684131491489037113WhatsAppVideo20170405at5.03.17PM.mp4",
                        "__v": 1,
                        "created": "2017-04-22T01:51:17.649Z",
                        "author": {"id": "58dedf6224ea6c0011d5f0c9", "username": "demo@quirkytv.net"},
                        "playlists": ["58fab6fada65ad0011160d9e"],
                        "imageURL": "https://dvfqe96bewx82.cloudfront.net/demo@quirkytv.net/14928258763741491488592262WhatsAppImage20170224at2.48.50PM.jpeg"
                    }, {
                        "_id": "58e65130d5daa50011a5d49a",
                        "videoName": "One More",
                        "videoURL": "https://dvfqe96bewx82.cloudfront.net/demo@quirkytv.net/1491489066811WhatsAppVideo20170317at6.37.39PM.mp4",
                        "__v": 0,
                        "created": "2017-04-06T14:31:12.751Z",
                        "author": {"id": "58dedf6224ea6c0011d5f0c9", "username": "demo@quirkytv.net"},
                        "playlists": [],
                        "imageURL": "https://dvfqe96bewx82.cloudfront.net/demo@quirkytv.net/1491489070592WhatsAppImage20170405at5.01.20PM.jpeg"
                    }, {
                        "_id": "58e65110d5daa50011a5d499",
                        "videoName": "First Video",
                        "videoURL": "https://dvfqe96bewx82.cloudfront.net/demo@quirkytv.net/1491489037113WhatsAppVideo20170405at5.03.17PM.mp4",
                        "__v": 2,
                        "created": "2017-04-06T14:30:40.543Z",
                        "author": {"id": "58dedf6224ea6c0011d5f0c9", "username": "demo@quirkytv.net"},
                        "playlists": [],
                        "imageURL": "https://dvfqe96bewx82.cloudfront.net/demo@quirkytv.net/1491489039123WhatsAppImage20170401at1.21.02PM.jpeg"
                    }, {
                        "_id": "58e6509bd5daa50011a5d497",
                        "videoName": "Come Come",
                        "videoURL": "https://dvfqe96bewx82.cloudfront.net/demo@quirkytv.net/1491488913438WhatsAppVideo20170222at2.19.16PM.mp4",
                        "__v": 0,
                        "created": "2017-04-06T14:28:43.719Z",
                        "author": {"id": "58dedf6224ea6c0011d5f0c9", "username": "demo@quirkytv.net"},
                        "playlists": [],
                        "imageURL": "https://dvfqe96bewx82.cloudfront.net/demo@quirkytv.net/1491488920978WhatsAppImage20170401at1.21.02PM.jpeg"
                    }, {
                        "_id": "58e64f51d5daa50011a5d495",
                        "videoName": "Loving da Spinach",
                        "videoURL": "https://dvfqe96bewx82.cloudfront.net/demo@quirkytv.net/1491488589919WhatsAppVideo20170224at2.58.14PM.mp4",
                        "__v": 0,
                        "created": "2017-04-06T14:23:13.545Z",
                        "author": {"id": "58dedf6224ea6c0011d5f0c9", "username": "demo@quirkytv.net"},
                        "playlists": [],
                        "imageURL": "https://dvfqe96bewx82.cloudfront.net/demo@quirkytv.net/1491488592262WhatsAppImage20170224at2.48.50PM.jpeg"
                    }, {
                        "_id": "58e64dd1d5daa50011a5d494",
                        "videoName": "Burping",
                        "videoURL": "https://dvfqe96bewx82.cloudfront.net/demo@quirkytv.net/1491488206263WhatsAppVideo20170405at5.03.17PM.mp4",
                        "__v": 2,
                        "created": "2017-04-06T14:16:49.002Z",
                        "author": {"id": "58dedf6224ea6c0011d5f0c9", "username": "demo@quirkytv.net"},
                        "playlists": [],
                        "imageURL": "https://dvfqe96bewx82.cloudfront.net/demo@quirkytv.net/1491488207648WhatsAppImage20170401at1.21.02PM.jpeg"
                    }, {
                        "_id": "58e64dbad5daa50011a5d493",
                        "videoName": "Always eating",
                        "videoURL": "https://dvfqe96bewx82.cloudfront.net/demo@quirkytv.net/1491488180275WhatsAppVideo20170317at6.37.39PM.mp4",
                        "__v": 2,
                        "created": "2017-04-06T14:16:26.884Z",
                        "author": {"id": "58dedf6224ea6c0011d5f0c9", "username": "demo@quirkytv.net"},
                        "playlists": [],
                        "imageURL": "https://dvfqe96bewx82.cloudfront.net/demo@quirkytv.net/1491488184850WhatsAppImage20170321at7.10.43PM.jpeg"
                    }, {
                        "_id": "58e64d61d5daa50011a5d491",
                        "videoName": "Swing set",
                        "videoURL": "https://dvfqe96bewx82.cloudfront.net/demo@quirkytv.net/1491488082873WhatsAppVideo20170317at6.37.39PM.mp4",
                        "__v": 2,
                        "created": "2017-04-06T14:14:57.626Z",
                        "author": {"id": "58dedf6224ea6c0011d5f0c9", "username": "demo@quirkytv.net"},
                        "playlists": [],
                        "imageURL": "https://dvfqe96bewx82.cloudfront.net/demo@quirkytv.net/1491488096046WhatsAppImage20170321at7.10.43PM.jpeg"
                    }, {
                        "_id": "58e64d27d5daa50011a5d490",
                        "videoName": "Haircut",
                        "videoURL": "https://dvfqe96bewx82.cloudfront.net/demo@quirkytv.net/1491488029664WhatsAppVideo20170405at5.03.17PM.mp4",
                        "__v": 2,
                        "created": "2017-04-06T14:13:59.360Z",
                        "author": {"id": "58dedf6224ea6c0011d5f0c9", "username": "demo@quirkytv.net"},
                        "playlists": [],
                        "imageURL": "https://dvfqe96bewx82.cloudfront.net/demo@quirkytv.net/1491488034023WhatsAppImage20170405at5.01.20PM.jpeg"
                    }],
                "playlistList": [
                    {
                        "_id": "58fab7bcda65ad0011160da4",
                        "name": "Last One",
                        "imageURL": "https://dvfqe96bewx82.cloudfront.net/demo@quirkytv.net/14928251215071491488592262WhatsAppImage20170224at2.48.50PM.jpeg",
                        "__v": 3,
                        "updated": "2017-04-22T02:01:16.746Z",
                        "created": "2017-04-22T01:54:04.804Z",
                        "author": {"id": "58dedf6224ea6c0011d5f0c9", "username": "demo@quirkytv.net"},
                        "videos": ["58fab96cda65ad0011160da7", "58fab8a3da65ad0011160da6", "58fab7ddda65ad0011160da5"]
                    }, {
                        "_id": "58fab7adda65ad0011160da3",
                        "name": "I'm alone",
                        "imageURL": "https://dvfqe96bewx82.cloudfront.net/demo@quirkytv.net/14928251215071491488207648WhatsAppImage20170401at1.21.02PM.jpeg",
                        "__v": 0,
                        "updated": "2017-04-22T01:53:49.483Z",
                        "created": "2017-04-22T01:53:49.483Z",
                        "author": {"id": "58dedf6224ea6c0011d5f0c9", "username": "demo@quirkytv.net"},
                        "videos": []
                    }, {
                        "_id": "58fab771da65ad0011160da1",
                        "name": "Cool Playlist",
                        "imageURL": "https://dvfqe96bewx82.cloudfront.net/demo@quirkytv.net/14928251215071491488034023WhatsAppImage20170405at5.01.20PM.jpeg",
                        "__v": 1,
                        "updated": "2017-04-22T01:53:27.338Z",
                        "created": "2017-04-22T01:52:49.941Z",
                        "author": {"id": "58dedf6224ea6c0011d5f0c9", "username": "demo@quirkytv.net"},
                        "videos": ["58fab797da65ad0011160da2"]
                    }, {
                        "_id": "58fab6fada65ad0011160d9e",
                        "name": "Greatest",
                        "imageURL": "https://dvfqe96bewx82.cloudfront.net/demo@quirkytv.net/14928251215071491488184850WhatsAppImage20170321at7.10.43PM.jpeg",
                        "__v": 2,
                        "updated": "2017-04-22T01:52:21.065Z",
                        "created": "2017-04-22T01:50:50.948Z",
                        "author": {"id": "58dedf6224ea6c0011d5f0c9", "username": "demo@quirkytv.net"},
                        "videos": ["58fab755da65ad0011160da0", "58fab715da65ad0011160d9f"]
                    }
                ]
            };
            home.playList = res.playlistList;
            home.videoList = res.videoList;
            console.log("home.playlist",home.playList);
        });

        var playUrl = function (playlist,index) {
            console.log("dffdg...");
            if(index>=0 && index<playlist.length) {
                console.log("dffdg..sfgd.");
                $state.go('video',{
                    data : playlist,
                    index : index
                });
            } else if(index == playlist.length) {
                playUrl(playlist,0);
            } else {
                console.log("invalid index")
            }
        };

        home.getFormatedDate = function (date) {
            if(date) {
                var objDate = new Date(date),
                    locale = "en-us",
                    month = objDate.toLocaleString(locale, { month: "short" });
                return (month + " " + objDate.getDate() +","+ objDate.getFullYear());
            } else {
                return "";
            }
        };

        home.onPlaylistClick = function (value) {
            currentPlaylist = [];
            console.log("on playlist click");
            console.log(value);
            var obj;
            value.videos.forEach(function (id) {
                obj = null;
                obj = home.videoList.filter(function ( obj ) {
                    return obj._id === id;
                })[0];
                if(obj) {
                    currentPlaylist.push(obj);
                }
            });
            console.log(currentPlaylist);
            playUrl(currentPlaylist,0);
        };

        home.onVideoClick = function (value,index) {
            currentPlaylist = [];
            playUrl(home.videoList,index);
        };

    }])

    .controller('videoController',['$scope','$stateParams', function ($scope,$stateParams) {
        var video = this;
        var playlist = $stateParams.data;
        var index = $stateParams.index;
        // var url = playlist[index].videoURL;
        console.log("in player");

        var nextVideo = function() {
            webapis.avplay.stop();
            webapis.avplay.setListener(null);
            webapis.avplay.close();
            ++index;
            if(index == playlist.length) {
                index = 0;
            }
            console.log("hii");
            playVideo(playlist[index].url);
        }
        var playVideo = function (url) {
            url = "https://dvfqe96bewx82.cloudfront.net/demo@quirkytv.net/14928262417041491488180275WhatsAppVideo20170317at6.37.39PM.mp4";
            var listner = {
                onbufferingstart : function() { console.log("1 onbufferingstart");},
                onbufferingprogress : function(percent) { console.log("2 onbufferingprogress");},
                onbufferingcomplete : function() { console.log("3 onbufferingcomplete");},
                oncurrentplaytime : function(currentTime) { console.log("4 oncurrentplaytime");},
                onevent : function(eventType, eventData) { console.log("5 onevent"); },
                onerror : function(eventType) { console.log("6 onerror",eventType);},
                onsubtitlechange : function(duration, text, data3, data4) { console.log("7 onsubtitlechange");},
                ondrmevent : function(drmEvent, drmData) { console.log("8 ondrmevent");},
                onstreamcompleted : function() { console.log("9 onstreamcompleted");
                    nextVideo();}

            }
            console.log("open url");
            webapis.avplay.open(url);
            webapis.avplay.setListener(listner);
            console.log("in listner :::");
            webapis.avplay.prepareAsync(function() {
                console.log("in prepare async :::");
                webapis.avplay.setDisplayRect(0, 0, 1920, 1080);
                console.log("in play");
                webapis.avplay.play();
            });
        };
        playVideo(playlist[index].videoURL);

    }]);