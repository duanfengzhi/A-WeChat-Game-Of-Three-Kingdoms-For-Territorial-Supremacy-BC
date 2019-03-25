//判断闭合，当遇到route为 this.selfColor或者this.fillColor时，闭合
function isCloseRoute(routeIndex){
    let route = [[1,1,1],[1,1,0],[1,1,1],[1,1,1]];
    if(route[routeIndex][2] === 1){
        return true;
    }
    return false;
}
module.exports.isCloseRoute = isCloseRoute;
