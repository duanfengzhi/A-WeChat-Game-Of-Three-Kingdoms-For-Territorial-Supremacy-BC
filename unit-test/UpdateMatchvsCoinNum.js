//判断玩家购买金币后matchvs服务器的相关信息是否更新
function UpdateMatchvsCoinNum(currentNum, newNum) {
    totalReNum = currentNum + newNum;
    return totalReNum;
}

module.exports.UpdateMatchvsCoinNum = UpdateMatchvsCoinNum;
