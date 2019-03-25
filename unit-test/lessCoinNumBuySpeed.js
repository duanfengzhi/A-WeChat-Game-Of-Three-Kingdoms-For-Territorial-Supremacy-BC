//判断玩家购买加速道具后matchvs服务器中玩家金币数是否减少相应数目
function LessCoinNumBuySpeed(currentNum, newNum) {
    totalReNum = currentNum - newNum;
    return totalReNum;
}

module.exports.LessCoinNumBuySpeed = LessCoinNumBuySpeed;
