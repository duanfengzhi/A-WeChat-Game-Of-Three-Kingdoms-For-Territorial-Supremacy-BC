let test = require("./isWarning.js");
let expect = require("chai").expect;

describe("判断输入非法数据后消息提示是否正确", function(){
    it("测试用例-case-1",function(){
        expect(test.isWarning("我")).to.be.equal(true);
    });
    it("测试用例-case-2",function(){
        expect(test.isWarning(20)).to.be.equal(false);
    });
});
