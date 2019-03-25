let common = require("Common");

cc.Class({
    extends: cc.Component,

    properties: {
        shopButton: cc.Button,
    },

    onLoad() {
        this.shopButton.node.on("click", this.enterShop, this);
    },

    enterShop() {
        common.shopSelect = 2;
        cc.director.loadScene("shop");
    }
});
