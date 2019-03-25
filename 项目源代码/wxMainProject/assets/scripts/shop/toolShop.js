cc.Class({
    extends: cc.Component,

    properties: {
        coinButton: cc.Button,
        coinShop: {
            default: null,
            type: cc.Node
        },
        lifeShop: {
            default: null,
            type: cc.Node
        },
        toolShop: {
            default: null,
            type: cc.Node
        },
        toolsShow: {
            default: null,
            type: cc.Node
        }
    },

    onLoad() {
        this.coinButton.node.on("click", this.enterShopModel, this);
    },

    enterShopModel() {
        this.lifeShop.active = false;
        this.toolShop.active = true;
        this.toolsShow.active = false;
        this.coinShop.active = false;
    },
});
