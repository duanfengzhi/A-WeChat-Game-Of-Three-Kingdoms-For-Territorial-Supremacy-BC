let common = require("Common");

cc.Class({
    extends: cc.Component,

    properties: {
        alert: null, // prefab
        cancelButton: null, // 确定按钮
        enterButton: null, // 取消按钮
        animSpeed: 0.05, // 动画速度
        coinNotEough: null //金币数不足时提示语
    },

    findAndRefresh: function (coin, life) {
        let node = cc.find("const").getComponent("addPersistNode");
        node.refresh(coin, life);
    },
    showCustom: function (detailString, needCancel) {
        // 引用
        let self = this;
        // 加载 prefab 创建
        cc.loader.loadRes("prefabs/AlertCustom", cc.Prefab, function (error, prefab) {

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
            detailString = cc.find("alertBackground/money", alertB).getComponent(cc.EditBox);
            self.cancelButton = cc.find("alertBackground/cancelButton", alertB);
            self.enterButton = cc.find("alertBackground/enterButton", alertB);
            self.coinNotEough = cc.find("alertBackground/coinNotE", alertB).getComponent(cc.Label);

            // 添加点击事件
            self.enterButton.on("click", self.onButtonClicked, self);
            self.cancelButton.on("click", self.onButtonClicked, self);

            // 父视图
            self.alert.parent = cc.find("Canvas");

            // 展现 alert
            self.startFadeIn();

            // 参数
            self.configAlert(detailString, needCancel);

        });

        // 参数
        self.configAlert = function (detailString, needCancel) {
            // 是否需要取消按钮
            if (needCancel || needCancel === undefined) { // 显示
                self.cancelButton.active = true;
            } else { // 隐藏
                self.cancelButton.active = false;
                self.enterButton.x = 0;
            }
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

        // 按钮点击事件,输入买多少钱的金币
        self.onButtonClicked = function (event) {
            if (event.target.name === "enterButton") {
                let payMoney = parseFloat(detailString.string);
                let re = /^[0-9]+.?[0-9]*$/; //判断字符串是否为数字
                if (!re.test(payMoney)) {
                    self.coinNotEough.string = "请输入数字！";
                    return false;
                } else {
                    common.coinNum = common.coinNum + payMoney * 500;
                    self.findAndRefresh(common.coinNum, common.lifeNum);
                }
            }
            self.startFadeOut();
        };

        // 销毁 alert 
        self.onDestory = function () {
            self.alert.destroy();
            self.alert = null;
            self.cancelButton = null;
            self.enterButton = null;
            self.animSpeed = 0.05;
        };
    },

    chooseSpeedToolNum: function (detailString, needCancel) {
        // 引用
        let self = this;
        // 加载 prefab 创建
        cc.loader.loadRes("prefabs/AlertToolCustom", cc.Prefab, function (error, prefab) {
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
            detailString = cc.find("alertBackground/money", alertB).getComponent(cc.EditBox);
            self.cancelButton = cc.find("alertBackground/cancelButton", alertB);
            self.enterButton = cc.find("alertBackground/enterButton", alertB);
            self.coinNotEough = cc.find("alertBackground/coinNotE", alertB).getComponent(cc.Label);

            // 添加点击事件
            self.enterButton.on("click", self.onButtonClicked, self);
            self.cancelButton.on("click", self.onButtonClicked, self);

            // 父视图
            self.alert.parent = cc.find("Canvas");

            // 展现 alert
            self.startFadeIn();

            // 参数
            self.configAlert(detailString, needCancel);

        });

        // 参数
        self.configAlert = function (detailString, needCancel) {

            // 是否需要取消按钮
            if (needCancel || needCancel === undefined) { // 显示
                self.cancelButton.active = true;
            } else { // 隐藏
                self.cancelButton.active = false;
                self.enterButton.x = 0;
            }
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

        // 按钮点击事件，填写购买加速道具的数目
        self.onButtonClicked = function (event) {
            let speedToolNum = parseFloat(detailString.string);
            let re = /^[0-9]+.?[0-9]*$/; //判断字符串是否为数字
            if (event.target.name === "cancelButton") {
                self.startFadeOut();
            }
            if (!re.test(speedToolNum)) {
                self.coinNotEough.string = "请输入数字！";
                if (event.target.name === "cancelButton") {
                    self.startFadeOut();
                }
                return false;
            } else {
                if (speedToolNum % 1 !== 0) {
                    self.coinNotEough.string = "请输入整数！";
                    if (event.target.name === "cancelButton") {
                        self.startFadeOut();
                    }
                } else {
                    if (speedToolNum * common.speedToolPrice > common.coinNum) {
                        self.coinNotEough.string = "金币数不足！";
                        if (event.target.name === "cancelButton") {
                            self.startFadeOut();
                        }
                    } else {
                        if (event.target.name === "enterButton") {
                            common.speedToolNum = common.speedToolNum + speedToolNum;
                            common.coinNum = common.coinNum - common.speedToolPrice * speedToolNum;
                            self.findAndRefresh(common.coinNum, common.lifeNum);
                            self.startFadeOut();
                        }
                    }
                }
            }
        };

        // 销毁 alert 
        self.onDestory = function () {
            self.alert.destroy();
            self.alert = null;
            self.cancelButton = null;
            self.enterButton = null;
            self.animSpeed = 0.05;
        };
    },

    chooseRelifeToolNum: function (detailString, needCancel) {
        // 引用
        let self = this;
        // 加载 prefab 创建
        cc.loader.loadRes("prefabs/AlertToolCustom", cc.Prefab, function (error, prefab) {
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
            detailString = cc.find("alertBackground/money", alertB).getComponent(cc.EditBox);
            self.cancelButton = cc.find("alertBackground/cancelButton", alertB);
            self.enterButton = cc.find("alertBackground/enterButton", alertB);
            self.coinNotEough = cc.find("alertBackground/coinNotE", alertB).getComponent(cc.Label);

            // 添加点击事件
            self.enterButton.on("click", self.onButtonClicked, self);
            self.cancelButton.on("click", self.onButtonClicked, self);

            // 父视图
            self.alert.parent = cc.find("Canvas");

            // 展现 alert
            self.startFadeIn();

            // 参数
            self.configAlert(detailString, needCancel);

        });

        // 参数
        self.configAlert = function (detailString, needCancel) {
            // 是否需要取消按钮
            if (needCancel || needCancel === undefined) { // 显示
                self.cancelButton.active = true;
            } else { // 隐藏
                self.cancelButton.active = false;
                self.enterButton.x = 0;
            }
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
            let relifeToolNum = parseFloat(detailString.string);
            let re = /^[0-9]+.?[0-9]*$/; //判断字符串是否为数字
            if (event.target.name === "cancelButton") {
                self.startFadeOut();
            }
            if (!re.test(relifeToolNum)) {
                self.coinNotEough.string = "请输入数字！";
                if (event.target.name === "cancelButton") {
                    self.startFadeOut();
                }
                return false;
            } else {
                if (relifeToolNum % 1 !== 0) {
                    self.coinNotEough.string = "请输入整数！";
                    if (event.target.name === "cancelButton") {
                        self.startFadeOut();
                    }
                } else {
                    if (relifeToolNum * common.relifeToolPrice > common.coinNum) {
                        self.coinNotEough.string = "金币数不足！";
                        if (event.target.name === "cancelButton") {
                            self.startFadeOut();
                        }
                    } else {
                        if (event.target.name === "enterButton") {
                            common.relifeToolNum = common.relifeToolNum + relifeToolNum;
                            common.coinNum = common.coinNum - common.relifeToolPrice * relifeToolNum;
                            self.findAndRefresh(common.coinNum, common.lifeNum);
                            self.startFadeOut();
                        }
                    }
                }
            }
        };

        // 销毁 alert 
        self.onDestory = function () {
            self.alert.destroy();
            self.alert = null;
            self.cancelButton = null;
            self.enterButton = null;
            self.animSpeed = 0.05;
        };
    },

    chooseLifeNum: function (detailString, needCancel) {
        // 引用
        let self = this;
        // 加载 prefab 创建
        cc.loader.loadRes("prefabs/AlertToolCustom", cc.Prefab, function (error, prefab) {
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
            detailString = cc.find("alertBackground/money", alertB).getComponent(cc.EditBox);
            self.cancelButton = cc.find("alertBackground/cancelButton", alertB);
            self.enterButton = cc.find("alertBackground/enterButton", alertB);
            self.coinNotEough = cc.find("alertBackground/coinNotE", alertB).getComponent(cc.Label);

            // 添加点击事件
            self.enterButton.on("click", self.onButtonClicked, self);
            self.cancelButton.on("click", self.onButtonClicked, self);

            // 父视图
            self.alert.parent = cc.find("Canvas");

            // 展现 alert
            self.startFadeIn();

            // 参数
            self.configAlert(detailString, needCancel);

        });

        // 参数
        self.configAlert = function (detailString, needCancel) {
            // 是否需要取消按钮
            if (needCancel || needCancel === undefined) { // 显示
                self.cancelButton.active = true;
            } else { // 隐藏
                self.cancelButton.active = false;
                self.enterButton.x = 0;
            }
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
            let lifeNum = parseFloat(detailString.string);
            let re = /^[0-9]+.?[0-9]*$/; //判断字符串是否为数字
            if (event.target.name === "cancelButton") {
                self.startFadeOut();
            }
            if (!re.test(lifeNum)) {
                self.coinNotEough.string = "请输入数字！";
                if (event.target.name === "cancelButton") {
                    self.startFadeOut();
                }
                return false;
            } else {
                if (lifeNum % 1 !== 0) {
                    self.coinNotEough.string = "请输入整数！";
                    if (event.target.name === "cancelButton") {
                        self.startFadeOut();
                    }
                } else {
                    if (lifeNum * common.lifePrice > common.coinNum) {
                        self.coinNotEough.string = "金币数不足！";
                        if (event.target.name === "cancelButton") {
                            self.startFadeOut();
                        }
                    } else if (common.lifeNum + lifeNum > 99) {
                        self.coinNotEough.string = "生命值超出购买上限99！";
                        if (event.target.name === "cancelButton") {
                            self.startFadeOut();
                        }
                    } else if (event.target.name === "enterButton") {

                        common.lifeNum = common.lifeNum + lifeNum;
                        common.coinNum = common.coinNum - common.lifePrice * lifeNum;
                        self.findAndRefresh(common.coinNum, common.lifeNum);
                        self.startFadeOut();

                    }
                }
            }
        };

        // 销毁 alert 
        self.onDestory = function () {
            self.alert.destroy();
            self.alert = null;
            self.cancelButton = null;
            self.enterButton = null;
            self.animSpeed = 0.05;
        };
    },
});
