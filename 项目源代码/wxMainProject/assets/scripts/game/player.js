cc.Class({
    extends: cc.Component,

    properties: {},

    start() {
        // 镜头跟随
        let mapBgNode = cc.find("Canvas/bg");
        let followAction = cc.follow(this.node);
        followAction.setTag(100);
        mapBgNode.stopActionByTag(100);
        mapBgNode.runAction(followAction);
    },
});
