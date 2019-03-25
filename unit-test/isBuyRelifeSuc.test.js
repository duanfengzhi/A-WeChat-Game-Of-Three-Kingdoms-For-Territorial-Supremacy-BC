let test = require("./isBuyRelifeSuc.js");
let expect = require("chai").expect;

describe("判断购买立即复活道具金币不足时是否扣除金币成功", function(){
    it("测试用例-case-1",function(){
        expect(test.isBuyRelifeSuc(200,4,300)).to.be.equal(false);
    });
    it("测试用例-case-2",function(){
        expect(test.isBuyRelifeSuc(200,2,500)).to.be.equal(true);
    });
});
