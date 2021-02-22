// Minimap for the game.
class MiniMap {
    constructor(game, x, y, w) {
        Object.assign(this, { game, x, y, w });
    };

    updateMe() {

    };

    drawMe(ctx) {
        // for (var i = 0; i < this.game.entities.length; i++) {
        //    this.game.entities[i].drawMinimap(ctx, this.x, this.y);
        // }

        ctx.fillStyle = "green";
        ctx.fillRect(this.x, this.y, this.w, 192);
        ctx.strokeStyle = "Black";
        ctx.strokeRect(this.x, this.y, this.w - 2, 192 - 1);

    };

};
