//将相对坐标Y转换为画图时索引坐标Y
function getIndexY(y,totalPixel,primaryX,pixel){
    return parseInt((totalPixel / 2 - primaryX - y) / pixel + 1 );
}
module.exports.getIndexY = getIndexY;
