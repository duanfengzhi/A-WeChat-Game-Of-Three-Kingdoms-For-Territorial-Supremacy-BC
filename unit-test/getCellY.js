//测试是否成功将玩家相对地图坐标的Y坐标转换为地图方格坐标Y
function getCellY (y,pixel) {
    return parseInt(y / pixel + 1);
}
module.exports.getCellY = getCellY;
