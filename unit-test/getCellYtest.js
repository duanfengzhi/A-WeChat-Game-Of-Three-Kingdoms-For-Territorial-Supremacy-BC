let test = require("./getCellY.js");
let expect = require("chai").expect;

describe("判断是否成功将玩家相对地图坐标的Y坐标转换为地图方格坐标Y", function(){
    it("测试用例-case-1",function(){
        expect(test.getCellY(5,5)).to.be.equal(2);
    });
    it("测试用例-case-2",function(){
        expect(test.getCellY(10,5)).to.be.equal(3);
    });
});
