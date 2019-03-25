let common = require("Common");

cc.Class({
    extends: cc.Component,

    properties: {
        plusButton: cc.Button
    },

    onLoad() {
        this.plusButton.node.on("click", this.enterShopModel, this);
    },

    enterShopModel() {
        common.shopSelect = 0;
        cc.director.loadScene("shop");
    },
});
