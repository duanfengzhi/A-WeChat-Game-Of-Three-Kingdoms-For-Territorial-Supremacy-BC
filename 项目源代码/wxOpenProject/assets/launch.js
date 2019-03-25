cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Node,
        prefab: cc.Prefab,
    },

    start() {
        this.getMyInfo(this.prefab,this.content);
    },

    getMyInfo:function(pre,con){

        let myName;
        let myAvatarUrl;
        let myRate;

        let thisPre = pre;
        let thisCon = con;

        wx.getUserInfo({
            openIdList: ['selfOpenId'],
            lang: 'zh_CN',
            success: (res) => {

                let userInfo = res.data[0];

                wx.getUserCloudStorage({
                    keyList: ['rate'], // 胜率
                    success: function (res) {

                        let strArray = JSON.stringify(res.KVDataList).split("\"");
                        myRate = strArray[strArray.length - 2];

                        myName = userInfo.nickName;
                        myAvatarUrl = userInfo.avatarUrl;

                        createFriend();
                    
                    },
                });
            },
            fail: (res) => {
                reject(res);
            }
        })

        function createFriend () {
            let name = myName;
            let rate = myRate;
            let avatarUrl = myAvatarUrl;
    
            let prefab = thisPre;
            let content = thisCon;
    
            function createSelf(indexNum) {
    
                let node = cc.instantiate(prefab);
                node.parent = content;
    
                let userName = node.getChildByName('userName').getComponent(cc.Label);
                let userRateNode = node.getChildByName('rate').getComponent(cc.Label);
                let userRank = node.getChildByName('rank').getComponent(cc.Label);
                let userIcon = node.getChildByName('mask').children[0].getComponent(cc.Sprite);
    
                userName.string = name;
                userRateNode.string = rate + "";
                userRank.string = indexNum + "";
    
                cc.loader.load({
                    url: avatarUrl,
                    type: 'png'
                }, (err, texture) => {
                    userIcon.spriteFrame = new cc.SpriteFrame(texture);
                });
            }
    
            function createPrefab() {
                let node = cc.instantiate(prefab);
                node.parent = content;
                return node;
            }
    
            function createFriendBlock(friend, indexNum) {
                let node = createPrefab();
                let nickName = friend[0];
                let avatarUrl = friend[1];
    
                let userName = node.getChildByName('userName').getComponent(cc.Label);
                let userRate = node.getChildByName('rate').getComponent(cc.Label);
                let userRank = node.getChildByName('rank').getComponent(cc.Label);
                let userIcon = node.getChildByName('mask').children[0].getComponent(cc.Sprite);
    
                userName.string = nickName;
                userRate.string = friend[2] + "%";
                userRank.string = indexNum + "";
    
                cc.loader.load({
                    url: avatarUrl,
                    type: 'png'
                }, (err, texture) => {
                    userIcon.spriteFrame = new cc.SpriteFrame(texture);
                });
            }
    
            wx.getFriendCloudStorage({
                keyList: ['rate'], // 胜率
                success: function (res) {
    
                    let userArray = [];
                    let length = 0;
    
                    for (let i in res.data) {
    
                        let strArray = JSON.stringify(res.data[i]).split(",");
                        let nickName = strArray[1].split("\"")[3];
                        let avatarUrl = strArray[2].split("\"")[3];
    
                        let arry = [];
                        arry.push(nickName); //nickName
                        arry.push(avatarUrl); //avarl
    
                        let strArray2 = JSON.stringify(res.data[i].KVDataList).split("\"");
                        let userRate = strArray2[strArray2.length - 2];
                        let num = parseFloat(userRate.replace("%", ""));
    
                        arry.push(num);
    
                        userArray.push(arry);
                        length++;
                    }
                    userArray.sort(
                        function (a, b) {
                            if (a[2] === b[2]) {
                                return a[0] - b[0]; //胜率相同，按照姓氏排名
                            } else {
                                return b[2] - a[2]; //按照胜率大小排名
                            }
                        }
                    );
    
                    let index = 0;
    
                    for (index; index < length; index++) {
                        if (userArray[index][0] === name) {
                            break;
                        }
                    }
    
                    if (index === 0 && length === 1) {
                        createSelf(1);
                    } else if (index === 0 && length === 2) {
                        createSelf(1);
                        createFriendBlock(userArray[1], 2);
                    } else if (index === 0 && length >= 3) {
                        createSelf(1);
                        createFriendBlock(userArray[1], 2);
                        createFriendBlock(userArray[2], 3);
                    } else if (index === length - 1) {
                        if (length === 1) {
                            createSelf(index + 1);
                        } else if (length === 2) {
                            createFriendBlock(userArray[0], 1);
                            createSelf(2);
                        } else if (length >= 3) {
                            createFriendBlock(userArray[index - 2], index - 1);
                            createFriendBlock(userArray[index - 1], index);
                            createSelf(index + 1);
                        }
                    } else if (index === 1) {
                        if (length === 2) {
                            createFriendBlock(userArray[0], 1);
                            createSelf(2);
                        } else if (length === 3) {
                            createFriendBlock(userArray[0], 1);
                            createSelf(2);
                            createFriendBlock(userArray[2], 3);
                        } else if (length >= 4) {
                            createFriendBlock(userArray[0], 1);
                            createSelf(2);
                            createFriendBlock(userArray[2], 3);
                            createFriendBlock(userArray[3], 4);
                        }
                    } else if (index >= 2) {
                        if (length === 3) {
                            createFriendBlock(userArray[index - 2], index - 1);
                            createFriendBlock(userArray[index - 1], index);
                            createSelf(index + 1);
                        } else if (length === 4) {
                            createFriendBlock(userArray[index - 2], index - 1);
                            createFriendBlock(userArray[index - 1], index);
                            createSelf(index + 1);
                            createFriendBlock(userArray[index + 1], index + 2);
                        } else if (length >= 5) {
                            createFriendBlock(userArray[index - 2], index - 1);
                            createFriendBlock(userArray[index - 1], index);
                            createSelf(index + 1);
                            createFriendBlock(userArray[index + 1], index + 2);
                            createFriendBlock(userArray[index + 2], index + 3);
                        }
                    }
                },
            });
        }

    },
});
