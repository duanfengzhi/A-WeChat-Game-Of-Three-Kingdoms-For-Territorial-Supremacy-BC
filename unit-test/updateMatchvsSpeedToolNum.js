//判断玩家购买加速道具后matchvs服务器中玩家加速道具是否增加相应数目
function UpdateMatchvsSpeedToolNum(currentNum, newNum) {
    totalReNum = currentNum + newNum;
    return totalReNum;
}

module.exports.UpdateMatchvsSpeedToolNum = UpdateMatchvsSpeedToolNum;
