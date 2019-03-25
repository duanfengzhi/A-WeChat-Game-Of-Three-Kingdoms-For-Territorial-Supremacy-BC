let test = require("./isInNowRoute.js");
let expect = require("chai").expect;

describe("判断闭合点是否存在nowRoute中", function(){
    it("测试用例-case-1",function(){
        expect(test.isInNowRoute(1)).to.be.equal(true);
    });
    it("测试用例-case-2",function(){
        expect(test.isInNowRoute(2)).to.be.equal(true);
    });
});
