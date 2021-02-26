class HealthBar {
  constructor(theGame, entity) {
    Object.assign(this, {theGame, entity});
    this.state = 1;
  };

  updateMe() {
  };

  drawMe(ctx) {
    if (this.entity.health < this.entity.maxHealth) {
      var ratio = this.entity.health / this.entity.maxHealth;
      ctx.strokeStyle = "black";
      ctx.fillstyle = ratio < 0.2 ? "Red" : ratio < 0.5 ? "Yellow" : "Green";
      ctx.fillRect(this.entity.x - this.entity.radius - this.theGame.theCamera.x, this.entity.y + this.entity.radius + 5 - this.theGame.theCamera.y,
        this.entity.radius  * 2 * ratio, 4);
      ctx.strokeRect(this.entity.x - this.entity.radius - this.theGame.theCamera.x, this.entity.y + this.entity.radius + 5 - this.theGame.theCamera.y,
        this.entity.radius  * 2, 4)
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
    if (this.elapsed > 1) {
      this.state == 0;
    }

    this.y += this.theGame.clockTick * this.velocity;
  };

  drawMe(ctx) {
    ctx.font = '12px "Press Start 2P"';
    ctx.fillStyle = this.color;
    ctx.fillText(this.score, this.x - this.theGame.theCamera.x, this.y - this.theGame.theCamera.y);
  };
}
