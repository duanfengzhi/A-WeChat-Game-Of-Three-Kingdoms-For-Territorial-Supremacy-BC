//判断购买加速道具金币不足时是否扣除金币成功
function isBuySpeedSuc(price, speedToolNum, totalCoin) {
    let payTotal = price * speedToolNum;
    if(payTotal > totalCoin) {
        return false;
    }
    else {
        return true;
    }
   
}

module.exports.isBuySpeedSuc = isBuySpeedSuc;

