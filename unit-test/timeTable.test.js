let test = require("./timeTable.js");
let expect = require("chai").expect;

describe("倒计时", function () {
    it("测试用例-case-1", function () {
        expect(test.timeTable(300)).to.be.equal(299);
    });
    it("测试用例-case-2", function () {
        expect(test.timeTable(0)).to.be.equal(0);
    });
});
