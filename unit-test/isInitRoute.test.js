let test = require("./isInitRoute.js");
let expect = require("chai").expect;

describe("判断是否成功初始化逻辑地图格子数组", function(){
    it("测试用例-case-1",function(){
        expect(test.isInitRoute(1440,5)).to.be.equal(82944);
    });
    it("测试用例-case-2",function(){
        expect(test.isInitRoute(10,2)).to.be.equal(25);
    });
});
