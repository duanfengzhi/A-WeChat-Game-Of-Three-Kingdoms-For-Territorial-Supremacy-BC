let test = require("./isCoLiChanged.js");
let expect = require("chai").expect;

describe("判断顶部显示框中的金币数和生命值是否刷新", function(){
    it("测试用例-case-1",function(){
        expect(test.isCoLiChanged(500,4,300,3)).to.be.equal(true);
    });
    it("测试用例-case-2",function(){
        expect(test.isCoLiChanged(300,2,100,3)).to.be.equal(true);
    });
});
