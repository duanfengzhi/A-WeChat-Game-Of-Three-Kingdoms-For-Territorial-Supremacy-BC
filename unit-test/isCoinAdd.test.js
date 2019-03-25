let test = require("./isCoinAdd.js");
let expect = require("chai").expect;

describe("判断购买金币付款后金币数是否增加", function(){
    it("测试用例-case-1",function(){
        expect(test.isCoinAdd(500,1500)).to.be.equal(2000);
    });
    it("测试用例-case-2",function(){
        expect(test.isCoinAdd(500,0)).to.be.equal(500);
    });
});
