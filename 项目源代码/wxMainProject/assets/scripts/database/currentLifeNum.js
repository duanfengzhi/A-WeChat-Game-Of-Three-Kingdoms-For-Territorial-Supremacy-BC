let common = require("Common");

cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad() {
        if (common.lifeNum > 0) {
            this.startGame();
        }
    },

    findAndRefresh: function (coin, life) {
        let node = cc.find("const").getComponent("addPersistNode");
        node.refresh(coin, life);
    },

    startGame: function () {
        let sign = common.appkey + "&gameID=" + common.gameID + "&userID=" + common.userID + "&" + common.token;
        let signCode = hex_md5(sign);

        let lifeNumList = [{
            key: "lifeNum"
        }]
        wx.request({
            url: "http://alphavsopen.matchvs.com/wc5/getUserData.do?",
            method: "GET",
            data: {
                gameID: common.gameID,
                userID: common.userID,
                keyList: lifeNumList,
                sign: signCode
            },

            header: {
                "content-type": "application/json" // 默认值
            },
            success: function (res) {
                let strArray = JSON.stringify(res.data.data.dataList).split("\"");
                let lifeNum = parseInt(strArray[strArray.length - 2]);
                common.lifeNum = lifeNum;
            },
        });
        common.lifeNum = common.lifeNum - 1; //每局匹配，生命值减1
        this.findAndRefresh(common.coinNum, common.lifeNum);
    },
});
