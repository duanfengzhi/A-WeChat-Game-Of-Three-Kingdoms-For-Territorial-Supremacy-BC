let Common = require("JoystickCommon");
let JoystickBG = require("JoystickBG");

cc.Class({
    extends: cc.Component,

    properties: {
        dot: {
            default: null,
            type: cc.Node,
            displayName: "摇杆节点",
        },
        ring: {
            default: null,
            type: JoystickBG,
            displayName: "摇杆背景节点",
        },
        touchType: {
            default: Common.TouchType.DEFAULT,
            type: Common.TouchType,
            displayName: "触摸类型",
        },
        directionType: {
            default: Common.DirectionType.ALL,
            type: Common.DirectionType,
            displayName: "方向类型",
        },
        sprite: {
            default: null,
            type: cc.Node,
            displayName: "操控的目标",
        },
        stickPos: {
            default: null,
            type: cc.Node,
            displayName: "摇杆当前位置",
        },
        touchLocation: {
            default: null,
            type: cc.Node,
            displayName: "摇杆当前位置",
        }
    },

    onLoad: function () {
        //当触摸类型为FOLLOW会在此对圆圈的触摸监听
        if (this.touchType === Common.TouchType.FOLLOW) {
            this.initTouchEvent();
        }
    },

    initTouchEvent: function () {
        let self = this;

        self.node.on(cc.Node.EventType.TOUCH_START, self.touchStartEvent, self);
        self.node.on(cc.Node.EventType.TOUCH_MOVE, self.touchMoveEvent, self);

        // 触摸在圆圈内离开或在圆圈外离开后，摇杆归位，player速度为0
        self.node.on(cc.Node.EventType.TOUCH_END, self.touchEndEvent, self);
        self.node.on(cc.Node.EventType.TOUCH_CANCEL, self.touchEndEvent, self);
    },

    touchStartEvent: function (event) {
        // 记录触摸的世界坐标，给touch move使用
        this.touchLocation = event.getLocation();
        let touchPos = this.node.convertToNodeSpaceAR(event.getLocation());
        // 更改摇杆的位置
        this.ring.node.setPosition(touchPos);
        this.dot.setPosition(touchPos);
        // 记录摇杆位置，给touch move使用
        this.stickPos = touchPos;
    },

    touchMoveEvent: function (event) {
        // 如果touch start位置和touch move相同，禁止移动
        if (this.touchLocation.x === event.getLocation().x && this.touchLocation.y === event.getLocation().y) {
            return false;
        }
        // 以圆圈为锚点获取触摸坐标
        let touchPos = this.ring.node.convertToNodeSpaceAR(event.getLocation());
        let distance = this.ring.getDistance(touchPos, cc.v2(0, 0));
        let radius = this.ring.node.width / 2;
        // 由于摇杆的postion是以父节点为锚点，所以定位要加上touch start时的位置
        let posX = this.stickPos.x + touchPos.x;
        let posY = this.stickPos.y + touchPos.y;
        if (radius > distance) {
            this.dot.setPosition(cc.v2(posX, posY));
        } else {
            //控杆永远保持在圈内，并在圈内跟随触摸更新角度
            let x = this.stickPos.x + Math.cos(this.ring.getRadian(cc.v2(posX, posY))) * radius;
            let y = this.stickPos.y + Math.sin(this.ring.getRadian(cc.v2(posX, posY))) * radius;
            this.dot.setPosition(cc.v2(x, y));
        }
        //更新角度
        this.ring.getAngle(cc.v2(posX, posY));
        //设置实际速度
        this.ring.setSpeed(cc.v2(posX, posY));
    },

    touchEndEvent: function () {
        this.dot.setPosition(this.ring.node.getPosition());
        this.ring.speed = 0;
    },
});
