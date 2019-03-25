let test = require("./isCloseRoute.js");
let expect = require("chai").expect;

describe("判断闭合，当遇到route[][2]为 this.selfColor或者this.fillColor时，闭合", function(){
    it("测试用例-case-1",function(){
        expect(test.isCloseRoute(0)).to.be.equal(true);
    });
    it("测试用例-case-2",function(){
        expect(test.isCloseRoute(1)).to.be.equal(false);
    });
});
