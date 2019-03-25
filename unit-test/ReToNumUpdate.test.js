let test = require("./ReToNumUpdate.js");
let expect = require("chai").expect;

describe("判断购买立即复活道具后立即复活道具数目是否增加", function(){
    it("测试用例-case-1",function(){
        expect(test.ReToNumUpdate(2,3)).to.be.equal(5);
    });
    it("测试用例-case-2",function(){
        expect(test.ReToNumUpdate(2,0)).to.be.equal(2);
    });
});
