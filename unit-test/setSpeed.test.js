let test = require("./setSpeed.js");
let expect = require("chai").expect;

describe("设置实际速度", function () {
    it("普通速度1", function () {
        expect(test.setSpeed(8)).to.be.equal(2);
    });
    it("加速用例1", function () {
        expect(test.setSpeed(12)).to.be.equal(4);
    });
    it("加速用例2", function () {
        expect(test.setSpeed(20)).to.be.equal(4);
    });
    it("普通速度2", function () {
        expect(test.setSpeed(5)).to.be.equal(2);
    });
});
