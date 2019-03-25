let test = require("./getCellX.js");
let expect = require("chai").expect;

describe("判断是否成功将玩家相对地图坐标的X坐标转换为地图方格坐标X", function(){
    it("测试用例-case-1",function(){
        expect(test.getCellX(5,5)).to.be.equal(2);
    });
    it("测试用例-case-2",function(){
        expect(test.getCellX(10,5)).to.be.equal(3);
    });
});
