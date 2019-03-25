module.exports = {
    gameID: 214500,
    appkey: "3e4355f5e5164b5aadd654d7326e360b#M",
    secret: "95374aa3ce46498e8f317d153f275cb7",
    userID: null, //matchvs登录的userID
    token: null,

    query: Array(),

    username: null, //用户名
    avatarUrl: null, //用户头像
    shopSelect: null, // 0 金币 ; 1 生命 ; 2 道具
    coinNum: null, //用户所拥有的金币数
    lifeNum: null, //用户所拥有的生命数

    winNum: null, //玩家胜场
    loseNum: null, //玩家输场
    tie: null, //玩家平场

    speedToolNum: null, //用户所拥有的加速道具数
    relifeToolNum: null, //用户所拥有的立即复活道具数
    speedToolPrice: 200, //加速道具单价
    relifeToolPrice: 500, //立即复活道具单价
    lifePrice: 200, //一个生命的价格
    userLifeLimit: 99, 
    userList: Array(), //游戏用户列表
    pattern: 0,

    myColor: 0,
    myZone: 1,
    isGameOver: 0,
    isLife: 0,
    isWin:null,
}
