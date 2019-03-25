let common = require("Common");

cc.Class({
    extends: cc.Component,

    properties: {
        buyCoins: {
            default: null,
            type: cc.Node
        },
        buyTools: {
            default: null,
            type: cc.Node
        },
        buyLife: {
            default: null,
            type: cc.Node
        },
        storeList: {
            default: null,
            type: cc.Node
        },
        myToolsList: {
            default: null,
            type: cc.Node
        },
    },

    onLoad() {
        if (common.shopSelect === 0) {
            this.buyCoins.active = true;

            this.buyLife.active = false;
            this.buyTools.active = false;
        } else if (common.shopSelect === 1) {
            this.buyCoins.active = false;

            this.buyLife.active = true;
            this.buyTools.active = false;
        } else if (common.shopSelect === 2) {
            this.buyCoins.active = false;

            this.buyLife.active = false;
            this.buyTools.active = true;
        }
    },
});
