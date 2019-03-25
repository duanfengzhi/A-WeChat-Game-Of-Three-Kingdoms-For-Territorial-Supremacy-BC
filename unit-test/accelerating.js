function accelerating(accelerating) {
    let speed;
    if (accelerating === 0) {
        speed = 2;
    } else if (accelerating === 1) {
        speed = 4;
    }

    return speed;
}

module.exports.accelerating = accelerating;
