// Rest of the UI to hold the game menu features.
class UI {
    constructor(game, x, y, w) {
        Object.assign(this, { game, x, y, w });

        this.towerButton = new TowerButton(this.game, 1038, 97);
    };

    updateMe() {

    };

    drawMe(ctx) {
        ctx.fillStyle = "SaddleBrown";
        ctx.fillRect(this.x, this.y, this.w, 576);
        ctx.strokeStyle = "Black";
        ctx.strokeRect(this.x, this.y, this.w - 2, 576 - 1);
        ctx.font = params.TILE_W_H/4 + 'px "Playfair Display SC"';

        ctx.fillStyle = "White";
        ctx.fillText("MiniMap", this.x + 88, 564);
        ctx.strokeStyle = "White"
        ctx.strokeRect(this.x + 84, 548, 76, 22);

        this.towerButton.drawMe(this.game.ctx);
    }

};
