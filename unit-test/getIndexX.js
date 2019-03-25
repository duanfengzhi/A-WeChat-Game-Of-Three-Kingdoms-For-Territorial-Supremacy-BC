//将相对坐标X转换为画图时索引坐标X
function getIndexX(x,totalPixel,primaryX,pixel){
    return parseInt((x + totalPixel / 2 + primaryX) / pixel + 1 );
}
module.exports.getIndexX = getIndexX;
