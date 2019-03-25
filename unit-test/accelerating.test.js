let test = require("./accelerating.js");
let expect = require("chai").expect;

describe("玩家使用加速道具", function () {
    it("使用加速道具", function () {
        expect(test.accelerating(1)).to.be.equal(4);
    });
    it("未使用加速道具", function () {
        expect(test.accelerating(0)).to.be.equal(2);
    });
});
