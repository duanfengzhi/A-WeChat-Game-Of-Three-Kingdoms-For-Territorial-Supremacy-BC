cc.Class({
    extends: cc.Component,

    properties: {
        angle: 0
    },

    onLoad() {
        //边界范围
        this.gameWidth = 1440;
        this.gameHeight = 1440;
        this.gameRect = new cc.rect(-this.gameWidth / 2 + 20, -this.gameHeight / 2 + 20, this.gameWidth - 40, this.gameHeight - 40);
        this.callback = function () {
            if (this.angle < 360) {
                this.angle += 45;
            } else {
                this.angle = Math.ceil(Math.random() * 360);
            }
        }
        this.schedule(this.callback, 1);
    },

    //更新移动目标
    update: function () {
        this.robotMove();
    },

    //全方向移动
    robotMove: function () {
        let newX = this.node.x;
        let newY = this.node.y;
        newX += Math.cos(this.angle * (Math.PI / 180)) * 2;
        newY += Math.sin(this.angle * (Math.PI / 180)) * 2;
        let tempVec2 = new cc.Vec2(newX, newY);
        if (!this.gameRect.contains(tempVec2)) {
            return
        }
        this.node.x = newX;
        this.node.y = newY;
    },
});
