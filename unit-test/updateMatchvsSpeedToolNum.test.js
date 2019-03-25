let test = require("./updateMatchvsSpeedToolNum.js");
let expect = require("chai").expect;

describe("判断玩家购买加速道具后matchvs服务器中玩家加速道具是否增加相应数目", function(){
    it("测试用例-case-1",function(){
        expect(test.UpdateMatchvsSpeedToolNum(2,1)).to.be.equal(3);
    });
    it("测试用例-case-2",function(){
        expect(test.UpdateMatchvsSpeedToolNum(3,4)).to.be.equal(7);
    });
});
