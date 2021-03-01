// Minimap for the theGame.
class MiniMap {
    constructor(theGame, x, y, w) {
        Object.assign(this, { theGame, x, y, w });
    };

    updateMe() {

    };

    drawMe(ctx) {
        for (var i = 0; i < this.theGame.entities.length; i++) {
          console.log(this.theGame.entities[i]);
          this.theGame.entities[i].drawMinimap(ctx, this.x, this.y);
        }
        this.theGame.theSM.drawCamera(ctx, this.x, this.y, this.w);

        ctx.fillStyle = "green";
        ctx.fillRect(this.x, this.y, this.w, this.w);
        ctx.strokeStyle = "Black";
        ctx.strokeRect(this.x, this.y, this.w - 2, this.w - 1);
    };

};
