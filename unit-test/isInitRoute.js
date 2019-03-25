//初始化逻辑上地图的方格
function isInitRoute(totalPixel,pixel) {
    let route = new Array();
    for (let i = 0; i < totalPixel / pixel; i++) //每一行
    {
        for (let j = 0; j < totalPixel / pixel; j++) //每一列
        {
            let index = i * (totalPixel / pixel) + j;
            route[index] = 0;
        }
    }
    return route.length;
}
module.exports.isInitRoute = isInitRoute;
