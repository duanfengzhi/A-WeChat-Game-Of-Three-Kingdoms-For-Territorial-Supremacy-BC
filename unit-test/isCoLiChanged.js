//判断顶部显示框中的金币数和生命值是否刷新
function isCoLiChanged(coin, life, topCoin, topLife) {
    topCoin = coin;
    topLife = life;
    if(topCoin === coin && topLife === life) {
        return true;
    }
    else {
        return false;
    }
}

module.exports.isCoLiChanged = isCoLiChanged;
