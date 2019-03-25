let common = require("Common");

cc.Class({
    extends: cc.Component,

    properties: {
        coin: cc.Label,
        life: cc.Label,
        coinNum: null,
        lifeNum: null,
        time: 1200,
    },

    onLoad() {
        this.getInfo(); //获取服务器中的数据
        cc.game.addPersistRootNode(this.node);
    },

    getInfo: function () {
        let sign = common.appkey + "&gameID=" + common.gameID + "&userID=" + common.userID + "&" + common.token;
        let signCode = hex_md5(sign);

        let coin = this.coin;
        let life = this.life;

        let coinNumList = [{
            key: "coinNum"
        }]
        wx.request({
            url: "http://alphavsopen.matchvs.com/wc5/getUserData.do?",
            method: "GET",
            data: {
                gameID: common.gameID,
                userID: common.userID,
                keyList: coinNumList,
                sign: signCode
            },

            header: {
                "content-type": "application/json" // 默认值
            },
            success: function (res) {
                let strArray = JSON.stringify(res.data.data.dataList).split("\"");
                let coinNum = parseInt(strArray[strArray.length - 2]);
                this.coinNum = coinNum;
                common.coinNum = coinNum;
                coin.string = this.coinNum;
            },
        });

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
                this.lifeNum = lifeNum;
                common.lifeNum = lifeNum;
                life.string = this.lifeNum;
            },
        });

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
            },
        });

        let winNumList = [{
            key: "winNum"
        }]
        wx.request({
            url: "http://alphavsopen.matchvs.com/wc5/getUserData.do?",
            method: "GET",
            data: {
                gameID: common.gameID,
                userID: common.userID,
                keyList: winNumList,
                sign: signCode
            },

            header: {
                "content-type": "application/json" // 默认值
            },
            success: function (res) {

                let strArray = JSON.stringify(res.data.data.dataList).split("\"");
                let winNum = parseInt(strArray[strArray.length - 2]);
                common.winNum = winNum;
            },
        });

        let loseNumList = [{
            key: "loseNum"
        }]
        wx.request({
            url: "http://alphavsopen.matchvs.com/wc5/getUserData.do?",
            method: "GET",
            data: {
                gameID: common.gameID,
                userID: common.userID,
                keyList: loseNumList,
                sign: signCode
            },

            header: {
                "content-type": "application/json" // 默认值
            },
            success: function (res) {

                let strArray = JSON.stringify(res.data.data.dataList).split("\"");
                let loseNum = parseInt(strArray[strArray.length - 2]);
                common.loseNum = loseNum;
            },
        });

        let tieList = [{
            key: "tie"
        }]
        wx.request({
            url: "http://alphavsopen.matchvs.com/wc5/getUserData.do?",
            method: "GET",
            data: {
                gameID: common.gameID,
                userID: common.userID,
                keyList: tieList,
                sign: signCode
            },

            header: {
                "content-type": "application/json" // 默认值
            },
            success: function (res) {
                let strArray = JSON.stringify(res.data.data.dataList).split("\"");
                let tie = parseInt(strArray[strArray.length - 2]);
                common.tie = tie;
            },
        });
    },

    setInfo: function () {
        let sign = common.appkey + "&gameID=" + common.gameID + "&userID=" + common.userID + "&" + common.token;
        let signCode = hex_md5(sign);

        let dataList = [{
            key: "coinNum",
            value: common.coinNum
        }, {
            key: "lifeNum",
            value: common.lifeNum
        },
        {
            key: "speedToolNum",
            value: common.speedToolNum
        }, {
            key: "relifeToolNum",
            value: common.relifeToolNum
        }
        ];
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

    refresh: function (coinNum, lifeNum) {
        this.coin.string = parseInt(coinNum);
        this.life.string = parseInt(lifeNum);

        this.setInfo();

        if (lifeNum < 5) {
            this.callback = function () {
                if (this.time === 1) {
                    this.unschedule(this.callback);
                    this.time = 1200;
                    common.lifeNum = common.lifeNum + 1;

                    this.refresh(common.coinNum, common.lifeNum);
                }
                this.time -= 1;
            }
            this.schedule(this.callback, 1);
        } else {
            return;
        }
    }
});
