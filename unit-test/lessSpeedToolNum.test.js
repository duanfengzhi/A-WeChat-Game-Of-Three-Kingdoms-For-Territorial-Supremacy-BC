let test = require("./lessSpeedToolNum.js");
let expect = require("chai").expect;

describe("判断玩家在游戏中使用加速道具后matchvs服务器中的道具数是否更新", function(){
    it("测试用例-case-1",function(){
        expect(test.LessSpeedToolNum(6,2)).to.be.equal(4);
    });
    it("测试用例-case-2",function(){
        expect(test.LessSpeedToolNum(5,3)).to.be.equal(2);
    });
});
