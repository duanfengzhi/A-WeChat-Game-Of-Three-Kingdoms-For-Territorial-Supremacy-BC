//判断输入非法数据后消息提示是否正确
function isWarning(input) {
    let payMoney = parseFloat(input);
    let re = /^[0-9]+.?[0-9]*$/; //判断字符串是否为数字
    if (!re.test(payMoney)) {
        return true;
    }
    else {
        return false;
    }
}

module.exports.isWarning = isWarning;

