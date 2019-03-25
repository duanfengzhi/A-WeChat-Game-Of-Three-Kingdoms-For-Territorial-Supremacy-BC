//闭合情况一 ：自身画线闭合,获取闭合图形边界下标
function getClosedRoute(routeIndex){
    let nowRoute = [1,2,3,4,5,6,7,8,9];
    let closure = new Array();
    closure = nowRoute.slice(nowRoute.indexOf(routeIndex));
    if(closure.length > 0){
        return true;
    }else{
        return false;
    }   
}
module.exports.getClosedRoute = getClosedRoute;

