let test = require("./getIndexX.js");
let expect = require("chai").expect;

describe("判断是否成功将相对坐标转换为索引下标X", function(){
    it("测试用例-case-1",function(){
        expect(test.getIndexX(10,1440,0,5)).to.be.equal(147);
    });
    it("测试用例-case-2",function(){
        expect(test.getIndexX(0,1440,0,5)).to.be.equal(145);
    });
});
