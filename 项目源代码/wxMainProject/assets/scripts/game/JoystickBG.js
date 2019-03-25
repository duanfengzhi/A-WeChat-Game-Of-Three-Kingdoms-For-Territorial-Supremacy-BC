let joystickCommon = require('JoystickCommon');
let common = require('../start/Common');
let route = new Array(); //route是整个cell的集合
let myImport = require('../start/login');
cc.Class({
    extends: cc.Component,

    properties: {
        deathCheckoutPoint:new Array(),
        isDeath:true,
        mate:[],
        otherRoute:new Array(),
        deletPoint: new Array(),
        test: 0,
        cell: [], //0:矩形坐下点的x坐标;1:矩形坐下点的y坐标;2:格子填充color;
        pixel: 40, //每个cell的像素值
        totalPixel: 1440, //地图总像素 
        cellX: 0,
        cellY: 0,
        primaryX: 0,
        primaryY: 0,
        cellIndex: 0,
        selfColor: 2,
        fillColor: 3, //自己圈地后填充颜色 
        nowRoute: new Array(), //存储当前路径信息
        closure: new Array(), //存储待封闭图形边界信息
        drawNode: {
            default: null,
            type: cc.Node,
        },
        dot: {
            default: null,
            type: cc.Node,
            displayName: '摇杆节点',
        },
        joyCom: {
            default: null,
            displayName: 'joy Node',
        },
        playerNode: {
            default: null,
            displayName: '被操作的目标Node',
        },
        angle: {
            default: null,
            displayName: '当前触摸的角度',
        },
        radian: {
            default: null,
            displayName: '弧度',
        },
        speed: 0, //实际速度
        speed1: 2, //正常速度
        speed2: 4, //加速
        accelerateButton: cc.Button,
        accelerating: 0,
        reviveButton: cc.Button,
        zone1: {
            default: null,
            type: cc.Node
        },
        zone2: {
            default: null,
            type: cc.Node
        },
        zone3: {
            default: null,
            type: cc.Node
        },
        zone4: {
            default: null,
            type: cc.Node
        },
    },

    onLoad: function () {
        this.accelerateButton.node.on('click', this.accelerate, this);
        this.reviveButton.node.on('click', this.revive, this);
        // joy下的Joystick组件
        this.joyCom = this.node.parent.getComponent('Joystick');
        // Joystick组件下的player节点
        this.playerNode = this.joyCom.sprite;
        this.getPrimaryPosition();
        if (this.joyCom.touchType === joystickCommon.TouchType.DEFAULT) {
            //对圆圈的触摸监听
            this.initTouchEvent();
        }

        //边界范围
        this.gameWidth = 1440;
        this.gameHeight = 1440;
        this.gameRect = new cc.rect(-this.gameWidth / 2 + 20, -this.gameHeight / 2 + 20, this.gameWidth - 40, this.gameHeight - 40);
        this.otherRect4 = new cc.rect(500, -720, 220, 220);
        this.otherRect3 = new cc.rect(-720, -720, 220, 220);
        this.otherRect2 = new cc.rect(500, 500, 220, 220);
        this.otherRect1 = new cc.rect(-720, 500, 220, 220);
        this.initRoute();
        this.drawSquare();
        //帧同步
        let frameRate = 20;
        myImport.engine.setFrameSync(frameRate, 0, {
            cacheFrameMS: 10000
        });
        //初始化mate数组,放队友编号
        if(common.pattern === 0){
            for(let i = 0;i < common.userList.length ;i++){
                if(i !== common.myZone){
                    this.mate.push(i);
                }
            }
        }
        myImport.rsp.frameUpdate = this.frameUpdate.bind(this);
    },

    frameUpdate: function (data) {
        cc.log(data.frameWaitCount + "--進入frameUpdate--------------------data.frameWaitCount");
        if (data.frameWaitCount !== 0) {
            for (let i = 0; i < data.frameWaitCount; i++) {
                let data1 = JSON.parse(data.frameItems[i].cpProto);
                if (data1.userID !== myImport.engine.mUserID) {
                    cc.log("化纖隊友");
                    let ctx = this.drawNode.getComponent(cc.Graphics);
                    ctx.rect(data1.x, data1.y, this.pixel, this.pixel);
                    if (data1.color === 1) {
                        ctx.fillColor = cc.Color.RED;
                    } else {
                        ctx.fillColor = cc.Color.BLUE;
                    }
                    ctx.fill();
                    cc.log((data1.x + this.totalPixel / 2) / this.pixel + 1 + this.totalPixel / this.pixel * ((this.totalPixel / 2 - data1.y) / this.pixel) + "测试未定义下标");
                    cc.log("data1.x" + data1.x + "   " + "data1.y" + data1.y );
                    route[(data1.x + this.totalPixel / 2) / this.pixel + 1 + this.totalPixel / this.pixel * ((this.totalPixel / 2 - data1.y) / this.pixel)][2] = data1.color;//填充等待寫
                }
            }
        }
    },

    //更新移动目标
    update: function () {
        switch (this.joyCom.directionType) {
        case joystickCommon.DirectionType.ALL:
            if (common.isGameOver !== 1) {
                this.allDirectionsMove();
            }else if(common.isGameOver === 1){
                if(common.myColor === 0){
                    if(this.calculateArea()){
                        common.isWin = true;
                    }else{
                        common.isWin = false;
                    }
                }else if(common.myColor === 1){
                    if(this.calculateArea()){
                        common.isWin = false;
                    }else{
                        common.isWin = true;
                    }
                }
            }
            break;
        default:
            break;
        }
    },

    //对圆圈的触摸监听
    initTouchEvent: function () {
        let self = this;
        self.node.on(cc.Node.EventType.TOUCH_START, this.touchStartEvent, self);
        self.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMoveEvent, self);
        // 触摸在圆圈内离开或在圆圈外离开后，摇杆归位，player速度为0
        self.node.on(cc.Node.EventType.TOUCH_END, this.touchEndEvent, self);
        self.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEndEvent, self);
    },

    moveLimit: function (tempVec2) {
        if (common.pattern === 0) {
            this.currentPattern(tempVec2);
        } else {
            if (common.userList.length === 0) {
                return this.otherRect4.contains(tempVec2);
            } else {
                return this.otherRect3.contains(tempVec2) || this.otherRect4.contains(tempVec2);
            }
        }
    },

    currentPattern: function (tempVec2) {
        if (common.userList.length === 2) {
            if (common.myZone === 1) {
                return this.otherRect4.contains(tempVec2);
            } else if (common.myZone === 4) {
                return this.otherRect1.contains(tempVec2);
            }
        } else if (common.userList.length === 4) {
            if (common.myZone === 1 || common.myZone === 2) {
                return this.otherRect3.contains(tempVec2) || this.otherRect4.contains(tempVec2);
            } else if (common.myZone === 3 || common.myZone === 4) {
                return this.otherRect1.contains(tempVec2) || this.otherRect2.contains(tempVec2);
            }
        }
    },

    //全方向移动
    allDirectionsMove: function () {
        let newX = this.playerNode.x;
        let newY = this.playerNode.y;
        let addX = Math.cos(this.angle * (Math.PI / 180)) * this.speed;
        let addY = Math.sin(this.angle * (Math.PI / 180)) * this.speed;
        newX += addX;
        newY += addY;
        let tempVec2 = new cc.Vec2(newX, newY);
        if (!this.gameRect.contains(tempVec2) || this.moveLimit(tempVec2)) {
            return;
        }
        this.playerNode.x = newX;
        this.playerNode.y = newY;
        if (addX !== 0 && addY !== 0) {
            this.cellX = this.xToCellX(newX);
            this.cellY = this.yToCellY(newY);
            this.cellIndex = this.getRouteIndex(this.xToIndexX(newX), this.yToIndexY(newY));
           
            this.drawSquare((this.cellX - 1) * this.pixel, this.cellY * this.pixel);
            //当前格子有更新，放入nowRoute
            if (this.nowRoute[this.nowRoute.length - 1] !== this.cellIndex) {
                cc.log("this.nowRoute[this.nowRoute.length - 1] --" + this.nowRoute[this.nowRoute.length - 1]);
                cc.log("this.cellIndex --" + this.cellIndex);
                //只对新加入格子进行判断,判断自身闭合
                if (this.isCloseRoute(this.cellIndex)) {
                    //当是自身闭合的时候，调用闭合算法获取闭合图形
                    this.selfRouteCircle(this.cellIndex);
                    //当队友闭合的时候，调用团队闭合算法
                    // this.patternRouterCircle(this.cellIndex);
                    //当画线到自身阵营
                    this.campCricle(this.cellIndex);
                }
                //死亡判斷
                cc.log("起点情况，坐标" + this.getRouteIndex(this.xToIndexX(this.primaryX), this.yToIndexY(this.primaryY)) + "颜色" + route[this.getRouteIndex(this.xToIndexX(this.primaryX), this.yToIndexY(this.primaryY))][2]);
                this.newIsDead(this.cellIndex,this.getRouteIndex(this.xToIndexX(this.primaryX), this.yToIndexY(this.primaryY)))
                this.deathCheckoutPoint.splice(0, this.deathCheckoutPoint.length);
                cc.log("是否清空" + this.deathCheckoutPoint.length);
                if(this.isDeath){
                    this.isDead();
                }
                this.isDeath = true;
                //将更新的格子设置颜色并且放入nowRoute数组；this.cellIndex >= 0 && route[this.cellIndex][2] !== 1
                if (this.cellIndex >= 0) {
                    cc.log("设置颜色this.cellIndex---" + this.cellIndex + "--color--" + route[this.cellIndex][2]);
                    route[this.cellIndex][2] = common.myColor; 
                    this.pushNowRoute(this.cellIndex); //放入路径
                    cc.log("路徑顔色填充" + route[this.cellIndex]);
                } else {
                    cc.log("出现了下标为0，函数有错误");
                }
            }
        }
    },

    //遍历上边，如果是有颜色，入栈
    getUp:function(i) {
        cc.log("遍历上面de" + (i - this.totalPixel / this.pixel));
        if(i - this.totalPixel / this.pixel < 0){
            cc.log("遍历上面没有点");
            return false;
        }
        if(route[i - this.totalPixel / this.pixel][2] === common.myColor){
            cc.log("遍历上面");
            return true;
        }
        cc.log("遍历上面失败");
        return false;
    },

    //遍历下边，如果是有颜色，入栈
    getDown:function(i){
        cc.log("遍历下面de " + (i + this.totalPixel / this.pixel));

        if(i + this.totalPixel / this.pixel > this.totalPixel / this.pixel * (this.totalPixel / this.pixel)){
            cc.log("遍历下面没有点");
            return false;
        }
        if(route[i + this.totalPixel / this.pixel][2] === common.myColor){
            cc.log("遍历下面");
            return true;
        }
        cc.log("遍历下面失败");
        return false;
    },
    //遍历左边，如果是有颜色，入栈
    getLeft:function(i){
        cc.log("遍历左面de " + (i - 1));

        if(i % (this.totalPixel / this.pixel) === 1){
            cc.log("遍历左面没有点");
            return false;
        }
        if(route[i - 1][2] === common.myColor){
            cc.log("遍历左面");
            
            return true;
        }
        cc.log("遍历左面失败");
        return false;
    },
    //遍历右边，如果是有颜色，入栈
    getRight:function(i){
        cc.log("遍历右面de " + (i + 1));

        if(i % (this.totalPixel / this.pixel) === 0){
            cc.log("遍历右面没有点");
            return false;
        }
        if(route[i + 1][2] === common.myColor){
            cc.log("遍历右面");

            return true;
        }
        cc.log("遍历右面失败" + route[i + 1]);

        return false;
    },

    //遍历左上
    getLeftUp:function(i){
        cc.log("遍历左上面de " + (i - this.totalPixel / this.pixel - 1));

        if(i % (this.totalPixel / this.pixel) === 1){
            cc.log("遍上面没有点");
            
            return false;
        }
        if(i - this.totalPixel / this.pixel - 1 < 0){
            cc.log("遍左面没有点");

            return false;
        }
        if(route[i - this.totalPixel / this.pixel - 1][2] === common.myColor){
            cc.log("遍历左上面");
            return true;
        }
        cc.log("遍历左上面失败");

        return false;
    },
    //遍历右上
    getRightUp:function(i){
        cc.log("遍历右上面de " + (i - this.totalPixel / this.pixel + 1));
        
        if(i % (this.totalPixel / this.pixel) === 0){
            cc.log("没有遍历右上面");
            return false;
        }
        if(i - this.totalPixel / this.pixel + 1 < 0 ){
            cc.log("没有遍历右上面");
            return false;
        }
        if(route[i - this.totalPixel / this.pixel + 1][2] === common.myColor){
            cc.log("遍历右上面");
            return true;
        }
        cc.log("遍历右上面失败");

        return false;
    },
    //遍历左下
    getLeftDown:function(i){
        cc.log("遍历左下面de " + (i + this.totalPixel / this.pixel - 1));
        if(i % (this.totalPixel / this.pixel) === 1){
            cc.log("没有遍历左下面");
            return false;
        }
        if (i + this.totalPixel / this.pixel - 1 > this.totalPixel / this.pixel * (this.totalPixel / this.pixel)){
            cc.log("没有遍历左下面");
            return false;
        }
        if(route[i + this.totalPixel / this.pixel - 1][2] === common.myColor){
            cc.log("遍历左下面");
            return true;
        }
        cc.log("遍历左下面失败");

        return false;
    },
    //遍历右下
    getRightDown:function(i){
        cc.log("遍历右下面de " + (i + this.totalPixel / this.pixel + 1));

        if(i % (this.totalPixel / this.pixel) === 0){
            cc.log("没有遍历右下面");
            
            return false;
        }
        if (i + this.totalPixel / this.pixel + 1 > this.totalPixel / this.pixel * (this.totalPixel / this.pixel)){
            cc.log("没有遍历右下面");
           
            return false;
        }
        if(route[i + this.totalPixel / this.pixel + 1][2] === common.myColor){
            cc.log("遍历右下面");
            return true;
        }
        cc.log("遍历右下面失败");

        return false;
    },
    
    newIsDead:function(indexRoute,startPoint){
        if(indexRoute === startPoint){
            this.isDeath = false;
            return;
        }

        this.deathCheckoutPoint.push(indexRoute);
        cc.log("-------入栈----------" + indexRoute + "栈里内容：" + this.deathCheckoutPoint);
        cc.log("-------進入死亡判斷,遍历点索引----------" + indexRoute);
        // cc.log("this.getUp(indexRoute)" + this.getUp(indexRoute));
        // cc.log("this.getDown(indexRoute)" + this.getDown(indexRoute));
        //从封闭点开始上下左右遍历,遍历未遍历的点
        if(this.getUp(indexRoute)){//如果上面有點
            cc.log("进入上面点的判断过程");
            if(this.deathCheckoutPoint.indexOf(indexRoute - this.totalPixel / this.pixel) === -1){//并且未查詢
                this.deathCheckoutPoint.push(indexRoute - this.totalPixel / this.pixel);//標記為查詢
                if(indexRoute - this.totalPixel / this.pixel !== startPoint){//如果到没到起点,，沒有死亡
                    this.newIsDead(indexRoute - this.totalPixel / this.pixel,startPoint);
                }else{//遇到起始點，不死亡，退出
                    this.isDeath = false;
                    return;
                }
                // if(!this.isDeath){
                //     return;
                // }
            }
        }
        if(this.getDown(indexRoute)){
            cc.log("不在栈里" + (this.deathCheckoutPoint.indexOf(indexRoute + this.totalPixel / this.pixel) === -1));
            if(this.deathCheckoutPoint.indexOf(indexRoute + this.totalPixel / this.pixel) === -1){
                this.deathCheckoutPoint.push(indexRoute + this.totalPixel / this.pixel);//標記為查詢
                cc.log("是否进入递归" + indexRoute + this.totalPixel / this.pixel !== startPoint);
                if(indexRoute + this.totalPixel / this.pixel !== startPoint){//如果到達遠點,，沒有死亡
                    cc.log("进入递归");
                    this.newIsDead(indexRoute + this.totalPixel / this.pixel,startPoint);
                }else{
                    this.isDeath = false;
                    return;
                }
                // if(!this.isDeath){
                //     return;
                // }
            }
            // cc.log("进行向左遍历");
        }
        if(this.getLeft(indexRoute)){
            cc.log(this.deathCheckoutPoint.indexOf(indexRoute - 1) + "this.deathCheckoutPoint.indexOf(indexRoute - 1)");
            cc.log(startPoint + "startPoint");
            cc.log(indexRoute + "indexRoute");
            if(this.deathCheckoutPoint.indexOf(indexRoute - 1) === -1){
                this.deathCheckoutPoint.push(indexRoute - 1);
                if(indexRoute - 1 !== startPoint){
                    cc.log("进入递归");
                    this.newIsDead(indexRoute - 1,startPoint);
                }else{
                    cc.log("活了");
                    this.isDeath = false;
                    return;
                }
                // if(!this.isDeath){
                //     return;
                // }
            }
        }
        if(this.getRight(indexRoute)){
            if(this.deathCheckoutPoint.indexOf(indexRoute + 1) === -1){
                this.deathCheckoutPoint.push(indexRoute + 1);
                if(indexRoute + 1 !== startPoint){
                    cc.log("进入递归");
                    this.newIsDead(indexRoute + 1,startPoint);
                }else{
                    this.isDeath = false;
                    return;
                }
                // if(!this.isDeath){
                //     return;
                // }
            }
        }
        if(this.getLeftUp(indexRoute)){
            if(this.deathCheckoutPoint.indexOf(indexRoute - this.totalPixel / this.pixel - 1) === -1){
                this.deathCheckoutPoint.push(indexRoute - this.totalPixel / this.pixel - 1);
                if(indexRoute - this.totalPixel / this.pixel - 1 !== startPoint){
                    this.newIsDead(indexRoute - this.totalPixel / this.pixel - 1,startPoint);
                }else{
                    this.isDeath = false;
                    return;
                }
                // if(!this.isDeath){
                //     return;
                // }
            }
        }
        if(this.getRightUp(indexRoute)){
            if(this.deathCheckoutPoint.indexOf(indexRoute - this.totalPixel / this.pixel + 1) === -1){
                this.deathCheckoutPoint.push(indexRoute - this.totalPixel / this.pixel + 1);
                if(indexRoute - this.totalPixel / this.pixel + 1 !== startPoint){
                    this.newIsDead(indexRoute - this.totalPixel / this.pixel + 1,startPoint);
                }else{
                    this.isDeath = false;
                    return;
                }
                // if(!this.isDeath){
                //     return;
                // }
            }
        }
        if(this.getLeftDown(indexRoute)){
            if(this.deathCheckoutPoint.indexOf(indexRoute + this.totalPixel / this.pixel - 1) === -1){
                this.deathCheckoutPoint.push(indexRoute + this.totalPixel / this.pixel - 1);
                if(indexRoute + this.totalPixel / this.pixel - 1 !== startPoint){
                    this.newIsDead(indexRoute + this.totalPixel / this.pixel - 1,startPoint);
                }else{
                    this.isDeath = false;
                    return;
                }
                // if(!this.isDeath){
                //     return;
                // }
            }
        }
        if(this.getRightDown(indexRoute)){
            if(this.deathCheckoutPoint.indexOf(indexRoute + this.totalPixel / this.pixel + 1) === -1){
                this.deathCheckoutPoint.push(indexRoute + this.totalPixel / this.pixel + 1);
                if(indexRoute + this.totalPixel / this.pixel + 1 !== startPoint){
                    this.newIsDead(indexRoute + this.totalPixel / this.pixel + 1,startPoint);
                }else{
                    this.isDeath = false;
                    cc.log("-------死亡情況----------" + false);
                    return;
                }
                // if(!this.isDeath){
                //     return;
                // }
            }
        }
        cc.log("本次递归结束；死亡情況----------" + this.isDeath);
        return;
    },

    //计算两点间的距离并返回
    getDistance: function (pos1, pos2) {
        return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) +
            Math.pow(pos1.y - pos2.y, 2));
    },

    /*角度/弧度转换
    角度 = 弧度 * 180 / Math.PI
    弧度 = 角度 * Math.PI / 180*/
    //计算弧度并返回
    getRadian: function (point) {
        this.radian = Math.PI / 180 * this.getAngle(point);
        return this.radian;
    },

    //计算角度并返回
    getAngle: function (point) {
        let pos = this.node.getPosition();
        this.angle = Math.atan2(point.y - pos.y, point.x - pos.x) * (180 / Math.PI);
        return this.angle;
    },

    //设置实际速度
    setSpeed: function () {
        if (this.accelerating === 0) {
            this.speed = this.speed1;
        } else if (this.accelerating === 1) {
            this.speed = this.speed2;
        }
    },

    accelerate() {
        this.accelerating = 1;
        this.scheduleOnce(function () {
            this.accelerating = 0;
        }, 5);
    },

    isDead() {
        common.isLife = 1;
        this.scheduleOnce(this.callback = function () {
            common.isLife = 0;
        }, 5);
    },

    revive() {
        this.unschedule(this.callback);
        common.isLife = 0;
    },

    touchStartEvent: function (event) {
        // 获取触摸位置的世界坐标转换成圆圈的相对坐标（以圆圈的锚点为基准）
        let touchPos = this.node.convertToNodeSpaceAR(event.getLocation());
        //触摸点与圆圈中心的距离
        let distance = this.getDistance(touchPos, cc.v2(0, 0));
        //圆圈半径
        let radius = this.node.width / 2;
        // 记录摇杆位置，给touch move使用
        this.stickPos = touchPos;
        let posX = this.node.getPosition().x + touchPos.x;
        let posY = this.node.getPosition().y + touchPos.y;
        //手指在圆圈内触摸,控杆跟随触摸点
        if (radius > distance) {
            this.dot.setPosition(cc.v2(posX, posY));
            return true;
        }
        return false;
    },

    touchMoveEvent: function (event) {
        let touchPos = this.node.convertToNodeSpaceAR(event.getLocation());
        let distance = this.getDistance(touchPos, cc.v2(0, 0));
        let radius = this.node.width / 2;
        // 由于摇杆的postion是以父节点为锚点，所以定位要加上ring和dot当前的位置(stickX,stickY)
        let posX = this.node.getPosition().x + touchPos.x;
        let posY = this.node.getPosition().y + touchPos.y;
        if (radius > distance) {
            this.dot.setPosition(cc.v2(posX, posY));
        } else {
            //控杆永远保持在圈内，并在圈内跟随触摸更新角度
            let x = this.node.getPosition().x + Math.cos(this.getRadian(cc.v2(posX, posY))) * radius;
            let y = this.node.getPosition().y + Math.sin(this.getRadian(cc.v2(posX, posY))) * radius;
            this.dot.setPosition(cc.v2(x, y));
        }
        //更新角度
        this.getAngle(cc.v2(posX, posY));
        //设置实际速度
        this.setSpeed();
    },

    touchEndEvent: function () {
        this.dot.setPosition(this.node.getPosition());
        this.speed = 0;
    },

    /**
     * 显示路径
     * 初始化逻辑上地图的方格
     */
    initRoute: function () {
        cc.log("初始化route成功");
        for (let i = 0; i < this.totalPixel / this.pixel; i++) //每一行
        {
            for (let j = 0; j < this.totalPixel / this.pixel; j++) //每一列
            {
                this.cell[0] = (i + 1) * this.pixel;
                this.cell[1] = j * this.pixel;
                this.cell[2] = 100;
                this.cell[3] = 0;//0:空，1：點；2 ：面；
                let index = i * (this.totalPixel / this.pixel) + j;
                route[index] = new Array(3);
                route[index][0] = this.cell[0];
                route[index][1] = this.cell[1];
                route[index][2] = this.cell[2];
                route[index][3] = this.cell[3];
            }
        }
        if (common.pattern === 0) {
            if (common.userList.length === 2) {
                for(let i = 0;i < 200 / this.pixel;i++){
                    for(let j = 0;j < 200 / this.pixel;j++){
                        let index = i * (this.totalPixel / this.pixel) + j;
                        route[index][2] = 0;  
                    }
                }
                for(let i = (this.totalPixel / 2 - 200) / this.pixel;i < this.totalPixel / this.pixel;i++){
                    for(let j = (this.totalPixel / 2 - 200) / this.pixel;j < this.totalPixel / this.pixel;j++ ){
                        let index = i * (this.totalPixel / this.pixel) + j;
                        route[index][2] = 1;  
                    }
                }

            } else {
                for(let i = 0;i < 200 / this.pixel;i++){
                    for(let j = 0;j < 200 / this.pixel;j++){
                        let index = i * (this.totalPixel / this.pixel) + j;
                        route[index][2] = 0;  
                    }
                }
                for(let i = 0;i < 200 / this.pixel;i++){
                    for(let j = this.totalPixel / this.pixel - 200;j < this.totalPixel / this.pixel;j++){
                        let index = i * (this.totalPixel / this.pixel) + j;
                        route[index][2] = 0;  
                    }
                }
                for(let i = (this.totalPixel / 2 - 200) / this.pixel;i < this.totalPixel / this.pixel;i++){
                    for(let j = 0;j < 200 / this.pixel;j++){
                        let index = i * (this.totalPixel / this.pixel) + j;
                        route[index][2] = 1;  
                    }
                }
                for(let i = (this.totalPixel / 2 - 200) / this.pixel;i < this.totalPixel / this.pixel;i++){
                    for(let j = (this.totalPixel / 2 - 200) / this.pixel;j < this.totalPixel / this.pixel;j++ ){
                        let index = i * (this.totalPixel / this.pixel) + j;
                        route[index][2] = 1;  
                    }
                }
            }
        } else {//人机
            if (common.userList.length === 1) {
                for(let i = 0;i < 200 / this.pixel;i++){
                    for(let j = 0;j < 200 / this.pixel;j++){
                        let index = i * (this.totalPixel / this.pixel) + j;
                        route[index][2] = 0;  
                    }
                }
                for(let i = (this.totalPixel / 2 - 200) / this.pixel;i < this.totalPixel / this.pixel;i++){
                    for(let j = (this.totalPixel / 2 - 200) / this.pixel;j < this.totalPixel / this.pixel;j++ ){
                        let index = i * (this.totalPixel / this.pixel) + j;
                        route[index][2] = 1;  
                    }
                }
            } else {
                for(let i = 0;i < 200 / this.pixel;i++){
                    for(let j = 0;j < 200 / this.pixel;j++){
                        let index = i * (this.totalPixel / this.pixel) + j;
                        route[index][2] = 0;  
                    }
                }
                for(let i = 0;i < 200 / this.pixel;i++){
                    for(let j = this.totalPixel / this.pixel - 200;j < this.totalPixel / this.pixel;j++){
                        let index = i * (this.totalPixel / this.pixel) + j;
                        route[index][2] = 0;  
                    }
                }
                for(let i = (this.totalPixel / 2 - 200) / this.pixel;i < this.totalPixel / this.pixel;i++){
                    for(let j = 0;j < 200 / this.pixel;j++){
                        let index = i * (this.totalPixel / this.pixel) + j;
                        route[index][2] = 1;  
                    }
                }
                for(let i = (this.totalPixel / 2 - 200) / this.pixel;i < this.totalPixel / this.pixel;i++){
                    for(let j = (this.totalPixel / 2 - 200) / this.pixel;j < this.totalPixel / this.pixel;j++ ){
                        let index = i * (this.totalPixel / this.pixel) + j;
                        route[index][2] = 1;  
                    }
                }
            }
        }

    },

    //获取初始相对坐标
    getPrimaryPosition: function () {
        this.primaryX = this.playerNode.x;
        cc.log("初始相对坐标获取：" + this.primaryX);
        this.primaryY = this.playerNode.y;

    },
    //转换为cellX,以地图左上角为坐标原点，横轴第cellX个方格
    xToCellX: function (x) {
        // return parseInt((x + this.totalPixel / 2 + this.primaryX) / this.pixel + 1 );
        return parseInt(x / this.pixel + 1);
    },
    //转换为cellY
    yToCellY: function (y) {
        // return parseInt((this.totalPixel / 2 - this.primaryX - y) / this.pixel + 1 );
        return parseInt(y / this.pixel + 1);
    },

    xToIndexX: function (x) {
        return parseInt((x + this.totalPixel / 2) / this.pixel + 1);
    },

    yToIndexY: function (y) {
        return parseInt((this.totalPixel / 2 - y) / this.pixel + 1);
    },

    //indexX,indexY 坐标存储在route的下标
    getRouteIndex: function (x, y) {
        return (y - 1) * (this.totalPixel / this.pixel) + x - 1;
    },

    //绘制指定坐标和宽度的矩形
    drawSquare: function (x, y) {
        let frameData = JSON.stringify({
            userID: myImport.engine.mUserID,
            x: x,
            y: y,
            color: common.myColor,
        });
        myImport.engine.sendFrameEvent(frameData);
        let ctx = this.drawNode.getComponent(cc.Graphics);
        ctx.rect(x, y, this.pixel, this.pixel);
        if (this.isRedColor()) {
            ctx.fillColor = cc.Color.RED;
        } else {
            ctx.fillColor = cc.Color.BLUE;
        }
        ctx.fill();
    },

    //根据阵营设置颜色：0：蓝色；1：红色色
    isRedColor: function () {
        if (common.myColor === 1) {
            return true;
        } else {
            return false;
        }
    },
    /**
     * 进行封闭图形检测，进行圈地填充
     * 存储route数组的下标信息：
     * nowRoute:数组 存储当前从非填充区域开始行走的路径信息，每次填充完后进行信息更新
     * closure：数组 存储待填色区域边界的格子信息
     */
    //判断是否开始记录路径信息
    isStartNewRoute: function (routeIndex) {
        //当当前行走的不是自己填充的颜色
        if (route[routeIndex][2] !== this.selfColor) {
            return true;
        }
        return false;
    },
    //将当前行走格子的index存储在nowRoute
    pushNowRoute: function (routeIndex) {
        this.nowRoute.push(routeIndex);
    },

    //当前路径清空
    clearNowRoute: function () {
        this.nowRoute.splice(0, this.nowRoute);
    },

    //判断闭合点是否存在nowRoute中
    isInNowRoute: function (routeIndex) {
        if (this.nowRoute.indexOf(routeIndex) === -1) {
            return false; 
        }
        return true;
    },
    //判断点是否存在deletPoint中
    isInDeletPoint: function (point) {
        if (this.deletPoint.indexOf(point) === -1) {
            return false;
        }
        return true;
    },
    //判断闭合，当遇到route为 this.selfColor或者this.fillColor时，闭合
    isCloseRoute: function (routeIndex) {
        cc.log("检测的下标---" + routeIndex);
        if (route[routeIndex][2] === common.myColor) {
            return true;
        }
        return false;
    },
    //闭合情况一 ：自身画线闭合,获取闭合图形边界下标
    selfRouteCircle: function (routeIndex) {
        if (this.isInNowRoute(routeIndex) && this.isCloseRoute(this.cellIndex)) {
            cc.log("检测自身路径存在闭合,索引为" + routeIndex);
            this.test++;
            cc.log("第几次" + this.test);
            //获取闭合下标,从routeIndex所在位置进行截取this.nowRoute.indexOf(routeIndex)
            this.closure = this.nowRoute.slice(this.nowRoute.indexOf(routeIndex));
            cc.log("获取边缘数量" + this.closure.length);
            cc.log("自身画线闭合");
            //进行填充
            this.fillCircle();
        }
    },
    //判断该点在otherRout哪个数组里
    inOtherRout:function(routeIndex){
        for(let i = 0;i < this.mate.length;i++){
            if (this.otherRout[i].indexOf(routeIndex) !== -1) {
                return i;
            }
        }
        return -1;
    },
    //闭合情况二，与队友会和闭合
    patternRouterCircle:function(routeIndex){        
        let other = this.inOtherRout(routeIndex);//获取与哪个队友合并
        if(other === -1){
            return;
        }
        //获取两个人的nowRoute,从开始到routeIndex
        this.coord.splice(0,this.closure.length);//先清空
        //获取自己从开始到routeIndex的路径数组内容
        this.closure = this.nowRoute.slice(this.nowRoute.indexOf(routeIndex));
        //加上队友的数组信息
        for(let i = 0 ;i < this.otherRout[other].length;i++){
            this.closure.push(this.inOtherRout[other][i]);
            if(this.inOtherRout[other][i] === routeIndex) {
                break;
            }
        }
        this.fillCircle();
    },
    //闭合情况三：与自己阵营闭合
    campCricle:function(routeIndex){
        cc.log("routeIndex------------------檢測---" + routeIndex);
        cc.log("this.isInNowRoute(routeIndex)   =" + this.isInNowRoute(routeIndex));
        cc.log("route[routeIndex][2]------ =" + route[routeIndex][2]);
        if(!this.isInNowRoute(routeIndex) && route[routeIndex][2] === common.myColor){
            for(let i = 0; i < this.nowRoute.length;i++){
                this.closure.push(this.nowRoute[i]);
            }
            cc.log("与自己阵营闭合");
            this.fillCircle();
        }
    },
    //将routeIndex转换为indexX
    routeIndexToIndexX: function (routeIndex) {
        return routeIndex % (this.totalPixel / this.pixel);
    },
    //将routeIndex转换为indexY
    routeIndexToIndexY: function (routeIndex, x) {
        return (routeIndex - x) / (this.totalPixel / this.pixel);
    },

    //循环二维数组，获取[][1]相等的值,并且不相连得值,同时去除返回数组
    getSameYX: function (coord, y) {
        let arrayX = new Array();
        let arrayY = new Array();
        cc.log("coord.length" + coord.length);
        for (let i = 0; i < coord.length; i++) {
            if (coord[i][1] === y) {
                arrayX.push(coord[i][0]);
                arrayY.push(i);
                cc.log("getSameYX" + coord[i][0]);
            }
        }
        arrayX.sort();
        
        if(arrayX.length === 2){
            return arrayX;
        }
        //删去相连的点，只留下最右边的点，只有两个交点时，不删除

        //当是与阵营地闭合时，获取闭合地的最靠近区域的x
        if(arrayX.length === 1){
            //从route获取，获取后进行排序，取该点和旁边的点，当营地为123，取左边，456右边
            if(common.myZone <= this.mate.length + 1){
                //左边
                let tmpArrary = new Array();
                for (let i = 0; i < route.length; i++) {
                    if (route[i][1] === y) {
                        tmpArrary.push(route[i][0]);
                        cc.log("獲取了左邊的點");
                    }
                }
                tmpArrary.sort();
                for(let i = 0;i < tmpArrary.length;i++){
                    if(tmpArrary[i] === arrayX[0]){
                        arrayX.push(tmpArrary[i - 1]);
                    }
                }
            }else{
                //右边
                let tmpArrary = new Array();
                for (let i = 0; i < route.length; i++) {
                    if (route[i][1] === y) {
                        tmpArrary.push(route[i][0]);
                        cc.log("獲取了右邊的點");
                    }
                }
                tmpArrary.sort();
                for(let i = 0;i < tmpArrary.length;i++){
                    if(tmpArrary[i] === arrayX[0]){
                        arrayX.push(tmpArrary[i + 1]);
                    }
                }
            }
        }

        cc.log("删除前的数组长度" + arrayX.length);
        for(let i = 0; i < arrayX.length - 1;i++){
            cc.log("遍歷可能刪除的x");
            if( arrayX[i] === arrayX[i + 1] - 1 || arrayX[i] === arrayX[i + 1] + 1){
                arrayX.splice(i,1);
                arrayY.splice(i,1);
                cc.log("删除");
                i--;
            }
        }
        cc.log("删除后的数组长度" + arrayX.length);
        //删去極点
        let findIndex = -1;
        for(let i = 0; i < arrayX.length - 1;i++){
            //找到arrayX[i]在arrayY[i]在coord裏面的下標
            for(let j = 0; j < coord.length;j++){
                if(coord[j][0] === arrayX[i] && coord[j][1] === y){
                    findIndex = j;
                    break;
                }
            }
            //看左右，判斷是否為幾點
            let backPoint = (findIndex + 1) % coord.length;
            let frontPoint;
            if(findIndex === 0){
                frontPoint = coord.length - 1;
                 
            }else{
                frontPoint = (findIndex - 1) % coord.length;
            }
            while(coord[backPoint][1] === coord[findIndex][1]){
                backPoint = (backPoint + 1) % coord.length;
            }
            while(coord[frontPoint][1] === coord[findIndex][1]){
                if(frontPoint === 0){
                    frontPoint = coord.length - 1;
                     
                }else{
                    frontPoint = (frontPoint - 1) % coord.length;
                }
            }

            if( coord[backPoint][1] > coord[findIndex][1] && coord[frontPoint][1] > coord[findIndex][1] ){
                //需要刪除這個點
                arrayX.splice(i,1);
                arrayY.splice(i,1);
            }else if(coord[backPoint][1] < coord[findIndex][1] && coord[frontPoint][1] < coord[findIndex][1]){
                //需要刪除這個點
                arrayX.splice(i,1);
                arrayY.splice(i,1);
            }
        }
        arrayX.sort();
        return arrayX;
    },
    
    //填充算法——X-扫描算法
    fillCircle: function () {
        let coord = new Array(); //存储边界的格子坐标（第几列，第几行）
        let yMax = 0; //获取坐标中最大的Y
        let yMin = this.totalPixel / this.pixel; //获取坐标中最小的Y
        let arrayX = new Array();
        cc.log(this.closure.length + "this.closure.length");
        for (let i = 0; i < this.closure.length; i++) {
            let x = this.routeIndexToIndexX(this.closure[i]);
            let y = this.routeIndexToIndexY(this.closure[i], x);
            cc.log("(" + x + "," + y + ")");
            if (y > yMax) {
                yMax = y;
            }
            if (y < yMin) {
                yMin = y;
            }
            coord[i] = [x, y];
        }
        cc.log("MAX ----(" + yMax + "," + yMin + ")");
        //对每行格子进行扫描,扫描范围是 yMin-yMax
        let xBig = 0;
        let xSmall = 0;
        for (let i = yMin + 1; i < yMax; i++) {
            //对每行格子进行扫描，获取y = i 的格子坐标
            cc.log( i + "-------lalalalla--------" );
            arrayX = this.getSameYX(coord, i);
            cc.log( i + "行扫描的交点数" + arrayX.length);
            //每两个之间进行填充
            for(let j = 0 ;j < arrayX.length / 2;j++){
                if(arrayX[j * 2 + 1] > arrayX[j * 2]){
                    xBig = arrayX[j * 2 + 1];
                    xSmall = arrayX[j * 2];
                }else{
                    xSmall = arrayX[j * 2 + 1];
                    xBig = arrayX[j * 2];
                }
                for(let m = 0;m < xBig - xSmall;m++){
                    this.drawSquare((xSmall + m + 1) * this.pixel - this.totalPixel / 2, this.totalPixel / 2 - i * this.pixel);
                    cc.log("tianchongdaiam该行填充個數：---" + xSmall + "----" + xBig);
                    route[this.getRouteIndex(arrayX[j * 2] + m,i)][2] = common.myColor;//x:(arrayX[j * 2] + m);y:i
                }
                cc.log("该行填充個數：---" + arrayX[j * 2 + 1] + "----" + arrayX[j * 2]);
                cc.log("该行填充次数" + arrayX.length / 2);
            }
        }
        this.clearNowRoute();
        this.closure.splice(0, this.closure);
    },

    /**
     * 死亡判断 
     */
    isPlayerDead: function (routeIndex) {
        if (common.myColor === 0 && this.route[routeIndex][2] === 1) {
            return true;
        } else if (common.myColor === 1 && this.route[routeIndex][2] === 0) {
            return true;
        }
        return false;
    },

    //游戏结束后计算面积
    calculateArea: function () {
        //返回蓝色是否比红色多
        let countBlue = 0;
        let countRed = 0;
        for (let i = 0; i < route.length; i++) {
            if (route[i][2] === 0) {
                countBlue++;
            }else if(route[i][2] === 1){
                countRed++;
            }
        }
        return countBlue > countRed;
    }
});
