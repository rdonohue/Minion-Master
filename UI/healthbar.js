class HealthBar {
  constructor(theGame, entity) {
    Object.assign(this, {theGame, entity});
    this.state = 1;
    this.width = this.entity.baseWidth*this.entity.scale/2;
    this.height = 4;
  };

  updateMe() {
    this.width = this.entity.baseWidth*this.entity.scale/2
  };

  drawMe(ctx) {
    if (this.entity.health < this.entity.maxHealth || params.DEBUG) {
      var ratio = this.entity.health / this.entity.maxHealth;
      ctx.save();
      ctx.strokeStyle = "black";
      ctx.fillstyle = ratio < 0.2 ? "Red" : ratio < 0.5 ? "Yellow" : "Green";
      ctx.fillRect(
        this.entity.x - this.theGame.theCamera.x, this.entity.y + this.entity.baseHeight*this.entity.scale - this.theGame.theCamera.y,
        this.width * ratio, this.height
      );
      ctx.strokeRect(
        this.entity.x - this.theGame.theCamera.x, this.entity.y + this.entity.baseHeight*this.entity.scale - this.theGame.theCamera.y,
        this.width, this.height)

      ctx.restore();
    }
  };
};

class Score {
  constructor(theGame, x, y, score, color) {
    Object.assign(this, {theGame, x, y, score});

    this.velocity = -32;
    this.elapsed = 0;
  }

  updateMe() {
    this.elapsed += this.theGame.clockTick;
    if (this.elapsed > 2) {
      this.state == 0;
      this.dead = true;
      this.removeFromWorld = true;
    }

    this.y += this.theGame.clockTick * this.velocity;
  };

  drawMe(ctx) {
    ctx.save();
    ctx.font = '12px "Press Start 2P"';
    ctx.fillStyle = this.color;
    ctx.globalAlpha = 1-(this.elapsed/2);
    ctx.fillText(this.score, this.x - this.theGame.theCamera.x, this.y - this.theGame.theCamera.y);
    ctx.restore();
  };
}
