//资源导入
let matchvs = require("matchvs.all");
let login = require("login");
let comment = require("Common");
//全局变量
let engine = null;
let response = null;
let sendMsg = null;
let roomMsg = null;
let useInfo = null;
let buttonMsg = null;
let userList = new Array();
let userBox = new Array();

let player = cc.Class({
    id: Number,
    state: Boolean,
    username: String,
    avatarUrl: String,

    ctor: function (uid, ustate, uname, uavaUrl) {
        this.id = uid;
        this.state = ustate;
        this.username = uname;
        this.avatarUrl = uavaUrl;
    }
});

cc.Class({
    extends: cc.Component,

    properties: {
        //必须挂载的信息
        boxNow: cc.Node,
        gtvNow: cc.Node,
        btnNow: cc.Node,
        userPrefab: cc.Prefab,
        userPhoto: cc.SpriteFrame,
        //必须赋值的信息
        maxPlayer: Number,
        mode: Number,
        tags: String
    },

    returnLobby: function () {
        cc.director.loadScene("lobby");
    },

    loadInit: function () {
        engine = login.engine;
        response = login.rsp;
        this.initUserList();
        this.drawUser();

        useInfo = new player(engine.mUserID, false, comment.username, comment.avatarUrl);
        //匹配房间绑定回调函数
        response.joinRoomResponse = this.joinRoomResponse.bind(this);
        response.joinRoomNotify = this.joinRoomNotify.bind(this);
        //发送全局信息绑定回调函数
        response.sendEventResponse = this.sendEventResponseRoom.bind(this);
        response.sendEventNotify = this.sendEventNotifyRoom.bind(this);
        //离开房间绑定回调函数
        response.leaveRoomResponse = this.leaveRoomResponseRoom.bind(this);
        response.leaveRoomNotify = this.leaveRoomNotifyRoom.bind(this);
    },

    //点击实时对战场景按钮，调用该函数
    enterPattern: function (event, customEventData) {
        let data = JSON.parse(customEventData);
        //初始化
        this.maxPlayer = parseInt(data.maxPlayer);
        this.mode = parseInt(data.mode);
        this.tags = data.tags;
        let matchinfo = this.initMacthinfo(this.maxPlayer, this.mode, {
            "title": this.tags
        });

        this.loadInit();
        this.joinRoomWithProperties(matchinfo);
    },

    //点击准备\开始游戏按钮，调用该函数
    enterFunction: function () {
        if (buttonMsg === "开始游戏") {
            this.sendEvent("Start", []);
            this.startGame();
            return;
        }
        if (buttonMsg === "取消准备" || buttonMsg === "准备") {
            this.sendEvent("Ready", engine.mUserID);
            return;
        }
    },

    //点击切换阵营按钮，调用该函数
    enterCamp: function () {
        let campChange = this.isCanChange(engine.mUserID);
        if (campChange[0]) {
            this.sendEvent("Camp", [campChange[1], campChange[2]]);
        }
    },

    //随机匹配用户房间，若服务器有房间人数未满的房间，则加入该房间，否则新建新的房间
    joinRoomWithProperties: function (matchinfo) {
        let userIdStr = engine.mUserID.toString();
        engine.joinRoomWithProperties(matchinfo, userIdStr);
    },

    //随机匹配用户房间的回调函数
    joinRoomResponse: function (status, roomUserInfoList, roomInfo) {
        if (status === 200) {
            //保存房间相关的信息
            roomMsg = roomInfo;
            if (roomUserInfoList.length === 0) {
                userList[0] = useInfo;
                this.listToBox();
            } else {
                this.sendEvent("New User", useInfo);
            }
            //房间界面跳转
            this.boxNow.active = false;
            this.gtvNow.active = true;
            this.btnNow.active = false;
            this.drawRoom();
        }
    },

    //监听房间人员是否发生变动
    joinRoomNotify: function (roomUserInfo) { //
    },

    //当前用户对房间内其他人员发送信息
    sendEvent: function (msgType, msgCentent) {
        sendMsg = JSON.stringify({
            "msgType": msgType,
            "msgCentent": msgCentent
        });
        engine.sendEvent(sendMsg);
    },

    //当前用户对房间内其他人员发送信息的回调函数
    sendEventResponseRoom: function (sendEventRsp) { //
    },

    //监听房间内其他玩家发送的信息
    sendEventNotifyRoom: function (eventInfo) {
        this.doSomethingWithMsg(eventInfo.cpProto)
    },

    //玩家离开房间
    leaveRoom: function () {
        let result = engine.leaveRoom("User Local");
        if (result === 0) {
            this.boxNow.active = true;
            this.gtvNow.active = false;
            this.btnNow.active = true;
        }
    },

    //玩家离开房间的回调函数
    leaveRoomResponseRoom: function (leaveRoomRsp) { //
    },

    //监听房间内其他玩家离开房间的信息
    leaveRoomNotifyRoom: function (leaveRoomInfo) {
        roomMsg.ownerId = leaveRoomInfo.owner;
        this.drawRoom();
        this.deleteUser(leaveRoomInfo.userID);
        this.listToBox();
    },

    //初始化实时对战模式的房间信息
    initMacthinfo: function (maxPlayer, mode, tags) {
        let matchinfo = new matchvs.MsMatchInfo();
        matchinfo.maxPlayer = maxPlayer;
        matchinfo.mode = mode;
        matchinfo.canWatch = 2;
        matchinfo.tags = tags;
        return matchinfo;
    },

    //初始化用户列表
    initUserList: function () {
        userList = new Array();
        for (let i = 0; i < this.maxPlayer; i++) {
            let user = new player(-1, false, null, null);
            userList.push(user);
        }
    },

    //分配玩家阵营
    allotCamp: function (user) {
        for (let i = 0; i < userList.length; i++) {
            if (userList[i].id === -1) {
                userList[i] = user;
                break;
            }
        }
    },

    //判断用户是否可以切换阵营
    isCanChange: function (userId) {
        let index;
        for (let i = 0; i < this.maxPlayer; i++) {
            if (userId === userList[i].id) {
                index = i;
            }
        }
        if (index < this.maxPlayer / 2) {
            for (let i = this.maxPlayer / 2; i < this.maxPlayer; i++) {
                if (userList[i].id === -1) {
                    return [true, i, index];
                }
            }
        } else {
            for (let i = 0; i < this.maxPlayer / 2; i++) {
                if (userList[i].id === -1) {
                    return [true, i, index];
                }
            }
        }
        return [false];
    },

    //判断用户是否是当前用户的房主
    isOwner: function (userID) {
        if (userID !== roomMsg.ownerId) {
            return false;
        }
        return true;
    },

    //绘制房间的基本信息
    drawRoom: function () {
        let gamePattern = cc.find("useBox/gamePattern", this.gtvNow);
        gamePattern.getComponent(cc.Label).string = "房间模式：" + this.tags;
        let maxPlayer = cc.find("useBox/maxPlayer", this.gtvNow);
        maxPlayer.getComponent(cc.Label).string = "提示信息：" + "XXXXXXXXX";
        let roomOwner = cc.find("useBox/roomOwner", this.gtvNow);
        roomOwner.getComponent(cc.Label).string = "房主信息：" + roomMsg.ownerId;
        let playId = cc.find("useBox/playId", this.gtvNow);
        playId.getComponent(cc.Label).string = "当前玩家：" + engine.mUserID;
    },

    //根据预制体生成用户头像
    drawUser: function () {
        this.destroyUser();
        userBox = new Array();
        let campleft = cc.find("campBox/campLeft/userList", this.gtvNow);
        let campright = cc.find("campBox/campRight/userList", this.gtvNow);
        for (let i = 0; i < this.maxPlayer; i++) {
            let node = cc.instantiate(this.userPrefab);
            if (i < this.maxPlayer / 2) {
                node.parent = campleft;
            } else {
                node.parent = campright;
            }
            userBox.push(node);
        }
    },

    //绘制按钮
    drawButton: function () {
        let flag = true,
            user;
        let button = cc.find("buttonBox/start-ready/Label", this.gtvNow);

        for (let i = 0; i < this.maxPlayer; i++) {
            if (userList[i].id === engine.mUserID) {
                user = userList[i];
            }
            if (userList[i].state === false && !this.isOwner(userList[i].id)) {
                flag = false
            }
        }

        if (this.isOwner(user.id)) {
            if (flag) {
                button.getComponent(cc.Label).string = "开始游戏";
            } else {
                button.getComponent(cc.Label).string = "等待玩家";
            }

        } else {
            if (user.state) {
                button.getComponent(cc.Label).string = "取消准备";
            } else {
                button.getComponent(cc.Label).string = "准备";
            }
        }
        buttonMsg = button.getComponent(cc.Label).string;
    },

    //销毁不需要的用户头像节点
    destroyUser: function () {
        if (userBox.length === 0) {
            return;
        }
        for (let i = 0; i < userBox.length; i++) {
            userBox[i].destroy();
        }
    },

    //同步用户头像节点和用户信息
    listToBox: function () {
        for (let i = 0; i < this.maxPlayer; i++) {
            let id = cc.find("id", userBox[i]);
            let state = cc.find("state", userBox[i]);
            let owner = cc.find("owner", userBox[i]);
            let photo = cc.find("photo", userBox[i]);
            if (userList[i].id === -1) {
                id.getComponent(cc.Label).string = "USER";
            } else if (userList[i].id === -2) {
                id.getComponent(cc.Label).string = "ROBOT";
            } else {
                id.getComponent(cc.Label).string = userList[i].username;
            }
            if (this.isOwner(userList[i].id)) {
                owner.active = true;
            } else {
                owner.active = false;
            }
            if (userList[i].avatarUrl !== null) {
                let url = userList[i].avatarUrl;
                cc.loader.load({
                    url: url,
                    type: "png"
                }, function (err, img) {
                    let mylogo = new cc.SpriteFrame(img);
                    photo.getComponent(cc.Sprite).spriteFrame = mylogo;
                });
            } else {
                photo.getComponent(cc.Sprite).spriteFrame = this.userPhoto;
            }
            state.active = userList[i].state;
        }
        this.drawButton();
    },

    //根据接收的消息做出不同的回应
    doSomethingWithMsg: function (msg) {
        msg = JSON.parse(msg)
        if (msg.msgType === "New User" && this.isOwner(engine.mUserID)) {
            this.allotCamp(msg.msgCentent);
            this.sendEvent("UserList", userList);
            this.listToBox();
            return;
        }
        if (msg.msgType === "Ready" && this.isOwner(engine.mUserID)) {
            this.setUserState(msg.msgCentent);
            this.sendEvent("UserList", userList);
            this.listToBox();
            return;
        }
        if (msg.msgType === "Camp" && this.isOwner(engine.mUserID)) {
            this.setUserCamp(msg.msgCentent[0], msg.msgCentent[1]);
            this.sendEvent("UserList", userList);
            this.listToBox();
            return;
        }
        if (msg.msgType === "UserList") {
            userList = msg.msgCentent;
            this.listToBox();
            return;
        }
        if (msg.msgType === "Start") {
            this.startGame();
            return;
        }
    },

    //修改玩家状态
    setUserState: function (userId) {
        for (let i = 0; i < userList.length; i++) {
            if (userList[i].id === userId) {
                userList[i].state = !userList[i].state;
                return;
            }
        }
    },

    //修改玩家阵营
    setUserCamp: function (dIndex, sIndex) {
        userList[dIndex] = new player(userList[sIndex].id, userList[sIndex].state,
            userList[sIndex].username, userList[sIndex].avatarUrl);
        userList[sIndex] = new player(-1, false, null, null);
    },

    //删除某个用户信息
    deleteUser: function (userId) {
        for (let i = 0; i < this.maxPlayer; i++) {
            if (userList[i].id === userId) {
                userList[i].id = -1;
                userList[i].state = false;
                userList[i].username = null;
                userList[i].avatarUrl = null;
            }
        }
    },

    //开始游戏函数
    startGame: function () {
        let userComList = new Array();
        for (let i = 0; i < userList.length; i++) {
            userComList.push(userList[i].id)
        }
        comment.userList = userComList;
        comment.pattern = 0;
        if(userList.length === 6) {
            cc.director.loadScene("game3V3");
            return ;
        }
        cc.director.loadScene("game");
    }
});
