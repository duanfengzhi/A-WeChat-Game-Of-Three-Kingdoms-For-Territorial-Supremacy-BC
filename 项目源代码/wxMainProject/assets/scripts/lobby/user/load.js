let common = require("Common");

cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad() {
        let myname = this.node.getChildByName("userName").getComponent(cc.Label);
        let touxiang = this.node.getChildByName("portrait").getComponent(cc.Sprite);

        if (myname) {
            myname.string = common.username;
        }

        if (touxiang) {
            //加载用户头像
            let url = common.avatarUrl;
            cc.loader.load({
                url: url,
                type: "png"
            }, function (err, img) {
                let mylogo = new cc.SpriteFrame(img);
                touxiang.spriteFrame = mylogo;
            });
        }
    },
});
