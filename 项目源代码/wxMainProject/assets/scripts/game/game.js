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
        spriteFrame1: {
            default: null,
            type: cc.SpriteFrame
        },
        spriteFrame2: {
            default: null,
            type: cc.SpriteFrame
        },
        spriteFrame3: {
            default: null,
            type: cc.SpriteFrame
        },
        spriteFrame4: {
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
        let node = cc.find("const");
        node.active = false;
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
            } else if (common.myZone === 3) {
                this.mPlayer.x = this.zone3.x;
                this.mPlayer.y = this.zone3.y;
            } else if (common.myZone === 4) {
                this.mPlayer.x = this.zone4.x;
                this.mPlayer.y = this.zone4.y;
            }
        }

        let data = JSON.stringify({
            otherZone: common.myZone,
            x: this.mPlayer.x,
            y: this.mPlayer.y,
        });
        myImport.engine.sendEvent(data);
    },

    init() {
        if (common.userList.length === 2) {
            myImport.rsp.sendEventNotify = this.sendEventNotify1V1.bind(this);
        } else {
            myImport.rsp.sendEventNotify = this.sendEventNotify2V2.bind(this);
        }
        myImport.rsp.sendEventResponse = this.sendEventResponseMove.bind(this);
    },

    playerBirth() {
        let parent = cc.find("Canvas/bg/other");
        if (common.userList.length === 2) {
            this.otherNode = cc.instantiate(this.otherPrefab);
            parent.addChild(this.otherNode);
            for (let i = 0; i < common.userList.length; i++) {
                if (myImport.engine.mUserID === common.userList[i]) {
                    common.myZone = 1;
                    break;
                } else {
                    common.myZone = 4;
                    break;
                }
            }
            if (common.myZone === 1) {
                this.mPlayer.x = this.zone1.x;
                this.mPlayer.y = this.zone1.y;
                this.otherNode.x = this.zone4.x;
                this.otherNode.y = this.zone4.y;
                common.myColor = 0;
                this.mPlayer.getComponent(cc.Sprite).spriteFrame = this.spriteFrame1;
                this.otherNode.getComponent(cc.Sprite).spriteFrame = this.spriteFrame4;
            } else {
                this.mPlayer.x = this.zone4.x;
                this.mPlayer.y = this.zone4.y;
                this.otherNode.x = this.zone1.x;
                this.otherNode.y = this.zone1.y;
                common.myColor = 1;
                this.mPlayer.getComponent(cc.Sprite).spriteFrame = this.spriteFrame4;
                this.otherNode.getComponent(cc.Sprite).spriteFrame = this.spriteFrame1;
            }
        }

        if (common.userList.length === 4) {
            this.zone2.active = true;
            this.zone3.active = true;
            this.otherNode1 = cc.instantiate(this.otherPrefab);
            parent.addChild(this.otherNode1);
            this.otherNode2 = cc.instantiate(this.otherPrefab);
            parent.addChild(this.otherNode2);
            this.otherNode3 = cc.instantiate(this.otherPrefab);
            parent.addChild(this.otherNode3);
            this.otherNode4 = cc.instantiate(this.otherPrefab);
            parent.addChild(this.otherNode4);
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
                this.otherNode1.active = false;
                this.otherNode2.x = this.zone2.x;
                this.otherNode2.y = this.zone2.y;
                this.otherNode3.x = this.zone3.x;
                this.otherNode3.y = this.zone3.y;
                this.otherNode4.x = this.zone4.x;
                this.otherNode4.y = this.zone4.y;
                this.mPlayer.getComponent(cc.Sprite).spriteFrame = this.spriteFrame1;
                this.otherNode2.getComponent(cc.Sprite).spriteFrame = this.spriteFrame2;
                this.otherNode3.getComponent(cc.Sprite).spriteFrame = this.spriteFrame3;
                this.otherNode4.getComponent(cc.Sprite).spriteFrame = this.spriteFrame4;
            } else if (common.myZone === 2) {
                this.mPlayer.x = this.zone2.x;
                this.mPlayer.y = this.zone2.y;
                common.myColor = 0;
                this.otherNode2.active = false;
                this.otherNode1.x = this.zone1.x;
                this.otherNode1.y = this.zone1.y;
                this.otherNode3.x = this.zone3.x;
                this.otherNode3.y = this.zone3.y;
                this.otherNode4.x = this.zone4.x;
                this.otherNode4.y = this.zone4.y;
                this.mPlayer.getComponent(cc.Sprite).spriteFrame = this.spriteFrame2;
                this.otherNode1.getComponent(cc.Sprite).spriteFrame = this.spriteFrame1;
                this.otherNode3.getComponent(cc.Sprite).spriteFrame = this.spriteFrame3;
                this.otherNode4.getComponent(cc.Sprite).spriteFrame = this.spriteFrame4;
            } else if (common.myZone === 3) {
                this.mPlayer.x = this.zone3.x;
                this.mPlayer.y = this.zone3.y;
                common.myColor = 1;
                this.otherNode3.active = false;
                this.otherNode1.x = this.zone1.x;
                this.otherNode1.y = this.zone1.y;
                this.otherNode2.x = this.zone2.x;
                this.otherNode2.y = this.zone2.y;
                this.otherNode4.x = this.zone4.x;
                this.otherNode4.y = this.zone4.y;
                this.mPlayer.getComponent(cc.Sprite).spriteFrame = this.spriteFrame3;
                this.otherNode2.getComponent(cc.Sprite).spriteFrame = this.spriteFrame2;
                this.otherNode1.getComponent(cc.Sprite).spriteFrame = this.spriteFrame1;
                this.otherNode4.getComponent(cc.Sprite).spriteFrame = this.spriteFrame4;
            } else if (common.myZone === 4) {
                this.mPlayer.x = this.zone4.x;
                this.mPlayer.y = this.zone4.y;
                common.myColor = 1;
                this.otherNode4.active = false;
                this.otherNode1.x = this.zone1.x;
                this.otherNode1.y = this.zone1.y;
                this.otherNode2.x = this.zone2.x;
                this.otherNode2.y = this.zone2.y;
                this.otherNode3.x = this.zone3.x;
                this.otherNode3.y = this.zone3.y;
                this.mPlayer.getComponent(cc.Sprite).spriteFrame = this.spriteFrame4;
                this.otherNode2.getComponent(cc.Sprite).spriteFrame = this.spriteFrame2;
                this.otherNode3.getComponent(cc.Sprite).spriteFrame = this.spriteFrame3;
                this.otherNode1.getComponent(cc.Sprite).spriteFrame = this.spriteFrame1;
            }
        }
    },

    sendEventNotify1V1: function (eventInfo) {
        let data = JSON.parse(eventInfo.cpProto);
        this.otherNode.x = data.x;
        this.otherNode.y = data.y;
    },

    sendEventNotify2V2: function (eventInfo) {
        let data = JSON.parse(eventInfo.cpProto);
        if (data.otherZone === 1) {
            this.otherNode1.x = data.x;
            this.otherNode1.y = data.y;
        } else if (data.otherZone === 2) {
            this.otherNode2.x = data.x;
            this.otherNode2.y = data.y;
        } else if (data.otherZone === 3) {
            this.otherNode3.x = data.x;
            this.otherNode3.y = data.y;
        } else if (data.otherZone === 4) {
            this.otherNode4.x = data.x;
            this.otherNode4.y = data.y;
        }
    },

    sendEventResponseMove: function (sendEventRsp) { //
    },

    backLobby: function () {
        let node = cc.find("const");
        node.active = true;
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
