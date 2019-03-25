//倒计时每秒减一
function timeTable(time) {
    if (time !== 0) {
        return time - 1;
    }
    return 0;
}

module.exports.timeTable = timeTable;
