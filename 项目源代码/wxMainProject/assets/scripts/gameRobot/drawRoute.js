let route = new Array(); //route是整个cell的集合

cc.Class({
    extends: cc.Component,

    properties: {
        cell: [], //0:矩形坐下点的x坐标;1:矩形坐下点的y坐标;2:格子填充color;
        pixel: 5, //每个cell的像素值
        totalPixel: 1440, //地图总像素 
    },

    start() {
        this.initRoute();
    },

    //初始化route,其中，color:0表示未被涉足;1表示红色；2表示蓝色
    initRoute: function () {
        for (let i = 0; i < this.totalPixel / this.pixel; i++) //每一行
        {
            for (let j = 0; j < this.totalPixel / this.pixel; j++) //每一列
            {
                this.cell[0] = (i + 1) * this.pixel;
                this.cell[1] = j * this.pixel;
                this.cell[2] = 0;
                let index = i * (this.totalPixel / this.pixel) + j;
                route[index] = new Array(3);
                route[index][0] = this.cell[0];
                route[index][1] = this.cell[1];
                route[index][2] = this.cell[2];
            }
        }
    },

    //获取走路的世界坐标，得到所在的方格存储在route的下标
    getCell: function (x, y) {
        let cellx = x / this.pixel;
        let celly = y / this.pixel;
        return celly * (this.totalPixel / this.pixel) + cellx;
    },

    drawLine: function () {
        let ctx = this.node.getComponent(cc.Graphics);
        ctx.moveTo(20, 100);
        ctx.lineTo(20, 20);
        ctx.lineTo(70, 20);
        ctx.stroke();
    },
});
