let test = require("./getClosedRoute.js");
let expect = require("chai").expect;

describe("测试自身画线闭合,获取闭合图形边界下标", function(){
    it("测试用例-case-1",function(){
        expect(test.getClosedRoute(2)).to.be.equal(true);
    });
    it("测试用例-case-2",function(){
        expect(test.getClosedRoute(4)).to.be.equal(true);
    });
});
