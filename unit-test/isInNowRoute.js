//判断闭合点是否存在nowRoute中
function isInNowRoute(routeIndex){
    let nowRoute = new Array(1,2,3,4,5);
    if(nowRoute.indexOf(routeIndex) === -1){
        return false;
    }
    return true;
}
module.exports.isInNowRoute = isInNowRoute;

