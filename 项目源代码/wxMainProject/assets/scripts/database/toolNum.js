let common = require("Common");

cc.Class({
    extends: cc.Component,

    properties: {
        speedTool: cc.Label,
        relifeTool: cc.Label,
    },

    onLoad() {
        this.showTool();
        if (common.speedToolNum === 0) {
            let node = cc.find("accelerate");
            node.active = false;
        }
        if (common.relifeToolNum === 0) {
            let node = cc.find("revive");
            node.active = false;
        }
    },

    showTool: function () {
        this.speedTool.string = common.speedToolNum;
        this.relifeTool.string = common.relifeToolNum;
    },

    speed: function () {
        if (common.speedToolNum >= 1) {
            common.speedToolNum = common.speedToolNum - 1;
            this.setInfo();
            this.showTool();
            if (common.speedToolNum === 0) {
                let node = cc.find("accelerate");
                node.active = false;
            }
        } else {
            let node = cc.find("accelerate");
            node.active = false;
        }

    },

    relife: function () {
        if (common.relifeToolNum >= 1) {
            common.relifeToolNum = common.relifeToolNum - 1;
            this.setInfo();
            this.showTool();
            if (common.relifeToolNum === 0) {
                let node = cc.find("revive");
                node.active = false;
            }
        } else {
            let node = cc.find("revive");
            node.active = false;
        }
    },

    setInfo: function () {
        let sign = common.appkey + "&gameID=" + common.gameID + "&userID=" + common.userID + "&" + common.token;
        let signCode = hex_md5(sign);

        let dataList = [{
            key: "speedToolNum",
            value: common.speedToolNum
        }, {
            key: "relifeToolNum",
            value: common.relifeToolNum
        }];
        wx.request({
            url: "http://alphavsopen.matchvs.com/wc5/setUserData.do?",
            method: "GET",
            data: {
                gameID: common.gameID,
                userID: common.userID,
                dataList: dataList,
                sign: signCode
            },
            header: {
                "content-type": "application/json" // 默认值
            },
        });
    },
});
