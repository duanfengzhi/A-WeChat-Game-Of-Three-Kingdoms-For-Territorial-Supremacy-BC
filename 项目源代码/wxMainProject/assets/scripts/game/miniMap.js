cc.Class({
    extends: cc.Component,

    properties: {
        sprite: {
            default: null,
            type: cc.Sprite
        },
        camera: {
            default: null,
            type: cc.Camera
        }
    },

    start() {
        //小地图
        let texture = new cc.RenderTexture();
        texture.initWithSize(1440, 1440);

        let spriteFrame = new cc.SpriteFrame();
        spriteFrame.setTexture(texture)
        this.sprite.spriteFrame = spriteFrame;

        this.camera.targetTexture = texture;
    },
});
