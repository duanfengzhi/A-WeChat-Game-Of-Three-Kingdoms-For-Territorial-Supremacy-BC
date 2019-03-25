let test = require("./playerBirth.js");
let expect = require("chai").expect;

describe("玩家出生位置调整", function () {
    it("房主出生位置-case-1", function () {
        expect(test.playerBirth("123456")).to.be.equal(1);
    });
    it("其它玩家位置-case-2", function () {
        expect(test.playerBirth("654321")).to.be.equal(2);
    });
    it("其它玩家位置-case-3", function () {
        expect(test.playerBirth("654789")).to.be.equal(2);
    });
});
