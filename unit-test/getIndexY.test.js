let test = require("./getIndexY.js");
let expect = require("chai").expect;

describe("判断是否成功将相对坐标转换为索引下标Y", function(){
    it("测试用例-case-1",function(){
        expect(test.getIndexY(10,1440,0,5)).to.be.equal(143);
    });
    it("测试用例-case-2",function(){
        expect(test.getIndexY(0,1440,0,5)).to.be.equal(145);
    });
});
