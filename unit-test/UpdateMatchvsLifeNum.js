//判断玩家购买生命值后matchvs服务器中玩家生命值是否更新
function UpdateMatchvsLifeNum(currentNum, newNum) {
    totalReNum = currentNum + newNum;
    return totalReNum;
}

module.exports.UpdateMatchvsLifeNum = UpdateMatchvsLifeNum;
