//测试是否成功将玩家相对地图坐标的X坐标转换为地图方格坐标X
function getCellX (x,pixel) {
    return parseInt(x / pixel + 1);
}
module.exports.getCellX = getCellX;
