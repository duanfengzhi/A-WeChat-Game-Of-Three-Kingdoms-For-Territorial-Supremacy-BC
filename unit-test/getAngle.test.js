let test = require("./getAngle.js");
let expect = require("chai").expect;

describe("计算角度", function () {
    it("计算角度-case-1", function () {
        expect(test.getAngle(3,3)).to.be.equal(360);
    });
    it("计算角度-case-1", function () {
        expect(test.getAngle(2,2)).to.be.equal(240);
    });
});
