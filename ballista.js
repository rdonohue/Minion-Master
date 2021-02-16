class Ballista {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });

        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/Arrow.png");

        this.myScale = 1;
        // radius
        // visualRadius
        // damage
        // direction
        // state
    };

    updateMe() {

    };

    drawMe(ctx) {

    };
};
