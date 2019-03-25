let test = require("./getDistance.js");
let expect = require("chai").expect;

describe("计算两点间的距离", function () {
    it("计算两点间的距离-case-1", function () {
        expect(test.getDistance(0, 0, 0, 1)).to.be.equal(1);
    });
    it("计算两点间的距离-case-2", function () {
        expect(test.getDistance(10, 8, 12, 10)).to.be.equal(Math.sqrt(8));
    });
});
