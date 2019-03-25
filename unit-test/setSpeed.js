//设置实际速度
function setSpeed(point) {
    //触摸点和遥控杆中心的距离
    let distance = point - 10;

    //如果半径
    if (distance < 0) {
        return 2;
    } else {
        return 4;
    }
}

module.exports.setSpeed = setSpeed;
