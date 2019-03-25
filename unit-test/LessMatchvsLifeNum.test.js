let test = require("./LessMatchvsLifeNum.js");
let expect = require("chai").expect;

describe("判断玩家购买生命值后matchvs服务器中玩家金币数是否减少相应数目", function(){
    it("测试用例-case-1",function(){
        expect(test.LessMatchvsCoinNum(1000,100)).to.be.equal(900);
    });
    it("测试用例-case-2",function(){
        expect(test.LessMatchvsCoinNum(500,300)).to.be.equal(200);
    });
});
