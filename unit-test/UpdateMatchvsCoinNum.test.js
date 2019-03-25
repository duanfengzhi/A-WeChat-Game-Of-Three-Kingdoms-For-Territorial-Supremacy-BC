let test = require("./ReToNumUpdate.js");
let expect = require("chai").expect;

describe("判断玩家购买金币后matchvs服务器的相关信息是否更新", function(){
    it("测试用例-case-1",function(){
        expect(test.ReToNumUpdate(100,500)).to.be.equal(600);
    });
    it("测试用例-case-2",function(){
        expect(test.ReToNumUpdate(100,1000)).to.be.equal(1100);
    });
});
