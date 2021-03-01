class Bush {
  constructor(game, x, y, scale, spriteChoice) {
    Object.assign(this, { game, x, y, scale, spriteChoice })
    this.spritesheet = ASSET_MANAGER.getAsset("./sprites/trees_stones_bushes.png");
    this.health = 100;
    this.maxHealth = 100;
    this.subHealth = 0;
    this.removeFromWorld = false;
    this.radius = 20;
    this.visualRadius = 100;
    this.ready = true;

    this.defineDefaultValues();
    this.chooseSprite(this.spriteChoice);

    this.healthbar = new HealthBar(this.game, this);
    this.elapsedTime = 0;
  };

  updateMe() {
      this.elapsedTime += this.game.clockTick;
      if (this.subHealth == 100) {
          this.health = this.subHealth;
          this.subHealth = 0;
      }
      if (this.elapsedTime > 1.6 && this.health <= 0 && this.subHealth < this.health) {
          this.subHealth += 5;
          this.elapsedTime = 0;
      }
  };

  drawMe(ctx) {
    ctx.drawImage(this.spritesheet,
                  this.sx, this.sy,
                  this.sw, this.sh,
                  this.x - this.game.camera.x,
                  this.y - this.game.camera.y,
                  22 * this.scale,
                  22 * this.scale);
      this.healthbar.drawMe(ctx);
  };

  //Sets the sprite for the bush
  chooseSprite(choice) {
    switch (choice) {
      case 0:
        this.sx = 142;
        this.sy = 800;
        this.sw = 37;
        this.sh = 31;
        break;
      case 1:
        this.sx = 192;
        this.sy = 808;
        this.sw = 30;
        this.sh = 23;
        break;
      case 2:
        this.sx = 237;
        this.sy = 805;
        this.sw = 37;
        this.sh = 26;
        break;
      case 3:
        this.sx = 294;
        this.sy = 818;
        this.sw = 20;
        this.sh = 13;
        break;
    }
  };

  // Helper method for undefined values with the purpose of decluttering the constructor.
  defineDefaultValues() {
    if (this.scale == undefined || this.scale <= 0) {
      this.scale = 1;
    }

    if (this.spriteChoice == undefined || this.spriteChoice < 0 || this.spriteChoice > 3) {
      this.spriteChoice = randomInt(3);
    }
  };

};
