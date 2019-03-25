let common = require("../start/Common");
let myImport = require("../start/login");

cc.Class({
    extends: cc.Component,

    properties: {
        timeLable: cc.Label,
        backButton: cc.Button,
        gameOver: {
            default: null,
            type: cc.Node
        },
        mPlayer: {
            default: null,
            type: cc.Node
        },
        zone1: {
            default: null,
            type: cc.Node
        },
        zone2: {
            default: null,
            type: cc.Node
        },
        zone3: {
            default: null,
            type: cc.Node
        },
        zone4: {
            default: null,
            type: cc.Node
        },
        robot1: {
            default: null,
            type: cc.Node
        },
        robot2: {
            default: null,
            type: cc.Node
        },
        spriteFrame1: {
            default: null,
            type: cc.SpriteFrame
        },
        spriteFrame2: {
            default: null,
            type: cc.SpriteFrame
        },
        otherPrefab: cc.Prefab,
        time: 300,
    },

    onLoad() {
        this.init();
        this.playerBirth();
        this.timer();
    },

    start() {
        common.isGameOver = 0;
    },

    update() {
        if (this.time === 0) {
            this.gameOver.active = true;
            common.isGameOver = 1;
        }

        if (common.isLife === 1) {
            if (common.myZone === 1) {
                this.mPlayer.x = this.zone1.x;
                this.mPlayer.y = this.zone1.y;
            } else if (common.myZone === 2) {
                this.mPlayer.x = this.zone2.x;
                this.mPlayer.y = this.zone2.y;
            }
        }
        if (common.userList.length === 2) {
            let data = JSON.stringify({
                x: this.mPlayer.x,
                y: this.mPlayer.y,
            });
            myImport.engine.sendEvent(data);
        }
    },

    init() {
        myImport.rsp.sendEventNotify = this.sendEventNotify2V2.bind(this);
        myImport.rsp.sendEventResponse = this.sendEventResponseMove.bind(this);
    },

    playerBirth() {
        let parent = cc.find("Canvas/bg/other");
        if (common.userList.length === 1) {
            common.myZone = 1;
            this.mPlayer.x = this.zone1.x;
            this.mPlayer.y = this.zone1.y;
            this.robot1.x = this.zone4.x;
            this.robot1.y = this.zone4.y;
            common.myColor = 0;
            this.mPlayer.getComponent(cc.Sprite).spriteFrame = this.spriteFrame1;
        }

        if (common.userList.length === 2) {
            this.zone2.active = true;
            this.zone3.active = true;
            this.robot2.active = true;
            this.robot1.x = this.zone4.x;
            this.robot1.y = this.zone4.y;
            this.robot2.x = this.zone3.x;
            this.robot2.y = this.zone3.y;
            this.otherNode = cc.instantiate(this.otherPrefab);
            parent.addChild(this.otherNode);
            for (let i = 0; i < common.userList.length; i++) {
                if (myImport.engine.mUserID === common.userList[i]) {
                    common.myZone = i + 1;
                    break;
                }
            }
            if (common.myZone === 1) {
                this.mPlayer.x = this.zone1.x;
                this.mPlayer.y = this.zone1.y;
                common.myColor = 0;
                this.otherNode.x = this.zone2.x;
                this.otherNode.y = this.zone2.y;
                this.mPlayer.getComponent(cc.Sprite).spriteFrame = this.spriteFrame1;
                this.otherNode.getComponent(cc.Sprite).spriteFrame = this.spriteFrame2;
            } else if (common.myZone === 2) {
                this.mPlayer.x = this.zone2.x;
                this.mPlayer.y = this.zone2.y;
                common.myColor = 0;
                this.otherNode.x = this.zone1.x;
                this.otherNode.y = this.zone1.y;
                this.mPlayer.getComponent(cc.Sprite).spriteFrame = this.spriteFrame2;
                this.otherNode.getComponent(cc.Sprite).spriteFrame = this.spriteFrame1;
            }
        }
    },

    sendEventNotify2V2: function (eventInfo) {
        let data = JSON.parse(eventInfo.cpProto);
        this.otherNode.x = data.x;
        this.otherNode.y = data.y;
    },

    sendEventResponseMove: function (sendEventRsp) { //
    },

    backLobby: function () {
        cc.director.loadScene("lobby");
    },

    timer() {
        //计时器
        this.timeLable.string = parseInt(this.time / 60) + ":" + this.time % 60;
        this.backButton.node.on("click", this.backLobby, this);
        this.callback = function () {
            if (this.time === 1) {
                this.unschedule(this.callback);
            }
            this.time -= 1;
            this.timeLable.string = parseInt(this.time / 60) + ":" + this.time % 60;
        }
        this.schedule(this.callback, 1);
    }
});
