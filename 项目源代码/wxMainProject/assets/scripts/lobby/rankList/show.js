cc.Class({
    extends: cc.Component,

    properties: {},

    click: function () {
        cc.director.loadScene("rankList");
    },

    back:function(){

        cc.director.loadScene("lobby");
    },
});
