//判断玩家在游戏中使用加速道具后matchvs服务器中的道具数是否更新
function LessSpeedToolNum(currentNum, newNum) {
    totalReNum = currentNum - newNum;
    return totalReNum;
}

module.exports.LessSpeedToolNum = LessSpeedToolNum;
