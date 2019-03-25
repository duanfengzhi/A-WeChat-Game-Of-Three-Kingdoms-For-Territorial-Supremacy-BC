function isContainsPoint(x, y) {
    let gameWidth = 1440;
    let gameHeight = 1440;
    if (x > gameWidth || y > gameHeight) {
        return false;
    } else {
        return true;
    }
}

module.exports.isContainsPoint = isContainsPoint;
