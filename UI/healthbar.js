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

  drawMe(ctx, stat, maxStat, posY) {
    if(stat && maxStat && posY) { //we want to let bushs or other entitys have "healthbars" for things other then their health.
      if (stat < maxStat || params.DEBUG) {
        var ratio = stat / maxStat;
        ctx.save();
        ctx.strokeStyle = "black";
        ctx.fillstyle = ratio < 0.2 ? "Red" : ratio < 0.5 ? "Yellow" : "Green";
        ctx.fillRect(
          this.entity.x - this.theGame.theCamera.x, this.entity.y + this.entity.baseHeight*this.entity.scale - this.theGame.theCamera.y,
          this.width * ratio, this.height + posY*this.height + 1
        );
        ctx.strokeRect(
          this.entity.x - this.theGame.theCamera.x, this.entity.y + this.entity.baseHeight*this.entity.scale - this.theGame.theCamera.y,
          this.width, this.height + posY*this.height + 1)

        ctx.restore();
      }
    } else {
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
    }
  };
};

class Score {
  constructor(theGame, x, y, score, color) {
    Object.assign(this, {theGame, x, y, score});

    this.velocity = -32;
    this.elapsed = 0;
    this.x += randomInt(10) - 5 //this makes the score start off in a few different spots randomly.
    this.lifespan = 2;
  }

  updateMe() {
    this.elapsed += this.theGame.clockTick;
    if (this.elapsed > this.lifespan) {
      this.state = 0;
    }

    this.y += this.theGame.clockTick * this.velocity;
    this.x += randomInt(3) - 1; //this makes the number move back and forth randomly.
  };

  drawMe(ctx) {
    //if(this.elapsed < this.lifespan){
      ctx.save();
      ctx.font = '12px "Press Start 2P"';
      ctx.fillStyle = this.color;
      ctx.globalAlpha = 1-(this.elapsed/this.lifespan);
      ctx.fillText(this.score, this.x - this.theGame.theCamera.x, this.y - this.theGame.theCamera.y);
      ctx.restore();
    //}
  };
}
