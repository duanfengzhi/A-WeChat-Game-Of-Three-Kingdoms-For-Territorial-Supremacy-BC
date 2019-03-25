let test = require("./isOwner.js");
let expect = require("chai").expect;

describe("判断用户是否为房主的函数", function(){
    it("测试用例-case-1",function(){
        expect(test.isOwner("123456","789456")).to.be.equal(false);
    });
    it("测试用例-case-2",function(){
        expect(test.isOwner("789456","789456")).to.be.equal(true);
    });
});
