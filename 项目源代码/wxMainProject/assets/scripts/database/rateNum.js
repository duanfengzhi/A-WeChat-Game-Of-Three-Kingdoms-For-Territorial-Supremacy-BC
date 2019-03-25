let common = require("Common");

cc.Class({
    extends: cc.Component,

    properties: {},

    rateNum: function () {
        if(common.isWin === true){
            common.winNum = common.winNum + 1;
        } else{
            common.loseNum = common.loseNum + 1;

        }

        this.setInfo();
        this.setWXRateInfo();
    },

    setInfo: function () {
        //每周一零点清空matchvs服务器的胜场、输场、平场的数据
        let data = new Date();
        let today = data.getDay();
        let currentTime = data.toLocaleTimeString();
        let arr = currentTime.split(":");
        let hour = arr[0];
        let min = arr[1];
        let second = arr[2];

        let sign = common.appkey + "&gameID=" + common.gameID + "&userID=" + common.userID + "&" + common.token;
        let signCode = hex_md5(sign);

        let dataList;

        if (today === 1 && hour === 0 && min === 0 && second === 0) {
            dataList = [{
                key: "winNum",
                value: 0
            }, {
                key: "loseNum",
                value: 0
            }, {
                key: "tie",
                value: 0
            }];
        } else {
            dataList = [{
                key: "winNum",
                value: common.winNum
            }, {
                key: "loseNum",
                value: common.loseNum
            }, {
                key: "tie",
                value: common.tie
            }];
        }

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

    setWXRateInfo: function () {
        //胜率每周一零点清空一次
        let data = new Date();
        let today = data.getDay();
        let currentTime = data.toLocaleTimeString();
        let arr = currentTime.split(":");
        let hour = arr[0];
        let min = arr[1];
        let second = arr[2];

        if (today === 1 && hour === 0 && min === 0 && second === 0) {
            common.winNum = 0;
            common.loseNum = 0;
            common.tie = 0;

            wx.setUserCloudStorage({
                KVDataList: [{
                    key: "rate",
                    value: 0
                }],
            });
        }

        //10局以上进入排行榜
        if (common.winNum + common.loseNum + common.tie >= 10) {
            let rate = (common.winNum / (common.winNum + common.loseNum + common.tie) * 100).toFixed(2) + "%";

            wx.setUserCloudStorage({
                KVDataList: [{
                    key: "rate",
                    value: rate
                }],
            });
        }
    },
});
