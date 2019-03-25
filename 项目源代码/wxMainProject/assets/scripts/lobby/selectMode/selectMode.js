let common = require("Common");

cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad() {
        if (common.query.length !== 0) {
            cc.director.loadScene("room");
        }
    },

    selectCurrent: function () {
        cc.director.loadScene("current");
    },
    selectRobot: function () {
        cc.director.loadScene("robot");
    },
    selectRoom: function () {
        cc.director.loadScene("room");
    }
});
