//判断购买金币付款后金币数是否增加
function isCoinAdd(payCoin, totalCoin) {
    totalCoin = totalCoin + payCoin;
    return totalCoin;
}

module.exports.isCoinAdd = isCoinAdd;
