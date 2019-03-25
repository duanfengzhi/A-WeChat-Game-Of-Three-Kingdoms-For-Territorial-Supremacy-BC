let common = require("Common");

cc.Class({
    extends: cc.Component,

    properties: {
        alert: null, // prefab
        detailLabel: null, // 内容
        cancelButton: null, // 确定按钮
        enterButton: null, // 取消按钮
        animSpeed: 0.05 // 动画速度
    },

    findAndRefresh: function (coin, life) {
        let node = cc.find("const").getComponent("addPersistNode");
        node.refresh(coin, life);
    },

    show: function (price) {
        // 引用
        let self = this;
        // 加载 prefab 创建
        cc.loader.loadRes("prefabs/Alert", cc.Prefab, function (error, prefab) {
            if (error) {
                cc.error(error);
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
            self.detailLabel = cc.find( "alertBackground/detailLabel", alertB).getComponent(cc.Label);
            self.cancelButton = cc.find("alertBackground/cancelButton", alertB);
            self.enterButton = cc.find("alertBackground/enterButton", alertB);
            // 添加点击事件
            self.enterButton.on("click", self.onButtonClicked, self);
            self.cancelButton.on("click", self.onButtonClicked, self);
            // 父视图
            self.alert.parent = cc.find("Canvas");
            // 展现 alert
            self.startFadeIn();
            // 参数
            self.configAlert();

        });

        // 参数
        self.configAlert = function () {
            let detailString = "确认付款";
            // 内容
            self.detailLabel.string = detailString;
        };

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
                common.coinNum = common.coinNum + price;
                self.findAndRefresh(common.coinNum, common.lifeNum);
            }
            self.startFadeOut();
        };

        // 销毁 alert 
        self.onDestory = function () {
            self.alert.destroy();
            self.alert = null;
            self.detailLabel = null;
            self.cancelButton = null;
            self.enterButton = null;
            self.animSpeed = 0.05;
        };
    },

    showOne: function () {
        this.show(500);
    },

    showTow: function () {
        this.show(1000);
    },

    showThree: function () {
        this.show(1500);
    },

    showFour: function () {
        this.show(2000);
    },

    showFive: function () {
        this.show(2500);
    }
});
