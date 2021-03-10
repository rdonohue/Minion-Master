// Minimap for the theGame.
class MiniMap {
    constructor(theGame, x, y, w) {
        Object.assign(this, { theGame, x, y, w });
        this.h = 192;
    };

    updateMe() {

    };

    drawMe(ctx) {
      ctx.fillStyle = "LimeGreen";
      ctx.fillRect(this.x, this.y, this.w, this.h);
      ctx.strokeStyle = "Black";
      ctx.strokeRect(this.x, this.y, this.w - 2, this.h - 1);
      this.theGame.theSM.drawCamera(ctx, this.x, this.y, this.w, this.h);
      for (var i = 0; i < this.theGame.entities.length; i++) {
        this.theGame.entities[i].drawMinimap(ctx, this.x, this.y, this.w, this.h);
      }
    };

};
