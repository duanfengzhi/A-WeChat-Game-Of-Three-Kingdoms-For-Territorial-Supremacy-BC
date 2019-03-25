//判断当前用户是否是当前用户的房主
function isOwner(mUserID, ownerId) {
    if (mUserID !== ownerId) {
        return false;
    }
    return true;
}

module.exports.isOwner = isOwner;
