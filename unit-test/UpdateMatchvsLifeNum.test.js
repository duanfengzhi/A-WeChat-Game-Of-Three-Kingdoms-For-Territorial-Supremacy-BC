let test = require("./UpdateMatchvsLifeNum.js");
let expect = require("chai").expect;

describe("判断玩家购买生命值后matchvs服务器中玩家生命值是否更新", function(){
    it("测试用例-case-1",function(){
        expect(test.UpdateMatchvsLifeNum(5,1)).to.be.equal(6);
    });
    it("测试用例-case-2",function(){
        expect(test.UpdateMatchvsLifeNum(4,3)).to.be.equal(7);
    });
});
