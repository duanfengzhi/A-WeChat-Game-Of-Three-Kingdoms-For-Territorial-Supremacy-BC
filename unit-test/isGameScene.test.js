let test = require("./isGameScene.js");
let expect = require("chai").expect;

describe("玩家进入游戏场景", function () {
    it("玩家未进入游戏场景", function () {
        expect(test.isGameScene(0)).to.be.equal(false);
    });
    it("玩家进入游戏场景", function () {
        expect(test.isGameScene(1)).to.be.equal(true);
    });
});
