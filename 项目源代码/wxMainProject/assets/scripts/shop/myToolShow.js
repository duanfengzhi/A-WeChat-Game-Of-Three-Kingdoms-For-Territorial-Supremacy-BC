let common = require("Common");

cc.Class({
    extends: cc.Component,

    properties: {
        coinButton: cc.Button,
        coinShop: {
            default: null,
            type: cc.Node
        },
        lifeShop: {
            default: null,
            type: cc.Node
        },
        toolShop: {
            default: null,
            type: cc.Node
        },
        toolsShow: {
            default: null,
            type: cc.Node
        },
        speedToolNumLabel: cc.Label,
        relifeToolNumLabel: cc.Label,
    },

    onLoad() {
        this.coinButton.node.on("click", this.enterShopModel, this);
    },

    enterShopModel() {
        this.lifeShop.active = false;
        this.toolShop.active = false;
        this.toolsShow.active = true;
        this.coinShop.active = false;
        this.getInfo();
    },

    getInfo: function () {
        let sign = common.appkey + "&gameID=" + common.gameID + "&userID=" + common.userID + "&" + common.token;
        let signCode = hex_md5(sign);

        let speedToolNumLabel = this.speedToolNumLabel;
        let relifeToolNumLabel = this.relifeToolNumLabel;

        let speedToolNumList = [{
            key: "speedToolNum"
        }]
        wx.request({
            url: "http://alphavsopen.matchvs.com/wc5/getUserData.do?",
            method: "GET",
            data: {
                gameID: common.gameID,
                userID: common.userID,
                keyList: speedToolNumList,
                sign: signCode
            },

            header: {
                "content-type": "application/json" // 默认值
            },
            success: function (res) {
                let strArray = JSON.stringify(res.data.data.dataList).split("\"");
                let speedToolNum = parseInt(strArray[strArray.length - 2]);

                common.speedToolNum = speedToolNum;
                speedToolNumLabel.string = speedToolNum;
            },
        });

        let relifeToolNumList = [{
            key: "relifeToolNum"
        }]
        wx.request({
            url: "http://alphavsopen.matchvs.com/wc5/getUserData.do?",
            method: "GET",
            data: {
                gameID: common.gameID,
                userID: common.userID,
                keyList: relifeToolNumList,
                sign: signCode
            },

            header: {
                "content-type": "application/json" // 默认值
            },
            success: function (res) {
                let strArray = JSON.stringify(res.data.data.dataList).split("\"");
                let relifeToolNum = parseInt(strArray[strArray.length - 2]);

                common.relifeToolNum = relifeToolNum;
                relifeToolNumLabel.string = relifeToolNum;
            },
        });

    },
});
