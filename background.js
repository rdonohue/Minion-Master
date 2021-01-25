class Grassland {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });

        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/ground_sprites.png");
    };

    update() {

    };

    /*
       Sx and Sy locations on the sprite sheet
       Top Left Corner | Top Right Corner | Bottom Left Corner | Bottom Right corner
    Sx:     64         |      223         |       64           |       223
    Sy:     1184       |      1184        |       1343         |       1343
    */

    // drawImage(spritesheet, sx, sy, sw, sh, dx, dy, dw, dh)
    draw(ctx) {
        //top left corner
        ctx.drawImage(this.spritesheet, 0, 1216, params.TILE_W_H, params.TILE_W_H, 0, 0, params.TILE_W_H, params.TILE_W_H);

        let yCanvasOrigin = 768 - params.TILE_W_H;
        let xCanvasOrigin = 1024 - params.TILE_W_H;
        //bottom left corner

        ctx.save();
        ctx.scale(1,-1);
        ctx.drawImage(this.spritesheet, 0, 1216, params.TILE_W_H, params.TILE_W_H, 0, -yCanvasOrigin - params.TILE_W_H, params.TILE_W_H, params.TILE_W_H);
        ctx.restore();

        //top right corner
        ctx.save();
        ctx.scale(-1,1);
        ctx.drawImage(this.spritesheet, 0, 1216, params.TILE_W_H, params.TILE_W_H, -xCanvasOrigin - params.TILE_W_H, 0, params.TILE_W_H, params.TILE_W_H);
        ctx.restore();

        //bottom right corner
        ctx.save();
        ctx.scale(-1,-1);
        ctx.drawImage(this.spritesheet, 0, 1216, params.TILE_W_H, params.TILE_W_H, -xCanvasOrigin - params.TILE_W_H, -yCanvasOrigin - params.TILE_W_H, params.TILE_W_H, params.TILE_W_H);
        ctx.restore();
    };
};
