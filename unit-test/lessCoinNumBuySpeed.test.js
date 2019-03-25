let test = require("./lessCoinNumBuySpeed.js");
let expect = require("chai").expect;

describe("判断玩家购买加速道具后matchvs服务器中玩家金币数是否减少相应数目", function(){
    it("测试用例-case-1",function(){
        expect(test.LessCoinNumBuySpeed(1000,200)).to.be.equal(800);
    });
    it("测试用例-case-2",function(){
        expect(test.LessCoinNumBuySpeed(1000,400)).to.be.equal(600);
    });
});
