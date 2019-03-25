//计算角度并返回
function getAngle(x1, y1) {
    let x = 0;
    let y = 0;
    angle = (y1 - y + x1 - x) * (180 / 3);
    return angle;
}

module.exports.getAngle = getAngle;
