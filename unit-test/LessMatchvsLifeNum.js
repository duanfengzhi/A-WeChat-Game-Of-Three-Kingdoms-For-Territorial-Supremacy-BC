//判断玩家购买生命值后matchvs服务器中玩家金币数是否减少相应数目
function LessMatchvsCoinNum(currentNum, newNum) {
    totalReNum = currentNum - newNum;
    return totalReNum;
}

module.exports.LessMatchvsCoinNum = LessMatchvsCoinNum;
