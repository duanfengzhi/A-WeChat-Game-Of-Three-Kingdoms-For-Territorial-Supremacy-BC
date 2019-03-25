//判断购买立即复活道具后立即复活道具数目是否增加
function ReToNumUpdate(relifeToolNum, totalReNum) {
    totalReNum = totalReNum + relifeToolNum;
    return totalReNum;
}

module.exports.ReToNumUpdate = ReToNumUpdate;

