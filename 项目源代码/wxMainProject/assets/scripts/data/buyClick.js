let common = require("Common");

cc.Class({
    extends: cc.Component,

    properties: {
        alert: null, // prefab
        enterButton: null, // 确定按钮
        animSpeed: 0.05, // 动画速度
        warning: cc.Label,
    },

    findAndRefresh: function (coin, life) {
        let node = cc.find("const").getComponent("addPersistNode");
        node.refresh(coin, life);
    },

    alertShow: function (warningString) {
        // 引用
        let self = this;
        // 加载 prefab 创建
        cc.loader.loadRes("prefabs/AlertWarning", cc.Prefab, function (error, prefab) {
            if (error) {
                return;
            }
            // 实例 
            let alertB = cc.instantiate(prefab);
            // Alert 持有
            self.alert = alertB;
            // 动画 
            let cbFadeOut = cc.callFunc(self.onFadeOutFinish, self);
            let cbFadeIn = cc.callFunc(self.onFadeInFinish, self);
            self.actionFadeIn = cc.sequence(cc.spawn(cc.fadeTo(self.animSpeed, 255), cc.scaleTo(self.animSpeed, 1.0)), cbFadeIn);
            self.actionFadeOut = cc.sequence(cc.spawn(cc.fadeTo(self.animSpeed, 0), cc.scaleTo(self.animSpeed, 2.0)), cbFadeOut);
            // 获取子节点
            self.enterButton = cc.find("alertBackground/enterButton", alertB);
            self.warning = cc.find("alertBackground/warning", alertB).getComponent(cc.Label);
            self.warning.string = warningString;
            // 添加点击事件
            self.enterButton.on("click", self.onButtonClicked, self);
            // 父视图
            self.alert.parent = cc.find("Canvas");
            // 展现 alert
            self.startFadeIn();
        });
        // 执行弹进动画
        self.startFadeIn = function () {
            cc.eventManager.pauseTarget(self.alert, true);
            self.alert.position = cc.p(0, 0);
            self.alert.setScale(2);
            self.alert.opacity = 0;
            self.alert.runAction(self.actionFadeIn);
        };
        // 执行弹出动画
        self.startFadeOut = function () {
            cc.eventManager.pauseTarget(self.alert, true);
            self.alert.runAction(self.actionFadeOut);
        };
        // 弹进动画完成回调
        self.onFadeInFinish = function () {
            cc.eventManager.resumeTarget(self.alert, true);
        };
        // 弹出动画完成回调
        self.onFadeOutFinish = function () {
            self.onDestory();
        };
        // 按钮点击事件
        self.onButtonClicked = function (event) {
            if (event.target.name === "enterButton") {
                self.startFadeOut();
            }
        };
        // 销毁 alert 
        self.onDestory = function () {
            self.alert.destroy();
            self.alert = null;
            self.enterButton = null;
            self.animSpeed = 0.05;
        };
    },

    buyOneSpeed: function () {
        if (common.speedToolPrice > common.coinNum) {
            //console.log("this is buyonespeed function....");
            let warningString = "金币数不足！";
            this.alertShow(warningString);
        } else {
            common.coinNum = common.coinNum - common.speedToolPrice;
            common.speedToolNum = common.speedToolNum + 1;
            this.findAndRefresh(common.coinNum, common.lifeNum);
        }
    },

    buyTowSpeed: function () {
        if (2 * common.speedToolPrice > common.coinNum) {
            let warningString = "金币数不足！";
            this.alertShow(warningString);
        } else {
            common.coinNum = common.coinNum - 2 * common.speedToolPrice;
            common.speedToolNum = common.speedToolNum + 2;
            this.findAndRefresh(common.coinNum, common.lifeNum);
        }
    },

    buyOneRelife: function () {
        if (common.relifeToolPrice > common.coinNum) {
            let warningString = "金币数不足！";
            this.alertShow(warningString);
        } else {
            common.coinNum = common.coinNum - common.relifeToolPrice;
            common.relifeToolNum = common.relifeToolNum + 1;
            this.findAndRefresh(common.coinNum, common.lifeNum);
        }
    },

    buyTowRelife: function () {
        if (2 * common.relifeToolPrice > common.coinNum) {
            let warningString = "金币数不足！";
            this.alertShow(warningString);
        } else {
            common.coinNum = common.coinNum - 2 * common.relifeToolPrice;
            common.relifeToolNum = common.relifeToolNum + 2;
            this.findAndRefresh(common.coinNum, common.lifeNum);
        }
    },

    buyOnelife: function () {
        if (common.lifePrice > common.coinNum) {
            let warningString = "金币数不足！";
            this.alertShow(warningString);
        } else if (common.lifeNum + 1 > common.userLifeLimit) {
            let warningString = "生命值超出购买上限common.userLifeLimit！";
            this.alertShow(warningString);
        } else {
            common.coinNum = common.coinNum - 1 * common.lifePrice;
            common.lifeNum = common.lifeNum + 1;
            this.findAndRefresh(common.coinNum, common.lifeNum);
        }
    },

    buyTowlife: function () {
        if (2 * common.lifePrice > common.coinNum) {
            let warningString = "金币数不足！";
            this.alertShow(warningString);
        } else if (common.lifeNum + 2 > common.userLifeLimit) {
            let warningString = "生命值超出购买上限common.userLifeLimit！";
            this.alertShow(warningString);
        } else {
            common.coinNum = common.coinNum - 2 * common.lifePrice;
            common.lifeNum = common.lifeNum + 2;
            this.findAndRefresh(common.coinNum, common.lifeNum);
        }
    },

    buyThreelife: function () {
        if (3 * common.lifePrice > common.coinNum) {
            let warningString = "金币数不足！";
            this.alertShow(warningString);
        } else if (common.lifeNum + 3 > common.userLifeLimit) {
            let warningString = "生命值超出购买上限common.userLifeLimit！";
            this.alertShow(warningString);
        } else {
            common.coinNum = common.coinNum - 3 * common.lifePrice;
            common.lifeNum = common.lifeNum + 3;
            this.findAndRefresh(common.coinNum, common.lifeNum);
        }
    },

    buyFourlife: function () {
        if (4 * common.lifePrice > common.coinNum) {
            let warningString = "金币数不足！";
            this.alertShow(warningString);
        } else if (common.lifeNum + 4 > common.userLifeLimit) {
            let warningString = "生命值超出购买上限common.userLifeLimit！";
            this.alertShow(warningString);
        } else {
            common.coinNum = common.coinNum - 4 * common.lifePrice;
            common.lifeNum = common.lifeNum + 4;
            this.findAndRefresh(common.coinNum, common.lifeNum);
        }
    },

    buyFivelife: function () {
        if (5 * common.lifePrice > common.coinNum) {
            let warningString = "金币数不足！";
            this.alertShow(warningString);
        } else if (common.lifeNum + 5 > common.userLifeLimit) {
            let warningString = "生命值超出购买上限common.userLifeLimit！";
            this.alertShow(warningString);
        } else {
            common.coinNum = common.coinNum - 5 * common.lifePrice;
            common.lifeNum = common.lifeNum + 5;
            this.findAndRefresh(common.coinNum, common.lifeNum);
        }
    }
})
