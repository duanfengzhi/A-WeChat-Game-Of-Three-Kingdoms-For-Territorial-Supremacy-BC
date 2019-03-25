let test = require("./isContainsPoint.js");
let expect = require("chai").expect;

describe("玩家移动范围限制", function () {
    it("出边界-case-1", function () {
        expect(test.isContainsPoint(1460, 2)).to.be.equal(false);
    });
    it("出边界-case-2", function () {
        expect(test.isContainsPoint(2, 1500)).to.be.equal(false);
    });
    it("没出边界-case-1", function () {
        expect(test.isContainsPoint(50, 60)).to.be.equal(true);
    });
    it("没出边界-case-2", function () {
        expect(test.isContainsPoint(100, 1400)).to.be.equal(true);
    });
});
