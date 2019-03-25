let common = require("Common");
let mvs = require("matchvs.all");

cc.Class({
    extends: cc.Component,
    properties: {
        wcode: null,
        code: null, //OpenId
        sessionKey: null,
        userInfo: null, //微信用户信息
        engine: null,
        rsp: null,
        gameID: common.gameID,
        hasUserInfo: false,
        appkey: common.appkey,
        secret: common.secret,
        signCode: null,
    },

    onLoad() {
        this.engine = new mvs.MatchvsEngine();
        this.rsp = new mvs.MatchvsResponse();
        this.rsp.initResponse = this.initResponse.bind(this);
        this.rsp.loginResponse = this.loginResponse.bind(this);

        common.query = this.getQuery();

        this.MatchvsInit();
       
    },

    getQuery: function () {
        let result = new Array();
        let LaunchOption = wx.getLaunchOptionsSync();
        let roomid = "roomID",
            maxplayer = "maxplayer",
            mode = "mode",
            userID = "userID",
            token = "token";
        let shareRoomID = LaunchOption.query[roomid];
        let shareMaxplayer = parseInt(LaunchOption.query[maxplayer]);
        let shareMode = parseInt(LaunchOption.query[mode]);
        let shareUserID = LaunchOption.query[userID];
        let shareToken = LaunchOption.query[token];
        if (shareRoomID !== undefined &&
            !isNaN(shareMaxplayer) &&
            !isNaN(shareMode)) {
            result.push(shareRoomID);
            result.push(shareMaxplayer);
            result.push(shareMode);
            result.push(shareUserID);
            result.push(shareToken);
        }

        return result;
    },

    MatchvsInit() {
        this.engine.init(this.rsp, "Matchvs", "alpha", this.gameID);
    },

    initResponse: function (status) {
        if (status === 200) {
            cc.log("初始化成功，开始绑定");
            this.bindOpenidWithUserid();
        } else {
            cc.log("初始化失败，错误码：" + status);
        }
    },

    loginResponse: function (loginRsp) {
        module.exports.engine = this.engine;
        module.exports.rsp = this.rsp;

        if (loginRsp.status === 200) {
            let sign = this.appkey + "&gameID=" + this.gameID + "&userID=" + common.userID + "&" + common.token;
            this.signCode = hex_md5(sign);
            this.isTheFirstLogin();
            this.getWxUserInfo();

        } else {
            cc.log("登录失败");
        }
    },

    getWxUserInfo: function () {
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting["scope.userInfo"]) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            this.userInfo = res.userInfo
                            common.username = res.userInfo.nickName;
                            common.avatarUrl = res.userInfo.avatarUrl;

                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                            cc.director.loadScene("lobby")
                        }
                    })
                } else {
                    // 没有弹出过授权弹窗
                    let button = wx.createUserInfoButton({
                        type: "text",
                        text: "微信授权登录",
                        style: {
                            left: 30,
                            top: 50,
                            width: 200,
                            height: 40,
                            lineHeight: 40,
                            backgroundColor: "#00ff00",
                            color: "#ffffff",
                            textAlign: "center",
                            fontSize: 16,
                            borderRadius: 4
                        }
                    });
                    button.show();
                    button.onTap((res) => {

                        if (res.userInfo) {
                            this.userInfo = res.userInfo;
                            common.username = res.userInfo.nickName;
                            common.avatarUrl = res.userInfo.avatarUrl;

                            let dataList = [{
                                key: "username",
                                value: res.userInfo.nickName
                            }, {
                                key: "avatarUrl",
                                value: res.userInfo.avatarUrl
                            }];

                            wx.request({

                                url: "http://alphavsopen.matchvs.com/wc5/setUserData.do?",
                                method: "GET",
                                data: {
                                    gameID: this.gameID,
                                    userID: common.userID,
                                    dataList: dataList,
                                    sign: this.signCode
                                },

                                header: {
                                    "content-type": "application/json" // 默认值
                                },
                                success: function (res) {

                                    cc.log("存用户微信信息成功" + res.errMsg + " " + res.data + res.data.status);

                                },
                                fail: function (res) {
                                    cc.log("存用户微信信息失败" + res.data);
                                }
                            });

                            button.destroy();
                            cc.director.loadScene("lobby");
                        } else {
                            cc.log("拒绝授权");
                        }
                        cc.log(res)
                    })
                }
            }
        })
    },

    bindOpenidWithUserid: function () {
        let theEngine = this.engine;

        wx.login({
            success(res) {
                if (res.code) {
                    this.wcode = res.code
                    cc.log(res.code + "登录成功")

                    wx.request({
                        url: "https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code",
                        method: "GET",
                        data: {
                            appid: "wxeac3c62acc04849e",
                            secret: "ea033810b31c9de3c6da8fc4842f8941",
                            js_code: this.wcode,
                            grant_type: "authorization_code"
                        },
                        success: function (res) {
                            this.code = res.data.openid;
                            this.sessionKey = res.data.session_key;

                            cc.log("获取到openID 和 session_key--------------" + this.code + " " + this.sessionKey);

                            let appKey = "3e4355f5e5164b5aadd654d7326e360b#M"; //matchvs游戏key
                            let secretKey = "95374aa3ce46498e8f317d153f275cb7"; //matchvs游戏secret
                            let params = appKey + "&gameID=" + 214500 + "&openID=" + this.code + "&session=" + this.sessionKey + "&thirdFlag=1&" + secretKey;
                            let signstr = hex_md5(params);

                            let jsonParam = {
                                userID: 0,
                                gameID: 214500,
                                openID: res.data.openid,
                                session: res.data.session_key,
                                thirdFlag: 1,
                                sign: signstr
                            };

                            wx.request({
                                method: "POST",
                                url: "http://alphavsuser.matchvs.com/wc6/thirdBind.do?",
                                data: JSON.stringify(jsonParam),
                                header: {
                                    "content-type": "application/json" // 默认值
                                },
                                success: function (res) {

                                    if (res.data.status === 0) {
                                        cc.log("绑定成功")
                                    }

                                    common.userID = res.data.data.userid;
                                    common.token = res.data.data.token;

                                    cc.log("绑定状态：" + res.data.status + "-----" + "matchvs登录的id和token" + common.userID + " " + common.token);

                                    let DeviceID = "abcdef";
                                    let gatewayID = 0;
                                    let gameVersion = 1;

                                    cc.log("开始登录，登录id" + common.userID);

                                    theEngine.login(common.userID, common.token, 214500, gameVersion,
                                        "3e4355f5e5164b5aadd654d7326e360b#M", "95374aa3ce46498e8f317d153f275cb7", DeviceID, gatewayID);

                                },
                                fail: function (res) {
                                    cc.log(JSON.stringify(res.data))
                                }
                            });
                        },

                        fail: function (res) {
                            cc.log("getOpenID failed" + res.data);
                        }
                    });
                } else {
                    cc.log("登录失败！" + res.errMsg)
                }
            }
        });

    },

    isTheFirstLogin: function () {
        let gameID = this.gameID;
        let signCode = this.signCode;

        let keyList = [{
            key: "isYourFirstPlay"
        }]
        wx.request({
            url: "http://alphavsopen.matchvs.com/wc5/getUserData.do?",
            method: "GET",
            data: {
                gameID: gameID,
                userID: common.userID,
                keyList: keyList,
                sign: signCode
            },

            header: {
                "content-type": "application/json" // 默认值
            },
            success: function (res) {

                let strArray = JSON.stringify(res.data.data.dataList).split("\"");
                let isYourFirstPlay = parseInt(strArray[strArray.length - 2]);
                common.isYourFirstPlay = isYourFirstPlay;
                if (isYourFirstPlay === -1) {
                    cc.log("你不是第一次登录" + res.errMsg + res.data.status + " " + "=======" + isYourFirstPlay);

                } else if(common.query.length === 0){
                    cc.log("你是第一次登录，开始初始化" + " " + res.errMsg + res.data.status + "=======" + isYourFirstPlay);

                    let dataList2 = [{
                        key: "isYourFirstPlay",
                        value: -1
                    }, {
                        key: "coinNum",
                        value: 100
                    },
                    {
                        key: "lifeNum",
                        value: 5
                    }, {
                        key: "speedToolNum",
                        value: 0
                    }, {
                        key: "relifeToolNum",
                        value: 0
                    },
                    {
                        key: "winNum",
                        value: 0
                    }, {
                        key: "loseNum",
                        value: 0
                    }, {
                        key: "tie",
                        value: 0
                    }
                    ];
                    wx.request({

                        url: "http://alphavsopen.matchvs.com/wc5/setUserData.do?",
                        method: "GET",
                        data: {
                            gameID: gameID,
                            userID: common.userID,
                            dataList: dataList2,
                            sign: signCode
                        },
                        header: {
                            "content-type": "application/json" // 默认值
                        },
                        success: function (res) {
                            
                            cc.log("初始化成功" + res.data);

                        },
                        fail: function (res) {
                            cc.log("初始化失败" + res.errMsg);
                        }
                    });
                }else {

                    cc.log("你是第一次登录，并且通过好友链接进入游戏，双方金币数加500");

                    let dataList2 = [{
                        key: "isYourFirstPlay",
                        value: -1
                    }, {
                        key: "coinNum",
                        value: 500
                    },
                    {
                        key: "lifeNum",
                        value: 5
                    }, {
                        key: "speedToolNum",
                        value: 0
                    }, {
                        key: "relifeToolNum",
                        value: 0
                    },
                    {
                        key: "winNum",
                        value: 0
                    }, {
                        key: "loseNum",
                        value: 0
                    }, {
                        key: "tie",
                        value: 0
                    }
                    ];
                    wx.request({

                        url: "http://alphavsopen.matchvs.com/wc5/setUserData.do?",
                        method: "GET",
                        data: {
                            gameID: gameID,
                            userID: common.userID,
                            dataList: dataList2,
                            sign: signCode
                        },
                        header: {
                            "content-type": "application/json" // 默认值
                        },
                        success: function (res) {
                           
                            cc.log("初始化成功" + res.data);

                        },
                        fail: function (res) {
                            cc.log("初始化失败" + res.errMsg);
                        }
                    });

                    //邀请方金币数加500
                    let sign2 = common.appkey + "&gameID=" + common.gameID + "&userID=" + common.query[3] + "&" + common.query[4];
                    let signCode2 = hex_md5(sign2);
            
                    let coinNumList2 = [{
                        key: "coinNum"
                    }]
                    wx.request({
                        url: "http://alphavsopen.matchvs.com/wc5/getUserData.do?",
                        method: "GET",
                        data: {
                            gameID: common.gameID,
                            userID: common.query[3],
                            keyList: coinNumList2,
                            sign: signCode2,
                        },
            
                        header: {
                            "content-type": "application/json" // 默认值
                        },
                        success: function (res) {
                            let strArray = JSON.stringify(res.data.data.dataList).split("\"");
                            let coinNum = parseInt(strArray[strArray.length - 2]);
                    
                            coinNum = coinNum + 500;

                            let dataList3 = [{
                                key: "coinNum",
                                value: coinNum
                            }
                            ];

                            wx.request({
                                url: "http://alphavsopen.matchvs.com/wc5/setUserData.do?",
                                method: "GET",
                                data: {
                                    gameID: common.gameID,
                                    userID: common.query[3],
                                    keyList: dataList3,
                                    sign: signCode2,
                                },
                    
                                header: {
                                    "content-type": "application/json" // 默认值
                                },
                                success: function (res) {
                                    cc.log("加500金币成功-------------" + res + " " + coinNum);
              
                                },
                            });
      
                        },
                    });

                }

            },

            fail: function (res) {
                cc.log("请求失败" + res.errMsg);
            }

        });
    }
});
