function playerBirth(mUserID) {
    let zone1 = 1;
    let zone2 = 2;
    let pos;
    if (mUserID === "123456") {
        pos = zone1;
    } else {
        pos = zone2;
    }

    return pos;
}

module.exports.playerBirth = playerBirth;
