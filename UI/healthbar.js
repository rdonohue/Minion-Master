class HealthBar {
  constructor(theGame, entity) {
    Object.assign(this, {theGame, entity});
    this.state = 1;
    this.width = this.entity.baseWidth*this.entity.scale/2;
    this.height = 4;
  };

  updateMe() {
    //this.width = this.entity.baseWidth*this.entity.scale/2
  };

  drawMe(ctx, stat, maxStat, type) {
    if (stat < maxStat || params.DEBUG || entity.isSelected) {
      var ratio = stat / maxStat;
      let x = this.entity.x - this.theGame.theCamera.x;
      let y = this.entity.y - this.theGame.theCamera.y;

      x += this.entity.baseWidth * this.entity.scale * 0.2
      y += this.entity.baseHeight * this.entity.scale * 1.1
      ctx.save();
      if(type == "health") {
        ctx.fillStyle = (ratio < 0.2 ? "Red" : ratio < 0.5 ? "Yellow" : "Green");
        ctx.fillRect(
          x, y,
          this.width * ratio, this.height
        );
        ctx.strokeStyle = "black";
        ctx.strokeRect(
          x, y,
          this.width, this.height)
      } else {
        ctx.fillStyle = "red";
        ctx.fillText((stat + "/" + maxStat),
          x, y
        );
      }

      ctx.restore();
    }
  };
};

class Score {
  constructor(theGame, x, y, score, color) {
    Object.assign(this, {theGame, x, y, score, color});

    this.velocity = -32;
    this.elapsed = 0;
    this.x += randomInt(10) - 5 //this makes the score start off in a few different spots randomly.
    this.lifespan = 2;
    this.state = 1;
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
