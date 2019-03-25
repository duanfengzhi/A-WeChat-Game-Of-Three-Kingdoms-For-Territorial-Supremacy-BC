//判断购买立即复活道具金币不足时是否扣除金币成功
function isBuyRelifeSuc(price, relifeToolNum, totalCoin) {
    let payTotal = price * relifeToolNum;
    if(payTotal > totalCoin) {
        return false;
    }
    else {
        return true;
    }
   
}

module.exports.isBuyRelifeSuc = isBuyRelifeSuc;

